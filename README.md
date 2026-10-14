# FINOVA — Smart Expense Tracker

A competition-ready, privacy-first **personal finance dashboard** built using React, Vite, TypeScript and Tailwind CSS.

## 🖥️ Run in VS Code

1. Extract the ZIP file and open the **FINOVA-Smart-Expense-Tracker** folder in Visual Studio Code.
2. Install **Node.js 20.19+ or Node.js 22+** if you don't already have it.
3. Open **Terminal → New Terminal** in VS Code.
4. Run:

   ```bash
   npm install
   npm run dev
   ```

5. Open the localhost URL printed in the terminal (usually **http://localhost:5173**).

> `node_modules` is intentionally excluded from the ZIP to keep it small. `npm install` downloads the dependencies; internet access is needed for the initial install.

## Features

- Premium mobile-friendly dashboard, sidebar navigation and theme switcher
- Income and expense transactions: add, edit and delete (with confirmation)
- Form validation using React Hook Form and Zod
- Category, month, transaction type, title search and sort filters
- Indian rupee formatting and accurate integer-paise financial calculations
- Spending category donut chart, six-month income/expense bar chart, daily trend chart
- Per-month budget tracking with 70%/90% warning levels
- Manual savings goals and data-driven spending insights
- CSV export of the currently filtered transactions, or all transactions from Settings
- Saved transactions, budgets, goals, name and theme in localStorage
- Optional **Explore Demo** with realistic sample transactions; demo entries are identifiable and removable separately
- Accessible dialogs, keyboard-friendly controls, empty states, dark mode, smooth interactions
- No backend, paid API, user registration or database required

## Other commands

```bash
npm run build    # TypeScript verification + production bundle in dist/
npm run preview  # Preview the production build
npm test         # Run financial logic and validation tests
```

## Project structure

```text
FINOVA-Smart-Expense-Tracker/
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
├── vercel.json
├── src/
│   ├── App.tsx                   # Navigation, screens, app state, user actions
│   ├── main.tsx
│   ├── styles.css
│   ├── components/
│   │   ├── Charts.tsx           # Recharts: donut, bars, trend
│   │   ├── Insights.tsx
│   │   ├── Sidebar.tsx
│   │   ├── SummaryCard.tsx
│   │   ├── TransactionModal.tsx
│   │   ├── TransactionsList.tsx
│   │   └── ui/                 # shadcn-style Radix/Tailwind UI primitives
│   ├── hooks/useLocalStorage.ts
│   ├── lib/finance.ts          # Pure calculations, validation, CSV, demo
│   ├── lib/utils.ts
│   └── test/finance.test.ts
└── public/favicon.svg
```

## Demo for competition judges

On the Dashboard, click **Explore demo** to generate clearly labeled sample financial activity for three months. Explore **Transactions** and **Analytics**, set a monthly budget in **Budgets**, switch to dark mode in **Settings**, and export filtered activity to CSV. Demo data never replaces personal entries; remove sample entries in Settings.

## Deploy to Vercel

1. Push this folder to a new GitHub repository.
2. Sign in to [vercel.com](https://vercel.com) and import the repository.
3. Select the Vite framework if not detected. Build command: `npm run build`; output directory: `dist`.
4. Deploy. A `vercel.json` is already provided.

## Screenshot suggestions

For a compelling submission capture the Dashboard **after loading demo data**, the **Analytics** tab, and the **Budgets** tab. Take screenshots at desktop (1440px width) and mobile (375px). Try dark mode too.

## Privacy and important notes

Data is stored **only in your browser's localStorage**. It does not sync across devices or browsers. Clearing browser storage deletes it, so use CSV export for backups. This project is a frontend demonstration, not a financial advisory product. Web fonts use Google Fonts when online, with system fallbacks offline.
