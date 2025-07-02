import diagnosticData from '@/services/mockData/diagnostics.json';

export const DiagnosticService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...diagnosticData];
  },

  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const diagnostic = diagnosticData.find(d => d.Id === parseInt(id));
    if (!diagnostic) {
      throw new Error('Diagnostic analysis not found');
    }
    return { ...diagnostic };
  },

  generateInsights: async (analysisData) => {
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
    await new Promise(resolve => setTimeout(resolve, 300));
    const maxId = Math.max(...diagnosticData.map(d => d.Id), 0);
    const newDiagnostic = {
      ...diagnosticData,
      Id: maxId + 1,
      timestamp: new Date().toISOString()
    };
    return newDiagnostic;
  },

  update: async (id, updates) => {
    await new Promise(resolve => setTimeout(resolve, 250));
    const diagnostic = diagnosticData.find(d => d.Id === parseInt(id));
    if (!diagnostic) {
      throw new Error('Diagnostic analysis not found');
    }
    return { ...diagnostic, ...updates, Id: parseInt(id) };
  },

  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const index = diagnosticData.findIndex(d => d.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Diagnostic analysis not found');
    }
    return true;
  }
};