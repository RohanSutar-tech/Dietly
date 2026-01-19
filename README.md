# Dietly

**Dietly** is a modern, full-featured React application for building and tracking personalized nutrition plans with a focus on Indian foods. It combines an intuitive multi-step form, intelligent calorie estimation, and real-time nutrition tracking—all with support for English, Hindi, and Marathi languages.

## ✨ Key Features

- 🍽️ **Comprehensive Food Database** – Extensive dataset of Indian foods with accurate nutritional data
- 📊 **Smart Calorie Estimation** – Real-time macronutrient calculations and nutrition analysis
- 📋 **Multi-Step Form** – Guided onboarding process for personalized diet planning
- 📈 **Nutrition Tracking** – Monitor daily nutrition goals and meal selections
- 🎨 **Modern UI** – Built with Tailwind CSS and reusable shadcn/ui components
- 🌍 **Multi-Language Support** – English, Hindi, and Marathi locales with i18n
- ⚡ **Fast & Lightweight** – Powered by Vite with instant HMR and optimized builds

## 🛠️ Tech Stack

| Technology | Purpose |
|----------|---------|
| **React 18+** | UI framework with JSX components |
| **Vite** | Lightning-fast build tool and dev server |
| **Tailwind CSS** | Utility-first CSS framework |
| **shadcn/ui** | High-quality, reusable UI components |
| **i18n** | Internationalization for multi-language support |
| **Bun** | Alternative JavaScript runtime (optional) |

## 📁 Project Structure

```
Dietly/
├── index.html                 # HTML entry point
├── package.json              # Dependencies and scripts
├── vite.config.ts            # Vite configuration
├── tailwind.config.ts        # Tailwind CSS config
├── tsconfig.json             # TypeScript configuration
├── postcss.config.js         # PostCSS configuration
├── components.json           # shadcn/ui configuration
├── .gitignore                # Git ignore rules
├── pnpm-lock.yaml            # pnpm lock file
├── pnpm-workspace.yaml       # pnpm workspace config
├── bun.lockb                 # Bun lock file (optional)
│
├── src/
│   ├── main.jsx              # React app bootstrap
│   ├── App.jsx               # Root component
│   ├── App.css               # Global styles
│   ├── index.css             # Base styles
│   ├── vite-env.d.ts         # Vite type definitions
│   │
│   ├── assets/               # Images, fonts, and static assets
│   │
│   ├── components/           # React components
│   │   ├── CalorieEstimator.jsx      # Calorie & macro calculations
│   │   ├── DietResults.jsx           # Results display component
│   │   ├── FoodSelector.jsx          # Food selection interface
│   │   ├── LanguageSwitcher.jsx      # i18n language selector
│   │   ├── MultiStepForm.jsx         # Multi-step form wizard
│   │   ├── NutritionGoals.jsx        # Nutrition targets setup
│   │   ├── NutritionTracker.jsx      # Daily tracking interface
│   │   ├── SelectedMealPlan.jsx      # Selected meals display
│   │   └── ui/                       # shadcn/ui components (30+ components)
│   │       ├── button.jsx, input.jsx, dialog.jsx, select.jsx
│   │       ├── toast.jsx, card.jsx, form.jsx, tabs.jsx
│   │       ├── chart.jsx, calendar.jsx, slider.jsx, and more...
│   │       └── use-toast.js          # Toast hook utility
│   │
│   ├── data/
│   │   └── indianFoods.js    # Nutritional database of Indian foods
│   │
│   ├── hooks/
│   │   ├── use-mobile.jsx    # Responsive design hook
│   │   └── use-toast.js      # Toast notification hook
│   │
│   ├── i18n/
│   │   ├── config.js         # i18n initialization
│   │   └── locales/
│   │       ├── en.json       # English translations
│   │       ├── hi.json       # Hindi translations
│   │       └── mr.json       # Marathi translations
│   │
│   ├── lib/
│   │   └── utils.js          # Utility functions (cn() for class merging)
│   │
│   ├── pages/
│   │   ├── Index.jsx         # Main/home page
│   │   └── NotFound.jsx      # 404 error page
│   │
│   └── utils/
│       ├── foodRecommendationEngine.js  # food recommendations using rule-based algorithm
│       └── pdfGenerator.js             # PDF export functionality
│
├── public/
│   └── robots.txt            # SEO robots file
│
└── README.md                 # This file
```

## 🔄 Data Flow & Architecture

```
User Input (MultiStepForm)
    ↓
Personal Data (age, weight, activity level, etc)
    ↓
FoodSelector (picks foods from indianFoods.js)
    ↓
CalorieEstimator + lib/utils.js (compute macros/calories)
    ↓
DietResults (displays personalized nutrition plan)
    ↓
SelectedMealPlan & NutritionTracker (track & persist)
```

### Component Responsibilities

| Component | Purpose |
|-----------|---------|
| `MultiStepForm` | Collects user profile data (age, weight, goals, etc.) |
| `FoodSelector` | Browse and select foods from the Indian foods database |
| `CalorieEstimator` | Calculate daily calorie/macro targets based on profile |
| `DietResults` | Display the computed nutrition plan with meal recommendations |
| `NutritionTracker` | Track daily consumption against goals |
| `LanguageSwitcher` | Switch between English, Hindi, and Marathi |

### Data Persistence

Currently, data is stored in component state and `localStorage`. To add persistence:
- Replace localStorage with API calls to a Node.js/Express backend
- Store user profiles and meal plans in a MongoDB/PostgreSQL database

## 🚀 Getting Started

### Prerequisites

- **Node.js** 16+ or **Bun**
- **npm** or **pnpm** (comes with Bun)

### Installation & Development

#### Using npm (Recommended)

```bash
# Clone and navigate to project
cd d:\Dietly

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

#### Using Bun (Optional)

```bash
# Install dependencies
bun install

# Start development server
bun run dev

# Build for production
bun run build
```

#### Using pnpm

```bash
pnpm install
pnpm dev
pnpm build
```



## 📄 License

This project is licensed under the **MIT License** – see [LICENSE](LICENSE) file for details.

---

**Made with ❤️ Team Medicynth**

 