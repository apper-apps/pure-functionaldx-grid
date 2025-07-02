import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  className = '', 
  hover = false,
  padding = 'default',
  ...props 
}) => {
  const baseClasses = 'bg-white rounded-lg border border-clinical-200 shadow-medical';
  
  const paddings = {
    none: '',
    sm: 'p-4',
    default: 'p-6',
    lg: 'p-8'
  };
  
  const CardComponent = hover ? motion.div : 'div';
  const motionProps = hover ? {
    whileHover: { scale: 1.02, boxShadow: '0 8px 16px 0 rgba(0, 0, 0, 0.12)' },
    transition: { duration: 0.2 }
  } : {};
  
  return (
    <CardComponent
      className={`
        ${baseClasses}
        ${paddings[padding]}
        ${hover ? 'cursor-pointer' : ''}
        ${className}
      `}
      {...motionProps}
      {...props}
    >
      {children}
    </CardComponent>
  );
};

export default Card;