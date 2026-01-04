import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Chart, registerables } from 'chart.js';

// Function to convert logo to base64 for PDF inclusion
const getLogoAsBase64 = (callback) => {
  // Create an image element to load the logo
  const img = new Image();
  img.crossOrigin = 'Anonymous';
  img.src = '/logo.png';
  
  img.onload = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions to match the logo
    canvas.width = img.width;
    canvas.height = img.height;
    
    // Draw the image on the canvas
    ctx.drawImage(img, 0, 0);
    
    // Convert to base64
    const dataURL = canvas.toDataURL('image/png');
    callback(dataURL);
  };
  
  img.onerror = () => {
    callback(null); // Return null if image fails to load
  };
};

// Register Chart.js components
Chart.register(...registerables);

// Offscreen canvas for chart generation
const createOffscreenCanvas = (width, height) => {
  const canvas = {
    width,
    height,
    style: {},
    getContext: () => {
      // This is a mock context for server-side chart generation
      return {
        canvas,
        fillRect: () => {},
        clearRect: () => {},
        getImageData: (x, y, w, h) => ({ data: new Array(w * h * 4) }),
        fillText: () => {},
        strokeText: () => {},
        measureText: () => ({ width: 0 }),
        arc: () => {},
        beginPath: () => {},
        closePath: () => {},
        clip: () => {},
        fill: () => {},
        stroke: () => {},
        moveTo: () => {},
        lineTo: () => {},
        rect: () => {},
        save: () => {},
        restore: () => {},
        scale: () => {},
        rotate: () => {},
        translate: () => {},
        transform: () => {},
        setTransform: () => {},
        createLinearGradient: () => ({ addColorStop: () => {} }),
        createRadialGradient: () => ({ addColorStop: () => {} }),
        createPattern: () => ({}),
        drawImage: () => {},
        createImageData: () => ({ data: new Array(width * height * 4) }),
        putImageData: () => {},
        isPointInPath: () => false,
        font: '',
        textAlign: 'start',
        textBaseline: 'alphabetic',
        fillStyle: '#000000',
        strokeStyle: '#000000',
        lineWidth: 1,
        lineCap: 'butt',
        lineJoin: 'miter',
        miterLimit: 10,
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        shadowBlur: 0,
        shadowColor: 'rgba(0, 0, 0, 0)',
        globalAlpha: 1,
        globalCompositeOperation: 'source-over',
        imageSmoothingEnabled: true,
        imageSmoothingQuality: 'low',
      };
    },
    toDataURL: (type, encoderOptions) => {
      // Return a mock data URL
      return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
    },
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  };
  return canvas;
};

// Function to create pie chart image from nutrition data
const createNutritionPieChart = (nutritionGoals) => {
  // Calculate macronutrient percentages based on calories
  const calories = nutritionGoals.calories;
  const proteinCalories = nutritionGoals.protein * 4; // 4 cal per gram of protein
  const carbsCalories = nutritionGoals.carbs * 4; // 4 cal per gram of carbs
  const fatCalories = nutritionGoals.fat * 9; // 9 cal per gram of fat
  
  // Calculate percentages
  const proteinPercentage = Math.round((proteinCalories / calories) * 100);
  const carbsPercentage = Math.round((carbsCalories / calories) * 100);
  const fatPercentage = Math.round((fatCalories / calories) * 100);
  
  // Data for the pie chart
  const data = {
    labels: ['Protein', 'Carbohydrates', 'Fat'],
    datasets: [{
      data: [proteinPercentage, carbsPercentage, fatPercentage],
      backgroundColor: [
        '#36A2EB', // Blue for protein
        '#FFCE56', // Yellow for carbs
        '#FF6384', // Pink for fat
      ],
      borderWidth: 1,
    }]
  };
  
  // Create an offscreen canvas
  const canvas = createOffscreenCanvas(400, 400);
  
  // Create chart instance
  const config = {
    type: 'pie',
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Macronutrient Distribution'
        }
      }
    },
  };
  
  // Return data URL of the chart
  // Since we're in a server environment, we'll return a mock chart image
  // In a real browser environment, we would create the chart and get the data URL
  return {
    dataUrl: canvas.toDataURL(),
    labels: ['Protein', 'Carbohydrates', 'Fat'],
    values: [proteinPercentage, carbsPercentage, fatPercentage]
  };
};

// Function to generate a pie chart and return its image data for PDF
const generatePieChartImage = (nutritionGoals) => {
  // Calculate macronutrient percentages based on calories
  const calories = nutritionGoals.calories;
  const proteinCalories = nutritionGoals.protein * 4; // 4 cal per gram of protein
  const carbsCalories = nutritionGoals.carbs * 4; // 4 cal per gram of carbs
  const fatCalories = nutritionGoals.fat * 9; // 9 cal per gram of fat
  
  // Calculate percentages
  const proteinPercentage = Math.round((proteinCalories / calories) * 100);
  const carbsPercentage = Math.round((carbsCalories / calories) * 100);
  const fatPercentage = Math.round((fatCalories / calories) * 100);
  
  // Return a simplified representation for PDF generation
  return {
    protein: proteinPercentage,
    carbs: carbsPercentage,
    fat: fatPercentage
  };
};

