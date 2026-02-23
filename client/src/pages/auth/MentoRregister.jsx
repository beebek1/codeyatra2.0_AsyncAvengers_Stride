import React, { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { createUserWithEmailAndPassword, signInWithPopup , updateProfile} from 'firebase/auth'
import { auth, googleProvider } from '../../services/firebase'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import gmail from "../../assets/gmail.png"
import { registerUser } from '../../services/api'

const MentorRegister = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '' })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match.')
      return
    }
    setLoading(true)
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
      // ⭐ NEW: Save the displayName in Firebase
      await updateProfile(userCredential.user, {
        displayName: form.fullName
      });
      await userCredential.user.reload();                        // ← force sync displayName
      const response = await registerUser({ 
        email: form.email, 
        password: form.password,
      });
            if (response.data.success) {
        setForm({ fullName: '', email: '', password: '', confirmPassword: '' })
        toast.success('Account created successfully!')
        navigate('/login')
      }else{
        toast.error(response.data.message || 'Registration failed.')
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

 const handleGoogleRegister = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider)
    const firebaseUser = result.user

    await registerUser({                                   // ← register in backend
      email: firebaseUser.email,
      password: null
    })

    toast.success('Signed up with Google!')
    navigate('/dashboard')
  } catch (error) {
    console.error('Google register error:', error)
    toast.error(error.message)
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
          <h2 className="text-4xl font-bold mb-4 tracking-tight">Discover Your Path</h2>
          <p className="text-gray-400 text-lg">
            Take our career roadmap quiz and unlock personalized guidance for your professional journey.
          </p>
        </div>
      </div>

      {/* Right Pane */}
      <div className="flex w-full md:w-1/2 justify-center items-center bg-white px-8">
        <div className="w-full max-w-md">

          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create an account</h1>
            <p className="text-gray-500">Sign up to start your career exploration</p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>

            <div className="flex flex-col items-start">
              <label className="text-sm font-medium text-gray-900 mb-1 w-full">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
              />
            </div>

            <div className="flex flex-col items-start">
              <label className="text-sm font-medium text-gray-900 mb-1 w-full">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email address"
                required
                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
              />
            </div>

            <div className="flex flex-col items-start">
              <label className="text-sm font-medium text-gray-900 mb-1 w-full">Password</label>
              <div className="relative w-full">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="********"
                  required
                  className="w-full px-3 py-2 pr-10 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-black">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex flex-col items-start">
              <label className="text-sm font-medium text-gray-900 mb-1 w-full">Confirm Password</label>
              <div className="relative w-full">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="********"
                  required
                  className="w-full px-3 py-2 pr-10 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-black">
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <input type="checkbox" required
                className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded cursor-pointer" />
              <label className="ml-2 text-sm text-gray-500 cursor-pointer">
                I agree to the Terms and Conditions
              </label>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-2.5 px-4 rounded-md text-sm font-medium text-white bg-[#0a0a0a] hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors disabled:opacity-50">
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>

          </form>

          <div className="mt-6 mb-4 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-400 uppercase tracking-wider text-xs">Or</span>
            </div>
          </div>

          <button type="button" onClick={handleGoogleRegister}
            className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-gray-200 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <img src={gmail} alt="Google"
            className="w-4 h-4" />
            Continue with Google
          </button>

          <p className="text-center text-sm text-gray-400 mt-6">
            Already have an account?{' '}
            <a href="/login" className="font-medium text-gray-900 hover:text-black">Login</a>
          </p>

          {/* For mentor */}
          <div className="text-center mt-4">
            <p className="text-gray-500 text-sm">Are you a User?</p>
            <button
              onClick={() => navigate('/register')}
              className="mt-2 w-full border border-black text-black py-2 rounded-md hover:bg-gray-100 transition"
            >
              Register as a User
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}

export default MentorRegister