import { FormResponseService } from "@/services/api/FormResponseService";
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
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "questions" } },
          { field: { Name: "status" } },
          { field: { Name: "created_at" } },
          { field: { Name: "last_modified" } }
        ],
        orderBy: [
          {
            fieldName: "created_at",
            sorttype: "DESC"
          }
        ]
      };

      const response = await apperClient.fetchRecords("intake_form", params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching intake forms:", error);
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
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "questions" } },
          { field: { Name: "status" } },
          { field: { Name: "created_at" } },
          { field: { Name: "last_modified" } }
        ]
      };

      const response = await apperClient.getRecordById("intake_form", id, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
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

      // Only include Updateable fields
      const recordData = {
        Name: formData.title || formData.Name,
        title: formData.title,
        description: formData.description,
        questions: typeof formData.questions === 'string' ? formData.questions : JSON.stringify(formData.questions || []),
        status: formData.status || "draft",
        created_at: new Date().toISOString(),
        last_modified: new Date().toISOString()
      };

      const params = {
        records: [recordData]
      };

      const response = await apperClient.createRecord("intake_form", params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);

        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(`Failed to create intake form: ${failedRecords[0].message || 'Unknown error'}`);
        }

        return successfulRecords[0]?.data;
      }

      throw new Error('No response data received');
    } catch (error) {
      console.error("Error creating intake form:", error);
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
      const recordData = {
        Id: parseInt(id),
        ...(updates.title !== undefined && { title: updates.title }),
        ...(updates.Name !== undefined && { Name: updates.Name }),
        ...(updates.description !== undefined && { description: updates.description }),
        ...(updates.questions !== undefined && { 
          questions: typeof updates.questions === 'string' ? updates.questions : JSON.stringify(updates.questions) 
        }),
        ...(updates.status !== undefined && { status: updates.status }),
        last_modified: new Date().toISOString()
      };

      const params = {
        records: [recordData]
      };

      const response = await apperClient.updateRecord("intake_form", params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);

        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          throw new Error(`Failed to update intake form: ${failedUpdates[0].message || 'Unknown error'}`);
        }

        return successfulUpdates[0]?.data;
      }

      throw new Error('No response data received');
    } catch (error) {
      console.error("Error updating intake form:", error);
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

      const response = await apperClient.deleteRecord("intake_form", params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);

        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          throw new Error(`Failed to delete intake form: ${failedDeletions[0].message || 'Unknown error'}`);
        }

        return successfulDeletions.length > 0;
      }

      throw new Error('No response data received');
    } catch (error) {
      console.error("Error deleting intake form:", error);
      throw error;
    }
}
};