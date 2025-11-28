# Dietly2

Dietly2 is a single-page React application for building and tracking nutrition plans with a focus on Indian foods. It provides a multi-step diet form, a food selector (with a local dataset of Indian foods), calorie estimation, nutrition goals, and trackers — all built using Vite + React and Tailwind CSS utilities.

## Key features

- Food selection with Indian foods dataset (`src/data/indianFoods.js`)  
- Calorie estimation and macronutrient calculations (`CalorieEstimator.jsx`, `lib/utils.js`)  
- Multi-step onboarding/form (`MultiStepForm.jsx`) and diet results (`DietResults.jsx`)  
- Nutrition tracker and selected meal plan components  
- Reusable UI primitives under `src/components/ui/` (buttons, dialogs, inputs, toast, etc.)  
- Internationalization (i18n) with English, Hindi, Marathi locales

## Tech stack

- React (JSX) + Vite
- Tailwind CSS (project contains `tailwind.config.ts`) and plain CSS
- Local data in JS (`src/data/indianFoods.js`) — no server required to run the app
- Optional Bun support (project contains `bun.lockb`)

## Project structure

```
Dietly2/
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.ts
├── postcss.config.js
├── src/
│   ├── main.jsx            # App entry point
│   ├── App.jsx             # Top-level app component
│   ├── App.css
│   ├── index.css
│   ├── assets/             # Images and static assets
│   ├── components/         # Application components
│   │   ├── CalorieEstimator.jsx
│   │   ├── DietForm.jsx
│   │   ├── DietResults.jsx
│   │   ├── FoodSelector.jsx
│   │   ├── LanguageSwitcher.jsx
│   │   ├── MultiStepForm.jsx
│   │   ├── NutritionGoals.jsx
│   │   ├── NutritionTracker.jsx
│   │   ├── SelectedMealPlan.jsx
│   │   └── ui/             # UI primitives (button, dialog, toast, input, etc.)
│   ├── data/
│   │   └── indianFoods.js  # Static dataset of Indian foods and nutrition values
│   ├── hooks/
│   │   ├── use-mobile.jsx
│   │   └── use-toast.js
│   ├── i18n/
│   │   ├── config.js
│   │   └── locales/
│   │       ├── en.json
│   │       ├── hi.json
│   │       └── mr.json
│   └── lib/
│       └── utils.js        # shared helper functions (calculations, formatting)
└── public/
	└── robots.txt
```

## How it works (data flow)

1. `main.jsx` bootstraps React and providers (router/i18n/toast if used).  
2. `Index` or `App.jsx` renders main components: `MultiStepForm`, `FoodSelector`, `CalorieEstimator`, etc.  
3. `FoodSelector` reads data from `src/data/indianFoods.js` and emits selected items.  
4. `CalorieEstimator` and `lib/utils.js` compute calories/macros and present a plan in `DietResults.jsx`.  
5. `SelectedMealPlan` and `NutritionTracker` hold/persist selections in component state or localStorage (can be extended to a backend later).

## Run & develop (PowerShell)

The project can be run with either npm (recommended) or Bun (if you prefer Bun and have it installed). Example PowerShell commands:

Using npm:

```powershell
# from project root (d:\Dietly2)
npm install
npm run dev    # start Vite dev server
npm run build  # build production bundle
npm run preview # preview production build
```

If you prefer Bun (optional):

```powershell
bun install
bun run dev
```

Notes:
- The dev server runs on Vite's default port (typically 5173). Open displayed URL in your browser.
- If you see TypeScript config files but the app uses .jsx, Vite will still run fine in JS mode.



## License

Add license details (MIT recommended) in `LICENSE` if this project is public.

