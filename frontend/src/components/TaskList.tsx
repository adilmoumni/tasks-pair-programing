import { useCallback, useEffect, useState } from 'react'
import { deleteTask, getTasks, updateTaskStatus } from '../services/tasks'
import type { Task, TaskStatus } from '../types/task'
import { TaskForm } from './TaskForm'

const statusLabels: Record<TaskStatus, string> = {
  todo: 'To do', in_progress: 'In progress', done: 'Done',
}
const nextStatus: Record<TaskStatus, TaskStatus> = {
  todo: 'in_progress', in_progress: 'done', done: 'todo',
}
const statusActionLabels: Record<TaskStatus, string> = {
  todo: 'Start', in_progress: 'Complete', done: 'Reopen',
}
const dateFormatter = new Intl.DateTimeFormat('en', {
  day: 'numeric', month: 'short', year: 'numeric',
})

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [busyTaskId, setBusyTaskId] = useState<number | null>(null)
  const [reloadKey, setReloadKey] = useState(0)
  const retry = useCallback(() => setReloadKey((key) => key + 1), [])

  useEffect(() => {
    const controller = new AbortController()
    async function loadTasks() {
      setIsLoading(true)
      setError(null)
      try {
        setTasks(await getTasks(controller.signal))
      } catch (requestError) {
        if (requestError instanceof DOMException && requestError.name === 'AbortError') return
        setError('We could not load your tasks. Check that the API is running.')
      } finally {
        if (!controller.signal.aborted) setIsLoading(false)
      }
    }
    void loadTasks()
    return () => controller.abort()
  }, [reloadKey])

  async function handleStatusUpdate(task: Task) {
    setBusyTaskId(task.id)
    setActionError(null)
    try {
      const updatedTask = await updateTaskStatus(task.id, nextStatus[task.status])
      setTasks((current) => current.map((item) => item.id === task.id ? updatedTask : item))
    } catch {
      setActionError(`Could not update ${task.prefix}-${task.id}.`)
    } finally {
      setBusyTaskId(null)
    }
  }

  async function handleDelete(task: Task) {
    if (!window.confirm(`Delete ${task.prefix}-${task.id}: ${task.name}?`)) return
    setBusyTaskId(task.id)
    setActionError(null)
    try {
      await deleteTask(task.id)
      setTasks((current) => current.filter((item) => item.id !== task.id))
    } catch {
      setActionError(`Could not delete ${task.prefix}-${task.id}.`)
    } finally {
      setBusyTaskId(null)
    }
  }

  if (isLoading) {
    return (
      <section className="task-panel" aria-label="Tasks" aria-busy="true">
        <div className="panel-heading"><div className="skeleton skeleton-title" /><div className="skeleton skeleton-count" /></div>
        {[1, 2, 3].map((item) => <div className="task-row task-row-loading" key={item}><div className="skeleton skeleton-key" /><div className="skeleton skeleton-content" /><div className="skeleton skeleton-status" /></div>)}
      </section>
    )
  }

  if (error) {
    return (
      <section className="task-panel state-panel" role="alert">
        <div className="state-icon" aria-hidden="true">!</div>
        <h2>Unable to load tasks</h2><p>{error}</p>
        <button className="retry-button" type="button" onClick={retry}>Try again</button>
      </section>
    )
  }

  return (
    <>
    <TaskForm onCreated={(task) => setTasks((current) => [...current, task])} />
    <section className="task-panel" aria-labelledby="task-list-title">
      <div className="panel-heading">
        <div><h2 id="task-list-title">All tasks</h2><p>Sorted by creation order</p></div>
        <span className="task-count">{tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}</span>
      </div>
      {actionError && <div className="action-error" role="alert">{actionError}</div>}
      {tasks.length === 0 ? (
        <div className="empty-state"><div className="empty-icon" aria-hidden="true">✓</div><h3>No tasks yet</h3><p>Your task list is empty. New tasks will appear here.</p></div>
      ) : (
        <div className="task-list">{tasks.map((task) => (
          <article className="task-row" key={task.id}>
            <span className="task-key">{task.prefix}-{task.id}</span>
            <div className="task-content"><h3>{task.name}</h3><p>{task.description || 'No description provided'}</p></div>
            <div className="task-meta">
              <span className={`status status-${task.status}`}><span className="status-dot" />{statusLabels[task.status]}</span>
              <time dateTime={task.created_at}>{dateFormatter.format(new Date(task.created_at))}</time>
              <div className="task-actions">
                <button type="button" className="action-button" disabled={busyTaskId === task.id} onClick={() => void handleStatusUpdate(task)}>{statusActionLabels[task.status]}</button>
                <button type="button" className="delete-button" aria-label={`Delete ${task.name}`} disabled={busyTaskId === task.id} onClick={() => void handleDelete(task)}>Delete</button>
              </div>
            </div>
          </article>
        ))}</div>
      )}
    </section>
    </>
  )
}
