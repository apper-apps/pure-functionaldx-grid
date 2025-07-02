import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const Header = ({ onMenuToggle }) => {
  const location = useLocation();
  const [notifications, setNotifications] = useState(3);

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
      case '/diagnostic-analysis':
        return 'Diagnostic Analysis';
      case '/matrix-builder':
        return 'Matrix Builder';
      case '/patient-intake':
        return 'Patient Intake';
      case '/patient-records':
        return 'Patient Records';
      default:
        return 'FunctionalDX Pro';
    }
  };

  return (
    <header className="bg-white border-b border-clinical-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuToggle}
            className="lg:hidden"
          >
            <ApperIcon name="Menu" size={20} />
          </Button>
          
          <div>
            <h1 className="text-2xl font-bold text-clinical-900">{getPageTitle()}</h1>
            <p className="text-sm text-clinical-600">AI-powered functional medicine diagnostics</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="relative">
            <ApperIcon name="Bell" size={20} />
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {notifications}
              </span>
            )}
          </Button>
          
          <Button variant="ghost" size="sm">
            <ApperIcon name="Settings" size={20} />
          </Button>
          
          <div className="flex items-center space-x-2 bg-clinical-50 rounded-lg px-3 py-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
              <ApperIcon name="User" size={16} className="text-white" />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-clinical-900">Dr. Smith</p>
              <p className="text-xs text-clinical-600">Functional Medicine</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;