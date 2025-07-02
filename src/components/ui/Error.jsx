import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const Error = ({ 
  title = "Something went wrong", 
  message = "We encountered an error while processing your request. Please try again.", 
  onRetry,
  showRetry = true 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-center min-h-[400px]"
    >
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-gradient-to-r from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-4">
          <ApperIcon name="AlertTriangle" size={32} className="text-red-600" />
        </div>
        
        <h2 className="text-xl font-semibold text-clinical-900 mb-2">{title}</h2>
        <p className="text-clinical-600 mb-6">{message}</p>
        
        {showRetry && onRetry && (
          <div className="space-y-3">
            <Button onClick={onRetry} className="w-full">
              <ApperIcon name="RefreshCw" size={16} className="mr-2" />
              Try Again
            </Button>
            <Button variant="ghost" onClick={() => window.location.reload()}>
              <ApperIcon name="RotateCcw" size={16} className="mr-2" />
              Refresh Page
            </Button>
          </div>
        )}
        
        <div className="mt-6 p-4 bg-clinical-50 rounded-lg">
          <p className="text-sm text-clinical-600">
            If this problem persists, please contact support with the error details.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default Error;