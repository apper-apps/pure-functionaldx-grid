import matrixData from '@/services/mockData/matrices.json';

export const MatrixService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...matrixData];
  },

  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const matrix = matrixData.find(m => m.Id === parseInt(id));
    if (!matrix) {
      throw new Error('Matrix not found');
    }
    return { ...matrix };
  },

  getByPatientId: async (patientId) => {
    await new Promise(resolve => setTimeout(resolve, 250));
    const matrix = matrixData.find(m => m.patientId === parseInt(patientId));
    if (!matrix) {
      throw new Error('Matrix not found for patient');
    }
    return { ...matrix };
  },

  create: async (matrixData) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const maxId = Math.max(...matrixData.map(m => m.Id), 0);
    const newMatrix = {
      ...matrixData,
      Id: maxId + 1,
      lastModified: new Date().toISOString()
    };
    return newMatrix;
  },

  update: async (id, updates) => {
    await new Promise(resolve => setTimeout(resolve, 250));
    const matrix = matrixData.find(m => m.Id === parseInt(id));
    if (!matrix) {
      throw new Error('Matrix not found');
    }
    return { ...matrix, ...updates, Id: parseInt(id), lastModified: new Date().toISOString() };
  },

  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const index = matrixData.findIndex(m => m.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Matrix not found');
    }
    return true;
  }
};