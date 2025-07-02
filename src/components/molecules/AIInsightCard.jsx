import { motion } from 'framer-motion';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';

const AIInsightCard = ({ insight, onAccept, onDismiss }) => {
  const getConfidenceVariant = (confidence) => {
    if (confidence >= 80) return 'success';
    if (confidence >= 60) return 'warning';
    return 'error';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="ai-insight-card p-4 rounded-lg mb-4"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <ApperIcon name="Brain" className="text-accent-600" size={20} />
          <h4 className="font-medium text-clinical-900">AI Diagnostic Suggestion</h4>
        </div>
        <Badge variant="confidence" size="sm">
          {insight.confidence}% confidence
        </Badge>
      </div>
      
      <div className="space-y-2 mb-4">
        <p className="text-clinical-800 font-medium">{insight.condition}</p>
        <p className="text-clinical-600 text-sm">{insight.reasoning}</p>
        
        {insight.supportingEvidence && insight.supportingEvidence.length > 0 && (
          <div className="mt-3">
            <p className="text-xs font-medium text-clinical-700 mb-1">Supporting Evidence:</p>
            <ul className="text-xs text-clinical-600 space-y-1">
              {insight.supportingEvidence.map((evidence, index) => (
                <li key={index} className="flex items-center space-x-1">
                  <ApperIcon name="Check" size={12} className="text-secondary-600" />
                  <span>{evidence}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      <div className="flex space-x-2">
        <button
          onClick={() => onAccept(insight)}
          className="flex items-center space-x-1 px-3 py-1 bg-secondary-100 text-secondary-700 rounded text-sm hover:bg-secondary-200 transition-colors"
        >
          <ApperIcon name="Plus" size={14} />
          <span>Add to Matrix</span>
        </button>
        <button
          onClick={() => onDismiss(insight.Id)}
          className="flex items-center space-x-1 px-3 py-1 bg-clinical-100 text-clinical-600 rounded text-sm hover:bg-clinical-200 transition-colors"
        >
          <ApperIcon name="X" size={14} />
          <span>Dismiss</span>
        </button>
      </div>
    </motion.div>
  );
};

export default AIInsightCard;