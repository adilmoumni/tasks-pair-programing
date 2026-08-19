import { TaskList } from './components/TaskList'
import './App.css'

function App() {
  return (
    <main className="app-shell">
      <header className="page-header">
        <p className="eyebrow">Workspace</p>
        <h1>Tasks</h1>
        <p className="page-description">A clear view of everything your team is working on.</p>
      </header>
      <TaskList />
    </main>
  )
}

export default App
