import { useEffect, useRef, useState } from 'react'

function GoalForm({ onClose, onSave, goalToEdit = null }) {
  const [title, setTitle] = useState(goalToEdit?.title ?? '')
  const titleInputRef = useRef(null)
  useEffect(() => {
    titleInputRef.current?.focus()
  }, [])
  const [description, setDescription] = useState(goalToEdit?.description ?? '',)
  const [targetDate, setTargetDate] = useState(goalToEdit?.targetDate ?? '',)
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

    if (!trimmedTitle) {
      setError('Please enter a title for your learning goal.')
      return
    }
    if (targetDate) {
  const today = new Date()
  const todayString = `${today.getFullYear()}-${String(
    today.getMonth() + 1,
  ).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

  if (targetDate < todayString) {
    setError('The target date cannot be in the past.')
    return
  }
}


    onSave({
  id: goalToEdit?.id ?? crypto.randomUUID(),
  title: trimmedTitle,
  description: description.trim(),
  targetDate: targetDate || null,
  createdAt: goalToEdit?.createdAt ?? new Date().toISOString(),
})

  }

  return (
    <div className="modal-backdrop">
      <section
        className="goal-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="goal-form-heading"
      >
        <div className="modal-header">
          <div>
            <h2 id="goal-form-heading">{goalToEdit ? 'Edit learning goal' : 'Create a learning goal'}</h2>
            <p>Define what you want to learn.</p>
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
            <label htmlFor="goal-title">Goal title</label>
            <input
              id="goal-title"
              ref={titleInputRef}
              type="text"
              value={title}
              onChange={(event) => {
                setTitle(event.target.value)
                setError('')
              }}
              placeholder="e.g. Learn React fundamentals"
              maxLength={120}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="goal-description">
              Description <span>(optional)</span>
            </label>
            <textarea
              id="goal-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="What would you like to achieve?"
              rows={4}
              maxLength={1000}
            />
          </div>
          <div className="form-field">
  <label htmlFor="goal-target-date">
    Target date <span>(optional)</span>
  </label>
  <input
    id="goal-target-date"
    type="date"
    value={targetDate}
    onChange={(event) => setTargetDate(event.target.value)}
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

            <button className="button-primary" type="submit">
              {goalToEdit ? 'Update learning goal' : 'Save learning goal'}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default GoalForm
