import { useState } from 'react'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import { loginSchema, type LoginSchemaValues } from '../../validation/loginSchema'
import { login } from '../../api/auth.api'
import { useAuthStore } from '../../store/authStore'
import { Link, useNavigate } from 'react-router-dom'
import { APP_ROUTES } from '../../utils/constants'
import type { ApiErrorResponse } from '../../types/common.types'

export function LoginPage() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchemaValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
      rememberMe: false,
    },
  })

  const onSubmit = async (values: LoginSchemaValues) => {
    try {
      setIsSubmitting(true)
      const response = await login(values)
      setAuth(response, values.rememberMe)
      toast.success(`Welcome back, Dr. ${response.firstName}`)
      navigate(APP_ROUTES.dashboard, { replace: true })
    } catch (error) {
      console.error('Login error:', error)

      if (axios.isAxiosError<ApiErrorResponse>(error)) {
        if (error.response) {
          const message =
            error.response.data?.message ||
            `Request failed with status ${error.response.status}`

          toast.error(message)
        } else if (error.request) {
          toast.error('Cannot reach backend server. Check backend and CORS.')
        } else {
          toast.error('Login request failed before being sent.')
        }
      } else {
        toast.error('Unexpected error occurred during login.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">
            Tarek's Clinic Login
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Sign in to access patients, appointments, billing, and reports.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label
              htmlFor="username"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              autoComplete="username"
              {...register('username')}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
              placeholder="Enter your username"
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-600">
                {errors.username.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              {...register('password')}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
            <input
              type="checkbox"
              {...register('rememberMe')}
              className="h-4 w-4 rounded border-slate-300 text-teal-700 focus:ring-teal-600"
            />
            Remember me
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-teal-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Need an account?{' '}
          <Link
            to={APP_ROUTES.register}
            className="font-semibold text-teal-700 hover:text-teal-800"
          >
            Create account
          </Link>
        </p>
      </div>
    </div>
  )
}
