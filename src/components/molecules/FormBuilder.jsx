import { useState, useEffect, useRef } from 'react';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Textarea from '@/components/atoms/Textarea';
import ApperIcon from '@/components/ApperIcon';
import { motion } from 'framer-motion';

const FormBuilder = ({ form, onUpdateForm }) => {
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [localForm, setLocalForm] = useState(form);
  const [showSaveIndicator, setShowSaveIndicator] = useState(false);
  const saveTimeoutRef = useRef(null);

  // Update local form when external form changes
  useEffect(() => {
    setLocalForm(form);
  }, [form]);

  // Debounced save function
  const debouncedSave = (updatedForm) => {
    setLocalForm(updatedForm);
    
    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    // Set new timeout for auto-save
    saveTimeoutRef.current = setTimeout(() => {
      onUpdateForm(updatedForm);
      setShowSaveIndicator(true);
      
      // Hide save indicator after animation
      setTimeout(() => setShowSaveIndicator(false), 600);
    }, 3000); // 3 second delay
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);
  const questionTypes = [
    { type: 'text', label: 'Text Input', icon: 'Type' },
    { type: 'textarea', label: 'Long Text', icon: 'AlignLeft' },
    { type: 'select', label: 'Multiple Choice', icon: 'List' },
    { type: 'checkbox', label: 'Checkboxes', icon: 'CheckSquare' },
    { type: 'scale', label: 'Rating Scale', icon: 'BarChart3' }
  ];

  const addQuestion = (type) => {
    const newQuestion = {
      Id: (form.questions?.length || 0) + 1,
      type,
      label: 'New Question',
      required: false,
      options: type === 'select' || type === 'checkbox' ? ['Option 1', 'Option 2'] : undefined,
      scale: type === 'scale' ? { min: 1, max: 5, labels: ['Poor', 'Excellent'] } : undefined
    };

    onUpdateForm({
      ...form,
      questions: [...(form.questions || []), newQuestion]
    });
  };

const updateQuestion = (questionId, updates) => {
    const updatedQuestions = localForm.questions.map(q => 
      q.Id === questionId ? { ...q, ...updates } : q
    );
    debouncedSave({ ...localForm, questions: updatedQuestions });
  };

const removeQuestion = (questionId) => {
    const updatedQuestions = localForm.questions.filter(q => q.Id !== questionId);
    const updatedForm = { ...localForm, questions: updatedQuestions };
    setLocalForm(updatedForm);
    onUpdateForm(updatedForm); // Immediate save for deletions
  };

const moveQuestion = (questionId, direction) => {
    const questions = [...localForm.questions];
    const index = questions.findIndex(q => q.Id === questionId);
    
    if (direction === 'up' && index > 0) {
      [questions[index], questions[index - 1]] = [questions[index - 1], questions[index]];
    } else if (direction === 'down' && index < questions.length - 1) {
      [questions[index], questions[index + 1]] = [questions[index + 1], questions[index]];
    }
    
    const updatedForm = { ...localForm, questions };
    setLocalForm(updatedForm);
    onUpdateForm(updatedForm); // Immediate save for reordering
  };

return (
    <div className="space-y-6">
      <div className={`bg-white rounded-lg border border-clinical-200 p-6 ${showSaveIndicator ? 'pulse-save' : ''}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-clinical-900">Form Settings</h3>
          {showSaveIndicator && (
            <div className="flex items-center text-sm text-secondary-600">
              <ApperIcon name="Check" size={14} className="mr-1" />
              Auto-saved
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Form Title"
            value={localForm.title || ''}
            onChange={(e) => debouncedSave({ ...localForm, title: e.target.value })}
            placeholder="Enter form title"
          />
          <Textarea
            label="Description"
            value={localForm.description || ''}
            onChange={(e) => debouncedSave({ ...localForm, description: e.target.value })}
            placeholder="Brief description of the form"
            rows={2}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg border border-clinical-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-clinical-900">Questions</h3>
          <div className="flex space-x-2">
            {questionTypes.map((type) => (
              <Button
                key={type.type}
                variant="outline"
                size="sm"
                onClick={() => addQuestion(type.type)}
                className="flex items-center space-x-1"
              >
                <ApperIcon name={type.icon} size={16} />
                <span>{type.label}</span>
              </Button>
            ))}
          </div>
        </div>

<div className="space-y-4">
          {localForm.questions?.map((question, index) => (
            <motion.div
              key={question.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-clinical-200 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-clinical-600">
                    Question {index + 1}
                  </span>
                  <span className="text-xs bg-clinical-100 text-clinical-600 px-2 py-1 rounded">
                    {question.type}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => moveQuestion(question.Id, 'up')}
                    disabled={index === 0}
                  >
                    <ApperIcon name="ChevronUp" size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
onClick={() => moveQuestion(question.Id, 'down')}
                    disabled={index === localForm.questions.length - 1}
                  >
                    <ApperIcon name="ChevronDown" size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingQuestion(question.Id === editingQuestion ? null : question.Id)}
                  >
                    <ApperIcon name="Edit" size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeQuestion(question.Id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <ApperIcon name="Trash2" size={16} />
                  </Button>
                </div>
              </div>

              {editingQuestion === question.Id ? (
                <div className="space-y-3">
                  <Input
                    label="Question Text"
                    value={question.label}
                    onChange={(e) => updateQuestion(question.Id, { label: e.target.value })}
                  />
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`required-${question.Id}`}
                      checked={question.required}
                      onChange={(e) => updateQuestion(question.Id, { required: e.target.checked })}
                      className="rounded border-clinical-300"
                    />
                    <label htmlFor={`required-${question.Id}`} className="text-sm text-clinical-700">
                      Required field
                    </label>
                  </div>

                  {(question.type === 'select' || question.type === 'checkbox') && (
                    <div>
                      <label className="block text-sm font-medium text-clinical-700 mb-2">
                        Options
                      </label>
                      {question.options?.map((option, optionIndex) => (
                        <div key={optionIndex} className="flex items-center space-x-2 mb-2">
                          <Input
                            value={option}
                            onChange={(e) => {
                              const newOptions = [...question.options];
                              newOptions[optionIndex] = e.target.value;
                              updateQuestion(question.Id, { options: newOptions });
                            }}
                            className="flex-1"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const newOptions = question.options.filter((_, i) => i !== optionIndex);
                              updateQuestion(question.Id, { options: newOptions });
                            }}
                            className="text-red-600"
                          >
                            <ApperIcon name="X" size={16} />
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newOptions = [...(question.options || []), `Option ${(question.options?.length || 0) + 1}`];
                          updateQuestion(question.Id, { options: newOptions });
                        }}
                      >
                        <ApperIcon name="Plus" size={16} className="mr-1" />
                        Add Option
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <p className="font-medium text-clinical-900">{question.label}</p>
                  {question.required && (
                    <span className="text-xs text-red-600">Required</span>
                  )}
                </div>
              )}
            </motion.div>
          ))}

{(!localForm.questions || localForm.questions.length === 0) && (
            <div className="text-center py-8 text-clinical-500">
              <ApperIcon name="FileText" size={32} className="mx-auto mb-2 opacity-50" />
              <p>No questions added yet. Click on a question type above to get started.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormBuilder;