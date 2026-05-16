import type { Patient } from '../../types/patient.types'
import { formatDate, formatFullName } from '../../utils/formatters'

interface PatientProfileTabProps {
  patient: Patient
}

const Field = ({
  label,
  value,
}: {
  label: string
  value: string | number | null | undefined
}) => (
  <div className="rounded-2xl border border-emerald-100 bg-white p-4">
    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
      {label}
    </p>
    <p className="mt-2 text-sm font-medium text-slate-900">
      {value || '-'}
    </p>
  </div>
)

export function PatientProfileTab({ patient }: PatientProfileTabProps) {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
              {formatFullName(patient.firstName, patient.lastName)}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Patient ID #{patient.id}
            </p>
          </div>

          <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            Age <span className="font-semibold">{patient.age}</span>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Field
          label="Full Name"
          value={formatFullName(patient.firstName, patient.lastName)}
        />
        <Field label="Date of Birth" value={formatDate(patient.dateOfBirth)} />
        <Field label="Gender" value={patient.gender} />
        <Field label="Phone" value={patient.phone} />
        <Field label="Email" value={patient.email} />
        <Field label="Address" value={patient.address} />
        <Field label="Blood Type" value={patient.bloodType} />
        <Field label="Allergies" value={patient.allergies} />
        <Field label="Emergency Contact" value={patient.emergencyContact} />
        <Field label="Emergency Phone" value={patient.emergencyPhone} />
        <Field label="Created" value={formatDate(patient.createdAt)} />
        <Field label="Last Updated" value={formatDate(patient.updatedAt)} />
      </section>
    </div>
  )
}