import { useState } from 'react'
import type { FormEvent } from 'react'
import { createTask } from '../services/tasks'
import type { Task, TaskStatus } from '../types/task'

interface TaskFormProps {
  onCreated: (task: Task) => void
}

export function TaskForm({ onCreated }: TaskFormProps) {
  const [prefix, setPrefix] = useState('TASK')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState<TaskStatus>('todo')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)
    try {
      const task = await createTask({
        prefix: prefix.trim().toUpperCase(),
        name: name.trim(),
        description: description.trim() || null,
        status,
      })
      onCreated(task)
      setName('')
      setDescription('')
      setStatus('todo')
    } catch {
      setError('The task could not be created. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="create-panel" aria-labelledby="create-task-title">
      <div className="create-heading">
        <div><p className="section-kicker">New item</p><h2 id="create-task-title">Create a task</h2></div>
        <span className="keyboard-hint">Add to workspace</span>
      </div>
      <form className="task-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <label className="field field-prefix">
            <span>Prefix</span>
            <input value={prefix} onChange={(event) => setPrefix(event.target.value)} maxLength={255} required />
          </label>
          <label className="field field-name">
            <span>Task name</span>
            <input value={name} onChange={(event) => setName(event.target.value)} placeholder="What needs to be done?" maxLength={255} required />
          </label>
          <label className="field field-status">
            <span>Status</span>
            <select value={status} onChange={(event) => setStatus(event.target.value as TaskStatus)}>
              <option value="todo">To do</option><option value="in_progress">In progress</option><option value="done">Done</option>
            </select>
          </label>
          <label className="field field-description">
            <span>Description <em>optional</em></span>
            <textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Add a little more context" rows={2} />
          </label>
        </div>
        <div className="form-footer">
          <div aria-live="polite">{error && <p className="form-error">{error}</p>}</div>
          <button className="create-button" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Creating…' : 'Create task'}</button>
        </div>
      </form>
    </section>
  )
}
