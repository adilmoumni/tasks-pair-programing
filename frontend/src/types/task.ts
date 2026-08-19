export type TaskStatus = 'todo' | 'in_progress' | 'done'

export interface Task {
  id: number
  prefix: string
  name: string
  description: string | null
  status: TaskStatus
  created_at: string
  updated_at: string
}
