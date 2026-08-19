import type { Task, TaskStatus } from '../types/task'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

export async function getTasks(signal?: AbortSignal): Promise<Task[]> {
  const response = await fetch(`${API_URL}/tasks`, {
    headers: { Accept: 'application/json' },
    signal,
  })
  if (!response.ok) throw new Error(`The API returned ${response.status}`)
  return response.json() as Promise<Task[]>
}

export interface CreateTaskInput {
  prefix: string
  name: string
  description: string | null
  status: TaskStatus
}

async function apiRequest<T>(path: string, init: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
  })
  if (!response.ok) throw new Error(`The API returned ${response.status}`)
  return response.json() as Promise<T>
}

export function createTask(task: CreateTaskInput): Promise<Task> {
  return apiRequest('/tasks', { method: 'POST', body: JSON.stringify(task) })
}

export function updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
  return apiRequest(`/tasks/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) })
}

export async function deleteTask(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/tasks/${id}`, { method: 'DELETE' })
  if (!response.ok) throw new Error(`The API returned ${response.status}`)
}
