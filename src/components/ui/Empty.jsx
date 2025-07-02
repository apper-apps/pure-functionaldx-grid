import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const Empty = ({ 
  icon = "FileText",
  title = "No data available", 
  message = "Get started by adding your first item.", 
  actionLabel = "Add Item",
  onAction,
  showAction = true 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-center min-h-[400px]"
    >
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-gradient-to-r from-clinical-100 to-clinical-200 rounded-full flex items-center justify-center mx-auto mb-6">
          <ApperIcon name={icon} size={40} className="text-clinical-400" />
        </div>
        
        <h2 className="text-xl font-semibold text-clinical-900 mb-2">{title}</h2>
        <p className="text-clinical-600 mb-6">{message}</p>
        
        {showAction && onAction && (
          <Button onClick={onAction} className="px-6">
            <ApperIcon name="Plus" size={16} className="mr-2" />
            {actionLabel}
          </Button>
        )}
        
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-primary-50 rounded-lg">
            <ApperIcon name="Brain" size={20} className="text-primary-600 mx-auto mb-1" />
            <p className="text-xs text-primary-700 font-medium">AI Analysis</p>
          </div>
          <div className="p-3 bg-secondary-50 rounded-lg">
            <ApperIcon name="Grid3x3" size={20} className="text-secondary-600 mx-auto mb-1" />
            <p className="text-xs text-secondary-700 font-medium">Matrix Builder</p>
          </div>
          <div className="p-3 bg-accent-50 rounded-lg">
            <ApperIcon name="FileText" size={20} className="text-accent-600 mx-auto mb-1" />
            <p className="text-xs text-accent-700 font-medium">Intake Forms</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Empty;