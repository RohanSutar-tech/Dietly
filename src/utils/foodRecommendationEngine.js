/**
 * Rule-Based Food Recommendation Engine
 * 
 * A pure deterministic recommendation system using IF-ELSE rules.
 * No machine learning or collaborative filtering.
 * 
 * Rule Priority Order:
 * 1. State-Based Filtering (Compulsory)
 * 2. Meal Category Filtering
 * 3. Disease-Based Safety Rules (Highest Priority)
 * 4. Goal-Based Rules
 * 5. Food Preference Rules
 * 6. Disliked Foods Rule (Strict)
 */

import { indianFoods } from '@/data/indianFoods';

/**
 * Parse comma-separated disliked foods into normalized array
 */
const parseDislikedFoods = (dislikedFoodsInput) => {
  if (!dislikedFoodsInput || typeof dislikedFoodsInput !== 'string') {
    return [];
  }
  return dislikedFoodsInput
    .toLowerCase()
    .split(',')
    .map(food => food.trim())
    .filter(food => food.length > 0);
};

/**
 * Rule 1: State-Based Filtering
 * If location = Maharashtra, recommend only Maharashtra foods
 * If location = Kerala, recommend only Kerala foods
 */
const filterByRegion = (foods, location) => {
  const normalizedLocation = location?.toLowerCase();
  
  // Supported regions for filtering
  const supportedRegions = ['maharashtra', 'kerala', 'punjab', 'karnataka'];
  
  if (supportedRegions.includes(normalizedLocation)) {
    return foods.filter(food => food.region === normalizedLocation);
  }
  
  // For unsupported locations, return all foods (for future extensibility)
  return foods;
};

/**
 * Rule 2: Meal Category Filtering
 * Each meal type gets only its designated foods
 */
const filterByMealCategory = (foods, mealType) => {
  return foods.filter(food => food.category === mealType);
};

/**
 * Rule 3: Disease-Based Safety Rules (Highest Priority)
 * Apply strict health condition filters
 */
const filterByHealthConditions = (foods, diseases) => {
  if (!diseases || diseases.length === 0 || diseases.includes('None')) {
    return foods;
  }

  return foods.filter(food => {
    // Diabetes: exclude high-sugar and refined-carb foods
    if (diseases.includes('Diabetes') && food.isHighSugar) {
      return false;
    }

    // High Blood Pressure: exclude high-sodium foods
    if (diseases.includes('High Blood Pressure') && food.isHighSodium) {
      return false;
    }

    // Heart Disease: exclude fried and high-fat foods
    if (diseases.includes('Heart Disease') && food.isHighFat) {
      return false;
    }

    // Kidney Disease: avoid very high-protein foods
    if (diseases.includes('Kidney Disease') && food.isHighProtein) {
      return false;
    }

    // Thyroid Issues: avoid highly processed foods
    if (diseases.includes('Thyroid Issues') && food.isProcessed) {
      return false;
    }

    // PCOS/PCOD: avoid highly processed foods
    if (diseases.includes('PCOS/PCOD') && food.isProcessed) {
      return false;
    }

    // Liver Disease: avoid high-fat and processed foods
    if (diseases.includes('Liver Disease') && (food.isHighFat || food.isProcessed)) {
      return false;
    }

    return true;
  });
};

/**
 * Rule 4: Goal-Based Rules
 * Prioritize/filter foods based on health goal
 */
const filterByGoal = (foods, goal) => {
  switch (goal) {
    case 'weight_loss':
      // Prefer low-calorie, high-fiber foods (exclude high-calorie items)
      return foods.filter(food => food.calories <= 400 || food.isHighFiber);
    
    case 'weight_gain':
      // Allow calorie-dense, protein-rich foods (no restriction, but prioritize)
      return foods; // All foods allowed, can sort by calories if needed
    
    case 'maintain':
    case 'stay_fit':
      // Balanced meals - all foods allowed
      return foods;
    
    default:
      return foods;
  }
};

/**
 * Rule 5: Food Preference Rules
 * Filter based on vegetarian/non-vegetarian preference
 */
const filterByFoodPreference = (foods, preference) => {
  switch (preference) {
    case 'vegetarian':
      // Exclude all non-veg foods
      return foods.filter(food => food.isVeg === true);
    
    case 'non_vegetarian':
      // Allow both veg and non-veg (no restriction)
      return foods;
    
    case 'both':
      // No restriction
      return foods;
    
    default:
      return foods;
  }
};

/**
 * Rule 6: Disliked Foods Rule (Strict)
 * Completely exclude any food matching user's disliked items
 */
const filterByDislikedFoods = (foods, dislikedFoodsList) => {
  if (dislikedFoodsList.length === 0) {
    return foods;
  }

  return foods.filter(food => {
    const foodNameLower = food.name.toLowerCase();
    
    // Check if any disliked food matches this food's name
    const isDisliked = dislikedFoodsList.some(disliked => {
      // Check if food name contains the disliked term
      return foodNameLower.includes(disliked) || disliked.includes(foodNameLower.split(' ')[0]);
    });
    
    return !isDisliked;
  });
};

/**
 * Sort foods by goal preference
 */
