import { useState } from 'react'
import './SignupPage.css'

function SignupPage({ onSignup, onShowLogin }) {

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  // Backend Registration
  async function handleSignup(e) {

    e.preventDefault()

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      alert('Please fill all the fields')
      return
    }

    if (password.length < 8) {
      alert('Password must contain at least 8 characters')
      return
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match')
      return
    }

    try {

      setLoading(true)

      const response = await fetch(
        'http://localhost:8080/api/auth/signup',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            password: password
          })
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed')
      }

      alert('Account created successfully! Please login.')

      onSignup()

    } catch (error) {

      console.error('Signup Error:', error)
      alert(error.message || 'Unable to create account')

    } finally {

      setLoading(false)

    }
  }

  return (
    <div className="signup-page">

      <div className="signup-card">

        <h1>SpendWise</h1>

        <p>Create your account to get started.</p>

        <form onSubmit={handleSignup}>

          <label>Full Name</label>

          <input
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={e => setName(e.target.value)}
          />

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
            placeholder="Create a password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          <label>Confirm Password</label>

          <input
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
          />

          <button type="submit" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>

        </form>

        <p className="signup-login-text">
          Already have an account?{' '}
          <span onClick={onShowLogin}>
            Login
          </span>
        </p>

      </div>

    </div>
  )
}

export default SignupPage