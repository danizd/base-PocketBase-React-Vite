import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useNavigate, Link } from 'react-router-dom'

const RegisterPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [error, setError] = useState(null)
  const { register, isAuthLoading } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    if (password !== passwordConfirm) {
      setError("Passwords don't match")
      return
    }
    try {
      await register(email, password, passwordConfirm)
      navigate('/')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Create Account</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            required
            disabled={isAuthLoading}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            required
            disabled={isAuthLoading}
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700">Confirm Password</label>
          <input
            type="password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            required
            disabled={isAuthLoading}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
          disabled={isAuthLoading}
        >
          {isAuthLoading ? 'Creating account...' : 'Register'}
        </button>
        <p className="text-center mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  )
}

export default RegisterPage
