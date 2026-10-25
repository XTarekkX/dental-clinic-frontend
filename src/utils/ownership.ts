import type { CurrentUser } from '../types/auth.types'

interface DoctorOwnedRecord {
  doctorId?: number | null
  doctorFullName?: string | null
}

const normalizeName = (value: string | null | undefined) =>
  (value ?? '').trim().replace(/\s+/g, ' ').toLowerCase()

export const getCurrentUserFullName = (user: CurrentUser | null) =>
  normalizeName(user ? `${user.firstName} ${user.lastName}` : '')

export const canManageDoctorOwnedRecord = (
  user: CurrentUser | null,
  record: DoctorOwnedRecord | null | undefined,
) => {
  if (!user || !record) return false

  if (user.doctorId && record.doctorId) {
    return user.doctorId === record.doctorId
  }

  const currentUserFullName = getCurrentUserFullName(user)
  const recordDoctorFullName = normalizeName(record.doctorFullName)

  return Boolean(currentUserFullName && currentUserFullName === recordDoctorFullName)
}
