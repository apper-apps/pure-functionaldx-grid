export const PatientService = {
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
          { field: { Name: "date_of_birth" } },
          { field: { Name: "contact_info_email" } },
          { field: { Name: "contact_info_phone" } },
          { field: { Name: "contact_info_address" } },
          { field: { Name: "medical_history" } },
          { field: { Name: "current_symptoms" } },
          { field: { Name: "lab_results" } },
          { field: { Name: "created_at" } }
        ]
      };
      
      const response = await apperClient.fetchRecords('patient', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error('Error fetching patients:', error);
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
          { field: { Name: "date_of_birth" } },
          { field: { Name: "contact_info_email" } },
          { field: { Name: "contact_info_phone" } },
          { field: { Name: "contact_info_address" } },
          { field: { Name: "medical_history" } },
          { field: { Name: "current_symptoms" } },
          { field: { Name: "lab_results" } },
          { field: { Name: "created_at" } }
        ]
      };
      
      const response = await apperClient.getRecordById('patient', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching patient with ID ${id}:`, error);
      throw error;
    }
  },

  create: async (patientData) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      // Only include Updateable fields
      const params = {
        records: [{
          Name: patientData.Name,
          Tags: patientData.Tags,
          Owner: patientData.Owner,
          date_of_birth: patientData.date_of_birth,
          contact_info_email: patientData.contact_info_email,
          contact_info_phone: patientData.contact_info_phone,
          contact_info_address: patientData.contact_info_address,
          medical_history: patientData.medical_history,
          current_symptoms: patientData.current_symptoms,
          lab_results: patientData.lab_results,
          created_at: patientData.created_at || new Date().toISOString()
        }]
      };
      
      const response = await apperClient.createRecord('patient', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error('Failed to create patient record');
        }
        
        return successfulRecords[0]?.data;
      }
    } catch (error) {
      console.error('Error creating patient:', error);
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
      
      // Only include Updateable fields
      const params = {
        records: [{
          Id: parseInt(id),
          Name: updates.Name,
          Tags: updates.Tags,
          Owner: updates.Owner,
          date_of_birth: updates.date_of_birth,
          contact_info_email: updates.contact_info_email,
          contact_info_phone: updates.contact_info_phone,
          contact_info_address: updates.contact_info_address,
          medical_history: updates.medical_history,
          current_symptoms: updates.current_symptoms,
          lab_results: updates.lab_results,
          created_at: updates.created_at
        }]
      };
      
      const response = await apperClient.updateRecord('patient', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          throw new Error('Failed to update patient record');
        }
        
        return successfulUpdates[0]?.data;
      }
    } catch (error) {
      console.error('Error updating patient:', error);
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
      
      const response = await apperClient.deleteRecord('patient', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          throw new Error('Failed to delete patient record');
        }
        
        return true;
      }
    } catch (error) {
      console.error('Error deleting patient:', error);
      throw error;
    }
  }
};