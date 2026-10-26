import { useState } from 'react'
import './AuthPage.css'

function AuthPage({ onLogin, onForgotPassword }) {
  const [activeForm, setActiveForm] = useState('login')
  const [resetEmail, setResetEmail] = useState('')
  const [resetRequested, setResetRequested] = useState(false)
  const [resetToken, setResetToken] = useState('')
const [newPassword, setNewPassword] = useState('')
const [confirmNewPassword, setConfirmNewPassword] = useState('')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  function switchForm(form) {
    setActiveForm(form)
    setErrorMessage('')
    setPassword('')
    setConfirmPassword('')
  }

  function handleSubmit(event) {
    event.preventDefault()
    setErrorMessage('')

    const trimmedEmail = email.trim()

    if (!trimmedEmail) {
      setErrorMessage('Enter your email address.')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setErrorMessage('Enter a valid email address.')
      return
    }

    if (activeForm === 'signup' && !name.trim()) {
      setErrorMessage('Enter your name.')
      return
    }

    if (!password) {
      setErrorMessage('Enter your password.')
      return
    }

    if (password.length < 12) {
      setErrorMessage('Your password must be at least 12 characters long.')
      return
    }

    if (activeForm === 'signup' && password !== confirmPassword) {
      setErrorMessage('Your passwords do not match.')
      return
    }

    setErrorMessage(
      'The authentication service has not been connected yet. Your account has not been created.',
    )
  }

  return (
    <main className="auth-page">
      <section className="auth-card" aria-labelledby="auth-heading">
        {activeForm === 'reset' ? (
  <>
    <a className="auth-brand" href="#login" aria-label="LearnTrack home">
      <span className="auth-brand-mark">L</span>
      <span>LearnTrack</span>
    </a>

    <div className="auth-intro">
      <p className="auth-eyebrow">ACCOUNT RECOVERY</p>
      <h1>Reset your password</h1>
      <p>Choose a new password for your LearnTrack account.</p>
    </div>

    <form
      onSubmit={(event) => {
        event.preventDefault()
        setErrorMessage('')

        if (!resetToken) {
          setErrorMessage(
            'This reset link is invalid or expired. Please request a new one.',
          )
          return
        }

        if (newPassword.length < 12) {
          setErrorMessage(
            'Your password must be at least 12 characters long.',
          )
          return
        }

        if (newPassword !== confirmNewPassword) {
          setErrorMessage('Your passwords do not match.')
          return
        }

        setErrorMessage(
          'Password reset is not connected to the authentication service yet.',
        )
      }}
      noValidate
    >
      <div className="auth-field">
        <label htmlFor="new-password">New password</label>
        <input
          id="new-password"
          type="password"
          autoComplete="new-password"
          value={newPassword}
          onChange={(event) => setNewPassword(event.target.value)}
          placeholder="At least 12 characters"
          required
        />
      </div>

      <div className="auth-field">
        <label htmlFor="confirm-new-password">Confirm new password</label>
        <input
          id="confirm-new-password"
          type="password"
          autoComplete="new-password"
          value={confirmNewPassword}
          onChange={(event) => setConfirmNewPassword(event.target.value)}
          placeholder="Enter your new password again"
          required
        />
      </div>

      {errorMessage && (
        <p className="auth-error" role="alert">
          {errorMessage}
        </p>
      )}

      <button className="auth-submit" type="submit">
        Reset password
      </button>

      <p className="auth-switch">
        <button
          type="button"
          onClick={() => {
            setActiveForm('login')
            setErrorMessage('')
          }}
        >
          Back to log in
        </button>
      </p>
    </form>
  </>
) : activeForm === 'forgot' ? (
  <>
    <a className="auth-brand" href="#login" aria-label="LearnTrack home">
      <span className="auth-brand-mark">L</span>
      <span>LearnTrack</span>
    </a>

    <div className="auth-intro">
      <p className="auth-eyebrow">ACCOUNT RECOVERY</p>
      <h1>Forgot your password?</h1>
      <p>
        Enter the email address associated with your account.
        If an account matches, you'll receive instructions to reset
        your password.
      </p>
    </div>

    {resetRequested ? (
      <div role="status">
        <p>
          If an account matches that email address, a password-reset
          link will be sent to it.
        </p>

        <button
          className="auth-submit"
          type="button"
          onClick={() => {
            setActiveForm('login')
            setResetRequested(false)
            setErrorMessage('')
          }}
        >
          Back to log in
        </button>
      </div>
    ) : (
      <form
        onSubmit={(event) => {
          event.preventDefault()
          setErrorMessage('')

          if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resetEmail.trim())
          ) {
            setErrorMessage('Enter a valid email address.')
            return
          }

          setResetRequested(true)
        }}
        noValidate
      >
        <div className="auth-field">
          <label htmlFor="reset-email">Email address</label>
          <input
            id="reset-email"
            type="email"
            autoComplete="email"
            value={resetEmail}
            onChange={(event) => setResetEmail(event.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>

        {errorMessage && (
          <p className="auth-error" role="alert">
            {errorMessage}
          </p>
        )}

        <button className="auth-submit" type="submit">
          Request reset link
        </button>

        <p className="auth-switch">
          Remembered your password?{' '}
          <button
            type="button"
            onClick={() => {
              setActiveForm('login')
              setErrorMessage('')
              setResetRequested(false)
            }}
          >
            Back to log in
          </button>
        </p>
      </form>
    )}
  </>
) : (
  <>

        <a className="auth-brand" href="#login" aria-label="LearnTrack home">
          <span className="auth-brand-mark">L</span>
          <span>LearnTrack</span>
        </a>

        <div className="auth-intro">
          <p className="auth-eyebrow">YOUR LEARNING JOURNEY</p>

          <h1 id="auth-heading">
            {activeForm === 'login'
              ? 'Welcome back'
              : 'Create your account'}
          </h1>

          <p>
            {activeForm === 'login'
              ? 'Sign in to continue organising your learning.'
              : 'Create an account to start planning your learning.'}
          </p>
        </div>

        <div className="auth-tabs" aria-label="Authentication options">
          <button
            type="button"
            className={activeForm === 'login' ? 'active' : ''}
            onClick={() => switchForm('login')}
            aria-pressed={activeForm === 'login'}
          >
            Log in
          </button>

          <button
            type="button"
            className={activeForm === 'signup' ? 'active' : ''}
            onClick={() => switchForm('signup')}
            aria-pressed={activeForm === 'signup'}
          >
            Sign up
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {activeForm === 'signup' && (
            <div className="auth-field">
              <label htmlFor="auth-name">Full name</label>
              <input
                id="auth-name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>
          )}

          <div className="auth-field">
            <label htmlFor="auth-email">Email address</label>
            <input
              id="auth-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="auth-password">Password</label>
            <input
              id="auth-password"
              type="password"
              autoComplete={
                activeForm === 'login'
                  ? 'current-password'
                  : 'new-password'
              }
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="At least 8 characters"
              aria-describedby="password-requirement"
              required
            />

            {activeForm === 'signup' && (
              <p id="password-requirement" className="auth-hint">
                Use at least 8 characters.
              </p>
            )}
          </div>

          {activeForm === 'signup' && (
            <div className="auth-field">
              <label htmlFor="auth-confirm-password">
                Confirm password
              </label>
              <input
                id="auth-confirm-password"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(event.target.value)
                }
                placeholder="Enter your password again"
                required
              />
            </div>
          )}

          {activeForm === 'login' && (
            <button
              className="auth-forgot-link"
              type="button"
              onClick={() => {
                setActiveForm('forgot')
                setResetEmail('email')
                setResetRequested('false')
                setErrorMessage('')
              }}
            >
              Forgot password?
            </button>
          )}

          {errorMessage && (
            <p className="auth-error" role="alert">
              {errorMessage}
            </p>
          )}

          <button
            className="auth-submit"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? 'Please wait...'
              : activeForm === 'login'
                ? 'Log in'
                : 'Create account'}
          </button>
        </form>

        <p className="auth-switch">
          {activeForm === 'login'
            ? "Don't have an account?"
            : 'Already have an account?'}{' '}
          <button
            type="button"
            onClick={() =>
              switchForm(activeForm === 'login' ? 'signup' : 'login')
            }
          >
            {activeForm === 'login' ? 'Sign up' : 'Log in'}
          </button>
        </p>

        <p className="auth-footer">
          Small steps count. Keep moving towards your learning goals.
        </p>
        </>
)}
      </section>
    </main>
  )
}

export default AuthPage
