import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calculator, TrendingUp, TrendingDown, Target as TargetIcon, Activity } from 'lucide-react';

export const CalorieEstimator = ({ userData }) => {
  const age = parseInt(userData.age);
  const height = parseFloat(userData.height);
  const weight = parseFloat(userData.weight);
  const isMale = userData.gender === 'male';

  // Calculate BMR using Mifflin-St Jeor Equation (more accurate)
  const bmr = isMale 
    ? (10 * weight) + (6.25 * height) - (5 * age) + 5
    : (10 * weight) + (6.25 * height) - (5 * age) - 161;

  // Activity multipliers
  const activityMultipliers = {
    sedentary: 1.2,      // Little/no exercise
    moderate: 1.55,      // Moderate exercise
    active: 1.725        // Very active
  };

  const activityMultiplier = activityMultipliers[userData.activityLevel] || 1.2;
  const maintenanceCalories = Math.round(bmr * activityMultiplier);

  // Goal-based calorie adjustments
  const getCalorieEstimates = () => {
    switch (userData.goal) {
      case 'weight_loss':
        return {
          target: Math.round(maintenanceCalories - 500), // 1 lb per week loss
          aggressive: Math.round(maintenanceCalories - 750), // 1.5 lbs per week
          conservative: Math.round(maintenanceCalories - 250), // 0.5 lbs per week
          description: 'Calorie deficit for gradual, sustainable weight loss'
        };
      case 'weight_gain':
        return {
          target: Math.round(maintenanceCalories + 500), // 1 lb per week gain
          aggressive: Math.round(maintenanceCalories + 750), // 1.5 lbs per week
          conservative: Math.round(maintenanceCalories + 250), // 0.5 lbs per week
          description: 'Calorie surplus for healthy weight gain'
        };
      case 'maintain':
        return {
          target: maintenanceCalories,
          aggressive: maintenanceCalories,
          conservative: maintenanceCalories,
          description: 'Maintain current weight with balanced nutrition'
        };
      case 'stay_fit':
        return {
          target: Math.round(maintenanceCalories + 100), // Slight surplus for muscle
          aggressive: Math.round(maintenanceCalories + 200),
          conservative: maintenanceCalories,
          description: 'Optimize body composition and fitness performance'
        };
      default:
        return {
          target: maintenanceCalories,
          aggressive: maintenanceCalories,
          conservative: maintenanceCalories,
          description: 'Maintain current weight'
        };
    }
  };

  const estimates = getCalorieEstimates();
  
  const getGoalIcon = () => {
    switch (userData.goal) {
      case 'weight_loss': return <TrendingDown className="w-5 h-5 text-destructive" />;
      case 'weight_gain': return <TrendingUp className="w-5 h-5" style={{ color: 'hsl(var(--success))' }} />;
      case 'maintain': return <TargetIcon className="w-5 h-5 text-primary" />;
      case 'stay_fit': return <Activity className="w-5 h-5" style={{ color: 'hsl(var(--warning))' }} />;
      default: return <TargetIcon className="w-5 h-5 text-primary" />;
    }
  };

  const getGoalColor = () => {
    switch (userData.goal) {
      case 'weight_loss': return 'destructive';
      case 'weight_gain': return 'secondary';
      case 'maintain': return 'default';
      case 'stay_fit': return 'outline';
      default: return 'default';
    }
  };

  const getActivityLabel = () => {
    switch (userData.activityLevel) {
      case 'sedentary': return 'Sedentary';
      case 'moderate': return 'Moderately Active';
      case 'active': return 'Very Active';
      default: return 'Unknown';
    }
  };

  return (
    <Card className="glass border-0 shadow-diet-lg bg-red-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-primary" />
          Daily Calorie Estimates
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* BMR and Maintenance */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold text-muted-foreground">{Math.round(bmr)}</div>
            <div className="text-xs text-muted-foreground">BMR (Base Metabolic Rate)</div>
          </div>
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold text-primary">{maintenanceCalories}</div>
            <div className="text-xs text-muted-foreground">Maintenance Calories</div>
            <Badge variant="outline" className="mt-1 text-xs">
              {getActivityLabel()}
            </Badge>
          </div>
        </div>

        {/* Goal-Based Recommendations */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-3">
            {getGoalIcon()}
            <h3 className="font-semibold">
              {userData.goal.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} Goal
            </h3>
          </div>
          
          <div className="text-sm text-muted-foreground mb-4">
            {estimates.description}
          </div>

          {/* Primary Recommendation */}
          <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Recommended Daily Calories</span>
              <Badge variant={getGoalColor()}>
                {estimates.target} kcal
              </Badge>
            </div>
            <Progress 
              value={(estimates.target / (maintenanceCalories * 1.5)) * 100} 
              className="h-2"
            />
          </div>

          {/* Alternative Options */}
          {userData.goal !== 'maintain' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 bg-muted/30 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Conservative</span>
                  <span className="font-medium">{estimates.conservative} kcal</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Slower progress, easier to maintain
                </div>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Aggressive</span>
                  <span className="font-medium">{estimates.aggressive} kcal</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Faster results, requires discipline
                </div>
              </div>
            </div>
          )}

          {/* Weekly Progress Estimate */}
          {userData.goal !== 'maintain' && (
            <div className="p-3 bg-gradient-subtle rounded-lg">
              <div className="text-sm font-medium mb-1">Expected Weekly Progress</div>
              <div className="text-xs text-muted-foreground">
                {userData.goal === 'weight_loss' ? 'Weight Loss: ' : 'Weight Gain: '}
                <span className="font-medium">
                  {userData.goal === 'weight_loss' ? '0.5-1.0 kg' : '0.25-0.5 kg'} per week
                </span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};