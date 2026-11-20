import { useState } from 'react'
import './LoginPage.css'

function LoginPage({ onLogin, onShowSignup }) {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  // Backend Login
  async function handleLogin(e) {
    e.preventDefault()

    if (!email.trim() || !password.trim()) {
      alert('Please enter email and password')
      return
    }

    try {

      setLoading(true)

      const response = await fetch(
        'http://localhost:8080/api/auth/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: email.trim(),
            password
          })
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Invalid email or password')
      }

      if (!data.token) {
        throw new Error('Authentication token not received')
      }

      // Save JWT token through App component
      onLogin(data.token)

    } catch (error) {

      console.error('Login Error:', error)
      alert(error.message || 'Unable to login. Please try again.')

    } finally {

      setLoading(false)

    }
  }

  return (
    <div className="login-page">

      <div className="login-card">

        <h1>SpendWise</h1>

        <p>Welcome back! Please login to your account.</p>

        <form onSubmit={handleLogin}>

          <label>Email Address</label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />

          <label>Password</label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>

        </form>

        <p className="login-signup-text">
          Don't have an account?{' '}
          <span onClick={onShowSignup}>
            Sign Up
          </span>
        </p>

      </div>

    </div>
  )
}

export default LoginPage