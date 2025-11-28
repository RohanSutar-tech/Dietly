import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2 } from 'lucide-react';

export const SelectedMealPlan = ({ selectedFoods, onRemoveFood }) => {

  const groupedFoods = selectedFoods.reduce((acc, food) => {
    if (!acc[food.category]) {
      acc[food.category] = [];
    }
    acc[food.category].push(food);
    return acc;
  }, {});

  const getMealTotals = (foods) => {
    return foods.reduce(
      (totals, food) => ({
        calories: totals.calories + food.calories,
        protein: totals.protein + food.protein,
        carbs: totals.carbs + food.carbs,
        fat: totals.fat + food.fat,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  };
  
  const totalCalories = selectedFoods.reduce((sum, food) => sum + food.calories, 0);

  return (
    <Card className="glass border-0 shadow-lg  top-4 mt-14 bg-yellow-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Your Meal Plan</CardTitle>
          {totalCalories > 0 && (
            <Badge variant="secondary">{totalCalories} cal</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[920px]">
          <div className="space-y-4">
            {Object.entries(groupedFoods).map(([mealType, foods]) => {
              const totals = getMealTotals(foods);
              
              return (
                <div key={mealType} className="p-4 bg-accent/20 rounded-lg border border-border">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold capitalize">{mealType}</h4>
                    <Badge variant="outline">{totals.calories} cal</Badge>
                  </div>
                  
                  <div className="space-y-2">
                    {foods.map((food) => (
                      <div 
                        key={food.id} 
                        className="flex items-center justify-between gap-3 p-3 bg-background/50 rounded-lg border border-border"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium mb-1 truncate">{food.name}</div>
                          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                            <span>Calories: {food.calories}</span>
                            <span>Protein: {food.protein}g</span>
                            <span>Carbs: {food.carbs}g</span>
                            <span>Fat: {food.fat}g</span>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onRemoveFood(food.id)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
            
            {selectedFoods.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No foods selected yet</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};