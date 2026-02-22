import React, { useState } from 'react'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '../components/firebase'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await sendPasswordResetEmail(auth, email)
      toast.success('Password reset email sent!')
      navigate('/login')
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-screen flex w-full font-sans overflow-hidden">

      {/* Left Pane */}
      <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-[#0a0a0a] text-white p-12 relative overflow-hidden">
        <div className="absolute w-[600px] h-[600px] border border-white/5 rounded-full z-0 flex items-center justify-center">
          <div className="w-[450px] h-[450px] border border-white/5 rounded-full flex items-center justify-center">
            <div className="w-[300px] h-[300px] border border-white/5 rounded-full"></div>
          </div>
        </div>
        <div className="z-10 flex flex-col items-center text-center max-w-md">
          <h2 className="text-4xl font-bold mb-4 tracking-tight">Reset Your Password</h2>
          <p className="text-gray-400 text-lg">
            No worries — it happens. Enter your email and we'll send you a link to get back on track.
          </p>
        </div>
      </div>

      {/* Right Pane */}
      <div className="flex w-full md:w-1/2 justify-center items-center bg-white px-8">
        <div className="w-full max-w-md">

          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password</h1>
            <p className="text-gray-500">
              Enter your email and we'll send you a reset link.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>

            <div className="flex flex-col items-start">
              <label className="text-sm font-medium text-gray-900 mb-1 w-full">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-md text-sm font-medium text-white bg-[#0a0a0a] hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>

          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Remember your password?{' '}
            <span
              onClick={() => navigate('/login')}
              className="font-medium text-gray-900 hover:text-black cursor-pointer"
            >
              Back to Login
            </span>
          </p>

        </div>
      </div>
    </div>
  )
}

export default ForgotPassword