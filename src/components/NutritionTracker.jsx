import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export const NutritionTracker = ({ selectedFoods, goals }) => {
  const totals = selectedFoods.reduce(
    (acc, food) => ({
      calories: acc.calories + food.calories,
      protein: acc.protein + food.protein,
      carbs: acc.carbs + food.carbs,
      fat: acc.fat + food.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const getStatus = (current, target) => {
    const percentage = (current / target) * 100;
    if (percentage >= 90 && percentage <= 110) return { status: 'good', color: 'text-success', bgColor: 'bg-success' };
    if (percentage >= 80 && percentage <= 120) return { status: 'warning', color: 'text-warning', bgColor: 'bg-warning' };
    return { status: 'danger', color: 'text-destructive', bgColor: 'bg-destructive' };
  };

  return (
    <Card className="glass border-0 shadow-diet-lg bg-indigo-200">
        <CardHeader>
          <CardTitle>Daily Targets</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { label: 'Calories', current: totals.calories, target: goals.calories, unit: 'kcal' },
            { label: 'Protein', current: totals.protein, target: goals.protein, unit: 'g' },
            { label: 'Carbs', current: totals.carbs, target: goals.carbs, unit: 'g' },
            { label: 'Fat', current: totals.fat, target: goals.fat, unit: 'g' }
          ].map((item) => {
            const status = getStatus(item.current, item.target);
            const percentage = Math.min((item.current / item.target) * 100, 100);
            
            return (
              <div key={item.label} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{Math.round(item.current)}/{item.target} {item.unit}</span>
                    <Badge 
                      variant="outline" 
                      className={`text-xs px-1 py-0 ${status.color}`}
                    >
                      {status.status === 'good' ? '✅' : status.status === 'warning' ? '⚠️' : '❌'}
                    </Badge>
                  </div>
                </div>
                <Progress value={percentage} className="h-2" />
              </div>
            );
          })}
        </CardContent>
      </Card>
  );
};