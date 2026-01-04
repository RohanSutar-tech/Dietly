import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Settings } from 'lucide-react';

export const NutritionGoalsComponent = ({ goals, onGoalsChange }) => {
  const [isEnabled, setIsEnabled] = useState(false);

  const updateGoal = (key, value) => {
    if (!isEnabled) return;
    onGoalsChange({
      ...goals,
      [key]: value
    });
  };

  return (
    <Card className="glass border-0 shadow-diet-lg bg-amber-100">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" />
            Adjust Your Goals
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="goals-toggle" className="text-sm font-normal text-muted-foreground">
              {isEnabled ? 'Enabled' : 'Disabled'}
            </Label>
            <Switch
              id="goals-toggle"
              checked={isEnabled}
              onCheckedChange={setIsEnabled}
            />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className={`space-y-6 transition-opacity ${!isEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Daily Calories: {goals.calories} kcal
          </Label>
          <Slider
            value={[goals.calories]}
            onValueChange={(value) => updateGoal('calories', value[0])}
            max={4000}
            min={1000}
            step={50}
            className="w-full"
            disabled={!isEnabled}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Protein: {goals.protein}g
          </Label>
          <Slider
            value={[goals.protein]}
            onValueChange={(value) => updateGoal('protein', value[0])}
            max={300}
            min={50}
            step={5}
            className="w-full"
            disabled={!isEnabled}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Carbohydrates: {goals.carbs}g
          </Label>
          <Slider
            value={[goals.carbs]}
            onValueChange={(value) => updateGoal('carbs', value[0])}
            max={500}
            min={50}
            step={10}
            className="w-full"
            disabled={!isEnabled}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Fat: {goals.fat}g
          </Label>
          <Slider
            value={[goals.fat]}
            onValueChange={(value) => updateGoal('fat', value[0])}
            max={150}
            min={20}
            step={5}
            className="w-full"
            disabled={!isEnabled}
          />
        </div>
      </CardContent>
    </Card>
  );
};