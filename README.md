# WealthManager Dashboard

This is a single-page, full-stack web application built with Next.js 14 and TypeScript. It provides a comprehensive dashboard for visualizing a simulated investment portfolio, including performance metrics, asset allocation, and detailed holdings. The application is designed to be fully responsive and deploy-ready on Vercel.

### Getting Started

To run this project locally, follow these steps:

1.  **Clone the repository:**

    ```
    git clone [https://github.com/HrOS-Summer/your-repo-name.git](https://github.com/HrOS-Summer/your-repo-name.git)
    cd wealth-manager-next

    ```

2.  **Install dependencies:**

    ```
    npm install

    ```

3.  **Run the development server:**

    ```
    npm run dev

    ```

    Open [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) in your browser to see the dashboard.

### Project Structure

The project follows the standard Next.js App Router structure with a `src/` directory for all source code.

src/
├── app/                  # Next.js App Router files
│   ├── api/              # API routes for data endpoints
│   ├── layout.tsx        # Main application layout
│   └── page.tsx          # Main dashboard page
├── components/           # Reusable UI components
├── lib/                  # Backend logic, static data, and utility functions
├── public/               # Public assets (e.g., favicon)
└── styles/               # Global CSS file


### Data & Calculations

The project uses static data defined in `src/lib/data.ts` to simulate a portfolio. This includes `holdings` (individual stock information) and `historicalPerformance` (monthly value snapshots for the portfolio and benchmarks).

Key calculations are handled in `src/lib/calc.ts`:

* **`computeHoldingMetrics(h)`**: Calculates the current market value, invested capital, and the profit/loss (P/L) in both absolute and percentage terms for a single stock holding.

* **`computePortfolioTotals(items)`**: Aggregates metrics from all holdings to provide the total portfolio value, total invested amount, and total P/L.

* **`buildAllocation(items, key)`**: Groups holdings by a specified key (e.g., `sector` or `marketCap`) and calculates the percentage of the total portfolio value that each group represents.

* **`computeDiversificationScore(items)`**: Computes a score from 0 to 10 based on the Herfindahl-Hirschman Index (HHI). A lower HHI indicates a more diversified portfolio (closer to a score of 10), while a higher HHI indicates concentration.

* **`computeReturns(timeline)`**: Calculates the month-over-month percentage returns for 1-month, 3-month, and 1-year periods by comparing the latest values to past values from the `historicalPerformance` data.

### API Endpoints

The project uses Next.js Route Handlers to create server-side API endpoints. These endpoints process the static data and serve it to the frontend, mimicking a real-world API.

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/portfolio/health` | `GET` | A simple health check to ensure the API is running. |
| `/api/portfolio/holdings` | `GET` | Returns a list of all holdings with calculated metrics. |
| `/api/portfolio/summary` | `GET` | Returns key summary statistics for the entire portfolio. |
| `/api/portfolio/allocation` | `GET` | Returns portfolio allocation data by sector and market cap. |
| `/api/portfolio/performance` | `GET` | Returns historical performance data and computed returns. |

### UI Components & Analysis

The dashboard is built from several interactive components, each presenting a specific analysis of the portfolio data.

#### **Stat Cards**

Located at the top of the page, these cards provide a quick glance at the portfolio's most important metrics, including:

* **Total Portfolio Value**: The current worth of all holdings.

* **Total Gain/Loss**: The absolute P/L and the percentage change since the initial investment.

* **Portfolio Performance %**: The overall percentage return.

* **Number of Holdings**: The total number of unique stocks in the portfolio.

#### **Asset Allocation**

This section features two responsive pie charts:

* **By Sector**: Visualizes the percentage of the portfolio value allocated to different economic sectors. This helps identify over- or under-exposure to specific industries.

* **By Market Cap**: Shows the distribution of the portfolio across different company sizes (Large, Mid, Small-Cap). This provides insight into the portfolio's risk profile.

#### **Performance Comparison**

* **Line Chart**: Compares the historical growth of the portfolio against major benchmarks like the Nifty 50 Index and Gold. This helps evaluate whether the portfolio is outperforming or underperforming the broader market and other asset classes.

* **Metric Cards**: Displays the percentage returns over different periods (1 month, 3 months, 1 year) for the portfolio and each benchmark.

#### **Holdings Table**

A dynamic table that lists all individual stock holdings. It is interactive and allows the user to:

* **Search**: Filter holdings by symbol, company name, or sector.

* **Sort**: Click on column headers to sort the table by metrics like value, P/L, or P/L %.

#### **Top Performers & Insights**

This section highlights key insights about the portfolio:

* **Best/Worst Performer**: Shows the single stock with the highest and lowest percentage gain or loss.

* **Diversification Score**: Provides a score out of 10 based on the portfolio's sector allocation, indicating how well-diversified the investments are.

* **Risk Level**: Assesses the overall risk of the portfolio as "Low," "Moderate," or "High."