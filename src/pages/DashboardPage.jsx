import Analytics from '../components/Analytics'
import './DashboardPage.css'

function DashboardPage({
  balance,
  totalIncome,
  totalExpenses,
  savings,
  monthlyExpenses,
  categoryExpenses,
  transactions
}) {

  const formatCurrency = (amount) =>
    `₹${Number(amount).toLocaleString('en-IN')}`

  const currentDate = new Date()

  const greeting =
    currentDate.getHours() < 12
      ? 'Good Morning'
      : currentDate.getHours() < 17
        ? 'Good Afternoon'
        : 'Good Evening'

  const monthName = currentDate.toLocaleString('en-IN', {
    month: 'long',
    year: 'numeric'
  })

  return (
    <div className="premium-dashboard">

      {/* Welcome Header */}

      <div className="premium-welcome">

        <div className="welcome-content">
          <span className="welcome-label">FINANCIAL OVERVIEW</span>

          <h1>{greeting} 👋</h1>

          <p>
            Here's what's happening with your finances today.
          </p>
        </div>

        <div className="welcome-date">
          <span>Today</span>
          <strong>
            {currentDate.toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            })}
          </strong>
        </div>

      </div>


      {/* Summary Cards */}

      <div className="premium-summary-grid">

        {/* Total Balance */}

        <div className="premium-card balance-card">

          <div className="premium-card-top">
            <span>Total Balance</span>
            <span className="premium-card-icon">₹</span>
          </div>

          <h2>{formatCurrency(balance)}</h2>

          <div className="balance-footer">
            <span>Available balance</span>
            <span>● Active</span>
          </div>

        </div>


        {/* Income */}

        <div className="premium-card income-card">

          <div className="premium-card-top">
            <span>Total Income</span>
            <span className="premium-card-icon">↗</span>
          </div>

          <h2>{formatCurrency(totalIncome)}</h2>

          <div className="premium-card-footer">
            <span>Money received</span>
            <span className="income-indicator">+ Income</span>
          </div>

        </div>


        {/* Expenses */}

        <div className="premium-card expense-card">

          <div className="premium-card-top">
            <span>Total Expenses</span>
            <span className="premium-card-icon">↘</span>
          </div>

          <h2>{formatCurrency(totalExpenses)}</h2>

          <div className="premium-card-footer">
            <span>Money spent</span>
            <span className="expense-indicator">− Expense</span>
          </div>

        </div>


        {/* Savings */}

        <div className="premium-card savings-card">

          <div className="premium-card-top">
            <span>Total Savings</span>
            <span className="premium-card-icon">✦</span>
          </div>

          <h2>{formatCurrency(savings)}</h2>

          <div className="premium-card-footer">
            <span>Your saved amount</span>
            <span className="savings-indicator">Savings</span>
          </div>

        </div>

      </div>


      {/* Monthly Expense Overview */}

      <div className="premium-monthly-section">

        <div className="section-heading">

          <div>
            <span className="section-eyebrow">MONTHLY OVERVIEW</span>
            <h2>Monthly Spending</h2>
            <p>Your expense summary for {monthName}.</p>
          </div>

          <span className="month-badge">
            {monthName}
          </span>

        </div>


        <div className="monthly-expense-card">

          <div className="monthly-expense-info">

            <div>
              <span>Total expenses this month</span>

              <h2>{formatCurrency(monthlyExpenses)}</h2>
            </div>

            <div className="monthly-expense-icon">
              ₹
            </div>

          </div>

          <div className="monthly-expense-bottom">
            <span>Track your spending and manage your money wisely.</span>
            <span>Monthly Report</span>
          </div>

        </div>


        {/* Category-wise Expenses */}

        <div className="premium-category-section">

          <div className="category-heading">
            <div>
              <h3>Spending by Category</h3>
              <p>Understand where your money goes.</p>
            </div>
          </div>


          {Object.keys(categoryExpenses).length > 0 ? (

            <div className="premium-category-grid">

              {Object.entries(categoryExpenses).map(
                ([category, amount], index) => {

                  const percentage = monthlyExpenses > 0
                    ? (amount / monthlyExpenses) * 100
                    : 0

                  const categoryColors = [
                    '#6366F1',
                    '#10B981',
                    '#F59E0B',
                    '#F43F5E',
                    '#8B5CF6',
                    '#06B6D4'
                  ]

                  const color =
                    categoryColors[index % categoryColors.length]

                  return (

                    <div className="premium-category-item" key={category}>

                      <div className="premium-category-info">

                        <div className="category-name">
                          <span
                            className="category-dot"
                            style={{ backgroundColor: color }}
                          ></span>

                          <strong>{category}</strong>
                        </div>

                        <strong>
                          {formatCurrency(amount)}
                        </strong>

                      </div>


                      <div className="premium-progress-track">

                        <div
                          className="premium-progress-fill"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: color
                          }}
                        ></div>

                      </div>


                      <div className="premium-category-percentage">
                        {percentage.toFixed(1)}% of monthly expenses
                      </div>

                    </div>

                  )

                }
              )}

            </div>

          ) : (

            <div className="premium-empty-state">
              <span>📊</span>
              <p>No expenses recorded this month.</p>
            </div>

          )}

        </div>

      </div>


      {/* Financial Analytics */}

      <div className="premium-analytics-section">

        <div className="section-heading">
          <div>
            <span className="section-eyebrow">FINANCIAL INSIGHTS</span>
            <h2>Analytics & Reports</h2>
            <p>Visual insights into your financial activities.</p>
          </div>
        </div>

        <Analytics
          transactions={transactions}
          totalIncome={totalIncome}
        />

      </div>

    </div>
  )
}

export default DashboardPage