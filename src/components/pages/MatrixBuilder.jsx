import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import MatrixCell from '@/components/molecules/MatrixCell';
import PatientInfoCard from '@/components/molecules/PatientInfoCard';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import ApperIcon from '@/components/ApperIcon';
import { PatientService } from '@/services/api/PatientService';
import { MatrixService } from '@/services/api/MatrixService';

const MatrixBuilder = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [matrix, setMatrix] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [newCondition, setNewCondition] = useState('');

  const functionalSystems = [
    {
      name: 'Gastrointestinal',
      description: 'Digestion, absorption, gut microbiome, inflammation',
      color: 'orange'
    },
    {
      name: 'Immune',
      description: 'Autoimmunity, allergies, infections, inflammation',
      color: 'red'
    },
    {
      name: 'Energy',
      description: 'Mitochondria, metabolism, fatigue, cellular function',
      color: 'yellow'
    },
    {
      name: 'Hormonal',
      description: 'Endocrine system, hormones, reproduction, stress',
      color: 'pink'
    },
    {
      name: 'Structural',
      description: 'Musculoskeletal, connective tissue, movement',
      color: 'blue'
    },
    {
      name: 'Mind/Spirit',
      description: 'Mental health, stress, emotions, cognitive function',
      color: 'purple'
    },
    {
      name: 'Detoxification',
      description: 'Liver function, toxin elimination, environmental health',
      color: 'green'
    }
  ];

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      setLoading(true);
      setError('');
      await new Promise(resolve => setTimeout(resolve, 300));
      const data = await PatientService.getAll();
      setPatients(data);
    } catch (err) {
      setError('Failed to load patients');
    } finally {
      setLoading(false);
    }
  };

  const handlePatientSelect = async (patient) => {
    setSelectedPatient(patient);
    await loadMatrix(patient.Id);
  };

  const loadMatrix = async (patientId) => {
    try {
      setLoading(true);
      const matrixData = await MatrixService.getByPatientId(patientId);
      setMatrix(matrixData);
    } catch (err) {
      // Create new matrix if none exists
      const newMatrix = {
        Id: Date.now(),
        patientId,
        systems: {},
        annotations: [],
        status: 'draft',
        lastModified: new Date().toISOString()
      };
      setMatrix(newMatrix);
    } finally {
      setLoading(false);
    }
  };

  const addConditionToSystem = (systemName, condition) => {
    if (!condition || !condition.name) return;

    const updatedMatrix = {
      ...matrix,
      systems: {
        ...matrix.systems,
        [systemName]: [
          ...(matrix.systems[systemName] || []),
          typeof condition === 'string' ? { name: condition } : condition
        ]
      },
      lastModified: new Date().toISOString()
    };

    setMatrix(updatedMatrix);
    toast.success(`Added condition to ${systemName} system`);
  };

  const removeConditionFromSystem = (systemName, conditionIndex) => {
    const updatedMatrix = {
      ...matrix,
      systems: {
        ...matrix.systems,
        [systemName]: matrix.systems[systemName]?.filter((_, index) => index !== conditionIndex) || []
      },
      lastModified: new Date().toISOString()
    };

    setMatrix(updatedMatrix);
    toast.info('Condition removed from matrix');
  };

  const addCustomCondition = (systemName) => {
    if (!newCondition.trim()) {
      toast.error('Please enter a condition name');
      return;
    }

    addConditionToSystem(systemName, { name: newCondition.trim() });
    setNewCondition('');
  };

  const saveMatrix = async () => {
    if (!matrix || !selectedPatient) return;

    try {
      setLoading(true);
      await MatrixService.update(matrix.Id, matrix);
      toast.success('Matrix saved successfully');
    } catch (err) {
      toast.error('Failed to save matrix');
    } finally {
      setLoading(false);
    }
  };

  const exportToPDF = () => {
    toast.info('PDF export functionality would be implemented here');
  };

  if (loading && patients.length === 0) {
    return <Loading type="matrix" />;
  }

  if (error && patients.length === 0) {
    return <Error message={error} onRetry={loadPatients} />;
  }

  return (
    <div className="space-y-6">
      {/* Patient Selection */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-clinical-900">Select Patient for Matrix</h2>
          <Button variant="outline" size="sm" onClick={loadPatients}>
            <ApperIcon name="RefreshCw" size={16} className="mr-2" />
            Refresh
          </Button>
        </div>
        
        {patients.length === 0 ? (
          <Empty
            icon="Users"
            title="No patients found"
            message="Add patients to start building matrices"
            showAction={false}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {patients.slice(0, 6).map((patient) => (
              <PatientInfoCard
                key={patient.Id}
                patient={patient}
                onSelect={handlePatientSelect}
                compact
              />
            ))}
          </div>
        )}
      </Card>

      {selectedPatient && matrix && (
        <>
          {/* Matrix Header */}
          <Card>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-accent-500 to-accent-600 rounded-full flex items-center justify-center">
                  <ApperIcon name="Grid3x3" size={20} className="text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-clinical-900">
                    Functional Medicine Matrix - {selectedPatient.name}
                  </h2>
                  <p className="text-clinical-600">
                    Last modified: {new Date(matrix.lastModified).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button variant="outline" onClick={saveMatrix} disabled={loading}>
                  <ApperIcon name="Save" size={16} className="mr-2" />
                  Save Matrix
                </Button>
                <Button onClick={exportToPDF}>
                  <ApperIcon name="Download" size={16} className="mr-2" />
                  Export PDF
                </Button>
              </div>
            </div>
          </Card>

          {/* Add Condition Tool */}
          <Card>
            <div className="flex items-center space-x-4">
              <Input
                placeholder="Enter condition or symptom to add..."
                value={newCondition}
                onChange={(e) => setNewCondition(e.target.value)}
                className="flex-1"
              />
              <select className="px-3 py-2 border border-clinical-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option value="">Select system...</option>
                {functionalSystems.map((system) => (
                  <option key={system.name} value={system.name}>
                    {system.name}
                  </option>
                ))}
              </select>
              <Button onClick={() => addCustomCondition('Gastrointestinal')}>
                <ApperIcon name="Plus" size={16} className="mr-2" />
                Add
              </Button>
            </div>
          </Card>

          {/* Functional Medicine Matrix Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {functionalSystems.map((system) => (
              <MatrixCell
                key={system.name}
                system={system}
                conditions={matrix.systems[system.name] || []}
                onAddCondition={addConditionToSystem}
                onRemoveCondition={removeConditionFromSystem}
              />
            ))}
          </div>

          {/* Matrix Summary */}
          <Card>
            <h3 className="text-lg font-semibold text-clinical-900 mb-4">Matrix Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-primary-50 rounded-lg">
                <div className="text-2xl font-bold text-primary-600">
                  {Object.values(matrix.systems).reduce((total, conditions) => total + conditions.length, 0)}
                </div>
                <div className="text-sm text-primary-700">Total Conditions</div>
              </div>
              <div className="text-center p-4 bg-secondary-50 rounded-lg">
                <div className="text-2xl font-bold text-secondary-600">
                  {Object.keys(matrix.systems).filter(key => matrix.systems[key]?.length > 0).length}
                </div>
                <div className="text-sm text-secondary-700">Systems Affected</div>
              </div>
              <div className="text-center p-4 bg-accent-50 rounded-lg">
                <div className="text-2xl font-bold text-accent-600">
                  {matrix.status === 'draft' ? 'Draft' : 'Complete'}
                </div>
                <div className="text-sm text-accent-700">Status</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">
                  {Math.round((Object.values(matrix.systems).reduce((total, conditions) => total + conditions.length, 0) / 21) * 100)}%
                </div>
                <div className="text-sm text-yellow-700">Completion</div>
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

export default MatrixBuilder;