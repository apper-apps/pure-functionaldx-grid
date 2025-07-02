import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Textarea from '@/components/atoms/Textarea';
import AIInsightCard from '@/components/molecules/AIInsightCard';
import PatientInfoCard from '@/components/molecules/PatientInfoCard';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import ApperIcon from '@/components/ApperIcon';
import { PatientService } from '@/services/api/PatientService';
import { DiagnosticService } from '@/services/api/DiagnosticService';

const DiagnosticAnalysis = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [aiInsights, setAiInsights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [analysisData, setAnalysisData] = useState({
    symptoms: '',
    medicalHistory: '',
    labResults: '',
    lifestyle: '',
    notes: ''
  });

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      setLoading(true);
      setError('');
      await new Promise(resolve => setTimeout(resolve, 300));
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
      setError('Failed to load patients');
    } finally {
      setLoading(false);
    }
  };

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
setAnalysisData({
      symptoms: patient.currentSymptoms?.join(', ') || '',
      medicalHistory: patient.medicalHistory?.join(', ') || '',
      labResults: patient.labResults?.map(lab => `${lab.name}: ${lab.value} ${lab.unit}`).join(', ') || '',
      lifestyle: '',
      notes: ''
    });
    setAiInsights([]);
  };

  const generateAIInsights = async () => {
    if (!selectedPatient || !analysisData.symptoms.trim()) {
      toast.error('Please select a patient and enter symptoms');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      // Simulate AI analysis delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const insights = await DiagnosticService.generateInsights({
        patientId: selectedPatient.Id,
        ...analysisData
      });
      
      setAiInsights(insights);
      toast.success('AI analysis completed successfully');
    } catch (err) {
      setError('Failed to generate AI insights');
      toast.error('Failed to generate AI insights');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptInsight = (insight) => {
    toast.success(`Added "${insight.condition}" to functional medicine matrix`);
    // In a real app, this would integrate with the matrix builder
  };

  const handleDismissInsight = (insightId) => {
    setAiInsights(prev => prev.filter(insight => insight.Id !== insightId));
    toast.info('Insight dismissed');
  };

  if (loading && patients.length === 0) {
    return <Loading type="skeleton" />;
  }

  if (error && patients.length === 0) {
    return <Error message={error} onRetry={loadPatients} />;
  }

  return (
    <div className="space-y-6">
      {/* Patient Selection */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-clinical-900">Select Patient</h2>
          <Button variant="outline" size="sm" onClick={loadPatients}>
            <ApperIcon name="RefreshCw" size={16} className="mr-2" />
            Refresh
          </Button>
        </div>
        
        {patients.length === 0 ? (
          <Empty
            icon="Users"
            title="No patients found"
            message="Add patients to start diagnostic analysis"
            actionLabel="Add Patient"
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

      {selectedPatient && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Patient Data Input */}
          <div className="lg:col-span-2">
            <Card>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                  <ApperIcon name="User" size={20} className="text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-clinical-900">{selectedPatient.name}</h2>
                  <p className="text-clinical-600">Patient Analysis & Data Input</p>
                </div>
              </div>

              <div className="space-y-4">
                <Textarea
                  label="Current Symptoms"
                  placeholder="Enter patient's current symptoms, complaints, and presenting issues..."
                  value={analysisData.symptoms}
                  onChange={(e) => setAnalysisData(prev => ({ ...prev, symptoms: e.target.value }))}
                  rows={3}
                  required
                />

                <Textarea
                  label="Medical History"
                  placeholder="Enter relevant medical history, previous diagnoses, surgeries, medications..."
                  value={analysisData.medicalHistory}
                  onChange={(e) => setAnalysisData(prev => ({ ...prev, medicalHistory: e.target.value }))}
                  rows={3}
                />

                <Textarea
                  label="Lab Results"
                  placeholder="Enter recent lab results, biomarkers, test values..."
                  value={analysisData.labResults}
                  onChange={(e) => setAnalysisData(prev => ({ ...prev, labResults: e.target.value }))}
                  rows={3}
                />

                <Textarea
                  label="Lifestyle Factors"
                  placeholder="Diet, exercise, sleep patterns, stress levels, environmental factors..."
                  value={analysisData.lifestyle}
                  onChange={(e) => setAnalysisData(prev => ({ ...prev, lifestyle: e.target.value }))}
                  rows={2}
                />

                <Textarea
                  label="Additional Notes"
                  placeholder="Any additional observations or notes..."
                  value={analysisData.notes}
                  onChange={(e) => setAnalysisData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={2}
                />

                <div className="flex space-x-3 pt-4">
                  <Button 
                    onClick={generateAIInsights}
                    disabled={loading || !analysisData.symptoms.trim()}
                    className="flex-1"
                  >
                    {loading ? (
                      <>
                        <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <ApperIcon name="Brain" size={16} className="mr-2" />
                        Generate AI Insights
                      </>
                    )}
                  </Button>
                  <Button variant="outline">
                    <ApperIcon name="Save" size={16} className="mr-2" />
                    Save Analysis
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* AI Insights Panel */}
          <div className="space-y-4">
            <Card>
              <div className="flex items-center space-x-2 mb-4">
                <ApperIcon name="Sparkles" className="text-accent-600" size={20} />
                <h3 className="text-lg font-semibold text-clinical-900">AI Diagnostic Insights</h3>
              </div>

              {aiInsights.length === 0 ? (
                <div className="text-center py-8">
                  <ApperIcon name="Brain" size={32} className="mx-auto mb-3 text-clinical-300" />
                  <p className="text-clinical-600 mb-2">No insights generated yet</p>
                  <p className="text-sm text-clinical-500">
                    Enter patient symptoms and click "Generate AI Insights" to get diagnostic suggestions
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {aiInsights.map((insight) => (
                    <AIInsightCard
                      key={insight.Id}
                      insight={insight}
                      onAccept={handleAcceptInsight}
                      onDismiss={handleDismissInsight}
                    />
                  ))}
                </div>
              )}
            </Card>

            {/* Quick Actions */}
            <Card>
              <h4 className="font-medium text-clinical-900 mb-3">Quick Actions</h4>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <ApperIcon name="Grid3x3" size={16} className="mr-2" />
                  Build Matrix
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <ApperIcon name="FileText" size={16} className="mr-2" />
                  Create Report
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <ApperIcon name="Download" size={16} className="mr-2" />
                  Export PDF
                </Button>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiagnosticAnalysis;