'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { authService } from '@/app/services/auth'
import Logo from '@/app/ui/logo'

export default function SignIn() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            await authService.login(email, password)
            router.push('/test-user') // Redirect to test page after successful login
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to sign in')
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
                                {/* Logo */}
                                <Logo />
                            </div>
                        </div>

                        <div className="max-w-sm mx-auto w-full px-4 py-8">
                            <h1 className="text-3xl text-slate-800 dark:text-slate-100 font-bold mb-6">Welcome back!</h1>
                            {error && (
                                <div className="text-sm text-red-500 bg-red-100 dark:bg-red-500/10 rounded p-3 mb-4">
                                    {error}
                                </div>
                            )}
                            <form onSubmit={handleSubmit}>
                                <div className="space-y-4">
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
                                    <div>
                                        <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1" htmlFor="password">
                                            Password
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
                                </div>
                                <div className="flex items-center justify-between mt-6">
                                    <div className="mr-1">
                                        <Link
                                            className="text-sm text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400"
                                            href="/reset-password"
                                        >
                                            Forgot Password?
                                        </Link>
                                    </div>
                                    <button
                                        type="submit"
                                        className="btn text-white bg-indigo-500 hover:bg-indigo-600 w-full mb-4 sm:w-auto sm:mb-0"
                                        disabled={loading}
                                    >
                                        {loading ? 'Signing in...' : 'Sign in'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Image */}
                <div className="hidden md:block absolute top-0 bottom-0 right-0 md:w-1/2" aria-hidden="true">
                    <img
                        className="object-cover object-center w-full h-full"
                        src="/images/auth-image.jpg"
                        width={760}
                        height={1024}
                        alt="Authentication"
                    />
                </div>
            </div>
        </main>
    )
}
