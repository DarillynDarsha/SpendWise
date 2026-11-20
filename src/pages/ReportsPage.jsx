import Analytics from '../components/Analytics'
import './ReportsPage.css'

function ReportsPage({ transactions = [], totalIncome = 0 }) {

  // =========================================
  // REPORT OVERVIEW DATA
  // =========================================

  const transactionCount = transactions.length

  const formattedIncome = Number(totalIncome).toLocaleString('en-IN')

  return (
    <div className="reports-page">

      {/* Reports Header */}

      <div className="reports-header">

        <div className="reports-header-content">

          <span className="reports-label">
            FINANCIAL INSIGHTS
          </span>

          <h1>Reports & Analytics</h1>

          <p>
            Monitor your financial performance and understand
            your spending patterns.
          </p>

        </div>

        <div className="reports-header-badge">
          <span className="reports-badge-icon">↗</span>
          <span>Financial Overview</span>
        </div>

      </div>


      {/* Summary Cards */}

      <div className="reports-summary-grid">

        {/* Income Card */}

        <div className="reports-summary-card income-summary">

          <div className="reports-summary-top">

            <span className="reports-summary-icon">₹</span>

            <span className="reports-summary-tag">
              TOTAL INCOME
            </span>

          </div>

          <p>Total Income</p>

          <h2>₹{formattedIncome}</h2>

          <span className="reports-summary-description">
            Total recorded income
          </span>

        </div>


        {/* Transactions Card */}

        <div className="reports-summary-card transaction-summary">

          <div className="reports-summary-top">

            <span className="reports-summary-icon">⇄</span>

            <span className="reports-summary-tag">
              ACTIVITY
            </span>

          </div>

          <p>Total Transactions</p>

          <h2>{transactionCount}</h2>

          <span className="reports-summary-description">
            Recorded financial activities
          </span>

        </div>

      </div>


      {/* Financial Analytics */}

      <section className="reports-analytics-section">

        <div className="reports-section-heading">

          <div>

            <span className="reports-section-label">
              PERFORMANCE ANALYSIS
            </span>

            <h2>Financial Analytics</h2>

            <p>
              Visual insights into your income, expenses
              and monthly spending patterns.
            </p>

          </div>

          <div className="reports-live-indicator">
            <span></span>
            Transaction Based
          </div>

        </div>


        {/* Existing Analytics Component */}

        <div className="reports-chart-container">

          <Analytics
            transactions={transactions}
            totalIncome={totalIncome}
          />

        </div>

      </section>

    </div>
  )
}

export default ReportsPage