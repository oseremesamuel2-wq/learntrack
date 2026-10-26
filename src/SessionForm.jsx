import { useEffect, useRef, useState } from 'react'

function toDateTimeLocalValue(value) {
  if (!value) return ''

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return ''

  const offset = date.getTimezoneOffset() * 60000

  return new Date(date.getTime() - offset)
    .toISOString()
    .slice(0, 16)
}


function SessionForm({ goals, onClose, onSave, sessionToEdit = null, }) {
    const [goalId, setGoalId] = useState(
  sessionToEdit?.goalId || goals[0]?.id || '',
)

const [title, setTitle] = useState(sessionToEdit?.title || '')
const titleInputRef = useRef(null)
useEffect(() => {
  titleInputRef.current?.focus()
}, [])

const [startTime, setStartTime] = useState(
  toDateTimeLocalValue(sessionToEdit?.startTime),
)

const [endTime, setEndTime] = useState(
  toDateTimeLocalValue(sessionToEdit?.endTime),
)

  const [error, setError] = useState('')
  useEffect(() => {
  function handleKeyDown(event) {
    if (event.key === 'Escape') {
      onClose()
    }
  }

  document.addEventListener('keydown', handleKeyDown)

  return () => {
    document.removeEventListener('keydown', handleKeyDown)
  }
}, [onClose])


  function handleSubmit(event) {
    event.preventDefault()

    const trimmedTitle = title.trim()

    if (!goalId) {
      setError('Please select a learning goal.')
      return
    }

    if (!trimmedTitle) {
      setError('Please enter a title for your study session.')
      return
    }

    if (!startTime || !endTime) {
      setError('Please select both a start time and an end time.')
      return
    }

    const start = new Date(startTime)
    const end = new Date(endTime)

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      setError('Please enter valid session dates and times.')
      return
    }

    if (start <= new Date()) {
      setError('The session start time must be in the future.')
      return
    }

    if (end <= start) {
      setError('The end time must be after the start time.')
      return
    }
    const durationMinutes = (end.getTime() - start.getTime()) / 60000

if (durationMinutes < 1 || durationMinutes > 1440) {
  setError('Session duration must be between 1 minute and 24 hours.')
  return
}


    onSave({
  id: sessionToEdit?.id || crypto.randomUUID(),
  goalId,
  title: trimmedTitle,
  startTime: start.toISOString(),
  endTime: end.toISOString(),
  status: sessionToEdit ? 'scheduled' : 'scheduled',
  createdAt: sessionToEdit?.createdAt || new Date().toISOString(),
})

  }

  return (
    <div className="modal-backdrop">
      <section
        className="goal-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="session-form-heading"
      >
        <div className="modal-header">
          <div>
            <h2 id="session-form-heading">Schedule a study session</h2>
            <p>Choose a learning goal and plan your study time.</p>
          </div>

          <button
            className="modal-close"
            type="button"
            onClick={onClose}
            aria-label="Close form"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="session-goal">Learning goal</label>

            <select
              id="session-goal"
              value={goalId}
              onChange={(event) => {
                setGoalId(event.target.value)
                setError('')
              }}
              required
            >
              <option value="">Select a learning goal</option>

              {goals.map((goal) => (
                <option key={goal.id} value={goal.id}>
                  {goal.title}
                </option>
              ))}
            </select>

            {goals.length === 0 && (
              <p className="form-error">
                Create a learning goal before scheduling a session.
              </p>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="session-title">Session title</label>

            <input
              id="session-title"
              ref={titleInputRef}
              type="text"
              value={title}
              onChange={(event) => {
                setTitle(event.target.value)
                setError('')
              }}
              placeholder="e.g. Study React components"
              maxLength={100}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="session-start">Start date and time</label>

            <input
              id="session-start"
              type="datetime-local"
              value={startTime}
              onChange={(event) => {
                setStartTime(event.target.value)
                setError('')
              }}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="session-end">End date and time</label>

            <input
              id="session-end"
              type="datetime-local"
              value={endTime}
              onChange={(event) => {
                setEndTime(event.target.value)
                setError('')
              }}
              required
            />
          </div>

          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}

          <div className="modal-actions">
            <button
              className="button-secondary"
              type="button"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              className="button-primary"
              type="submit"
              disabled={goals.length === 0}
            >
              Schedule session
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default SessionForm
