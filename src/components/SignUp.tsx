import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5144/api'

const SignUp = () => {
  const navigate = useNavigate()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [userName, setUserName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: firstName.toLowerCase(),
          lastName: lastName.toLowerCase(),
          userName: userName.toLowerCase(),
          email: email.toLowerCase(),
          passwordHash: password,
        }),
      })

      const data = await response.text()

      if (!response.ok) {
        throw new Error(data || 'Sign up failed. Please try again.')
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
          Create Your Account
        </h1>
         <p className="text-sm! font-extralight! mb-2 text-left text-black!">
         Sign Up and Start Managing Your Inventory Today!
        </p>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-sm bg-red-50 border border-red-300 text-red-700 text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-sm font-medium text-black">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="John"
                required
                className="bg-white text-black placeholder-gray-400 px-4 py-3 rounded-sm border border-gray-300 focus:outline-none focus:border-[#22C55E]"
              />
            </div>
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-sm font-medium text-black">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Doe"
                required
                className="bg-white text-black placeholder-gray-400 px-4 py-3 rounded-sm border border-gray-300 focus:outline-none focus:border-[#22C55E]"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-black">Username</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="johndoe"
              required
              className="bg-white text-black placeholder-gray-400 px-4 py-3 rounded-sm border border-gray-300 focus:outline-none focus:border-[#22C55E]"
            />
          </div>

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
              placeholder="create a password"
              required
              className="bg-white text-black placeholder-gray-400 px-4 py-3 rounded-sm border border-gray-300 focus:outline-none focus:border-[#22C55E]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-[#22C55E] text-white hover:bg-[#16A34A] disabled:opacity-60 disabled:cursor-not-allowed text-lg font-semibold transition-colors px-12 py-3.5 rounded-md mt-2"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default SignUp
