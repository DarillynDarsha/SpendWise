// Transactions Page Styles
import './TransactionsPage.css'
function TransactionsPage({
  filteredTransactions,
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  selectedType,
  setSelectedType,
  clearFilters,
  handleExportTransactions,
  handleEditTransaction,
  handleDeleteTransaction
}) {
  return (
    <div className="transactions-section">

      <h2>Recent Transactions</h2>

      <button
        type="button"
        className="export-btn"
        onClick={handleExportTransactions}
      >
        Export Transactions
      </button>

      {/* Search and Filter */}
      <div className="filter-container">

        <input
          type="text"
          placeholder="Search transactions..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="search-input"
        />

        <select
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
          className="filter-select"
        >
          <option value="All">All Categories</option>
          <option value="Food">Food</option>
          <option value="Shopping">Shopping</option>
          <option value="Salary">Salary</option>
          <option value="Utilities">Utilities</option>
          <option value="Travel">Travel</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Healthcare">Healthcare</option>
          <option value="Education">Education</option>
          <option value="Others">Others</option>
        </select>

        <select
          value={selectedType}
          onChange={e => setSelectedType(e.target.value)}
          className="filter-select"
        >
          <option value="All">All Types</option>
          <option value="Income">Income</option>
          <option value="Expense">Expense</option>
        </select>

        <button
          type="button"
          className="clear-filter-btn"
          onClick={clearFilters}
        >
          Clear Filters
        </button>

      </div>

      {/* Transactions Table */}
      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th>Category</th>
            <th>Date</th>
            <th>Amount</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map(transaction => (
              <tr key={transaction.id}>
                <td>{transaction.description}</td>
                <td>{transaction.category}</td>
                <td>{transaction.date}</td>

                <td className={
                  transaction.type === 'Income' ? 'income' : 'expense'
                }>
                  {transaction.type === 'Income' ? '+' : '-'}
                  ₹{Number(transaction.amount).toLocaleString('en-IN')}
                </td>

                <td>
                  <button
                    type="button"
                    className="edit-btn"
                    onClick={() => handleEditTransaction(transaction)}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="delete-btn"
                    onClick={() => handleDeleteTransaction(transaction.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">
                No transactions available.
              </td>
            </tr>
          )}
        </tbody>
      </table>

    </div>
  )
}

export default TransactionsPage