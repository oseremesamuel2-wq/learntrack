import { useEffect, useState } from 'react'
import GoalForm from './GoalForm.jsx'
import SessionForm from './SessionForm.jsx'
import EditSessionTitleForm from './EditSessionTitleForm.jsx'
import './App.css'

const navigationItems = [
  { label: 'Dashboard', icon: '▦' },
  { label: 'Learning Goals', icon: '◎' },
  { label: 'Session History', icon: '◷' },
  { label: 'Settings', icon: '⚙' },
]

function loadStoredData(key) {
  try {
    const savedData = localStorage.getItem(key)

    if (!savedData) return []

    const parsedData = JSON.parse(savedData)

    return Array.isArray(parsedData) ? parsedData : []
  } catch (error) {
    console.error(`Could not load ${key}:`, error)
    return []
  }
}

function App() {
  const [activePage, setActivePage] = useState('Dashboard')
  const [showGoalForm, setShowGoalForm] = useState(false)
  const [showSessionForm, setShowSessionForm] = useState(false)
  const [sessionToReschedule, setSessionToReschedule] = useState(null)
  const [sessionToEditTitle, setSessionToEditTitle] = useState(null)

  const [goals, setGoals] = useState(() =>
    loadStoredData('learntrack-goals'),
  )

  const [sessions, setSessions] = useState(() =>
    loadStoredData('learntrack-sessions'),
  )

  const [successMessage, setSuccessMessage] = useState('')

  const [, setClock] = useState(Date.now())

useEffect(() => {
  const timer = setInterval(() => {
    setClock(Date.now())
  }, 60000)

  return () => clearInterval(timer)
}, [])


  useEffect(() => {
    try {
      localStorage.setItem('learntrack-goals', JSON.stringify(goals))
    } catch (error) {
      console.error('Could not save learning goals:', error)
    }
  }, [goals])

  useEffect(() => {
    try {
      localStorage.setItem('learntrack-sessions', JSON.stringify(sessions))
    } catch (error) {
      console.error('Could not save study sessions:', error)
    }
  }, [sessions])

  function handleSaveGoal(newGoal) {
    setGoals((currentGoals) => [...currentGoals, newGoal])
    setShowGoalForm(false)
    setSuccessMessage('Your learning goal has been created successfully.')
  }

  function handleSaveSession(newSession) {
    setSessions((currentSessions) => {
      const sessionExists = currentSessions.some(
        (session) => session.id === newSession.id,
      )

      if (sessionExists) {
        return currentSessions.map((session) =>
          session.id === newSession.id ? newSession : session,
        )
      }

      return [...currentSessions, newSession]
    })

    setShowSessionForm(false)
    setSessionToReschedule(null)
    setSuccessMessage('Your study session has been saved successfully.')
  }

  function handleSaveSessionTitle(updatedSession) {
    setSessions((currentSessions) =>
      currentSessions.map((session) =>
        session.id === updatedSession.id ? updatedSession : session,
      ),
    )

    setSessionToEditTitle(null)
    setSuccessMessage('Session title updated successfully.')
  }

  function handleRescheduleSession(session) {
    setSessionToReschedule(session)
    setShowSessionForm(true)
    setSuccessMessage('')
  }

  function handleCompleteSession(sessionId) {
    setSessions((currentSessions) =>
      currentSessions.map((session) =>
        session.id === sessionId
          ? { ...session, status: 'completed' }
          : session,
      ),
    )

    setSuccessMessage('Study session marked as completed.')
  }

  function handleUndoCompletion(sessionId) {
    setSessions((currentSessions) =>
      currentSessions.map((session) => {
        if (session.id !== sessionId) {
          return session
        }

        const now = new Date()
        const start = new Date(session.startTime)
        const end = new Date(session.endTime)

        let status = 'scheduled'

        if (now >= end) {
          status = 'overdue'
        } else if (now >= start) {
          status = 'in-progress'
        }

        return { ...session, status }
      }),
    )

    setSuccessMessage('Session completion has been undone.')
  }

  function handleCancelSession(sessionId) {
  const confirmed = window.confirm(
    'Are you sure you want to cancel this study session? Cancelled sessions are excluded from your progress calculation, and this action cannot be undone.',
  )

  if (!confirmed) return

  setSessions((currentSessions) =>
    currentSessions.map((session) =>
      session.id === sessionId
        ? { ...session, status: 'cancelled' }
        : session,
    ),
  )

  setSuccessMessage('Study session cancelled successfully.')
}


  function openGoalForm() {
    setShowGoalForm(true)
    setShowSessionForm(false)
    setSessionToReschedule(null)
    setSuccessMessage('')
  }

  function openSessionForm() {
    if (goals.length === 0) {
      setSuccessMessage(
        'Create a learning goal before scheduling a session.',
      )
      return
    }

    setShowSessionForm(true)
    setShowGoalForm(false)
    setSessionToEditTitle(null)
    setSuccessMessage('')
  }

  return (
    <div className="app">
      <div className="app-layout">
        <aside className="sidebar">
          <a
            className="brand"
            href="#dashboard"
            aria-label="LearnTrack home"
            onClick={() => {
              setActivePage('Dashboard')
              setSuccessMessage('')
            }}
          >
            <span className="brand-mark">L</span>
            <span>LearnTrack</span>
          </a>

          <nav className="sidebar-nav" aria-label="Main navigation">
            {navigationItems.map((item) => (
              <button
                key={item.label}
                type="button"
                className={`nav-link ${
                  activePage === item.label ? 'active' : ''
                }`}
                onClick={() => {
                  setActivePage(item.label)
                  setSuccessMessage('')
                  setShowGoalForm(false)
                  setShowSessionForm(false)
                  setSessionToReschedule(null)
                  setSessionToEditTitle(null)
                }}
                aria-current={
                  activePage === item.label ? 'page' : undefined
                }
              >
                <span className="nav-icon" aria-hidden="true">
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="sidebar-note">
            <strong>Small steps count.</strong>
            <p>
              Build a learning routine that works for you, one session at a
              time.
            </p>
          </div>
        </aside>

        <main className="main-area">
          <header className="topbar">
            <div>
              <h1 className="page-heading">{activePage}</h1>
              <p className="page-subtitle">
                Keep your learning plans organised and on track.
              </p>
            </div>

            <button className="profile-button" type="button">
              <span className="avatar" aria-hidden="true">
                S
              </span>
              <span className="profile-name">Student</span>
            </button>
          </header>

          <div className="dashboard-content">
            {successMessage && (
              <p className="success-message" role="status">
                {successMessage}
              </p>
            )}

            {activePage === 'Dashboard' ? (
              <Dashboard
                goals={goals}
                sessions={sessions}
                onCreateGoal={openGoalForm}
                onScheduleSession={openSessionForm}
                onCompleteSession={handleCompleteSession}
                onUndoCompletion={handleUndoCompletion}
                onCancelSession={handleCancelSession}
                onRescheduleSession={handleRescheduleSession}
                onEditSessionTitle={(session) => {
                  setSessionToEditTitle(session)
                  setSuccessMessage('')
                }}
              />
            ) : activePage === 'Learning Goals' ? (
              <LearningGoals
                goals={goals}
                onCreateGoal={openGoalForm}
              />
            ) : activePage === 'Session History' ? (
              <SessionHistory sessions={sessions} goals={goals} />
            ) : activePage === 'Settings' ? (
              <PagePlaceholder page="Settings" />
            ) : null}

            {showGoalForm && (
              <GoalForm
                onClose={() => setShowGoalForm(false)}
                onSave={handleSaveGoal}
              />
            )}

            {(showSessionForm || sessionToReschedule) && (
              <SessionForm
                goals={goals}
                onClose={() => {
                  setShowSessionForm(false)
                  setSessionToReschedule(null)
                }}
                onSave={handleSaveSession}
                sessionToEdit={sessionToReschedule}
              />
            )}

            {sessionToEditTitle && (
              <EditSessionTitleForm
                session={sessionToEditTitle}
                onClose={() => setSessionToEditTitle(null)}
                onSave={handleSaveSessionTitle}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

function Dashboard({
  goals,
  sessions,
  onCreateGoal,
  onScheduleSession,
  onCompleteSession,
  onUndoCompletion,
  onCancelSession,
  onRescheduleSession,
  onEditSessionTitle,
}) {
  const now = new Date()

  const upcomingSessions = sessions.filter(
    (session) =>
      session.status !== 'cancelled' &&
      session.status !== 'completed' &&
      new Date(session.startTime) > now,
  )

  const completedSessions = sessions.filter(
    (session) => session.status === 'completed',
  )

  const eligibleSessions = sessions.filter(
    (session) => session.status !== 'cancelled',
  )

  const completedEligibleSessions = eligibleSessions.filter(
    (session) => session.status === 'completed',
  )

  const progressPercentage =
    eligibleSessions.length > 0
      ? Math.round(
          (completedEligibleSessions.length / eligibleSessions.length) *
            100,
        )
      : null

  return (
    <>
      <section className="welcome-panel">
        <div>
          <h2>Your learning journey, your pace.</h2>

          <p>
            Set meaningful learning goals, plan your study sessions, and keep
            track of the progress you make along the way.
          </p>

          <button
            className="button-primary"
            type="button"
            onClick={onCreateGoal}
          >
            + Create a learning goal
          </button>

          <button
            className="button-secondary"
            type="button"
            onClick={onScheduleSession}
          >
            + Schedule a study session
          </button>
        </div>

        <div className="welcome-decoration" aria-hidden="true">
          📚
        </div>
      </section>

      <section aria-labelledby="overview-heading">
        <div className="section-heading">
          <h2 id="overview-heading">Your overview</h2>
          <span className="muted-text">Your learning activity</span>
        </div>

        <div className="stats-grid">
          <StatCard
            label="Learning goals"
            value={goals.length}
            description="Goals you're working towards"
          />

          <StatCard
            label="Upcoming sessions"
            value={upcomingSessions.length}
            description="Sessions planned ahead"
          />

          <StatCard
            label="Planned sessions completed"
            value={
              progressPercentage === null
                ? '—'
                : `${progressPercentage}%`
            }
            description={
              progressPercentage === null
                ? 'No active sessions planned'
                : `${completedSessions.length} of ${eligibleSessions.length} eligible sessions completed`
            }
          />
        </div>
      </section>

      <section aria-labelledby="sessions-heading">
        <div className="section-heading">
          <h2 id="sessions-heading">Your study sessions</h2>

          {sessions.length > 0 && (
            <button
              className="button-secondary"
              type="button"
              onClick={onScheduleSession}
            >
              + Schedule session
            </button>
          )}
        </div>

        <div className="content-card">
          {sessions.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon" aria-hidden="true">
                🗓️
              </div>

              <h3>No sessions planned yet</h3>

              <p>
                Schedule a study session to turn one of your learning goals
                into a practical plan.
              </p>

              {goals.length === 0 ? (
                <button
                  className="button-primary"
                  type="button"
                  onClick={onCreateGoal}
                >
                  Create your first learning goal
                </button>
              ) : (
                <button
                  className="button-primary"
                  type="button"
                  onClick={onScheduleSession}
                >
                  Schedule your first session
                </button>
              )}
            </div>
          ) : (
            <div className="goal-list">
              {sessions.map((session) => {
                const goal = goals.find(
                  (item) => item.id === session.goalId,
                )

                return (
                  <article className="goal-item" key={session.id}>
                    <h3>{session.title}</h3>

                    <p>
                      <strong>Learning goal:</strong>{' '}
                      {goal?.title || 'Goal unavailable'}
                    </p>

                    <p>
                      <strong>Starts:</strong>{' '}
                      {formatDateTime(session.startTime)}
                    </p>

                    <p>
                      <strong>Ends:</strong>{' '}
                      {formatDateTime(session.endTime)}
                    </p>

                    <p className="muted-text">
                      {getSessionStatus(session)}
                    </p>

                                        {session.status !== 'cancelled' && (
                      <>
                        {session.status === 'completed' ? (
                          <button
                            className="button-primary"
                            type="button"
                            onClick={() => onUndoCompletion(session.id)}
                          >
                            Undo completion
                          </button>
                        ) : (
                          <>
                            <button
                              className="button-primary"
                              type="button"
                              onClick={() => onCompleteSession(session.id)}
                            >
                              Complete session
                            </button>

                            <button
                              className="button-secondary"
                              type="button"
                              onClick={() => onRescheduleSession(session)}
                            >
                              Reschedule
                            </button>

                            <button
                              className="button-secondary"
                              type="button"
                              onClick={() => onEditSessionTitle(session)}
                            >
                              Edit title
                            </button>

                            <button
                              className="button-secondary"
                              type="button"
                              onClick={() => onCancelSession(session.id)}
                            >
                              Cancel session
                            </button>
                          </>
                        )}
                      </>
                    )}


                  </article>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </>
  )
}

function LearningGoals({ goals, onCreateGoal }) {
  return (
    <section className="content-card">
      <div className="section-heading">
        <h2>Your learning goals</h2>

        <button
          className="button-primary"
          type="button"
          onClick={onCreateGoal}
        >
          + Create a learning goal
        </button>
      </div>

      {goals.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon" aria-hidden="true">
            🎯
          </div>

          <h3>No learning goals yet</h3>

          <p>
            Create your first goal to give your learning sessions a clear
            direction.
          </p>
        </div>
      ) : (
        <div className="goal-list">
          {goals.map((goal) => (
            <article className="goal-item" key={goal.id}>
              <h3>{goal.title}</h3>

              {goal.description && <p>{goal.description}</p>}

              <p className="muted-text">Learning goal</p>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

function SessionHistory({ sessions, goals }) {
  const now = new Date()

  const pastSessions = sessions.filter(
    (session) =>
      new Date(session.endTime) <= now ||
      session.status === 'completed' ||
      session.status === 'cancelled',
  )

  return (
    <section className="content-card">
      <div className="section-heading">
        <h2>Session history</h2>
      </div>

      {pastSessions.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon" aria-hidden="true">
            ◷
          </div>

          <h3>No past sessions</h3>

          <p>
            Completed and cancelled sessions, along with sessions whose
            scheduled end times have passed, will appear here.
          </p>
        </div>
      ) : (
        <div className="goal-list">
          {pastSessions.map((session) => {
            const goal = goals.find(
              (item) => item.id === session.goalId,
            )

            return (
              <article className="goal-item" key={session.id}>
                <h3>{session.title}</h3>

                <p>
                  <strong>Learning goal:</strong>{' '}
                  {goal?.title || 'Goal unavailable'}
                </p>

                <p>
                  <strong>Scheduled:</strong>{' '}
                  {formatDateTime(session.startTime)}
                </p>

                <p className="muted-text">
                  {getSessionStatus(session)}
                </p>
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}

function getSessionStatus(session) {
  if (session.status === 'completed') return 'Completed'
  if (session.status === 'cancelled') return 'Cancelled'

  const now = new Date()
  const start = new Date(session.startTime)
  const end = new Date(session.endTime)

  if (
    Number.isNaN(start.getTime()) ||
    Number.isNaN(end.getTime()) ||
    end <= start
  ) {
    return 'Invalid schedule'
  }

  if (now < start) return 'Upcoming'
  if (now < end) return 'In progress'

  return 'Overdue — completion not yet recorded'
}

function formatDateTime(value) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return 'Invalid date'
  }

  return date.toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

function StatCard({ label, value, description }) {
  return (
    <article className="stat-card">
      <p className="stat-label">{label}</p>
      <p className="stat-value">{value}</p>
      <p className="stat-description">{description}</p>
    </article>
  )
}

function PagePlaceholder({ page }) {
  const descriptions = {
    Settings: 'Manage your learning preferences and account settings.',
  }

  return (
    <section className="content-card">
      <div className="empty-state">
        <div className="empty-state-icon" aria-hidden="true">
          ⚙
        </div>

        <h2>{page}</h2>

        <p>
          {descriptions[page] || 'Your learning workspace will appear here.'}
        </p>
      </div>
    </section>
  )
}

export default App
