'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { authService } from '@/app/services/auth'
import Logo from '@/app/ui/logo'

export default function ResetPassword() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [tokenValid, setTokenValid] = useState<boolean | null>(null)

  const validateToken = async () => {
    try {
      const isValid = await authService.validateResetToken(token!)
      setTokenValid(isValid)
    } catch {
      setTokenValid(false)
    }
  }

  // Check token validity when component mounts
  useEffect(() => {
    if (token) {
      validateToken()
    }
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    try {
      if (token) {
        // Reset password
        if (password !== confirmPassword) {
          setError('Passwords do not match')
          return
        }
        await authService.resetPassword(token, password)
        router.push('/signin')
      } else {
        // Request password reset
        await authService.forgotPassword(email)
        setMessage('If an account exists with this email, you will receive password reset instructions.')
      }
    } catch (err: unknown) {
      if (
        typeof err === 'object' &&
        err !== null &&
        'response' in err &&
        typeof (err as { response?: { data?: { message?: string } } }).response?.data?.message === 'string'
      ) {
        setError((err as { response?: { data?: { message?: string } } }).response!.data!.message!)
      } else {
        setError('Something went wrong')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="bg-white dark:bg-slate-900">
      <div className="relative md:flex">
        {/* Content */}
        <div className="md:w-1/2">
          <div className="min-h-screen h-full flex flex-col after:flex-1">
            {/* Header */}
            <div className="flex-1">
              <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
                <Logo />
              </div>
            </div>

            <div className="max-w-sm mx-auto w-full px-4 py-8">
              <h1 className="text-3xl text-slate-800 dark:text-slate-100 font-bold mb-6">
                {token ? 'Reset Password' : 'Forgot Password'}
              </h1>
              {error && (
                <div className="text-sm text-red-500 bg-red-100 dark:bg-red-500/10 rounded p-3 mb-4">
                  {error}
                </div>
              )}
              {message && (
                <div className="text-sm text-green-500 bg-green-100 dark:bg-green-500/10 rounded p-3 mb-4">
                  {message}
                </div>
              )}
              {(!token || (token && tokenValid)) && (
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    {!token && (
                      <div>
                        <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1" htmlFor="email">
                          Email
                        </label>
                        <input
                          id="email"
                          className="form-input w-full text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-indigo-300 dark:focus:border-indigo-500 focus:ring-indigo-300 dark:focus:ring-indigo-500"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    )}
                    {token && tokenValid && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1" htmlFor="password">
                            New Password
                          </label>
                          <input
                            id="password"
                            className="form-input w-full text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-indigo-300 dark:focus:border-indigo-500 focus:ring-indigo-300 dark:focus:ring-indigo-500"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1" htmlFor="confirm-password">
                            Confirm New Password
                          </label>
                          <input
                            id="confirm-password"
                            className="form-input w-full text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-indigo-300 dark:focus:border-indigo-500 focus:ring-indigo-300 dark:focus:ring-indigo-500"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                          />
                        </div>
                      </>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-6">
                    <Link
                      className="text-sm text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400"
                      href="/signin"
                    >
                      Back to Sign In
                    </Link>
                    <button
                      type="submit"
                      className="btn bg-indigo-500 hover:bg-indigo-600 text-white ml-3"
                      disabled={loading}
                    >
                      {loading ? 'Processing...' : token ? 'Reset Password' : 'Send Reset Link'}
                    </button>
                  </div>
                </form>
              )}
              {token && tokenValid === false && (
                <div className="text-center">
                  <p className="text-slate-600 dark:text-slate-400 mb-4">
                    This password reset link is invalid or has expired.
                  </p>
                  <Link
                    href="/reset-password"
                    className="text-sm text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400"
                  >
                    Request a new password reset link
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Image */}
        <div className="hidden md:block absolute top-0 bottom-0 right-0 md:w-1/2" aria-hidden="true">
          <img
            className="object-cover object-center w-full h-full"
            src="/images/auth-hero.webp"
            width={760}
            height={1024}
            alt="Authentication"
          />
        </div>
      </div>
    </main>
  )
}
