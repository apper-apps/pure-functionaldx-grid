import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import FormBuilder from "@/components/molecules/FormBuilder";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import { FormResponseService } from "@/services/api/FormResponseService";
import { IntakeFormService } from "@/services/api/IntakeFormService";
const PatientIntake = () => {
  const [forms, setForms] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null);
  const [activeTab, setActiveTab] = useState('builder');
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadForms();
  }, []);

  const loadForms = async () => {
    try {
      setLoading(true);
      setError('');
      await new Promise(resolve => setTimeout(resolve, 300));
const data = await IntakeFormService.getAll();
      // Transform database fields to match UI expectations
      const transformedData = data.map(form => ({
        ...form,
        title: form.title || form.Name,
        questions: form.questions ? JSON.parse(form.questions) : [],
        createdAt: form.created_at,
        lastModified: form.last_modified
      }));
      setForms(transformedData);
      if (transformedData.length > 0) {
        setSelectedForm(transformedData[0]);
        loadResponses(transformedData[0].Id);
      }
    } catch (err) {
      setError('Failed to load intake forms');
    } finally {
      setLoading(false);
    }
  };

const loadResponses = async (formId) => {
    try {
      const formResponses = await FormResponseService.getByFormId(formId);
      setResponses(formResponses);
    } catch (err) {
      console.error('Failed to load responses:', err);
      setResponses([]);
    }
  };

  const createNewForm = () => {
    const newForm = {
      Id: Date.now(),
      title: 'New Intake Form',
      description: 'Patient intake form',
      questions: [],
      status: 'draft',
      createdAt: new Date().toISOString()
    };
    setSelectedForm(newForm);
    setActiveTab('builder');
  };

const saveForm = async (formData) => {
    try {
      setLoading(true);
      
      if (forms.find(f => f.Id === formData.Id)) {
        const savedForm = await IntakeFormService.update(formData.Id, {
          ...formData,
          questions: formData.questions,
          last_modified: new Date().toISOString()
        });
        const transformedForm = {
          ...savedForm,
          title: savedForm.title || savedForm.Name,
          questions: savedForm.questions ? JSON.parse(savedForm.questions) : [],
          createdAt: savedForm.created_at,
          lastModified: savedForm.last_modified
        };
        setForms(prev => prev.map(f => f.Id === formData.Id ? transformedForm : f));
        setSelectedForm(transformedForm);
        toast.success('Form updated successfully');
      } else {
        const savedForm = await IntakeFormService.create({
          ...formData,
          questions: formData.questions
        });
        const transformedForm = {
          ...savedForm,
          title: savedForm.title || savedForm.Name,
          questions: savedForm.questions ? JSON.parse(savedForm.questions) : [],
          createdAt: savedForm.created_at,
          lastModified: savedForm.last_modified
        };
        setForms(prev => [...prev, transformedForm]);
        setSelectedForm(transformedForm);
        toast.success('Form created successfully');
      }
} catch (err) {
      toast.error('Failed to save form');
    } finally {
      setLoading(false);
    }
  };

  const publishForm = async (formId) => {
    if (!window.confirm('Are you sure you want to publish this form? Once published, it will be available for patient responses.')) return;

    try {
      setLoading(true);
      const updatedForm = await IntakeFormService.update(formId, {
        status: 'published'
      });
      
      const transformedForm = {
        ...updatedForm,
        title: updatedForm.title || updatedForm.Name,
        questions: updatedForm.questions ? JSON.parse(updatedForm.questions) : [],
        createdAt: updatedForm.created_at,
        lastModified: updatedForm.last_modified
      };
      
      setForms(prev => prev.map(f => f.Id === formId ? transformedForm : f));
      setSelectedForm(transformedForm);
      toast.success('Form published successfully');
    } catch (err) {
      toast.error('Failed to publish form');
    } finally {
      setLoading(false);
    }
  };

  const deleteForm = async (formId) => {
    if (!window.confirm('Are you sure you want to delete this form?')) return;

    try {
      await IntakeFormService.delete(formId);
      setForms(prev => prev.filter(f => f.Id !== formId));
      if (selectedForm?.Id === formId) {
        setSelectedForm(forms.length > 1 ? forms.find(f => f.Id !== formId) : null);
      }
      toast.success('Form deleted successfully');
    } catch (err) {
      toast.error('Failed to delete form');
    }
  };

