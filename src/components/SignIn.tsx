import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5144/api'

const SignIn = () => {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch(`${API_URL}/signup/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.toLowerCase(),
          password,
        }),
      })

      const data = await response.text()

      if (!response.ok) {
        throw new Error(data || 'Invalid email or password.')
      }

      // Store token if API returns one (for authenticated endpoints)
      let tokenStored = false
      try {
        const parsed = JSON.parse(data)
        if (parsed.token) {
          localStorage.setItem('token', parsed.token)
          tokenStored = true
        }
      } catch {
        // Response is not JSON — may be a plain-text JWT
      }

      if (!tokenStored) {
        throw new Error('Login succeeded but no token was returned by the server.')
      }

      navigate('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full min-h-screen bg-white text-black flex items-center justify-center">
     
      <div className="bg-white p-8  w-full max-w-xl">
        <h1 className="text-2xl! font-bold! mb-3 text-left text-black">
        Welcome Back!
        </h1>
         <p className="text-sm! font-extralight! mb-2 text-left text-black!">
         Sign In to continue using your account!
        </p>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-sm bg-red-50 border border-red-300 text-red-700 text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
         

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-black">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="bg-white text-black placeholder-gray-400 px-4 py-3 rounded-sm border border-gray-300 focus:outline-none focus:border-[#22C55E]"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-black">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Your Password"
              required
              className="bg-white text-black placeholder-gray-400 px-4 py-3 rounded-sm border border-gray-300 focus:outline-none focus:border-[#22C55E]"
            />
          </div>

          
          <button
            type="submit"
            disabled={loading}
            className="bg-[#22C55E] text-white hover:bg-[#16A34A] disabled:opacity-60 disabled:cursor-not-allowed text-lg font-semibold transition-colors px-12 py-3.5 rounded-md mt-2"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default SignIn
