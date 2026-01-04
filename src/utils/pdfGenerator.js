import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateDietPDF = (userData, selectedFoods, nutritionGoals, bmi, bmiStatus, recommendationRules) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPosition = 20;
  
  // Colors
  const primaryColor = [34, 197, 94]; // Green
  const headerBg = [240, 253, 244]; // Light green background
  const textColor = [55, 65, 81]; // Gray
  
  // Helper function to add new page if needed
  const checkPageBreak = (requiredSpace = 30) => {
    if (yPosition + requiredSpace > pageHeight - 20) {
      doc.addPage();
      yPosition = 20;
      return true;
    }
    return false;
  };

  // Helper function to draw section header
  const drawSectionHeader = (title) => {
    checkPageBreak(25);
    doc.setFillColor(...headerBg);
    doc.rect(14, yPosition - 5, pageWidth - 28, 12, 'F');
    doc.setTextColor(...primaryColor);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(title, 16, yPosition + 3);
    yPosition += 15;
    doc.setTextColor(...textColor);
    doc.setFont('helvetica', 'normal');
  };

  // ========== PAGE 1: Header & User Profile ==========
  
  // Title with gradient-like effect
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 45, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('Smart Indian Diet Report', pageWidth / 2, 22, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Your Personalized Diet Journey', pageWidth / 2, 32, { align: 'center' });
  
  // Date
  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleDateString('en-IN', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  })}`, pageWidth / 2, 40, { align: 'center' });
  
  yPosition = 60;
  doc.setTextColor(...textColor);

  // User Profile Section
  drawSectionHeader('👤 Personal Profile');
  
  const profileData = [
    ['Age', `${userData.age} years`],
    ['Gender', userData.gender?.charAt(0).toUpperCase() + userData.gender?.slice(1) || 'Not specified'],
    ['Height', `${userData.height} cm`],
    ['Weight', `${userData.weight} kg`],
    ['Blood Group', userData.bloodGroup || 'Not specified'],
    ['Location', userData.location?.charAt(0).toUpperCase() + userData.location?.slice(1) || 'Not specified'],
    ['Activity Level', getActivityLabel(userData.activityLevel)],
    ['Food Preference', getFoodPrefLabel(userData.foodPreference)],
  ];

  autoTable(doc, {
    startY: yPosition,
    head: [],
    body: profileData,
    theme: 'plain',
    styles: { fontSize: 10, cellPadding: 3 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 50, textColor: primaryColor },
      1: { cellWidth: 80 }
    },
    margin: { left: 16 }
  });

  yPosition = doc.lastAutoTable.finalY + 15;

  // Health Conditions
  if (userData.diseases?.length > 0 || userData.geneticDisorders) {
    drawSectionHeader('🏥 Health Conditions');
    
    doc.setFontSize(10);
    if (userData.diseases?.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.text('Existing Conditions:', 16, yPosition);
      doc.setFont('helvetica', 'normal');
      doc.text(userData.diseases.join(', '), 60, yPosition);
      yPosition += 8;
    }
    
    if (userData.geneticDisorders) {
      doc.setFont('helvetica', 'bold');
      doc.text('Genetic Disorders:', 16, yPosition);
      doc.setFont('helvetica', 'normal');
      doc.text(userData.geneticDisorders, 60, yPosition);
      yPosition += 8;
    }
    
    if (userData.dislikedFoods) {
      doc.setFont('helvetica', 'bold');
      doc.text('Disliked Foods:', 16, yPosition);
      doc.setFont('helvetica', 'normal');
      doc.text(userData.dislikedFoods, 60, yPosition);
      yPosition += 8;
    }
    
    yPosition += 10;
  }

  // BMI & Health Metrics
  drawSectionHeader('📊 Health Metrics');
  
  const bmiData = [
    ['BMI Score', bmi.toFixed(1)],
    ['BMI Status', bmiStatus.status],
    ['Health Goal', getGoalLabel(userData.goal)],
  ];

  autoTable(doc, {
    startY: yPosition,
    head: [],
    body: bmiData,
    theme: 'plain',
    styles: { fontSize: 10, cellPadding: 3 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 50, textColor: primaryColor },
      1: { cellWidth: 80 }
    },
    margin: { left: 16 }
  });

  yPosition = doc.lastAutoTable.finalY + 8;

  // BMI Scale visual
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text('BMI Reference: Underweight (<18.5) | Normal (18.5-24.9) | Overweight (25-29.9) | Obese (≥30)', 16, yPosition);
  yPosition += 15;

  // ========== PAGE 2: Nutrition Goals & Recommendations ==========
  doc.addPage();
  yPosition = 20;

  // Nutrition Goals
  drawSectionHeader('🎯 Daily Nutrition Goals');
  
  const nutritionData = [
    ['Nutrient', 'Daily Target', 'Description'],
    ['Calories', `${nutritionGoals.calories} kcal`, 'Total daily energy intake'],
    ['Protein', `${nutritionGoals.protein} g`, 'For muscle maintenance & repair'],
    ['Carbohydrates', `${nutritionGoals.carbs} g`, 'Primary energy source'],
    ['Fat', `${nutritionGoals.fat} g`, 'For hormone balance & absorption'],
  ];

  autoTable(doc, {
    startY: yPosition,
    head: [nutritionData[0]],
    body: nutritionData.slice(1),
    theme: 'striped',
    headStyles: { fillColor: primaryColor, fontSize: 10 },
    styles: { fontSize: 10, cellPadding: 4 },
    margin: { left: 16, right: 16 }
  });

  yPosition = doc.lastAutoTable.finalY + 15;

  // Smart Filtering Rules
  if (recommendationRules?.length > 0) {
    drawSectionHeader('🧠 Smart Filtering Applied');
    
    doc.setFontSize(10);
    recommendationRules.forEach((rule, index) => {
      checkPageBreak(8);
      doc.text(`• ${rule}`, 16, yPosition);
      yPosition += 7;
    });
    yPosition += 10;
  }

  // ========== MEAL PLAN ==========
  checkPageBreak(40);
  drawSectionHeader('🍽️ Your Selected Meal Plan');

  if (selectedFoods.length === 0) {
    doc.setFontSize(11);
    doc.setTextColor(150, 150, 150);
    doc.text('No foods selected yet. Build your meal plan using the interactive planner!', 16, yPosition);
    yPosition += 15;
  } else {
    // Group foods by meal type
    const mealGroups = {
      breakfast: selectedFoods.filter(f => f.category === 'breakfast'),
      lunch: selectedFoods.filter(f => f.category === 'lunch'),
      snacks: selectedFoods.filter(f => f.category === 'snacks'),
      dinner: selectedFoods.filter(f => f.category === 'dinner'),
    };

    const mealLabels = {
      breakfast: '🌅 Breakfast',
      lunch: '☀️ Lunch',
      snacks: '🍎 Snacks',
      dinner: '🌙 Dinner'
    };

    Object.entries(mealGroups).forEach(([mealType, foods]) => {
      if (foods.length > 0) {
        checkPageBreak(30);
        
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...primaryColor);
        doc.text(mealLabels[mealType], 16, yPosition);
        yPosition += 8;

        const tableData = foods.map(food => [
          food.name,
          food.nameHindi || '-',
          `${food.calories} kcal`,
          `P: ${food.protein}g`,
          `C: ${food.carbs}g`,
          `F: ${food.fat}g`
        ]);

        autoTable(doc, {
          startY: yPosition,
          head: [['Food Item', 'Hindi Name', 'Calories', 'Protein', 'Carbs', 'Fat']],
          body: tableData,
          theme: 'striped',
          headStyles: { fillColor: [100, 116, 139], fontSize: 9 },
          styles: { fontSize: 9, cellPadding: 3 },
          margin: { left: 16, right: 16 }
        });

        yPosition = doc.lastAutoTable.finalY + 10;
      }
    });

    // Total Summary
    checkPageBreak(40);
    drawSectionHeader('📈 Meal Plan Summary');

    const totalNutrition = selectedFoods.reduce((acc, food) => ({
      calories: acc.calories + (food.calories || 0),
      protein: acc.protein + (food.protein || 0),
      carbs: acc.carbs + (food.carbs || 0),
      fat: acc.fat + (food.fat || 0),
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

    const summaryData = [
      ['Metric', 'Selected', 'Target', 'Status'],
      [
        'Calories',
        `${totalNutrition.calories} kcal`,
        `${nutritionGoals.calories} kcal`,
        getStatusLabel(totalNutrition.calories, nutritionGoals.calories)
      ],
      [
        'Protein',
        `${totalNutrition.protein} g`,
        `${nutritionGoals.protein} g`,
        getStatusLabel(totalNutrition.protein, nutritionGoals.protein)
      ],
      [
        'Carbohydrates',
        `${totalNutrition.carbs} g`,
        `${nutritionGoals.carbs} g`,
        getStatusLabel(totalNutrition.carbs, nutritionGoals.carbs)
      ],
      [
        'Fat',
        `${totalNutrition.fat} g`,
        `${nutritionGoals.fat} g`,
        getStatusLabel(totalNutrition.fat, nutritionGoals.fat)
      ],
    ];

    autoTable(doc, {
      startY: yPosition,
      head: [summaryData[0]],
      body: summaryData.slice(1),
      theme: 'striped',
      headStyles: { fillColor: primaryColor, fontSize: 10 },
      styles: { fontSize: 10, cellPadding: 4 },
      margin: { left: 16, right: 16 }
    });

    yPosition = doc.lastAutoTable.finalY + 15;
  }

  // ========== FOOTER ==========
  const addFooter = (pageNum, totalPages) => {
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Smart Indian Diet Recommendation | Page ${pageNum} of ${totalPages}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
  };

  // Add page numbers
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    addFooter(i, totalPages);
  }

  // Download the PDF
  doc.save(`diet-plan-${new Date().toISOString().split('T')[0]}.pdf`);
};

// Helper functions
function getActivityLabel(level) {
  const labels = {
    'sedentary': 'Little/No Exercise',
    'moderate': 'Moderate (3-5 days/week)',
    'active': 'Extra Active (6-7 days/week)'
  };
  return labels[level] || level || 'Not specified';
}

function getFoodPrefLabel(pref) {
  const labels = {
    'vegetarian': 'Vegetarian',
    'non-vegetarian': 'Non-Vegetarian',
    'both': 'Both (Veg & Non-Veg)'
  };
  return labels[pref] || pref || 'Not specified';
}

function getGoalLabel(goal) {
  const labels = {
    'weight_loss': 'Weight Loss',
    'weight_gain': 'Weight Gain',
    'maintain': 'Maintain Weight',
    'stay_fit': 'Stay Fit & Healthy'
  };
  return labels[goal] || goal || 'Not specified';
}

function getStatusLabel(current, target) {
  const percentage = (current / target) * 100;
  if (percentage < 80) return '⬇️ Below Target';
  if (percentage > 110) return '⬆️ Above Target';
  return '✅ On Track';
}