const sortByGoal = (foods, goal) => {
  const sortedFoods = [...foods];
  
  switch (goal) {
    case 'weight_loss':
      // Sort by calories (ascending) and prefer high-fiber
      return sortedFoods.sort((a, b) => {
        if (a.isHighFiber && !b.isHighFiber) return -1;
        if (!a.isHighFiber && b.isHighFiber) return 1;
        return a.calories - b.calories;
      });
    
    case 'weight_gain':
      // Sort by calories (descending) and protein
      return sortedFoods.sort((a, b) => {
        if (a.isHighProtein && !b.isHighProtein) return -1;
        if (!a.isHighProtein && b.isHighProtein) return 1;
        return b.calories - a.calories;
      });
    
    default:
      // Balanced - sort by protein/calorie ratio
      return sortedFoods.sort((a, b) => {
        const ratioA = a.protein / a.calories;
        const ratioB = b.protein / b.calories;
        return ratioB - ratioA;
      });
  }
};

/**
 * Main Recommendation Engine Function
 * 
 * @param {Object} userData - User data from the multi-step form
 * @param {string} userData.location - User's state (maharashtra/kerala)
 * @param {string} userData.foodPreference - vegetarian/non_vegetarian/both
 * @param {string} userData.goal - weight_loss/weight_gain/maintain/stay_fit
 * @param {Array} userData.diseases - Array of health conditions
 * @param {string} userData.dislikedFoods - Comma-separated disliked foods
 * 
 * @returns {Object} Recommended foods categorized by meal type
 */
export const getRecommendedFoods = (userData) => {
  const {
    location,
    foodPreference,
    goal,
    diseases = [],
    dislikedFoods = ''
  } = userData;

  // Parse disliked foods
  const dislikedFoodsList = parseDislikedFoods(dislikedFoods);

  // Apply rules in order to get base filtered foods
  let filteredFoods = [...indianFoods];

  // Rule 1: State-Based Filtering (Compulsory)
  filteredFoods = filterByRegion(filteredFoods, location);

  // Rule 3: Disease-Based Safety Rules (Highest Priority)
  filteredFoods = filterByHealthConditions(filteredFoods, diseases);

  // Rule 4: Goal-Based Rules
  filteredFoods = filterByGoal(filteredFoods, goal);

  // Rule 5: Food Preference Rules
  filteredFoods = filterByFoodPreference(filteredFoods, foodPreference);

  // Rule 6: Disliked Foods Rule (Strict)
  filteredFoods = filterByDislikedFoods(filteredFoods, dislikedFoodsList);

  // Categorize by meal type (Rule 2)
  const mealCategories = ['breakfast', 'lunch', 'snacks', 'dinner'];
  
  const recommendations = {};
  
  mealCategories.forEach(mealType => {
    // Filter by meal category
    let mealFoods = filterByMealCategory(filteredFoods, mealType);
    
    // Sort by goal preference
    mealFoods = sortByGoal(mealFoods, goal);
    
    recommendations[mealType] = mealFoods;
  });

  return recommendations;
};

/**
 * Get all available foods for a specific meal type
 * (Used for FoodSelector component)
 */
export const getAvailableFoodsForMeal = (userData, mealType) => {
  const recommendations = getRecommendedFoods(userData);
  return recommendations[mealType] || [];
};

/**
 * Get recommendation summary/explanation
 */
export const getRecommendationSummary = (userData) => {
  const {
    location,
    foodPreference,
    goal,
    diseases = [],
    dislikedFoods = ''
  } = userData;

  const rules = [];

  // Region rule
  const supportedRegions = ['maharashtra', 'kerala', 'punjab', 'karnataka'];
  if (supportedRegions.includes(location?.toLowerCase())) {
    rules.push(`Showing ${location.charAt(0).toUpperCase() + location.slice(1)} regional foods`);
  }

  // Disease rules
  if (diseases.length > 0 && !diseases.includes('None')) {
    const diseaseRules = [];
    if (diseases.includes('Diabetes')) diseaseRules.push('excluding high-sugar foods');
    if (diseases.includes('High Blood Pressure')) diseaseRules.push('excluding high-sodium foods');
    if (diseases.includes('Heart Disease')) diseaseRules.push('excluding high-fat foods');
    if (diseases.includes('Kidney Disease')) diseaseRules.push('limiting high-protein foods');
    if (diseases.includes('Thyroid Issues') || diseases.includes('PCOS/PCOD')) diseaseRules.push('excluding processed foods');
    if (diseaseRules.length > 0) {
      rules.push(`Health-aware filtering: ${diseaseRules.join(', ')}`);
    }
  }

  // Goal rule
  if (goal === 'weight_loss') {
    rules.push('Prioritizing low-calorie, high-fiber options');
  } else if (goal === 'weight_gain') {
    rules.push('Prioritizing calorie-dense, protein-rich options');
  }

  // Preference rule
  if (foodPreference === 'vegetarian') {
    rules.push('Showing vegetarian options only');
  }

  // Disliked foods
  const dislikedList = parseDislikedFoods(dislikedFoods);
  if (dislikedList.length > 0) {
    rules.push(`Excluding: ${dislikedList.join(', ')}`);
  }

  return rules;
};
