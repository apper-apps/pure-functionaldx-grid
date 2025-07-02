import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Layout from '@/components/organisms/Layout';
import DiagnosticAnalysis from '@/components/pages/DiagnosticAnalysis';
import MatrixBuilder from '@/components/pages/MatrixBuilder';
import PatientIntake from '@/components/pages/PatientIntake';
import PatientRecords from '@/components/pages/PatientRecords';

function App() {
  return (
    <div className="min-h-screen bg-clinical-50">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<DiagnosticAnalysis />} />
          <Route path="diagnostic-analysis" element={<DiagnosticAnalysis />} />
          <Route path="matrix-builder" element={<MatrixBuilder />} />
          <Route path="patient-intake" element={<PatientIntake />} />
          <Route path="patient-records" element={<PatientRecords />} />
        </Route>
      </Routes>
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ zIndex: 9999 }}
      />
    </div>
  );
}

export default App;