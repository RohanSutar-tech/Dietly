import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus } from 'lucide-react';

export const FoodSelector = ({ mealType, foods, onAddFood, selectedFoodIds }) => {
  const mealFoods = foods.filter(food => food.category === mealType);

  return (
    <Card className="glass border-0 shadow-lg bg-lime-100">
      <CardHeader>
        <CardTitle className="capitalize">{mealType} Options</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-3">
            {mealFoods.map((food) => {
              const isSelected = selectedFoodIds.includes(food.id);
              return (
                <div
                  key={food.id}
                  className={`p-4 rounded-lg border transition-colors ${
                    isSelected 
                      ? 'bg-primary/10 border-primary' 
                      : 'bg-background/50 border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <h4 className="font-semibold mb-2">{food.name}</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                        <span>Calories: {food.calories}</span>
                        <span>Protein: {food.protein}g</span>
                        <span>Carbs: {food.carbs}g</span>
                        <span>Fat: {food.fat}g</span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant={isSelected ? "secondary" : "default"}
                      onClick={() => onAddFood(food)}
                      disabled={isSelected}
                      className="shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};