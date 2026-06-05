# Wordle Solver Setup Guide

## 1. Create a new Vite project
```bash
npm create vite@latest wordle-solver -- --template react
```

## 2. Enter the directory
```bash
cd wordle-solver
```

## 3. Install dependencies
```bash
npm install
```

## 4. Install Tailwind CSS v4, PostCSS, and Lucide Icons
```bash
npm install -D tailwindcss @tailwindcss/postcss postcss autoprefixer
npm install lucide-react
```

## 5. Create configuration files

### Create `postcss.config.js`
```javascript
export default {
    plugins: {
        '@tailwindcss/postcss': {},
        autoprefixer: {},
    },
}
```

### Create `tailwind.config.js`
```javascript
/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {},
    },
    plugins: [],
}
```

## 6. Update `src/index.css`
Replace the content with:
```css
@import "tailwindcss";
```

## 7. Run the development server
```bash
npm run dev
```