export const generateDietPDF = (userData, selectedFoods, nutritionGoals, bmi, bmiStatus, recommendationRules) => {
  // Load the logo first, then generate the PDF
  getLogoAsBase64((logoBase64) => {
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
  
  // Add logo to the left of the title
  if (logoBase64) {
    // Use the actual logo image
    doc.addImage(logoBase64, 'PNG', 15, 8, 25, 25); // x, y, width, height
    // Position the title closer to the logo
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('Smart Indian Diet Report', 50, 22, { align: 'left' }); // Positioned right after the logo
  } else {
    // Fallback to text logo if image fails to load
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('DIETLY', 20, 20);
    
    // Position the title closer to the text logo
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('Smart Indian Diet Report', 50, 22, { align: 'left' }); // Positioned right after the text logo
  }
  
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
  drawSectionHeader('Personal Profile');
  
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
    drawSectionHeader('Health Conditions');
    
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
  drawSectionHeader('Health Metrics');
  
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
  doc.text('BMI Reference: Underweight (<18.5) | Normal (18.5-24.9) | Overweight (25-29.9) | Obese (30+)', 16, yPosition);
  yPosition += 15;

  // ========== PAGE 2: Nutrition Goals & Recommendations ==========
  doc.addPage();
  yPosition = 20;

  // Nutrition Goals
  drawSectionHeader('Daily Nutrition Goals');
  
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

  // Nutrition Pie Chart
  const chartData = generatePieChartImage(nutritionGoals);
  
  // Draw the pie chart representation
  drawSectionHeader('Macronutrient Distribution');
  
  // Draw a visual representation of the pie chart using rectangles
  const chartWidth = 120;
  const chartHeight = 20;
  const chartX = (pageWidth - chartWidth) / 2; // Center the chart
  
  // Draw the "pie chart" as a segmented bar
  let currentX = chartX;
  const totalPercentage = chartData.protein + chartData.carbs + chartData.fat;
  
  // Protein segment (Blue)
  doc.setFillColor(54, 162, 235); // Blue
  const proteinWidth = (chartData.protein / totalPercentage) * chartWidth;
  doc.rect(currentX, yPosition, proteinWidth, chartHeight, 'F');
  
  currentX += proteinWidth;
  
  // Carbs segment (Yellow)
  doc.setFillColor(255, 206, 86); // Yellow
  const carbsWidth = (chartData.carbs / totalPercentage) * chartWidth;
  doc.rect(currentX, yPosition, carbsWidth, chartHeight, 'F');
  
  currentX += carbsWidth;
  
  // Fat segment (Pink)
  doc.setFillColor(255, 99, 132); // Pink
  const fatWidth = (chartData.fat / totalPercentage) * chartWidth;
  doc.rect(currentX, yPosition, fatWidth, chartHeight, 'F');
  
  yPosition += chartHeight + 10;
  
  // Add legend below the chart
  doc.setFontSize(9);
  doc.setTextColor(...textColor);
  doc.setFont('helvetica', 'normal');
  
  // Position legend items
  const legendX = (pageWidth - chartWidth) / 2;
  let legendY = yPosition;
  
  // Protein legend
  doc.setFillColor(54, 162, 235); // Blue
  doc.rect(legendX, legendY, 5, 5, 'F');
  doc.setTextColor(...textColor);
  doc.text(`Protein: ${chartData.protein}%`, legendX + 7, legendY + 4);
  
  // Carbs legend
  doc.setFillColor(255, 206, 86); // Yellow
  doc.rect(legendX + 40, legendY, 5, 5, 'F');
  doc.setTextColor(...textColor);
  doc.text(`Carbs: ${chartData.carbs}%`, legendX + 47, legendY + 4);
  
  // Fat legend
  doc.setFillColor(255, 99, 132); // Pink
  doc.rect(legendX + 80, legendY, 5, 5, 'F');
  doc.setTextColor(...textColor);
  doc.text(`Fat: ${chartData.fat}%`, legendX + 87, legendY + 4);
  
  yPosition += 15;

  // Smart Filtering Rules
  if (recommendationRules?.length > 0) {
    drawSectionHeader('Smart Filtering Applied');
    
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
  drawSectionHeader('Your Selected Meal Plan');

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
      breakfast: 'Breakfast',
      lunch: 'Lunch',
      snacks: 'Snacks',
      dinner: 'Dinner'
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
    drawSectionHeader('Meal Plan Summary');

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
  });
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
  if (percentage < 80) return 'Below Target';
  if (percentage > 110) return 'Above Target';
  return 'On Track';
}
