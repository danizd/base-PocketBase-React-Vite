import { Routes, Route } from 'react-router-dom'
import LoginPage from './pages/Login'
import DashboardPage from './pages/Dashboard'
import AuthLayout from './components/AuthLayout'
import GuestLayout from './components/GuestLayout'

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Routes>
        <Route element={<GuestLayout />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>
        <Route element={<AuthLayout />}>
          <Route path="/" element={<DashboardPage />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
