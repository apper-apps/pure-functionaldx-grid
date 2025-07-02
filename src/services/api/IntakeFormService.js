export const IntakeFormService = {
  getAll: async () => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "questions" } },
          { field: { Name: "status" } },
          { field: { Name: "created_at" } },
          { field: { Name: "last_modified" } }
        ]
      };
      
      const response = await apperClient.fetchRecords('intake_form', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error('Error fetching intake forms:', error);
      throw error;
    }
  },

getById: async (id) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "questions" } },
          { field: { Name: "status" } },
          { field: { Name: "created_at" } },
          { field: { Name: "last_modified" } }
        ]
      };
      
      const response = await apperClient.getRecordById('intake_form', parseInt(id), params);
      
      if (!response.success) {
        // Handle "not found" as null return, throw for other errors
        if (response.message && (
          response.message.toLowerCase().includes('not found') || 
          response.message.toLowerCase().includes('record with id') ||
          response.message.toLowerCase().includes('does not exist') ||
          response.message.toLowerCase().includes('no record found') ||
          response.message.toLowerCase().includes('record not found') ||
          response.message.includes('404')
        )) {
          console.log(`Intake form with ID ${id} not found, returning null`);
          return null;
        }
        console.error(`Error fetching intake form with ID ${id}:`, response.message);
        throw new Error(response.message);
      }
      
      return response.data;
    } catch (error) {
      // Check if this is a network/API error that might indicate "not found"
      if (error.message && (
        error.message.toLowerCase().includes('not found') ||
        error.message.toLowerCase().includes('record with id') ||
        error.message.toLowerCase().includes('does not exist') ||
        error.message.toLowerCase().includes('404')
      )) {
        console.log(`Intake form with ID ${id} not found, returning null`);
        return null;
      }
      console.error(`Error fetching intake form with ID ${id}:`, error);
      throw error;
    }
  },

  getResponses: async (formId) => {
    // Get responses from form_response table
    try {
      const FormResponseService = await import('./FormResponseService.js');
      return await FormResponseService.FormResponseService.getByFormId(formId);
    } catch (error) {
      console.error(`Error fetching responses for form ${formId}:`, error);
      return [];
    }
  },

  create: async (formData) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
records: [{
          Name: formData.Name || formData.title,
          Tags: formData.Tags,
          Owner: formData.Owner ? parseInt(formData.Owner) : null,
          title: formData.title,
          description: formData.description,
          questions: JSON.stringify(formData.questions),
          status: formData.status || 'draft',
          created_at: new Date().toISOString(),
          last_modified: new Date().toISOString()
        }]
      };
      
      const response = await apperClient.createRecord('intake_form', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error('Failed to create intake form record');
        }
        
        return successfulRecords[0]?.data;
      }
    } catch (error) {
      console.error('Error creating intake form:', error);
      throw error;
    }
  },

  update: async (id, updates) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        records: [{
Id: parseInt(id),
          Name: updates.Name || updates.title,
          Tags: updates.Tags,
          Owner: updates.Owner ? parseInt(updates.Owner) : null,
          title: updates.title,
          description: updates.description,
          questions: JSON.stringify(updates.questions),
          status: updates.status,
          created_at: updates.created_at,
          last_modified: new Date().toISOString()
        }]
      };
      
      const response = await apperClient.updateRecord('intake_form', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          throw new Error('Failed to update intake form record');
        }
        
        return successfulUpdates[0]?.data;
      }
    } catch (error) {
      console.error('Error updating intake form:', error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord('intake_form', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          throw new Error('Failed to delete intake form record');
        }
        
        return true;
      }
    } catch (error) {
      console.error('Error deleting intake form:', error);
      throw error;
    }
  }
};