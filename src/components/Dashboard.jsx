import { useState, useEffect } from 'react'
import './Dashboard.css'
import DashboardPage from '../pages/DashboardPage'
import TransactionsPage from '../pages/TransactionsPage'
import BudgetsPage from '../pages/BudgetsPage'
import ReportsPage from '../pages/ReportsPage'
import ProfilePage from '../pages/ProfilePage'

const defaultTransactions = [
  {
    id: 1,
    description: 'Grocery Shopping',
    category: 'Food',
    date: '2026-11-16',
    amount: 2000,
    type: 'Expense'
  },
  {
    id: 2,
    description: 'Monthly Salary',
    category: 'Salary',
    date: '2026-11-15',
    amount: 30000,
    type: 'Income'
  },
  {
    id: 3,
    description: 'Electricity Bill',
    category: 'Utilities',
    date: '2026-11-14',
    amount: 1500,
    type: 'Expense'
  },
  {
    id: 4,
    description: 'Shopping',
    category: 'Shopping',
    date: '2026-11-12',
    amount: 3000,
    type: 'Expense'
  }
]

function Dashboard({ activePage = 'Dashboard', onLogout }) {
  // Load saved data
  const [savedData] = useState(() => {
    try {
      const data = localStorage.getItem('spendwiseData')
      return data ? JSON.parse(data) : null
    } catch {
      return null
    }
  })

  // Restore demo data only for the first initialization
  const shouldRestoreDemo = savedData?.restoreVersion !== 1

  // Transaction List
  const [transactions, setTransactions] = useState(() => {
    if (shouldRestoreDemo) {
      return defaultTransactions
    }

    return savedData.transactions ?? []
  })

  // Form States
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [amount, setAmount] = useState('')
  const [type, setType] = useState('')
  const [date, setDate] = useState('')

  // Edit State
  const [editingId, setEditingId] = useState(null)

  // Search and Filter States
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedType, setSelectedType] = useState('All')

  // Budget Management
  const [budgets, setBudgets] = useState(
    savedData?.budgets ?? {}
  )

  const [budgetCategory, setBudgetCategory] = useState('')
  const [budgetAmount, setBudgetAmount] = useState('')

  // Dashboard Summary
  const [totalIncome, setTotalIncome] = useState(
    shouldRestoreDemo ? 75000 : savedData.totalIncome ?? 75000
  )

  const [totalExpenses, setTotalExpenses] = useState(
    shouldRestoreDemo ? 25000 : savedData.totalExpenses ?? 25000
  )

  const [balance, setBalance] = useState(
    shouldRestoreDemo ? 50000 : savedData.balance ?? 50000
  )

  const [savings, setSavings] = useState(
    shouldRestoreDemo ? 25000 : savedData.savings ?? 25000
  )

  // Fetch Transactions from Backend
useEffect(() => {

  async function fetchTransactions() {

    try {

      const token = localStorage.getItem('spendwiseToken')

const response = await fetch(
  'http://localhost:8080/api/transactions',
  {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }
)

      if (!response.ok) {
        throw new Error('Failed to fetch transactions')
      }

      const data = await response.json()

      setTransactions(data)

      const income = data
        .filter(transaction => transaction.type === 'Income')
        .reduce((total, transaction) => total + Number(transaction.amount), 0)

      const expenses = data
        .filter(transaction => transaction.type === 'Expense')
        .reduce((total, transaction) => total + Number(transaction.amount), 0)

      setTotalIncome(income)
      setTotalExpenses(expenses)
      setBalance(income - expenses)
      setSavings(income - expenses)

    } catch (error) {

      console.error('Error fetching transactions:', error)
      alert('Unable to load transactions from backend')

    }

  }

  fetchTransactions()

}, [])

  // Save Data to Local Storage
  useEffect(() => {

    const dashboardData = {
      restoreVersion: 1,
      transactions,
      totalIncome,
      totalExpenses,
      balance,
      savings,
      budgets
    }

    localStorage.setItem(
      'spendwiseData',
      JSON.stringify(dashboardData)
    )

  }, [
    transactions,
    totalIncome,
    totalExpenses,
    balance,
    savings,
    budgets
  ])

  // Search and Filter Transactions
  const filteredTransactions = transactions.filter(transaction => {

    const matchesSearch =
      transaction.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase())

    const matchesCategory =
      selectedCategory === 'All' ||
      transaction.category === selectedCategory

    const matchesType =
      selectedType === 'All' ||
      transaction.type === selectedType

    return matchesSearch && matchesCategory && matchesType

  })

  // Monthly Expense Summary
  const currentDate = new Date()

  const currentMonth = `${currentDate.getFullYear()}-${String(
    currentDate.getMonth() + 1
  ).padStart(2, '0')}`

  const monthlyExpenses = transactions
    .filter(transaction =>
      transaction.type === 'Expense' &&
      transaction.date.startsWith(currentMonth)
    )
    .reduce(
      (total, transaction) => total + Number(transaction.amount),
      0
    )

  // Category-wise Monthly Expenses
  const categoryExpenses = transactions
    .filter(transaction =>
      transaction.type === 'Expense' &&
      transaction.date.startsWith(currentMonth)
    )
    .reduce((result, transaction) => {

      result[transaction.category] =
        (result[transaction.category] || 0) +
        Number(transaction.amount)

      return result

    }, {})

  // Reset Form
  function resetForm() {
    setDescription('')
    setCategory('')
    setAmount('')
    setType('')
    setDate('')
    setEditingId(null)
  }

  // Add or Update Transaction
