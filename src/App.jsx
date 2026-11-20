import { useState } from 'react'
import './App.css'

import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'

function App() {

  const [activePage, setActivePage] = useState('Dashboard')

  // Check Existing JWT Login Session
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => Boolean(localStorage.getItem('spendwiseToken'))
  )

  const [showSignup, setShowSignup] = useState(false)

  // Handle Successful Backend Login
  function handleLogin(token) {

    localStorage.setItem('spendwiseToken', token)

    localStorage.setItem('spendwiseLoggedIn', 'true')

    setIsLoggedIn(true)

  }

  // Handle Logout
  function handleLogout() {

    localStorage.removeItem('spendwiseToken')

    localStorage.removeItem('spendwiseLoggedIn')

    setIsLoggedIn(false)

    setActivePage('Dashboard')

  }

  return (
    <>

      {!isLoggedIn ? (

        showSignup ? (

          <SignupPage
            onSignup={() => {
              setShowSignup(false)
            }}
            onShowLogin={() => setShowSignup(false)}
          />

        ) : (

          <LoginPage
            onLogin={handleLogin}
            onShowSignup={() => setShowSignup(true)}
          />

        )

      ) : (

        <div className="app-container">

          <Sidebar
            activePage={activePage}
            setActivePage={setActivePage}
            onLogout={handleLogout}
          />

          <Dashboard
            activePage={activePage}
            onLogout={handleLogout}
          />

        </div>

      )}

    </>
  )
}

export default App