import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Sidebar = ({ isOpen, onClose }) => {
  const navigation = [
    {
      name: 'Diagnostic Analysis',
      href: '/diagnostic-analysis',
      icon: 'Brain',
      description: 'AI-powered patient analysis'
    },
    {
      name: 'Matrix Builder',
      href: '/matrix-builder',
      icon: 'Grid3x3',
      description: 'Functional medicine matrices'
    },
    {
      name: 'Patient Intake',
      href: '/patient-intake',
      icon: 'FileText',
      description: 'Intake forms & responses'
    },
    {
      name: 'Patient Records',
      href: '/patient-records',
      icon: 'Users',
      description: 'Patient management'
    }
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

{/* Sidebar */}
      <motion.aside
        initial={{ x: window.innerWidth >= 1024 ? 0 : -280 }}
        animate={{ x: isOpen || window.innerWidth >= 1024 ? 0 : -280 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="fixed left-0 top-0 h-full w-72 bg-white border-r border-clinical-200 z-50 lg:relative lg:translate-x-0 lg:z-auto"
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center space-x-3 p-6 border-b border-clinical-200">
            <div className="w-10 h-10 bg-gradient-to-r from-primary-600 to-accent-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="Stethoscope" size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-clinical-900">FunctionalDX</h1>
              <p className="text-sm text-clinical-600">Pro</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={() => window.innerWidth < 1024 && onClose()}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                    isActive
                      ? 'bg-gradient-to-r from-primary-50 to-accent-50 text-primary-700 border-l-4 border-primary-600'
                      : 'text-clinical-600 hover:bg-clinical-50 hover:text-clinical-900'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <ApperIcon
                      name={item.icon}
                      size={20}
                      className={isActive ? 'text-primary-600' : 'text-clinical-500 group-hover:text-clinical-700'}
                    />
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-xs text-clinical-500">{item.description}</p>
                    </div>
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-6 border-t border-clinical-200">
            <div className="bg-gradient-to-r from-accent-50 to-primary-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <ApperIcon name="Sparkles" size={16} className="text-accent-600" />
                <p className="text-sm font-medium text-clinical-900">AI Insights</p>
              </div>
              <p className="text-xs text-clinical-600">
                Get better diagnostic insights with our AI-powered analysis
              </p>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;