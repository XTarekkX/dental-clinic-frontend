import { useState } from 'react'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import { registerAccount } from '../../api/auth.api'
import { useAuthStore } from '../../store/authStore'
import {
  registerSchema,
  type RegisterSchemaValues,
} from '../../validation/registerSchema'
import { APP_ROUTES } from '../../utils/constants'
import type { ApiErrorResponse } from '../../types/common.types'
import type { RegisterRequest } from '../../types/auth.types'

const optionalValue = (value?: string) => {
  const trimmed = value?.trim()
  return trimmed ? trimmed : undefined
}

export function RegisterPage() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchemaValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      role: 'DOCTOR',
      password: '',
      confirmPassword: '',
      phone: '',
      specialization: '',
      licenseNumber: '',
    },
  })

  const onSubmit = async (values: RegisterSchemaValues) => {
    try {
      setIsSubmitting(true)

      const payload: RegisterRequest = {
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        username: values.username.trim(),
        email: values.email.trim(),
        role: values.role,
        password: values.password,
        phone: optionalValue(values.phone),
        specialization: optionalValue(values.specialization),
        licenseNumber: optionalValue(values.licenseNumber),
      }

      const response = await registerAccount(payload)
      setAuth(response, true)
      toast.success(`Welcome, Dr. ${response.firstName}`)
      navigate(APP_ROUTES.dashboard, { replace: true })
    } catch (error) {
      console.error('Registration error:', error)

      if (axios.isAxiosError<ApiErrorResponse>(error)) {
        if (error.response) {
          const message =
            error.response.data?.message ||
            `Request failed with status ${error.response.status}`

          toast.error(message)
        } else if (error.request) {
          toast.error('Cannot reach backend server. Check backend and CORS.')
        } else {
          toast.error('Create account request failed before being sent.')
        }
      } else {
        toast.error('Unexpected error occurred while creating account.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputClass =
    'w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100'

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-8">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">
            Create Clinic Account
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Set up a doctor account for Tarek's Clinic.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="firstName"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                First name
              </label>
              <input
                id="firstName"
                type="text"
                autoComplete="given-name"
                {...register('firstName')}
                className={inputClass}
                placeholder="Enter first name"
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Last name
              </label>
              <input
                id="lastName"
                type="text"
                autoComplete="family-name"
                {...register('lastName')}
                className={inputClass}
                placeholder="Enter last name"
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
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
                className={inputClass}
                placeholder="Choose a username"
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                {...register('email')}
                className={inputClass}
                placeholder="Enter email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="role"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Role
              </label>
              <select
                id="role"
                {...register('role')}
                className={inputClass}
              >
                <option value="DOCTOR">Doctor</option>
                <option value="ADMIN">Admin</option>
              </select>
              {errors.role && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.role.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
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
                autoComplete="new-password"
                {...register('password')}
                className={inputClass}
                placeholder="Create a password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Confirm password
              </label>
              <input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                {...register('confirmPassword')}
                className={inputClass}
                placeholder="Confirm password"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            <div>
              <label
                htmlFor="phone"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Phone
              </label>
              <input
                id="phone"
                type="tel"
                autoComplete="tel"
                {...register('phone')}
                className={inputClass}
                placeholder="Optional"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="specialization"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Specialization
              </label>
              <input
                id="specialization"
                type="text"
                {...register('specialization')}
                className={inputClass}
                placeholder="Optional"
              />
              {errors.specialization && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.specialization.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="licenseNumber"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                License no.
              </label>
              <input
                id="licenseNumber"
                type="text"
                {...register('licenseNumber')}
                className={inputClass}
                placeholder="Optional"
              />
              {errors.licenseNumber && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.licenseNumber.message}
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-teal-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link
            to={APP_ROUTES.login}
            className="font-semibold text-teal-700 hover:text-teal-800"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