async function handleAddTransaction(e) {

  e.preventDefault()

  if (!description.trim() || !category || !amount || !type || !date) {
    alert('Please fill all the fields')
    return
  }

  if (!Number.isFinite(Number(amount)) || Number(amount) <= 0) {
    alert('Please enter a valid amount')
    return
  }

  const newAmount = Number(amount)

  const transactionData = {
    description: description.trim(),
    category,
    amount: newAmount,
    type,
    date
  }

  try {

    // Edit Existing Transaction
    if (editingId !== null) {

      const oldTransaction = transactions.find(
        transaction => transaction.id === editingId
      )

      if (!oldTransaction) return

      const response = await fetch(
        `http://localhost:8080/api/transactions/${editingId}`,
        {
          method: 'PUT',
          headers: {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('spendwiseToken')}`
},
          body: JSON.stringify(transactionData)
        }
      )

      if (!response.ok) {
        throw new Error('Failed to update transaction')
      }

      const updatedTransaction = await response.json()

      setTransactions(prev =>
        prev.map(transaction =>
          transaction.id === editingId
            ? updatedTransaction
            : transaction
        )
      )

      if (oldTransaction.type === 'Income') {
        setTotalIncome(prev => prev - Number(oldTransaction.amount))
      } else {
        setTotalExpenses(prev => prev - Number(oldTransaction.amount))
      }

      if (type === 'Income') {
        setTotalIncome(prev => prev + newAmount)
      } else {
        setTotalExpenses(prev => prev + newAmount)
      }

      const oldValue =
        oldTransaction.type === 'Income'
          ? Number(oldTransaction.amount)
          : -Number(oldTransaction.amount)

      const newValue =
        type === 'Income'
          ? newAmount
          : -newAmount

      const difference = newValue - oldValue

      setBalance(prev => prev + difference)
      setSavings(prev => prev + difference)

      resetForm()

      alert('Transaction updated successfully!')
      return
    }

    // Add New Transaction
    const response = await fetch(
      'http://localhost:8080/api/transactions',
      {
        method: 'POST',
        headers: {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('spendwiseToken')}`
},
        body: JSON.stringify(transactionData)
      }
    )

    if (!response.ok) {
      throw new Error('Failed to add transaction')
    }

    const savedTransaction = await response.json()

    setTransactions(prev => [savedTransaction, ...prev])

    if (type === 'Income') {
      setTotalIncome(prev => prev + newAmount)
      setBalance(prev => prev + newAmount)
      setSavings(prev => prev + newAmount)
    } else {
      setTotalExpenses(prev => prev + newAmount)
      setBalance(prev => prev - newAmount)
      setSavings(prev => prev - newAmount)
    }

    resetForm()

    alert('Transaction added successfully!')

  } catch (error) {

    console.error('Transaction Error:', error)
    alert('Unable to save transaction. Please try again.')

  }

}

  // Edit Transaction
  function handleEditTransaction(transaction) {

    setEditingId(transaction.id)
    setDescription(transaction.description)
    setCategory(transaction.category)
    setAmount(String(transaction.amount))
    setType(transaction.type)
    setDate(transaction.date)

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })

  }

