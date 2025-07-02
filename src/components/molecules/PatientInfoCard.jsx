import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';
import { format } from 'date-fns';

const PatientInfoCard = ({ patient, onSelect, compact = false }) => {
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

  if (compact) {
    return (
      <Card hover className="cursor-pointer" onClick={() => onSelect(patient)}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-clinical-900">{patient.name}</h3>
            <p className="text-sm text-clinical-600">
              Age {calculateAge(patient.dateOfBirth)} • {patient.contactInfo.email}
            </p>
          </div>
          <ApperIcon name="ChevronRight" className="text-clinical-400" size={20} />
        </div>
      </Card>
    );
  }

  return (
    <Card hover className="cursor-pointer" onClick={() => onSelect(patient)}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-clinical-900">{patient.name}</h3>
          <p className="text-clinical-600">Patient ID: {patient.Id}</p>
        </div>
        <Badge variant="primary">Active</Badge>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm font-medium text-clinical-700">Age</p>
          <p className="text-clinical-900">{calculateAge(patient.dateOfBirth)} years</p>
        </div>
        <div>
          <p className="text-sm font-medium text-clinical-700">Date of Birth</p>
          <p className="text-clinical-900">{format(new Date(patient.dateOfBirth), 'MMM dd, yyyy')}</p>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <ApperIcon name="Mail" size={16} className="text-clinical-500" />
          <span className="text-sm text-clinical-700">{patient.contactInfo.email}</span>
        </div>
        <div className="flex items-center space-x-2">
          <ApperIcon name="Phone" size={16} className="text-clinical-500" />
          <span className="text-sm text-clinical-700">{patient.contactInfo.phone}</span>
        </div>
      </div>
      
      {patient.currentSymptoms && patient.currentSymptoms.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-medium text-clinical-700 mb-2">Current Symptoms</p>
          <div className="flex flex-wrap gap-1">
            {patient.currentSymptoms.slice(0, 3).map((symptom, index) => (
              <Badge key={index} variant="warning" size="sm">
                {symptom}
              </Badge>
            ))}
            {patient.currentSymptoms.length > 3 && (
              <Badge variant="default" size="sm">
                +{patient.currentSymptoms.length - 3} more
              </Badge>
            )}
          </div>
        </div>
      )}
    </Card>
  );
};

export default PatientInfoCard;