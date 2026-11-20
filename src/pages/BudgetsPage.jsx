import './BudgetsPage.css'

function BudgetsPage({
  budgets,
  categoryExpenses,
  budgetCategory,
  setBudgetCategory,
  budgetAmount,
  setBudgetAmount,
  handleSetBudget,
  handleDeleteBudget
}) {

  // =====================================
  // CURRENCY FORMATTER
  // =====================================

  const formatCurrency = (amount) =>
    `₹${Number(amount || 0).toLocaleString('en-IN')}`


  // =====================================
  // BUDGET OVERVIEW CALCULATIONS
  // =====================================

  const totalBudget = Object.values(budgets).reduce(
    (total, amount) => total + Number(amount),
    0
  )

  const totalSpent = Object.keys(budgets).reduce(
    (total, category) =>
      total + Number(categoryExpenses[category] || 0),
    0
  )

  const totalRemaining = totalBudget - totalSpent

  const budgetCount = Object.keys(budgets).length


  // =====================================
  // CATEGORY ICONS
  // =====================================

  const categoryIcons = {
    Food: '🍽️',
    Shopping: '🛍️',
    Utilities: '💡',
    Travel: '✈️',
    Entertainment: '🎬',
    Healthcare: '🏥',
    Education: '📚',
    Others: '📦'
  }


  // =====================================
  // PAGE UI
  // =====================================

  return (

    <div className="budgets-page">

      {/* =====================================
          PAGE HEADER
      ===================================== */}

      <div className="budgets-header">

        <div>
          <span className="budgets-label">
            FINANCIAL PLANNING
          </span>

          <h1>Budget Management</h1>

          <p>
            Plan your spending and stay in control of your finances.
          </p>
        </div>

        <div className="budgets-header-badge">
          <span className="header-status-dot"></span>
          Smart Budgeting
        </div>

      </div>


      {/* =====================================
          BUDGET OVERVIEW CARDS
      ===================================== */}

      <div className="budget-overview">

        {/* Total Budget */}

        <div className="budget-overview-card total-budget-card">

          <div className="budget-card-top">
            <div className="budget-overview-icon purple-icon">
              ₹
            </div>

            <span className="overview-card-tag">
              ALLOCATED
            </span>
          </div>

          <p>Total Budget</p>

          <h2>{formatCurrency(totalBudget)}</h2>

          <span>Monthly allocated amount</span>

        </div>


        {/* Total Spent */}

        <div className="budget-overview-card total-spent-card">

          <div className="budget-card-top">
            <div className="budget-overview-icon orange-icon">
              ↗
            </div>

            <span className="overview-card-tag">
              EXPENSES
            </span>
          </div>

          <p>Total Spent</p>

          <h2>{formatCurrency(totalSpent)}</h2>

          <span>Amount spent in budget categories</span>

        </div>


        {/* Remaining Budget */}

        <div className="budget-overview-card remaining-budget-card">

          <div className="budget-card-top">
            <div className="budget-overview-icon green-icon">
              ✓
            </div>

            <span className="overview-card-tag">
              {totalRemaining < 0 ? 'EXCEEDED' : 'AVAILABLE'}
            </span>
          </div>

          <p>Remaining Budget</p>

          <h2 className={totalRemaining < 0 ? 'over-budget-text' : ''}>
            {formatCurrency(Math.abs(totalRemaining))}
          </h2>

          <span>
            {totalRemaining < 0
              ? 'Amount exceeded'
              : 'Available to spend'}
          </span>

        </div>

      </div>


      {/* =====================================
          CREATE MONTHLY BUDGET
      ===================================== */}

      <div className="budget-create-section">

        <div className="budget-section-heading">

          <div className="budget-heading-content">

            <span className="budget-section-eyebrow">
              BUDGET PLANNER
            </span>

            <h2>Create Monthly Budget</h2>

            <p>
              Set a spending limit for each category.
            </p>

          </div>

      

        </div>


        {/* Budget Form */}

        <form
          className="budget-form"
          onSubmit={handleSetBudget}
        >

          {/* Category Selection */}

          <div className="budget-input-group">

            <label htmlFor="budget-category">
              Category
            </label>

            <select
              id="budget-category"
              value={budgetCategory}
              onChange={e => setBudgetCategory(e.target.value)}
            >

              <option value="">Select Category</option>
              <option value="Food">Food</option>
              <option value="Shopping">Shopping</option>
              <option value="Utilities">Utilities</option>
              <option value="Travel">Travel</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Education">Education</option>
              <option value="Others">Others</option>

            </select>

          </div>


          {/* Monthly Budget Amount */}

          <div className="budget-input-group">

            <label htmlFor="budget-amount">
              Monthly Limit (₹)
            </label>

            <input
              id="budget-amount"
              type="number"
              min="0.01"
              step="0.01"
              placeholder="Enter budget amount"
              value={budgetAmount}
              onChange={e => setBudgetAmount(e.target.value)}
            />

          </div>


          {/* Submit Button */}

          <button
            type="submit"
            className="create-budget-btn"
          >
            <span>+</span>
            Set Budget
          </button>

        </form>

      </div>


      {/* =====================================
          EXISTING MONTHLY BUDGETS
      ===================================== */}

      <div className="budget-list-section">

        <div className="budget-section-heading">

          <div className="budget-heading-content">

            <span className="budget-section-eyebrow">
              SPENDING OVERVIEW
            </span>

            <h2>Your Monthly Budgets</h2>

            <p>
              Track your spending against each category limit.
            </p>

          </div>

          <span className="budget-count">
            {budgetCount} {budgetCount === 1 ? 'Category' : 'Categories'}
          </span>

        </div>


        {/* Budget Cards */}

        <div className="budget-list">

          {budgetCount > 0 ? (

            Object.entries(budgets).map(([category, budget]) => {

              // Category Spending

              const spent = Number(categoryExpenses[category] || 0)

              const budgetValue = Number(budget)

              const remaining = budgetValue - spent


              // Budget Percentage

              const actualPercentage = budgetValue > 0
                ? (spent / budgetValue) * 100
                : 0

              const progressPercentage = Math.min(
                actualPercentage,
                100
              )


              // Budget Status

              const isOverBudget = spent > budgetValue

              const isNearLimit =
                actualPercentage >= 80 && !isOverBudget


              return (

                <div className="budget-card" key={category}>

                  {/* Card Header */}

                  <div className="budget-card-header">

                    <div className="budget-category-info">

                      <div className="budget-category-icon">
                        {categoryIcons[category] || '📦'}
                      </div>

                      <div>
                        <span className="budget-category-label">
                          CATEGORY
                        </span>

                        <h3>{category}</h3>
                      </div>

                    </div>

                    <span className="budget-category-symbol">
                      ₹
                    </span>

                  </div>


                  {/* Budget Amount Details */}

                  <div className="budget-amount-details">

                    <div>
                      <span>Monthly Limit</span>

                      <strong>
                        {formatCurrency(budgetValue)}
                      </strong>
                    </div>

                    <div>
                      <span>Spent</span>

                      <strong className="spent-amount">
                        {formatCurrency(spent)}
                      </strong>
                    </div>

                  </div>


                  {/* Budget Progress */}

                  <div className="budget-progress-heading">

                    <span>Budget Usage</span>

                    <strong>
                      {actualPercentage.toFixed(1)}%
                    </strong>

                  </div>


                  <div
                    className="budget-progress-bar"
                    role="progressbar"
                    aria-label={`${category} budget usage`}
                    aria-valuenow={Math.min(actualPercentage, 100)}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  >

                    <div
                      className={`budget-progress-fill ${
                        isOverBudget
                          ? 'danger-progress'
                          : isNearLimit
                            ? 'warning-progress'
                            : ''
                      }`}
                      style={{
                        width: `${progressPercentage}%`
                      }}
                    />

                  </div>


                  {/* Remaining Amount */}

                  <div className="budget-remaining">

                    <span>
                      {isOverBudget
                        ? 'Exceeded Amount'
                        : 'Remaining Amount'}
                    </span>

                    <strong
                      className={
                        isOverBudget
                          ? 'over-budget-text'
                          : 'remaining-text'
                      }
                    >
                      {formatCurrency(Math.abs(remaining))}
                    </strong>

                  </div>


                  {/* Budget Status */}

                  <div
                    className={`budget-status ${
                      isOverBudget
                        ? 'status-danger'
                        : isNearLimit
                          ? 'status-warning'
                          : 'status-success'
                    }`}
                  >

                    {isOverBudget
                      ? '⚠ Budget Exceeded'
                      : isNearLimit
                        ? '⚡ Approaching Budget Limit'
                        : '✓ Within Budget'}

                  </div>


                  {/* Delete Budget */}

                  <button
                    type="button"
                    className="delete-budget-btn"
                    onClick={() => handleDeleteBudget(category)}
                  >
                    <span>✕</span>
                    Delete Budget
                  </button>

                </div>

              )

            })

          ) : (

            /* Empty Budget State */

            <div className="empty-budget-state">

              <div className="empty-budget-icon">
                ₹
              </div>

              <h3>No Budgets Yet</h3>

              <p>
                Create your first monthly budget to start tracking your expenses.
              </p>

            </div>

          )}

        </div>

      </div>

    </div>

  )

}

export default BudgetsPage