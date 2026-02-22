import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
          <h2 className="text-4xl font-bold mb-4 tracking-tight">
            Discover Your Path
          </h2>
          <p className="text-gray-400 text-lg">
            Take our career roadmap quiz and unlock personalized guidance for your professional journey.
          </p>
        </div>
      </div>

      {/* Right Pane */}
      <div className="flex w-full md:w-1/2 justify-center items-center bg-white px-8">
        <div className="w-full max-w-md">

          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Create an account
            </h1>
            <p className="text-gray-500">
              Sign up to start your career exploration
            </p>
          </div>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            
            {/* Full Name */}
            <div>
              <label className="text-sm font-medium text-gray-900 mb-1 block">
                Full Name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
              />
            </div>

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

            {/* Confirm Password */}
            <div>
              <label className="text-sm font-medium text-gray-900 mb-1 block">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 pr-10 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-black"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded cursor-pointer"
              />
              <label className="ml-2 text-sm text-gray-500 cursor-pointer">
                I agree to the Terms and Conditions
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-md text-sm font-medium text-white bg-[#0a0a0a] hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors"
            >
              Sign Up
            </button>

          </form>

          {/* Divider */}
          <div className="mt-6 mb-4 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-400 uppercase tracking-wider text-xs">
                Or
              </span>
            </div>
          </div>

          {/* Google Button */}
          <button
            type="button"
            className="w-full flex justify-center items-center py-2.5 px-4 border border-gray-200 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors"
          >
            Continue with Google
          </button>

        </div>
      </div>
    </div>
  );
};

export default RegisterPage;