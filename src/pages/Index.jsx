import { useState } from 'react';
import { MultiStepForm } from '@/components/MultiStepForm';
import { DietResults } from '@/components/DietResults';

const Index = () => {
  const [showResults, setShowResults] = useState(false);
  const [formData, setFormData] = useState(null);

  const handleFormSubmit = (data) => {
    setFormData(data);
    setShowResults(true);
  };

  const handleBackToForm = () => {
    setShowResults(false);
  };

  if (showResults && formData) {
    return (
      <DietResults 
        userData={formData} 
        onBack={handleBackToForm}
      />
    );
  }

  return <MultiStepForm onSubmit={handleFormSubmit} />;
};

export default Index;