const handleFormSelect = async (form) => {
    setSelectedForm(form);
    loadResponses(form.Id);
  };
  if (loading && forms.length === 0) {
    return <Loading type="skeleton" />;
  }

  if (error && forms.length === 0) {
    return <Error message={error} onRetry={loadForms} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-clinical-900">Patient Intake Forms</h2>
            <p className="text-clinical-600">Create and manage patient intake forms and responses</p>
          </div>
          <Button onClick={createNewForm}>
            <ApperIcon name="Plus" size={16} className="mr-2" />
            New Form
          </Button>
        </div>

        {forms.length === 0 ? (
          <Empty
            icon="FileText"
            title="No intake forms"
            message="Create your first intake form to start collecting patient information"
            actionLabel="Create Form"
            onAction={createNewForm}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {forms.map((form) => (
              <Card
                key={form.Id}
                hover
                className={`cursor-pointer transition-all ${
                  selectedForm?.Id === form.Id ? 'ring-2 ring-primary-500' : ''
                }`}
                onClick={() => handleFormSelect(form)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-medium text-clinical-900">{form.title}</h3>
                    <p className="text-sm text-clinical-600">{form.description}</p>
                  </div>
                  <Badge variant={form.status === 'published' ? 'success' : 'default'}>
                    {form.status}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between text-sm text-clinical-500">
                  <span>{form.questions?.length || 0} questions</span>
                  <span>{new Date(form.createdAt).toLocaleDateString()}</span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>

      {selectedForm && (
        <>
          {/* Form Tabs */}
          <Card padding="none">
            <div className="border-b border-clinical-200">
              <nav className="flex space-x-8 px-6">
                <button
                  onClick={() => setActiveTab('builder')}
                  className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'builder'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-clinical-500 hover:text-clinical-700'
                  }`}
                >
                  <ApperIcon name="Settings" size={16} className="mr-2 inline" />
                  Form Builder
                </button>
                <button
                  onClick={() => setActiveTab('responses')}
                  className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'responses'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-clinical-500 hover:text-clinical-700'
                  }`}
                >
                  <ApperIcon name="Users" size={16} className="mr-2 inline" />
                  Responses ({responses.length})
                </button>
                <button
                  onClick={() => setActiveTab('preview')}
                  className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'preview'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-clinical-500 hover:text-clinical-700'
                  }`}
                >
                  <ApperIcon name="Eye" size={16} className="mr-2 inline" />
                  Preview
                </button>
              </nav>
            </div>

            <div className="p-6">
              {activeTab === 'builder' && (
                <FormBuilder
                  form={selectedForm}
                  onUpdateForm={(updatedForm) => {
                    setSelectedForm(updatedForm);
                    saveForm(updatedForm);
                  }}
                />
              )}

              {activeTab === 'responses' && (
                <div className="space-y-4">
                  {responses.length === 0 ? (
                    <Empty
                      icon="FileX"
                      title="No responses yet"
                      message="Patient responses will appear here once the form is submitted"
                      showAction={false}
                    />
                  ) : (
                    <div className="space-y-4">
                      {responses.map((response) => (
                        <Card key={response.Id}>
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h4 className="font-medium text-clinical-900">
                                Response #{response.Id}
                              </h4>
                              <p className="text-sm text-clinical-600">
                                Submitted: {new Date(response.completedAt).toLocaleString()}
                              </p>
                            </div>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                <ApperIcon name="Eye" size={16} className="mr-1" />
                                View
                              </Button>
                              <Button variant="outline" size="sm">
                                <ApperIcon name="Download" size={16} className="mr-1" />
                                Export
                              </Button>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            {Object.entries(response.data || {}).slice(0, 4).map(([key, value]) => (
                              <div key={key}>
                                <p className="font-medium text-clinical-700">{key}:</p>
                                <p className="text-clinical-600 truncate">{String(value)}</p>
                              </div>
                            ))}
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'preview' && (
                <div className="max-w-2xl mx-auto">
                  <Card>
                    <div className="text-center mb-6">
                      <h2 className="text-2xl font-bold text-clinical-900">{selectedForm.title}</h2>
                      <p className="text-clinical-600 mt-2">{selectedForm.description}</p>
                    </div>

                    {selectedForm.questions?.length === 0 ? (
                      <div className="text-center py-8">
                        <ApperIcon name="FileText" size={32} className="mx-auto mb-3 text-clinical-300" />
                        <p className="text-clinical-600">No questions added yet</p>
                        <p className="text-sm text-clinical-500">Add questions in the Form Builder tab</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {selectedForm.questions?.map((question, index) => (
                          <div key={question.Id} className="space-y-2">
                            <label className="block text-sm font-medium text-clinical-700">
                              {index + 1}. {question.label}
                              {question.required && <span className="text-red-500 ml-1">*</span>}
                            </label>
                            
                            {question.type === 'text' && (
                              <input
                                type="text"
                                disabled
                                className="w-full px-3 py-2 border border-clinical-300 rounded-lg bg-clinical-50"
                                placeholder="Text input"
                              />
                            )}
                            
                            {question.type === 'textarea' && (
                              <textarea
                                disabled
                                rows={3}
                                className="w-full px-3 py-2 border border-clinical-300 rounded-lg bg-clinical-50"
                                placeholder="Long text input"
                              />
                            )}
                            
                            {question.type === 'select' && (
                              <select disabled className="w-full px-3 py-2 border border-clinical-300 rounded-lg bg-clinical-50">
                                <option>Select an option...</option>
                                {question.options?.map((option, optionIndex) => (
                                  <option key={optionIndex}>{option}</option>
                                ))}
                              </select>
                            )}
                            
                            {question.type === 'checkbox' && (
                              <div className="space-y-2">
                                {question.options?.map((option, optionIndex) => (
                                  <label key={optionIndex} className="flex items-center space-x-2">
                                    <input type="checkbox" disabled className="rounded" />
                                    <span className="text-sm text-clinical-700">{option}</span>
                                  </label>
                                ))}
                              </div>
                            )}
                            
                            {question.type === 'scale' && (
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm text-clinical-600">
                                  <span>{question.scale?.labels?.[0] || 'Low'}</span>
                                  <span>{question.scale?.labels?.[1] || 'High'}</span>
                                </div>
                                <input
                                  type="range"
                                  min={question.scale?.min || 1}
                                  max={question.scale?.max || 5}
                                  disabled
                                  className="w-full"
                                />
                              </div>
                            )}
                          </div>
                        ))}
                        
                        <Button disabled className="w-full mt-6">
                          Submit Form (Preview Mode)
                        </Button>
                      </div>
                    )}
                  </Card>
                </div>
              )}
            </div>
          </Card>

          {/* Form Actions */}
          <Card>
            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                <Badge variant={selectedForm.status === 'published' ? 'success' : 'default'}>
                  {selectedForm.status}
                </Badge>
                <span className="text-sm text-clinical-600">
                  Last updated: {new Date(selectedForm.lastModified || selectedForm.createdAt).toLocaleString()}
                </span>
              </div>
<div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => deleteForm(selectedForm.Id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <ApperIcon name="Trash2" size={16} className="mr-2" />
                  Delete
                </Button>
                <Button variant="outline">
                  <ApperIcon name="Copy" size={16} className="mr-2" />
                  Duplicate
                </Button>
                {selectedForm.status === 'published' ? (
                  <Button variant="outline" disabled>
                    <ApperIcon name="CheckCircle" size={16} className="mr-2" />
                    Published
                  </Button>
                ) : (
                  <Button
                    onClick={() => publishForm(selectedForm.Id)}
                    disabled={loading}
                  >
                    <ApperIcon name="Share" size={16} className="mr-2" />
                    {loading ? 'Publishing...' : 'Publish'}
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

export default PatientIntake;