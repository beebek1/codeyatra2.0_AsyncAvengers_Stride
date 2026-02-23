import { LoaderButton } from '../../components/Elements';
import React, { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth'
import { auth, googleProvider } from '../../services/firebase'
import { useNavigate } from 'react-router-dom'
import gmail from "../../assets/gmail.png"
import toast from 'react-hot-toast'
import { loginUser } from '../../services/api';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await signInWithEmailAndPassword(auth, form.email, form.password);
      const response = await loginUser({ email: form.email, password: form.password });
      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        toast.success('Logged in successfully!')
        navigate('/')
      } else {
        toast.error(response.data.message || 'Login failed.')
        return;
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider)
      toast.success('Logged in with Google!')
      navigate('/')
    } catch (error) {
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-500">Login to continue your career exploration</p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>

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

            <div className="flex justify-end">
              <span onClick={() => navigate('/forgot-password')}
                className="text-sm font-medium text-gray-900 hover:text-black cursor-pointer">
                Forgot Password?
              </span>
            </div>

            <LoaderButton text={"Login"}/>

          </form>

          <div className="mt-6 mb-4 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-400 uppercase tracking-wider text-xs">Or</span>
            </div>
          </div>

          <button type="button" onClick={handleGoogleLogin}
            className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-gray-200 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <img src={gmail} alt="Google"
            className="w-4 h-4" />
            Continue with Google
          </button>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{' '}
            <a href="/register" className="font-medium text-gray-900 hover:text-black">Sign Up</a>
          </p>

           

        </div>
      </div>
    </div>
  )
}

export default Login