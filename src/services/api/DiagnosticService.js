export const DiagnosticService = {
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
          { field: { Name: "input_data_symptoms" } },
          { field: { Name: "input_data_medical_history" } },
          { field: { Name: "input_data_lab_results" } },
          { field: { Name: "input_data_lifestyle" } },
          { field: { Name: "input_data_notes" } },
          { field: { Name: "ai_suggestions" } },
          { field: { Name: "practitioner_notes" } },
          { field: { Name: "timestamp" } },
          { field: { Name: "patient_id" } }
        ]
      };
      
      const response = await apperClient.fetchRecords('diagnostic', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error('Error fetching diagnostics:', error);
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
          { field: { Name: "input_data_symptoms" } },
          { field: { Name: "input_data_medical_history" } },
          { field: { Name: "input_data_lab_results" } },
          { field: { Name: "input_data_lifestyle" } },
          { field: { Name: "input_data_notes" } },
          { field: { Name: "ai_suggestions" } },
          { field: { Name: "practitioner_notes" } },
          { field: { Name: "timestamp" } },
          { field: { Name: "patient_id" } }
        ]
      };
      
      const response = await apperClient.getRecordById('diagnostic', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching diagnostic with ID ${id}:`, error);
      throw error;
    }
  },

  generateInsights: async (analysisData) => {
    // First, save the diagnostic analysis to the database
    try {
      await DiagnosticService.create({
        Name: `Analysis for Patient ${analysisData.patientId}`,
        input_data_symptoms: analysisData.symptoms,
        input_data_medical_history: analysisData.medicalHistory,
        input_data_lab_results: analysisData.labResults,
        input_data_lifestyle: analysisData.lifestyle,
        input_data_notes: analysisData.notes,
        patient_id: analysisData.patientId,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error saving diagnostic analysis:', error);
    }
    
    // Simulate AI analysis delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate AI analysis based on symptoms
    const symptoms = analysisData.symptoms?.toLowerCase() || '';
    const insights = [];
    
    if (symptoms.includes('fatigue') || symptoms.includes('tired')) {
      insights.push({
        Id: 1,
        condition: 'Mitochondrial Dysfunction',
        confidence: 85,
        reasoning: 'Chronic fatigue patterns suggest cellular energy production issues. Consider ATP synthesis pathways and oxidative stress markers.',
        supportingEvidence: [
          'Persistent energy depletion symptoms',
          'Pattern consistent with cellular dysfunction',
          'May correlate with nutrient deficiencies'
        ]
      });
    }
    
    if (symptoms.includes('digestive') || symptoms.includes('bloating') || symptoms.includes('gut')) {
      insights.push({
        Id: 2,
        condition: 'Small Intestinal Bacterial Overgrowth (SIBO)',
        confidence: 78,
        reasoning: 'GI symptoms pattern indicates potential bacterial imbalance in the small intestine.',
        supportingEvidence: [
          'Digestive discomfort patterns',
          'Bloating and gas symptoms',
          'May indicate microbiome dysbiosis'
        ]
      });
    }
    
    if (symptoms.includes('joint') || symptoms.includes('pain') || symptoms.includes('inflammation')) {
      insights.push({
        Id: 3,
        condition: 'Systemic Inflammation',
        confidence: 72,
        reasoning: 'Pain and joint symptoms suggest underlying inflammatory processes that may affect multiple systems.',
        supportingEvidence: [
          'Joint pain and stiffness patterns',
          'Inflammatory marker elevation likely',
          'May involve autoimmune components'
        ]
      });
    }
    
    if (symptoms.includes('hormone') || symptoms.includes('mood') || symptoms.includes('sleep')) {
      insights.push({
        Id: 4,
        condition: 'Hormonal Imbalance',
        confidence: 69,
        reasoning: 'Sleep and mood disturbances often correlate with hormonal dysregulation affecting multiple endocrine pathways.',
        supportingEvidence: [
          'Sleep pattern disruption',
          'Mood regulation challenges',
          'Likely HPA axis involvement'
        ]
      });
    }
    
    // Default insight if no specific patterns match
    if (insights.length === 0) {
      insights.push({
        Id: 5,
        condition: 'Functional Imbalance Pattern',
        confidence: 60,
        reasoning: 'Symptom constellation suggests multi-system functional medicine approach may be beneficial.',
        supportingEvidence: [
          'Multiple symptom presentation',
          'Suggests root cause investigation needed',
          'Functional medicine matrix analysis recommended'
        ]
      });
    }
    
    return insights;
  },

  create: async (diagnosticData) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        records: [{
          Name: diagnosticData.Name,
          Tags: diagnosticData.Tags,
          Owner: diagnosticData.Owner,
          input_data_symptoms: diagnosticData.input_data_symptoms,
          input_data_medical_history: diagnosticData.input_data_medical_history,
          input_data_lab_results: diagnosticData.input_data_lab_results,
          input_data_lifestyle: diagnosticData.input_data_lifestyle,
          input_data_notes: diagnosticData.input_data_notes,
          ai_suggestions: diagnosticData.ai_suggestions,
          practitioner_notes: diagnosticData.practitioner_notes,
          timestamp: diagnosticData.timestamp || new Date().toISOString(),
          patient_id: parseInt(diagnosticData.patient_id)
        }]
      };
      
      const response = await apperClient.createRecord('diagnostic', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error('Failed to create diagnostic record');
        }
        
        return successfulRecords[0]?.data;
      }
    } catch (error) {
      console.error('Error creating diagnostic:', error);
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
          input_data_symptoms: updates.input_data_symptoms,
          input_data_medical_history: updates.input_data_medical_history,
          input_data_lab_results: updates.input_data_lab_results,
          input_data_lifestyle: updates.input_data_lifestyle,
          input_data_notes: updates.input_data_notes,
          ai_suggestions: updates.ai_suggestions,
          practitioner_notes: updates.practitioner_notes,
          timestamp: updates.timestamp,
          patient_id: parseInt(updates.patient_id)
        }]
      };
      
      const response = await apperClient.updateRecord('diagnostic', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          throw new Error('Failed to update diagnostic record');
        }
        
        return successfulUpdates[0]?.data;
      }
    } catch (error) {
      console.error('Error updating diagnostic:', error);
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
      
      const response = await apperClient.deleteRecord('diagnostic', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          throw new Error('Failed to delete diagnostic record');
        }
        
        return true;
      }
    } catch (error) {
      console.error('Error deleting diagnostic:', error);
      throw error;
    }
  }
};