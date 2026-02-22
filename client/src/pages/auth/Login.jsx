import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { LoaderButton } from '../../components/Elements';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="h-screen flex w-full font-sans overflow-hidden">
      
      {/* Left Pane */}
      <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] text-white p-12 relative overflow-hidden">
        {/* Concentric Circles - Background Decoration */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[600px] h-[600px] border border-white/10 rounded-full flex items-center justify-center">
            <div className="w-[450px] h-[450px] border border-white/10 rounded-full flex items-center justify-center">
              <div className="w-[300px] h-[300px] border border-white/10 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center max-w-md">
          <h2 className="text-5xl font-bold mb-6 tracking-tight">
            Discover Your Path
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed">
            Take our career roadmap quiz and unlock personalized guidance for your professional journey.
          </p>
        </div>
      </div>

      {/* Right Pane */}
      <div className="flex w-full md:w-1/2 justify-center items-center bg-white px-8">
        <div className="w-full max-w-md">

          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-500">
              Login to continue your career exploration
            </p>
          </div>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            
            {/* Email */}
            <div>
              <label className="text-sm font-medium text-gray-900 mb-1 block">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-medium text-gray-900 mb-1 block">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 pr-10 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-black"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end">
              <a href="#" className="text-sm font-medium text-gray-900 hover:text-black">
                Forgot Password?
              </a>
            </div>

            <LoaderButton text={"Login"}/>

          </form>

          

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Don't have an account?{' '}
              <a href="#" className="font-medium text-gray-900 hover:text-black">
                Sign Up
              </a>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LoginPage;