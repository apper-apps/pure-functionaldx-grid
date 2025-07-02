import patientData from '@/services/mockData/patients.json';

export const PatientService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...patientData];
  },

  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const patient = patientData.find(p => p.Id === parseInt(id));
    if (!patient) {
      throw new Error('Patient not found');
    }
    return { ...patient };
  },

  create: async (patientData) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const maxId = Math.max(...patientData.map(p => p.Id), 0);
    const newPatient = {
      ...patientData,
      Id: maxId + 1,
      createdAt: new Date().toISOString()
    };
    return newPatient;
  },

  update: async (id, updates) => {
    await new Promise(resolve => setTimeout(resolve, 250));
    const patient = patientData.find(p => p.Id === parseInt(id));
    if (!patient) {
      throw new Error('Patient not found');
    }
    return { ...patient, ...updates, Id: parseInt(id) };
  },

  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const index = patientData.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Patient not found');
    }
    return true;
  }
};