export const MatrixService = {
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
          { field: { Name: "systems" } },
          { field: { Name: "annotations" } },
          { field: { Name: "status" } },
          { field: { Name: "last_modified" } },
          { field: { Name: "patient_id" } }
        ]
      };
      
      const response = await apperClient.fetchRecords('matrix', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error('Error fetching matrices:', error);
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
          { field: { Name: "systems" } },
          { field: { Name: "annotations" } },
          { field: { Name: "status" } },
          { field: { Name: "last_modified" } },
          { field: { Name: "patient_id" } }
        ]
      };
      
      const response = await apperClient.getRecordById('matrix', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching matrix with ID ${id}:`, error);
      throw error;
    }
  },

  getByPatientId: async (patientId) => {
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
          { field: { Name: "systems" } },
          { field: { Name: "annotations" } },
          { field: { Name: "status" } },
          { field: { Name: "last_modified" } },
          { field: { Name: "patient_id" } }
        ],
        where: [
          {
            FieldName: "patient_id",
            Operator: "EqualTo",
            Values: [parseInt(patientId)]
          }
        ]
      };
      
      const response = await apperClient.fetchRecords('matrix', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (!response.data || response.data.length === 0) {
        throw new Error('Matrix not found for patient');
      }
      
      return response.data[0];
    } catch (error) {
      console.error(`Error fetching matrix for patient ${patientId}:`, error);
      throw error;
    }
  },

  create: async (matrixData) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        records: [{
          Name: matrixData.Name,
          Tags: matrixData.Tags,
          Owner: matrixData.Owner,
          systems: JSON.stringify(matrixData.systems),
          annotations: JSON.stringify(matrixData.annotations),
          status: matrixData.status,
          last_modified: new Date().toISOString(),
          patient_id: parseInt(matrixData.patient_id)
        }]
      };
      
      const response = await apperClient.createRecord('matrix', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error('Failed to create matrix record');
        }
        
        return successfulRecords[0]?.data;
      }
    } catch (error) {
      console.error('Error creating matrix:', error);
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
          systems: JSON.stringify(updates.systems),
          annotations: JSON.stringify(updates.annotations),
          status: updates.status,
          last_modified: new Date().toISOString(),
          patient_id: parseInt(updates.patient_id)
        }]
      };
      
      const response = await apperClient.updateRecord('matrix', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          throw new Error('Failed to update matrix record');
        }
        
        return successfulUpdates[0]?.data;
      }
    } catch (error) {
      console.error('Error updating matrix:', error);
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
      
      const response = await apperClient.deleteRecord('matrix', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          throw new Error('Failed to delete matrix record');
        }
        
        return true;
      }
    } catch (error) {
      console.error('Error deleting matrix:', error);
      throw error;
    }
  }
};