export const FormResponseService = {
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
          { field: { Name: "form_id" } },
          { field: { Name: "data" } },
          { field: { Name: "completed_at" } }
        ]
      };
      
      const response = await apperClient.fetchRecords('form_response', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error('Error fetching form responses:', error);
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
          { field: { Name: "form_id" } },
          { field: { Name: "data" } },
          { field: { Name: "completed_at" } }
        ]
      };
      
      const response = await apperClient.getRecordById('form_response', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching form response with ID ${id}:`, error);
      throw error;
    }
  },

  getByFormId: async (formId) => {
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
          { field: { Name: "form_id" } },
          { field: { Name: "data" } },
          { field: { Name: "completed_at" } }
        ],
        where: [
          {
            FieldName: "form_id",
            Operator: "EqualTo",
            Values: [parseInt(formId)]
          }
        ]
      };
      
      const response = await apperClient.fetchRecords('form_response', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error(`Error fetching responses for form ${formId}:`, error);
      throw error;
    }
  },

  create: async (responseData) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        records: [{
          Name: responseData.Name || `Response ${Date.now()}`,
          Tags: responseData.Tags,
          Owner: responseData.Owner,
          form_id: parseInt(responseData.form_id),
          data: JSON.stringify(responseData.data),
          completed_at: responseData.completed_at || new Date().toISOString()
        }]
      };
      
      const response = await apperClient.createRecord('form_response', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error('Failed to create form response record');
        }
        
        return successfulRecords[0]?.data;
      }
    } catch (error) {
      console.error('Error creating form response:', error);
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
          Name: updates.Name,
          Tags: updates.Tags,
          Owner: updates.Owner,
          form_id: parseInt(updates.form_id),
          data: JSON.stringify(updates.data),
          completed_at: updates.completed_at
        }]
      };
      
      const response = await apperClient.updateRecord('form_response', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          throw new Error('Failed to update form response record');
        }
        
        return successfulUpdates[0]?.data;
      }
    } catch (error) {
      console.error('Error updating form response:', error);
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
      
      const response = await apperClient.deleteRecord('form_response', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          throw new Error('Failed to delete form response record');
        }
        
        return true;
      }
    } catch (error) {
      console.error('Error deleting form response:', error);
      throw error;
    }
  }
};