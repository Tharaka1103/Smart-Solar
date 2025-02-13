  'use client'

  import { useState } from 'react'
  import { useRouter } from 'next/navigation'
  import Image from 'next/image'
  import { motion } from 'framer-motion'
  import { FiSun, FiMail, FiLock, FiUser } from 'react-icons/fi'
  import { ThemeSwitch } from '@/components/ThemeSwitch'

  export default function Login() {
    const [isLogin, setIsLogin] = useState(true)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      setLoading(true)
      setError('')

      if (isLogin) {
        try {
          alert('Sign in successful!')
        } catch (error) {
          setError('An error occurred')
        }
      } else {
        // Handle registration logic here
        try {
          alert('Registration successful!')
        } catch (error) {
          setError('An error occurred')
        }
      }
      setLoading(false)
    }

    return (
      <>
        <header className="fixed top-0 right-0 w-full p-4 flex justify-end z-50">
          <ThemeSwitch />
        </header>
        <div className="min-h-screen bg-background flex items-center justify-center p-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-2xl shadow-xl overflow-hidden max-w-4xl w-full"
          >
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2 bg-gradient-to-br from-sky-500 to-emerald-500 p-12 text-white">
                <div className="flex items-center mb-8">
                  <FiSun className="text-4xl mr-4" />
                  <h2 className="text-3xl font-bold">Solar Energy</h2>
                </div>
                <p className="text-lg mb-8">
                  Join us in the renewable energy revolution. Power your future with solar.
                </p>
                <Image
                  src="/hero-bg.png"
                  alt="Solar Panel"
                  width={400}
                  height={300}
                  className="rounded-lg"
                />
              </div>

              <div className="md:w-1/2 p-12">
                <h2 className="text-3xl font-bold mb-8">
                  {isLogin ? 'Welcome Back' : 'Create Account'}
                </h2>
              
                <form onSubmit={handleSubmit} className="space-y-6">
                  {!isLogin && (
                    <div>
                      <label className="flex items-center text-sm font-medium  mb-2">
                        <FiUser className="mr-2" />
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                        required
                      />
                    </div>
                  )}

                  <div>
                    <label className="flex items-center text-sm font-medium  mb-2">
                      <FiMail className="mr-2" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-medium  mb-2">
                      <FiLock className="mr-2" />
                      Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      required
                    />
                  </div>

                  {error && (
                    <p className="text-red-500 text-sm">{error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary  py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
                  </button>
                </form>

                <p className="mt-6 text-center">
                  {isLogin ? "Don't have an account?" : "Already have an account?"}
                  <button
                    onClick={() => setIsLogin(!isLogin)}
                    className="ml-2 text-sky-500 hover:underline font-medium"
                  >
                    {isLogin ? 'Sign Up' : 'Sign In'}
                  </button>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </>
    )
  }