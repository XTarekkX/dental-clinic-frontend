import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  patientSchema,
  type PatientFormValues,
} from '../../validation/patientSchema'
import type { PatientRequest } from '../../types/patient.types'

interface PatientFormProps {
  onSubmit: (values: PatientRequest) => void
  isSubmitting?: boolean
}

const bloodTypeOptions = [
  '',
  'A+',
  'A-',
  'B+',
  'B-',
  'AB+',
  'AB-',
  'O+',
  'O-',
]

export function PatientForm({
  onSubmit,
  isSubmitting = false,
}: PatientFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PatientFormValues>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gender: 'MALE',
      phone: '',
      email: '',
      address: '',
      bloodType: '',
      allergies: '',
      emergencyContact: '',
      emergencyPhone: '',
    },
  })

  const inputClassName =
    'w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50'

  const labelClassName = 'mb-2 block text-sm font-medium text-slate-700'

  const errorText = (message?: string) =>
    message ? <p className="mt-1 text-xs text-red-600">{message}</p> : null

  const submitHandler = (values: PatientFormValues) => {
    const payload: PatientRequest = {
      firstName: values.firstName,
      lastName: values.lastName,
      dateOfBirth: values.dateOfBirth,
      gender: values.gender,
      phone: values.phone,
      email: values.email,
      address: values.address,
      bloodType: values.bloodType || '',
      allergies: values.allergies || '',
      emergencyContact: values.emergencyContact,
      emergencyPhone: values.emergencyPhone,
    }

    onSubmit(payload)
  }

  return (
    <form onSubmit={handleSubmit(submitHandler)}>
      <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 sm:p-6">
        <div>
          <label htmlFor="firstName" className={labelClassName}>
            First Name
          </label>
          <input
            id="firstName"
            {...register('firstName')}
            className={inputClassName}
            placeholder="Enter first name"
          />
          {errorText(errors.firstName?.message)}
        </div>

        <div>
          <label htmlFor="lastName" className={labelClassName}>
            Last Name
          </label>
          <input
            id="lastName"
            {...register('lastName')}
            className={inputClassName}
            placeholder="Enter last name"
          />
          {errorText(errors.lastName?.message)}
        </div>

        <div>
          <label htmlFor="dateOfBirth" className={labelClassName}>
            Date of Birth
          </label>
          <input
            id="dateOfBirth"
            type="date"
            {...register('dateOfBirth')}
            className={inputClassName}
          />
          {errorText(errors.dateOfBirth?.message)}
        </div>

        <div>
          <label htmlFor="gender" className={labelClassName}>
            Gender
          </label>
          <select
            id="gender"
            {...register('gender')}
            className={inputClassName}
          >
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="OTHER">Other</option>
          </select>
          {errorText(errors.gender?.message)}
        </div>

        <div>
          <label htmlFor="phone" className={labelClassName}>
            Phone
          </label>
          <input
            id="phone"
            {...register('phone')}
            className={inputClassName}
            placeholder="Enter phone number"
          />
          {errorText(errors.phone?.message)}
        </div>

        <div>
          <label htmlFor="email" className={labelClassName}>
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register('email')}
            className={inputClassName}
            placeholder="Enter email"
          />
          {errorText(errors.email?.message)}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="address" className={labelClassName}>
            Address
          </label>
          <input
            id="address"
            {...register('address')}
            className={inputClassName}
            placeholder="Enter address"
          />
          {errorText(errors.address?.message)}
        </div>

        <div>
          <label htmlFor="bloodType" className={labelClassName}>
            Blood Type
          </label>
          <select
            id="bloodType"
            {...register('bloodType')}
            className={inputClassName}
          >
            {bloodTypeOptions.map((option) => (
              <option key={option || 'empty'} value={option}>
                {option || 'Select blood type'}
              </option>
            ))}
          </select>
          {errorText(errors.bloodType?.message)}
        </div>

        <div>
          <label htmlFor="allergies" className={labelClassName}>
            Allergies
          </label>
          <input
            id="allergies"
            {...register('allergies')}
            className={inputClassName}
            placeholder="Enter allergies if any"
          />
          {errorText(errors.allergies?.message)}
        </div>

        <div>
          <label htmlFor="emergencyContact" className={labelClassName}>
            Emergency Contact
          </label>
          <input
            id="emergencyContact"
            {...register('emergencyContact')}
            className={inputClassName}
            placeholder="Enter emergency contact name"
          />
          {errorText(errors.emergencyContact?.message)}
        </div>

        <div>
          <label htmlFor="emergencyPhone" className={labelClassName}>
            Emergency Phone
          </label>
          <input
            id="emergencyPhone"
            {...register('emergencyPhone')}
            className={inputClassName}
            placeholder="Enter emergency phone"
          />
          {errorText(errors.emergencyPhone?.message)}
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-emerald-100 bg-slate-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-end sm:px-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:from-emerald-700 hover:to-emerald-600 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? 'Saving...' : 'Create Patient'}
        </button>
      </div>
    </form>
  )
}