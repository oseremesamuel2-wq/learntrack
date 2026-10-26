import { useEffect, useState } from 'react'

function EditSessionTitleForm({ session, onClose, onSave }) {
  const [title, setTitle] = useState(session.title || '')
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
      setError('Please enter a session title.')
      return
    }

    onSave({
      ...session,
      title: trimmedTitle,
    })
  }

  return (
    <div className="modal-backdrop">
      <section
        className="goal-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-session-title-heading"
      >
        <div className="modal-header">
          <div>
            <h2 id="edit-session-title-heading">Edit session title</h2>
            <p>Update the title of your study session.</p>
          </div>

          <button
            className="modal-close"
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="session-title">Session title</label>
            <input
              id="session-title"
              type="text"
              value={title}
              onChange={(event) => {
                setTitle(event.target.value)
                setError('')
              }}
              placeholder="e.g. Practise React components"
              maxLength={100}
              autoFocus
            />

            {error && <p className="form-error">{error}</p>}
          </div>

          <div className="form-actions">
            <button
              className="button-secondary"
              type="button"
              onClick={onClose}
            >
              Cancel
            </button>

            <button className="button-primary" type="submit">
              Save title
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default EditSessionTitleForm
