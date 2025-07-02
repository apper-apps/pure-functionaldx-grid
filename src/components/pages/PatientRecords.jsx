import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Badge from '@/components/atoms/Badge';
import PatientInfoCard from '@/components/molecules/PatientInfoCard';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import ApperIcon from '@/components/ApperIcon';
import { PatientService } from '@/services/api/PatientService';
import { format } from 'date-fns';

const PatientRecords = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    loadPatients();
  }, []);

  useEffect(() => {
    filterPatients();
  }, [patients, searchTerm, filterStatus]);

  const loadPatients = async () => {
    try {
      setLoading(true);
      setError('');
      await new Promise(resolve => setTimeout(resolve, 400));
const data = await PatientService.getAll();
      // Transform database fields to match UI expectations
      const transformedData = data.map(patient => ({
        ...patient,
        name: patient.Name,
        dateOfBirth: patient.date_of_birth,
        contactInfo: {
          email: patient.contact_info_email,
          phone: patient.contact_info_phone,
          address: patient.contact_info_address
        },
        medicalHistory: patient.medical_history ? patient.medical_history.split(',') : [],
        currentSymptoms: patient.current_symptoms ? patient.current_symptoms.split(',') : [],
        labResults: patient.lab_results ? JSON.parse(patient.lab_results) : [],
        createdAt: patient.created_at
      }));
      setPatients(transformedData);
    } catch (err) {
      setError('Failed to load patient records');
    } finally {
      setLoading(false);
    }
  };

  const filterPatients = () => {
    let filtered = [...patients];

    // Search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(patient =>
        patient.name.toLowerCase().includes(term) ||
        patient.contactInfo.email.toLowerCase().includes(term) ||
        patient.currentSymptoms?.some(symptom => symptom.toLowerCase().includes(term))
      );
    }

    // Status filter
    if (filterStatus !== 'all') {
      // For this demo, we'll simulate status based on recent activity
      filtered = filtered.filter(patient => {
        const recentActivity = new Date(patient.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        return filterStatus === 'active' ? recentActivity : !recentActivity;
      });
    }

    setFilteredPatients(filtered);
  };

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
  };

  const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  if (loading && patients.length === 0) {
    return <Loading type="skeleton" />;
  }

  if (error && patients.length === 0) {
    return <Error message={error} onRetry={loadPatients} />;
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <ApperIcon name="Search" size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-clinical-500" />
              <Input
                placeholder="Search patients by name, email, or symptoms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-clinical-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Patients</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            
            <Button variant="outline" onClick={loadPatients}>
              <ApperIcon name="RefreshCw" size={16} className="mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient List */}
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-clinical-900">
                Patient Records ({filteredPatients.length})
              </h2>
              <Badge variant="primary">{patients.length} Total</Badge>
            </div>

            {filteredPatients.length === 0 ? (
              searchTerm || filterStatus !== 'all' ? (
                <Empty
                  icon="Search"
                  title="No patients found"
                  message="Try adjusting your search terms or filters"
                  showAction={false}
                />
              ) : (
                <Empty
                  icon="Users"
                  title="No patient records"
                  message="Patient records will appear here once added to the system"
                  showAction={false}
                />
              )
            ) : (
              <div className="space-y-4">
                {filteredPatients.map((patient) => (
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
        </div>

        {/* Patient Detail Panel */}
        <div>
          {selectedPatient ? (
            <Card>
              <div className="space-y-6">
                {/* Patient Header */}
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <ApperIcon name="User" size={24} className="text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-clinical-900">{selectedPatient.name}</h3>
                  <p className="text-clinical-600">Patient ID: {selectedPatient.Id}</p>
                </div>

                {/* Basic Information */}
                <div className="space-y-4">
                  <h4 className="font-medium text-clinical-900 border-b pb-2">Basic Information</h4>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-clinical-700">Age</p>
                      <p className="text-clinical-600">{calculateAge(selectedPatient.dateOfBirth)} years</p>
                    </div>
                    <div>
                      <p className="font-medium text-clinical-700">Date of Birth</p>
                      <p className="text-clinical-600">{format(new Date(selectedPatient.dateOfBirth), 'MMM dd, yyyy')}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <ApperIcon name="Mail" size={16} className="text-clinical-500" />
                      <span className="text-sm text-clinical-700">{selectedPatient.contactInfo.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <ApperIcon name="Phone" size={16} className="text-clinical-500" />
                      <span className="text-sm text-clinical-700">{selectedPatient.contactInfo.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <ApperIcon name="MapPin" size={16} className="text-clinical-500" />
                      <span className="text-sm text-clinical-700">{selectedPatient.contactInfo.address}</span>
                    </div>
                  </div>
                </div>

                {/* Current Symptoms */}
                {selectedPatient.currentSymptoms && selectedPatient.currentSymptoms.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-clinical-900 border-b pb-2">Current Symptoms</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedPatient.currentSymptoms.map((symptom, index) => (
                        <Badge key={index} variant="warning" size="sm">
                          {symptom}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Medical History */}
                {selectedPatient.medicalHistory && selectedPatient.medicalHistory.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-clinical-900 border-b pb-2">Medical History</h4>
                    <div className="space-y-2">
                      {selectedPatient.medicalHistory.map((item, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <ApperIcon name="Circle" size={8} className="text-clinical-400" />
                          <span className="text-sm text-clinical-700">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Lab Results */}
                {selectedPatient.labResults && selectedPatient.labResults.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-clinical-900 border-b pb-2">Recent Lab Results</h4>
                    <div className="space-y-2">
                      {selectedPatient.labResults.map((lab, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <span className="text-clinical-700">{lab.name}</span>
                          <span className="font-medium text-clinical-900">
                            {lab.value} {lab.unit}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="space-y-2 pt-4 border-t">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <ApperIcon name="Brain" size={16} className="mr-2" />
                    Start Analysis
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <ApperIcon name="Grid3x3" size={16} className="mr-2" />
                    Build Matrix
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <ApperIcon name="FileText" size={16} className="mr-2" />
                    View Reports
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <ApperIcon name="Edit" size={16} className="mr-2" />
                    Edit Profile
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <Card>
              <div className="text-center py-8">
                <ApperIcon name="UserCircle" size={48} className="mx-auto mb-4 text-clinical-300" />
                <h3 className="text-lg font-medium text-clinical-900 mb-2">Select a Patient</h3>
                <p className="text-clinical-600">Choose a patient from the list to view their detailed information</p>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <div className="text-2xl font-bold text-primary-600 mb-1">{patients.length}</div>
          <div className="text-sm text-clinical-600">Total Patients</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-secondary-600 mb-1">
            {patients.filter(p => new Date(p.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length}
          </div>
          <div className="text-sm text-clinical-600">Active (30 days)</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-accent-600 mb-1">
            {patients.reduce((total, p) => total + (p.currentSymptoms?.length || 0), 0)}
          </div>
          <div className="text-sm text-clinical-600">Total Symptoms</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-yellow-600 mb-1">
            {patients.reduce((total, p) => total + (p.labResults?.length || 0), 0)}
          </div>
          <div className="text-sm text-clinical-600">Lab Results</div>
        </Card>
      </div>
    </div>
  );
};

export default PatientRecords;