import formData from '@/services/mockData/intakeForms.json';
import responseData from '@/services/mockData/formResponses.json';

export const IntakeFormService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...formData];
  },

  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const form = formData.find(f => f.Id === parseInt(id));
    if (!form) {
      throw new Error('Form not found');
    }
    return { ...form };
  },

  getResponses: async (formId) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const responses = responseData.filter(r => r.formId === parseInt(formId));
    return responses.map(r => ({ ...r }));
  },

  create: async (formData) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const maxId = Math.max(...formData.map(f => f.Id), 0);
    const newForm = {
      ...formData,
      Id: maxId + 1,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    };
    return newForm;
  },

  update: async (id, updates) => {
    await new Promise(resolve => setTimeout(resolve, 250));
    const form = formData.find(f => f.Id === parseInt(id));
    if (!form) {
      throw new Error('Form not found');
    }
    return { ...form, ...updates, Id: parseInt(id), lastModified: new Date().toISOString() };
  },

  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const index = formData.findIndex(f => f.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Form not found');
    }
    return true;
  }
};