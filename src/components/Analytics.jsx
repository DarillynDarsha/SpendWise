import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line
} from "recharts";

import "./Analytics.css";

function Analytics({ transactions = [], totalIncome = 0 }) {

  const currentDate = new Date();

  // Currency Formatting

  const formatCurrency = (amount) =>
    `₹${Number(amount).toLocaleString("en-IN")}`;

  const currentMonthKey = `${currentDate.getFullYear()}-${String(
    currentDate.getMonth() + 1
  ).padStart(2, "0")}`;

  // =========================================
  // LAST SIX MONTHS DATA
  // =========================================

  const monthlyData = [];

  for (let i = 5; i >= 0; i--) {

    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - i,
      1
    );

    const month = date.toLocaleString("en-IN", {
      month: "short"
    });

    const year = date.getFullYear();

    const monthKey = `${year}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}`;

    const monthTransactions = transactions.filter(
      (transaction) =>
        transaction.date?.startsWith(monthKey)
    );

    const income = monthTransactions
      .filter((t) => t.type === "Income")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const expenses = monthTransactions
      .filter((t) => t.type === "Expense")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    monthlyData.push({
      month: `${month} ${year}`,
      income,
      expenses
    });

  }

  // =========================================
  // CATEGORY-WISE EXPENSE DATA
  // =========================================

  const categoryTotals = {};

  transactions
    .filter(
      (t) =>
        t.type === "Expense" &&
        t.date?.startsWith(currentMonthKey)
    )
    .forEach((t) => {

      categoryTotals[t.category] =
        (categoryTotals[t.category] || 0) +
        Number(t.amount);

    });

  const categoryData = Object.entries(categoryTotals).map(
    ([category, amount]) => ({
      category,
      amount
    })
  );

  // =========================================
  // CHART COLORS
  // =========================================

  const COLORS = [
    "#6366F1",
    "#06B6D4",
    "#F59E0B",
    "#10B981",
    "#F43F5E",
    "#8B5CF6"
  ];

  return (

    <div className="analytics-container">

      {/* Analytics Heading */}

      <div className="analytics-heading">

        <h2>Dashboard Analytics</h2>

        <p>
          Understand your financial activities through visual insights.
        </p>

      </div>


      {/* =====================================
          INCOME VS EXPENSES
      ===================================== */}

      <div className="chart-card">

        <div className="chart-title-row">

          <div>
            <span className="chart-card-label">
              CASH FLOW
            </span>

            <h3>Income vs Expenses</h3>

            <p className="chart-description">
              Monthly comparison of your income and expenses.
            </p>
          </div>

          <span className="chart-card-icon income-chart-icon">
            ⇄
          </span>

        </div>

        <ResponsiveContainer width="100%" height={300}>

          <BarChart
            data={monthlyData}
            margin={{ top: 15, right: 15, left: 5, bottom: 5 }}
            barGap={8}
          >

            <CartesianGrid
              strokeDasharray="4 4"
              vertical={false}
              stroke="#e9edf5"
            />

            <XAxis
              dataKey="month"
              tick={{ fill: "#64748b", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              tickFormatter={(value) =>
                value >= 1000
                  ? `₹${value / 1000}k`
                  : `₹${value}`
              }
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip
              formatter={formatCurrency}
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 8px 25px rgba(15,23,42,0.10)"
              }}
            />

            <Legend
              verticalAlign="bottom"
              height={35}
            />

            <Bar
              dataKey="income"
              name="Income"
              fill="#10B981"
              radius={[6, 6, 0, 0]}
              maxBarSize={38}
            />

            <Bar
              dataKey="expenses"
              name="Expenses"
              fill="#F43F5E"
              radius={[6, 6, 0, 0]}
              maxBarSize={38}
            />

          </BarChart>

        </ResponsiveContainer>

      </div>


      {/* =====================================
          CATEGORY-WISE EXPENSES
      ===================================== */}

      <div className="chart-card">

        <div className="chart-title-row">

          <div>
            <span className="chart-card-label">
              SPENDING BREAKDOWN
            </span>

            <h3>Category-wise Expenses</h3>

            <p className="chart-description">
              Breakdown of your spending by category this month.
            </p>
          </div>

          <span className="chart-card-icon category-chart-icon">
            ◉
          </span>

        </div>

        {categoryData.length > 0 ? (

          <ResponsiveContainer width="100%" height={300}>

            <PieChart>

              <Pie
                data={categoryData}
                dataKey="amount"
                nameKey="category"
                cx="50%"
                cy="45%"
                innerRadius={65}
                outerRadius={100}
                paddingAngle={3}
                label
              >

                {categoryData.map((entry, index) => (

                  <Cell
                    key={entry.category}
                    fill={COLORS[index % COLORS.length]}
                    stroke="#ffffff"
                    strokeWidth={3}
                  />

                ))}

              </Pie>

              <Tooltip formatter={formatCurrency} />

              <Legend
                verticalAlign="bottom"
                height={35}
              />

            </PieChart>

          </ResponsiveContainer>

        ) : (

          <p className="no-chart-data">
            No expense data available for this month.
          </p>

        )}

      </div>


      {/* =====================================
          MONTHLY SPENDING TREND
      ===================================== */}

      <div className="chart-card">

        <div className="chart-title-row">

          <div>
            <span className="chart-card-label">
              SPENDING ANALYSIS
            </span>

            <h3>Monthly Spending Trend</h3>

            <p className="chart-description">
              Track how your expenses change over the last six months.
            </p>
          </div>

          <span className="chart-card-icon trend-chart-icon">
            ↗
          </span>

        </div>

        <ResponsiveContainer width="100%" height={300}>

          <LineChart
            data={monthlyData}
            margin={{ top: 15, right: 15, left: 5, bottom: 5 }}
          >

            <CartesianGrid
              strokeDasharray="4 4"
              vertical={false}
              stroke="#e9edf5"
            />

            <XAxis
              dataKey="month"
              tick={{ fill: "#64748b", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              tickFormatter={(value) =>
                value >= 1000
                  ? `₹${value / 1000}k`
                  : `₹${value}`
              }
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip formatter={formatCurrency} />

            <Legend />

            <Line
              type="monotone"
              dataKey="expenses"
              name="Expenses"
              stroke="#6366F1"
              strokeWidth={3}
              dot={{
                r: 5,
                fill: "#6366F1",
                strokeWidth: 2,
                stroke: "#ffffff"
              }}
              activeDot={{ r: 8 }}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

    </div>

  );

}

export default Analytics;