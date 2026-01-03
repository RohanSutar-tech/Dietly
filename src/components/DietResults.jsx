import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Target, Download, Scale, Save, Info } from 'lucide-react';
import { FoodSelector } from './FoodSelector';
import { SelectedMealPlan } from './SelectedMealPlan';
import { NutritionTracker } from './NutritionTracker';
import { NutritionGoalsComponent } from './NutritionGoals';
import { CalorieEstimator } from './CalorieEstimator';
import { LanguageSwitcher } from './LanguageSwitcher';
import { getRecommendedFoods, getRecommendationSummary } from '@/utils/foodRecommendationEngine';
import { toast } from 'sonner';
import indianDietBg from '@/assets/bg-7.jpg';

export const DietResults = ({ userData, onBack }) => {
  const { t } = useTranslation();
  
  // Calculate BMI and other metrics
  const height = parseFloat(userData.height) / 100;
  const weight = parseFloat(userData.weight);
  const bmi = weight / (height * height);
  
  const getBMIStatus = (bmi) => {
    if (bmi < 18.5) return { status: 'Underweight', color: 'text-warning' };
    if (bmi < 25) return { status: 'Normal', color: 'text-success' };
    if (bmi < 30) return { status: 'Overweight', color: 'text-warning' };
    return { status: 'Obese', color: 'text-destructive' };
  };

  const bmiStatus = getBMIStatus(bmi);
  
  // Calculate daily goals
  const baseCalories = userData.gender === 'male' ? 2200 : 1800;
  const goalMultiplier = {
    'weight_loss': 0.8,
    'weight_gain': 1.2,
    'maintain': 1.0,
    'stay_fit': 1.1
  }[userData.goal] || 1.0;
  
  const dailyCalories = Math.round(baseCalories * goalMultiplier);
  
  // State management
  const [selectedFoods, setSelectedFoods] = useState([]);
  const [nutritionGoals, setNutritionGoals] = useState({
    calories: dailyCalories,
    protein: Math.round(weight * 1.2), // 1.2g per kg body weight
    carbs: Math.round((dailyCalories * 0.45) / 4), // 45% of calories from carbs
    fat: Math.round((dailyCalories * 0.30) / 9), // 30% of calories from fat
  });

  // Get recommended foods using rule-based engine
  const recommendedFoods = useMemo(() => {
    return getRecommendedFoods(userData);
  }, [userData]);

  // Get recommendation summary for display
  const recommendationRules = useMemo(() => {
    return getRecommendationSummary(userData);
  }, [userData]);

  // Flatten all recommended foods for nutrition tracking
  const allRecommendedFoods = useMemo(() => {
    return [
      ...recommendedFoods.breakfast,
      ...recommendedFoods.lunch,
      ...recommendedFoods.snacks,
      ...recommendedFoods.dinner
    ];
  }, [recommendedFoods]);

  const handleAddFood = (food) => {
    setSelectedFoods(prev => [...prev, food]);
    toast.success(`Added ${food.name}`);
  };

  const handleRemoveFood = (foodId) => {
    setSelectedFoods(prev => prev.filter(food => food.id !== foodId));
    toast.info("Food item removed from your meal plan");
  };

  const handleSavePlan = () => {
    if (selectedFoods.length === 0) {
      toast.error("Please select some foods before saving your plan");
      return;
    }
    
    toast.success("Your personalized meal plan has been saved");
  };

  const selectedFoodIds = selectedFoods.map(food => food.id);

  return (
    <div 
      className="min-h-screen py-8 px-4 bg-cover bg-center bg-fixed relative"
      style={{ backgroundImage: `url(${indianDietBg})` }}
    >
      <div className="absolute  bg-background/10"></div>
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-end mb-4">
            <LanguageSwitcher />
          </div>
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-card/80 backdrop-blur-sm rounded-full border border-border">
            <Target className="w-5 h-5 text-success" />
            <span className="text-sm font-medium text-success">{t('results.interactivePlanner')}</span>
          </div>
          <h1 className="text-gray-800 text-4xl md:text-5xl font-bold gradient-text mb-4">
            {t('results.title')}  
          </h1>
          <p className="text-lg text-gray-600">
            {t('results.subtitle')}
          </p>
        </div>

        {/* First Row - Stats & Goals + Daily Calorie Estimates */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left Column - Stats & Goals Stacked */}
          <div className="space-y-6">
            {/* Stats Card - Compact */}
            <Card className="bg-blue-50 glass border-0 shadow-diet-lg">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Scale className="w-4 h-4 text-primary" />
                  Your Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="text-center">
                  <div className="text-xl font-bold gradient-text">{bmi.toFixed(1)}</div>
                  <div className="text-xs text-muted-foreground">BMI Score</div>
                  <Badge variant="outline" className={`mt-1 text-xs ${bmiStatus.color}`}>
                    {bmiStatus.status}
                  </Badge>
                  
                  {/* BMI Ranges */}
                  <div className="mt-3 pt-3 border-t border-border">
                    <div className="text-xs font-semibold text-muted-foreground mb-2">Healthy Ranges:</div>
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <div className="flex justify-between">
                        <span>Underweight:</span>
                        <span className="font-medium">&lt; 18.5</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-success">Normal:</span>
                        <span className="font-medium text-success">18.5 - 24.9</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Overweight:</span>
                        <span className="font-medium">25 - 29.9</span>
                      </div>
                      {/* <div className="flex justify-between">
                        <span>Obese:</span>
                        <span className="font-medium">≥ 30</span>
                      </div> */}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Nutrition Goals */}
            <div>
              <NutritionGoalsComponent 
                goals={nutritionGoals} 
                onGoalsChange={setNutritionGoals} 
              />
            </div>
          </div>

          {/* Daily Calorie Estimates */}
          <div className="lg:col-span-2">
            <CalorieEstimator userData={userData} />
          </div>
        </div>

        {/* Second Row - Nutrition Tracker Full Width */}
        <div className="mb-8 ">
          <NutritionTracker 
            selectedFoods={selectedFoods} 
            goals={nutritionGoals} 
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Food Selection */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex flex-col gap-4">
              <h2 className="text-2xl font-bold">Choose Your Foods</h2>
              
              {/* Recommendation Rules Summary */}
              {recommendationRules.length > 0 && (
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="py-3 px-4">
                    <div className="flex items-start gap-2">
                      <Info className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-primary">Smart Filtering Applied:</p>
                        <ul className="text-xs text-muted-foreground space-y-0.5">
                          {recommendationRules.map((rule, index) => (
                            <li key={index}>• {rule}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FoodSelector
                mealType="breakfast"
                foods={recommendedFoods.breakfast}
                onAddFood={handleAddFood}
                selectedFoodIds={selectedFoodIds}
              />
              <FoodSelector
                mealType="lunch"
                foods={recommendedFoods.lunch}
                onAddFood={handleAddFood}
                selectedFoodIds={selectedFoodIds}
              />
              <FoodSelector
                mealType="snacks"
                foods={recommendedFoods.snacks}
                onAddFood={handleAddFood}
                selectedFoodIds={selectedFoodIds}
              />
              <FoodSelector
                mealType="dinner"
                foods={recommendedFoods.dinner}
                onAddFood={handleAddFood}
                selectedFoodIds={selectedFoodIds}
              />
            </div>
          </div>

          {/* Selected Plan */}
          <div>
            <SelectedMealPlan
              selectedFoods={selectedFoods}
              onRemoveFood={handleRemoveFood}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button
            onClick={onBack}
            variant="outline"
            size="lg"
            className="px-8"
          >
            {t('results.backToForm')}
          </Button>
          <Button
            onClick={handleSavePlan}
            size="lg"
            className="bg-gradient-primary hover:opacity-90 text-white px-8 shadow-glow"
          >
            <Save className="w-4 h-4 mr-2" />
            {t('results.savePlan')}
          </Button>
          <Button
            size="lg"
            variant="secondary"
            className="px-8"
          >
            <Download className="w-4 h-4 mr-2" />
            {t('results.downloadPdf')}
          </Button>
        </div>
      </div>
    </div>
  );
};