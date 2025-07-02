import { motion } from 'framer-motion';
import { useDrop } from 'react-dnd';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';

const MatrixCell = ({ system, conditions = [], onAddCondition, onRemoveCondition }) => {
  const [{ isOver }, drop] = useDrop({
    accept: 'condition',
    drop: (item) => onAddCondition(system.name, item),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const systemColors = {
    'Gastrointestinal': 'bg-orange-50 border-orange-200',
    'Immune': 'bg-red-50 border-red-200',
    'Energy': 'bg-yellow-50 border-yellow-200',
    'Hormonal': 'bg-pink-50 border-pink-200',
    'Structural': 'bg-blue-50 border-blue-200',
    'Mind/Spirit': 'bg-purple-50 border-purple-200',
    'Detoxification': 'bg-green-50 border-green-200'
  };

  return (
    <motion.div
      ref={drop}
      className={`
        matrix-cell p-4 rounded-lg border-2 min-h-[200px]
        ${systemColors[system.name] || 'bg-clinical-50 border-clinical-200'}
        ${isOver ? 'border-primary-400 bg-primary-50' : ''}
        transition-all duration-200
      `}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-clinical-900">{system.name}</h3>
        <button
          onClick={() => onAddCondition(system.name)}
          className="p-1 rounded-full hover:bg-white/50 transition-colors"
        >
          <ApperIcon name="Plus" size={16} className="text-clinical-600" />
        </button>
      </div>
      
      <p className="text-sm text-clinical-600 mb-4">{system.description}</p>
      
      <div className="space-y-2">
        {conditions.map((condition, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-between p-2 bg-white/60 rounded border"
          >
            <span className="text-sm font-medium text-clinical-800">{condition.name}</span>
            <button
              onClick={() => onRemoveCondition(system.name, index)}
              className="p-1 rounded-full hover:bg-red-100 transition-colors"
            >
              <ApperIcon name="X" size={12} className="text-red-500" />
            </button>
          </motion.div>
        ))}
        
        {conditions.length === 0 && (
          <div className="text-center py-6 text-clinical-500">
            <ApperIcon name="Plus" size={24} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">Drop conditions here or click + to add</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MatrixCell;