// Delete Transaction
async function handleDeleteTransaction(id) {

  const transactionToDelete = transactions.find(
    transaction => transaction.id === id
  )

  if (!transactionToDelete) return

  const confirmDelete = window.confirm(
    'Are you sure you want to delete this transaction?'
  )

  if (!confirmDelete) return

  try {

    const response = await fetch(
      `http://localhost:8080/api/transactions/${id}`,
      {
  method: 'DELETE',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('spendwiseToken')}`
  }
}
    )

    if (!response.ok) {
      throw new Error('Failed to delete transaction')
    }

    setTransactions(prev =>
      prev.filter(transaction => transaction.id !== id)
    )

    if (transactionToDelete.type === 'Income') {

      setTotalIncome(prev => prev - Number(transactionToDelete.amount))
      setBalance(prev => prev - Number(transactionToDelete.amount))
      setSavings(prev => prev - Number(transactionToDelete.amount))

    } else {

      setTotalExpenses(prev => prev - Number(transactionToDelete.amount))
      setBalance(prev => prev + Number(transactionToDelete.amount))
      setSavings(prev => prev + Number(transactionToDelete.amount))

    }

    if (editingId === id) {
      resetForm()
    }

    alert('Transaction deleted successfully!')

  } catch (error) {

    console.error('Delete Transaction Error:', error)
    alert('Unable to delete transaction. Please try again.')

  }

}

  // Clear Search and Filters
  function clearFilters() {
    setSearchTerm('')
    setSelectedCategory('All')
    setSelectedType('All')
  }

  // Export Transactions to CSV
function handleExportTransactions() {

  if (filteredTransactions.length === 0) {
    alert('No transactions available to export')
    return
  }

  const headers = [
    'Description',
    'Category',
    'Date',
    'Amount',
    'Type'
  ]

  const csvRows = filteredTransactions.map(transaction => [
    transaction.description,
    transaction.category,
    transaction.date,
    transaction.amount,
    transaction.type
  ])

  const csvContent = [
    headers,
    ...csvRows
  ]
    .map(row =>
      row.map(value =>
        `"${String(value).replace(/"/g, '""')}"`
      ).join(',')
    )
    .join('\n')

  const blob = new Blob(
    ['\uFEFF' + csvContent],
    { type: 'text/csv;charset=utf-8;' }
  )

  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = 'SpendWise_Transactions.csv'
  link.click()

  URL.revokeObjectURL(url)

  alert('Transactions exported successfully!')
}

  // Set Monthly Budget
  function handleSetBudget(e) {

    e.preventDefault()

    if (!budgetCategory || !budgetAmount) {
      alert('Please select a category and enter a budget amount')
      return
    }

    const amount = Number(budgetAmount)

    if (!Number.isFinite(amount) || amount <= 0) {
      alert('Please enter a valid budget amount')
      return
    }

    setBudgets(prev => ({
      ...prev,
      [budgetCategory]: amount
    }))

    setBudgetCategory('')
    setBudgetAmount('')

    alert('Monthly budget saved successfully!')
  }

  // Delete Budget
  function handleDeleteBudget(category) {

    const confirmDelete = window.confirm(
      `Are you sure you want to delete the ${category} budget?`
    )

    if (confirmDelete) {

      setBudgets(prev => {

        const updatedBudgets = { ...prev }

        delete updatedBudgets[category]

        return updatedBudgets
      })

      alert('Budget deleted successfully!')
    }
  }

  return (

    <div className="dashboard">

        {/* Dashboard Page */}

      {activePage === 'Dashboard' && (
        <DashboardPage
          balance={balance}
          totalIncome={totalIncome}
          totalExpenses={totalExpenses}
          savings={savings}
          monthlyExpenses={monthlyExpenses}
          categoryExpenses={categoryExpenses}
          transactions={transactions}
        />
      )}

{/* Reports Page */}

{activePage === 'Reports' && (
  <ReportsPage
    transactions={transactions}
    totalIncome={totalIncome}
  />
)}

{/* Profile Page */}

{activePage === 'Profile' && (
  <ProfilePage />
)}

  {/* Budget Management */}
{activePage === 'Budgets' && (
  <BudgetsPage
    budgets={budgets}
    categoryExpenses={categoryExpenses}
    budgetCategory={budgetCategory}
    setBudgetCategory={setBudgetCategory}
    budgetAmount={budgetAmount}
    setBudgetAmount={setBudgetAmount}
    handleSetBudget={handleSetBudget}
    handleDeleteBudget={handleDeleteBudget}
  />
)}    

      {/* Add / Edit Transaction */}
      {(activePage === 'Dashboard' || activePage === 'Transactions') && (
  <div className="add-transaction-section">

        <h2>
          {editingId !== null
            ? 'Edit Transaction'
            : 'Add New Transaction'}
        </h2>

        <form
          className="transaction-form"
          onSubmit={handleAddTransaction}
        >

          <input
            type="text"
            placeholder="Transaction Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />

          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
          >

            <option value="">Select Category</option>
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

          <input
            type="number"
            placeholder="Enter Amount"
            min="0.01"
            step="0.01"
            value={amount}
            onChange={e => setAmount(e.target.value)}
          />

          <select
            value={type}
            onChange={e => setType(e.target.value)}
          >

            <option value="">Select Type</option>
            <option value="Income">Income</option>
            <option value="Expense">Expense</option>

          </select>

          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
          />

          <button type="submit">
            {editingId !== null
              ? 'Update Transaction'
              : 'Add Transaction'}
          </button>

          {editingId !== null && (

            <button
              type="button"
              className="cancel-btn"
              onClick={resetForm}
            >
              Cancel Edit
            </button>

          )}

        </form>

      </div>
      )}

{/* Transactions Page */}

{activePage === 'Transactions' && (
  <TransactionsPage
    filteredTransactions={filteredTransactions}
    searchTerm={searchTerm}
    setSearchTerm={setSearchTerm}
    selectedCategory={selectedCategory}
    setSelectedCategory={setSelectedCategory}
    selectedType={selectedType}
    setSelectedType={setSelectedType}
    clearFilters={clearFilters}
    handleExportTransactions={handleExportTransactions}
    handleEditTransaction={handleEditTransaction}
    handleDeleteTransaction={handleDeleteTransaction}
  />
)}

    </div>

  )
}

export default Dashboard
