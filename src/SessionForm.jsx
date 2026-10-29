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

function getDateInTimeZone(dateTime, timeZone) {
  const [datePart, timePart] = dateTime.split('T')
  const [year, month, day] = datePart.split('-').map(Number)
  const [hour, minute] = timePart.split(':').map(Number)

  const desiredTime = Date.UTC(year, month - 1, day, hour, minute)
  let timestamp = desiredTime

  for (let i = 0; i < 3; i++) {
    const parts = new Intl.DateTimeFormat('en-GB', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    }).formatToParts(new Date(timestamp))

    const values = Object.fromEntries(
      parts.map(({ type, value }) => [type, value]),
    )

    const representedTime = Date.UTC(
      Number(values.year),
      Number(values.month) - 1,
      Number(values.day),
      Number(values.hour),
      Number(values.minute),
    )

    const difference = desiredTime - representedTime

    if (difference === 0) break

    timestamp += difference
  }

  const result = new Date(timestamp)

  const formatted = new Intl.DateTimeFormat('en-GB', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).format(result)

  const [resultDay, resultMonth, resultYear, resultHour, resultMinute] =
    formatted.match(/\d+/g).map(Number)

  if (
    resultYear !== year ||
    resultMonth !== month ||
    resultDay !== day ||
    resultHour !== hour ||
    resultMinute !== minute
  ) {
    throw new Error(
      'That start time is invalid in the selected time zone. Please choose another time.',
    )
  }

  return result
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

const [timeZone, setTimeZone] = useState(
  sessionToEdit?.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone,
)

const [durationMinutes, setDurationMinutes] = useState(
  sessionToEdit?.startTime && sessionToEdit?.endTime
    ? (new Date(sessionToEdit.endTime) - new Date(sessionToEdit.startTime)) / 60000
    : 60,
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

    if (!startTime || durationMinutes === '') {
      setError('Please select a start time and enter a session duration.')
      return
    }

    let start

try {
  start = getDateInTimeZone(startTime, timeZone)
} catch (error) {
  setError(error.message)
  return
}

    const duration = Number(durationMinutes)
    const end = new Date(start.getTime() + duration * 60000)

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      setError('Please enter valid session dates and times.')
      return
    }

    if (start <= new Date()) {
      setError('The session start time must be in the future.')
      return
    }

if (
  durationMinutes === '' ||
  !Number.isInteger(duration) ||
  duration < 1 ||
  duration > 1440
) {
  setError('Session duration must be a whole number between 1 and 1440 minutes.')
  return
}




    onSave({
  id: sessionToEdit?.id || crypto.randomUUID(),
  goalId,
  title: trimmedTitle,
  startTime: start.toISOString(),
  timeZone,
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
  <label htmlFor="session-time-zone">Time zone</label>
  <select
    id="session-time-zone"
    value={timeZone}
    onChange={(event) => {
      setTimeZone(event.target.value)
      setError('')
    }}
    required
  >
    {[...new Set([
      timeZone,
      'Africa/Lagos',
      'Europe/London',
      'America/New_York',
      'America/Los_Angeles',
      'Asia/Dubai',
      'Asia/Kolkata',
      'Asia/Tokyo',
      'Australia/Sydney',
      'UTC',
    ])].map((zone) => (
      <option key={zone} value={zone}>
        {zone.replaceAll('_', ' ')}
      </option>
    ))}
  </select>
</div>


          <div className="form-field">
  <label htmlFor="session-duration">Duration (minutes)</label>
  <input
    id="session-duration"
    type="number"
    min="1"
    max="1440"
    step="1"
    value={durationMinutes}
    onChange={(event) => {
      setDurationMinutes(event.target.value)
      setError('')
    }}
    required
  />
  <small>Enter a duration between 1 minute and 24 hours.</small>
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
