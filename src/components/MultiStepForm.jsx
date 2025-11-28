import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { Utensils, User, Target, MapPin, Heart, ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { LanguageSwitcher } from './LanguageSwitcher';
import indianDietBg from '@/assets/bg-7.jpg';

const STEPS = [
  { id: 1, title: 'Personal Info', icon: User },
  { id: 2, title: 'Goals & Activity', icon: Target },
  { id: 3, title: 'Location & Diet', icon: MapPin },
  { id: 4, title: 'Health', icon: Heart }
];

export const MultiStepForm = ({ onSubmit }) => {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    age: '',
    height: '',
    weight: '',
    gender: '',
    activityLevel: '',
    goal: '',
    diseases: [],
    location: '',
    foodPreference: '',
    bloodGroup: '',
    geneticDisorders: '',
    dislikedFoods: ''
  });

  const progress = (currentStep / STEPS.length) * 100;

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    } else {
      onSubmit(formData);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleDiseaseChange = (disease, checked) => {
    setFormData(prev => ({
      ...prev,
      diseases: checked 
        ? [...prev.diseases, disease]
        : prev.diseases.filter(d => d !== disease)
    }));
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.age && formData.height && formData.weight && formData.gender && formData.bloodGroup;
      case 2:
        return formData.activityLevel && formData.goal;
      case 3:
        return formData.location && formData.foodPreference;
      case 4:
        return true; // Health conditions are optional
      default:
        return false;
    }
  };

  return (
    <div 
      className="min-h-screen py-8 px-4 bg-cover bg-center bg-fixed relative"
      style={{ backgroundImage: `url(${indianDietBg})` }}
    >
      <div className="absolute  bg-background "></div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12 slide-up ">
          <div className="flex justify-end mb-6">
            <LanguageSwitcher />
          </div>
          
          <div className="inline-flex items-center gap-3 mb-6 px-6 py-3 bg-card/90 backdrop-blur-sm rounded-full border border-border shadow-soft">
            <Utensils className="w-6 h-6 text-primary" />
            <span className="text-base font-semibold text-foreground ">{t('app.title')}</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 tracking-tight">
            {t('app.subtitle')}
          </h1>
          
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto leading-relaxed">
            {t('app.description')}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8 fade-in ">
          <div className="flex justify-between items-center mb-4">
            {STEPS.map((step, index) => {
              const StepIcon = step.icon;
              const isCompleted = currentStep > step.id;
              const isCurrent = currentStep === step.id;
              
              return (
                <div key={step.id} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center gap-2">
                    <div 
                      className={`
                        w-12 h-12 rounded-full flex items-center justify-center transition-smooth
                        ${isCompleted ? 'bg-primary text-white shadow-glow' : 
                          isCurrent ? 'bg-primary text-white shadow-glow scale-110' : 
                          'bg-muted text-muted-foreground'}
                      `}
                    >
                      {isCompleted ? <Check className="w-6 h-6" /> : <StepIcon className="w-6 h-6" />}
                    </div>
                    <span className={`text-xs font-medium hidden md:block ${isCurrent ? 'text-primary' : 'text-muted-foreground'}`}>
                      {step.title}
                    </span>
                  </div>
                  {index < STEPS.length - 1 && (
                    <div className={`h-1 flex-1 mx-2 rounded-full transition-smooth ${
                      currentStep > step.id ? 'bg-primary' : 'bg-muted'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
          <Progress value={progress} className="h-2 shadow-sm" />
        </div>

        {/* Form Steps */}
        <Card className="bg-blue-200 outline-double shadow-xl hover-scale">
          <CardContent className="pt-8 pb-6">
            <div className="slide-up">
              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold mb-2">{t('form.personalInfo')}</h2>
                    <p className="text-muted-foreground">{t('form.personalInfoDesc')}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="age" className="text-base">{t('form.age')}</Label>
                      <Input
                        id="age"
                        type="number"
                        min="1"
                        value={formData.age}
                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                        placeholder="25"
                        className="h-12 text-base transition-smooth focus:shadow-md bg-cyan-50"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="gender" className="text-base">{t('form.gender')}</Label>
                      <Select  value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                        <SelectTrigger className="h-12 text-base transition-smooth focus:shadow-md bg-cyan-50">
                          <SelectValue placeholder={t('form.selectGender')} />
                        </SelectTrigger>
                        <SelectContent className="bg-cyan-50">
                          <SelectItem value="male">{t('form.male')}</SelectItem>
                          <SelectItem value="female">{t('form.female')}</SelectItem>
                          <SelectItem value="other">{t('form.other')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="height" className="text-base">{t('form.height')}</Label>
                      <Input
                        id="height"
                        type="number"
                        min="1"
                        value={formData.height}
                        onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                        placeholder="170"
                        className="h-12 text-base transition-smooth focus:shadow-md bg-cyan-50"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="weight" className="text-base">{t('form.weight')}</Label>
                      <Input
                        id="weight"
                        type="number"
                        min="1"
                        value={formData.weight}
                        onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                        placeholder="65"
                        className="h-12 text-base transition-smooth focus:shadow-md bg-cyan-50"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="bloodGroup" className="text-base">{t('form.bloodGroup')}</Label>
                      <Select value={formData.bloodGroup} onValueChange={(value) => setFormData({ ...formData, bloodGroup: value })}>
                        <SelectTrigger className="h-12 text-base transition-smooth focus:shadow-md bg-cyan-50">
                          <SelectValue placeholder={t('form.selectBloodGroup')} />
                        </SelectTrigger>
                        <SelectContent className="bg-cyan-50">
                          <SelectItem value="A+">A+</SelectItem>
                          <SelectItem value="A-">A-</SelectItem>
                          <SelectItem value="B+">B+</SelectItem>
                          <SelectItem value="B-">B-</SelectItem>
                          <SelectItem value="AB+">AB+</SelectItem>
                          <SelectItem value="AB-">AB-</SelectItem>
                          <SelectItem value="O+">O+</SelectItem>
                          <SelectItem value="O-">O-</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Activity & Goals */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold mb-2">{t('form.activityGoals')}</h2>
                    <p className="text-muted-foreground">{t('form.activityGoalsDesc')}</p>
                  </div>
                  
                  <div className="space-y-8">
                    <div>
                      <Label className="text-lg font-semibold mb-4 block">{t('form.activityLevel')}</Label>
                      <RadioGroup
                        value={formData.activityLevel}
                        onValueChange={(value) => setFormData({ ...formData, activityLevel: value })}
                        className="space-y-3 "
                      >
                        {[
                          { value: 'sedentary', label: t('form.sedentary') },
                          { value: 'moderate', label: t('form.moderate') },
                          { value: 'active', label: t('form.active') }
                        ].map((option) => (
                          <div key={option.value} className="bg-cyan-50 flex items-center space-x-3 p-4 rounded-lg border border-border cursor-pointer">
                            <RadioGroupItem value={option.value} id={option.value} />
                            <Label htmlFor={option.value} className="text-base cursor-pointer flex-1">{option.label}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>

                    <div>
                      <Label htmlFor="goal" className="text-lg font-semibold mb-4 block">{t('form.healthGoal')}</Label>
                      <Select value={formData.goal} onValueChange={(value) => setFormData({ ...formData, goal: value })}>
                        <SelectTrigger className="bg-cyan-50 h-14 text-base transition-smooth focus:shadow-md">
                          <SelectValue placeholder={t('form.selectGoal')} />
                        </SelectTrigger>
                        <SelectContent className="bg-cyan-50"> 
                          <SelectItem value="weight_loss" className="text-base py-3">{t('form.weightLoss')}</SelectItem>
                          <SelectItem value="weight_gain" className="text-base py-3">{t('form.weightGain')}</SelectItem>
                          <SelectItem value="maintain" className="text-base py-3">{t('form.maintainWeight')}</SelectItem>
                          <SelectItem value="stay_fit" className="text-base py-3">{t('form.stayFit')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Location & Preferences */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold mb-2">{t('form.locationPreferences')}</h2>
                    <p className="text-muted-foreground">{t('form.locationPreferencesDesc')}</p>
                  </div>
                  
                  <div className="space-y-8">
                    <div>
                      <Label htmlFor="location" className="text-lg font-semibold mb-4 block">{t('form.location')}</Label>
                      <Select value={formData.location} onValueChange={(value) => setFormData({ ...formData, location: value })}>
                        <SelectTrigger className="bg-cyan-50 h-14 text-base transition-smooth focus:shadow-md">
                          <SelectValue placeholder={t('form.selectState')} />
                        </SelectTrigger>
                        <SelectContent className="bg-cyan-50">
                          <SelectItem value="maharashtra" className="text-base py-3">{t('form.states.maharashtra')}</SelectItem>
                          <SelectItem value="karnataka" className="text-base py-3">{t('form.states.karnataka')}</SelectItem>
                          <SelectItem value="tamil_nadu" className="text-base py-3">{t('form.states.tamilNadu')}</SelectItem>
                          <SelectItem value="kerala" className="text-base py-3">{t('form.states.kerala')}</SelectItem>
                          <SelectItem value="gujarat" className="text-base py-3">{t('form.states.gujarat')}</SelectItem>
                          <SelectItem value="rajasthan" className="text-base py-3">{t('form.states.rajasthan')}</SelectItem>
                          <SelectItem value="punjab" className="text-base py-3">{t('form.states.punjab')}</SelectItem>
                          <SelectItem value="west_bengal" className="text-base py-3">{t('form.states.westBengal')}</SelectItem>
                          <SelectItem value="uttar_pradesh" className="text-base py-3">{t('form.states.uttarPradesh')}</SelectItem>
                          <SelectItem value="bihar" className="text-base py-3">{t('form.states.bihar')}</SelectItem>
                          <SelectItem value="other" className="text-base py-3">{t('form.states.other')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-lg font-semibold mb-4 block">{t('form.foodPreference')}</Label>
                      <RadioGroup
                        value={formData.foodPreference}
                        onValueChange={(value) => setFormData({ ...formData, foodPreference: value })}
                        className="space-y-3"
                      >
                        {[
                          { value: 'vegetarian', label: t('form.vegetarian') },
                          { value: 'non_vegetarian', label: t('form.nonVegetarian') },
                          { value: 'both', label: t('form.both') }
                        ].map((option) => (
                          <div key={option.value} className="bg-cyan-50 flex items-center space-x-3 p-4 rounded-lg border border-border  cursor-pointer">
                            <RadioGroupItem value={option.value} id={option.value} />
                            <Label htmlFor={option.value} className="text-base cursor-pointer flex-1">{option.label}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>

                    <div>
                      <Label htmlFor="dislikedFoods" className="text-lg font-semibold mb-4 block">{t('form.dislikedFoods')}</Label>
                      <Textarea
                        id="dislikedFoods"
                        value={formData.dislikedFoods}
                        onChange={(e) => setFormData({ ...formData, dislikedFoods: e.target.value })}
                        placeholder={t('form.dislikedFoodsPlaceholder')}
                        className="bg-cyan-50 min-h-[100px] text-base transition-smooth focus:shadow-md resize-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Health Conditions */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold mb-2">{t('form.healthConditions')}</h2>
                    <p className="text-muted-foreground">{t('form.healthConditionsDesc')}</p>
                  </div>
                  
                  <div className="space-y-8">
                    <div>
                      <Label className="text-lg font-semibold mb-4 block">{t('form.existingConditions')}</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          { key: 'None', label: t('form.diseases.none') },
                          { key: 'Diabetes', label: t('form.diseases.diabetes') },
                          { key: 'High Blood Pressure', label: t('form.diseases.highBP') },
                          { key: 'Heart Disease', label: t('form.diseases.heartDisease') },
                          { key: 'Thyroid Issues', label: t('form.diseases.thyroid') },
                          { key: 'PCOS/PCOD', label: t('form.diseases.pcos') },
                          { key: 'Kidney Disease', label: t('form.diseases.kidneyDisease') },
                          { key: 'Liver Disease', label: t('form.diseases.liverDisease') }
                        ].map((disease) => (
                          <div key={disease.key} className="bg-cyan-50 flex items-center space-x-3 p-4 rounded-lg border border-border  ">
                            <Checkbox
                              id={disease.key}
                              checked={formData.diseases.includes(disease.key)}
                              onCheckedChange={(checked) => handleDiseaseChange(disease.key, !!checked)}
                            />
                            <Label htmlFor={disease.key} className="text-base cursor-pointer flex-1">{disease.label}</Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="geneticDisorders" className="text-lg font-semibold mb-4 block">{t('form.geneticDisorders')}</Label>
                      <Input
                        id="geneticDisorders"
                        value={formData.geneticDisorders}
                        onChange={(e) => setFormData({ ...formData, geneticDisorders: e.target.value })}
                        placeholder={t('form.geneticDisordersPlaceholder')}
                        className="bg-cyan-50 h-12 text-base transition-smooth focus:shadow-md"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-10 pt-6 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1}
                className="bg-cyan-50 h-12 px-8 text-base transition-smooth hover:scale-105 disabled:opacity-50"
              >
                <ChevronLeft className="w-5 h-5 mr-2" />
                Back
              </Button>
              
              <div className="text-sm text-muted-foreground">
                Step {currentStep} of {STEPS.length}
              </div>
              
              <Button
                type="button"
                onClick={handleNext}
                disabled={!isStepValid()}
                className="h-12 px-8 text-base bg-gradient-primary hover:opacity-90 text-white shadow-glow transition-smooth hover:scale-105 disabled:opacity-50"
              >
                {currentStep === STEPS.length ? (
                  <>
                    Generate Plan
                    <Check className="w-5 h-5 ml-2" />
                  </>
                ) : (
                  <>
                    Next
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
