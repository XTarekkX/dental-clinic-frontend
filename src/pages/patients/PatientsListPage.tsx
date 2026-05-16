import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Phone, Mail, UserRound } from 'lucide-react'
import { usePatients } from '../../hooks/usePatients'
import { useDebounce } from '../../hooks/useDebounce'
import { useCreatePatient } from '../../hooks/useCreatePatient'
import { SearchInput } from '../../components/common/SearchInput'
import { Pagination } from '../../components/common/Pagination'
import { LoadingSpinner } from '../../components/common/LoadingSpinner'
import { EmptyState } from '../../components/common/EmptyState'
import { Modal } from '../../components/common/Modal'
import { PatientForm } from '../../components/forms/PatientForm'
import { formatDate, formatFullName } from '../../utils/formatters'
import type { PatientRequest } from '../../types/patient.types'

const PAGE_SIZE = 10

export function PatientsListPage() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  const debouncedSearch = useDebounce(search, 400)

  const { data, isLoading, isError, error, isFetching } = usePatients({
    page,
    size: PAGE_SIZE,
    search: debouncedSearch,
  })

  const createPatientMutation = useCreatePatient({
    onSuccess: () => {
      setIsCreateOpen(false)
    },
  })

  const patients = useMemo(() => data?.content ?? [], [data])

  const handleSearchChange = (value: string) => {
    setSearch(value)
    setPage(0)
  }

  const handleCreatePatient = (values: PatientRequest) => {
    createPatientMutation.mutate(values)
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (isError) {
    return (
      <div className="rounded-3xl border border-red-100 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Failed to load patients
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          {error instanceof Error
            ? error.message
            : 'Something went wrong while loading patients.'}
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Patients
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Search and manage patient records across the clinic.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:from-emerald-700 hover:to-emerald-600"
          >
            <Plus className="h-4 w-4" />
            Add Patient
          </button>
        </div>

        <section className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm">
          <div className="border-b border-emerald-100 px-4 py-4 sm:px-5">
            <SearchInput
              value={search}
              onChange={handleSearchChange}
              placeholder="Search patients by name, phone, or email..."
            />
          </div>

          {isFetching && !isLoading && (
            <div className="border-b border-emerald-100 bg-emerald-50/60 px-5 py-2 text-xs font-medium text-emerald-700">
              Updating results...
            </div>
          )}

          {patients.length === 0 ? (
            <div className="p-5">
              <EmptyState
                title="No patients found"
                description={
                  debouncedSearch
                    ? 'No patients matched your current search.'
                    : 'There are no patient records to display yet.'
                }
              />
            </div>
          ) : (
            <>
              <div className="hidden md:block">
                <div className="grid grid-cols-[2fr_1.1fr_1fr_1.2fr_1.5fr] border-b border-emerald-100 bg-emerald-50/50 px-5 py-4 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                  <div>Name</div>
                  <div>DOB</div>
                  <div>Gender</div>
                  <div>Phone</div>
                  <div>Email</div>
                </div>

                <div className="divide-y divide-emerald-100">
                  {patients.map((patient) => (
                    <Link
                      key={patient.id}
                      to={`/patients/${patient.id}`}
                      className="grid grid-cols-[2fr_1.1fr_1fr_1.2fr_1.5fr] items-center gap-4 px-5 py-5 transition hover:bg-emerald-50/40"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                            <UserRound className="h-5 w-5" />
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-slate-900">
                              {formatFullName(patient.firstName, patient.lastName)}
                            </p>
                            <p className="text-xs text-slate-500">
                              Age {patient.age}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="text-sm text-slate-700">
                        {formatDate(patient.dateOfBirth)}
                      </div>

                      <div>
                        <span className="inline-flex rounded-xl bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                          {patient.gender}
                        </span>
                      </div>

                      <div className="truncate text-sm text-slate-700">
                        {patient.phone || '-'}
                      </div>

                      <div className="truncate text-sm text-slate-700">
                        {patient.email || '-'}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="divide-y divide-emerald-100 md:hidden">
                {patients.map((patient) => (
                  <Link
                    key={patient.id}
                    to={`/patients/${patient.id}`}
                    className="block space-y-4 px-4 py-4 transition hover:bg-emerald-50/40"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                        <UserRound className="h-5 w-5" />
                      </div>

                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900">
                          {formatFullName(patient.firstName, patient.lastName)}
                        </p>
                        <p className="text-xs text-slate-500">
                          {patient.gender} • Age {patient.age}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          DOB: {formatDate(patient.dateOfBirth)}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 text-sm text-slate-700">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-emerald-600" />
                        <span>{patient.phone || '-'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-emerald-600" />
                        <span className="break-all">{patient.email || '-'}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              <Pagination
                page={data?.page ?? 0}
                totalPages={data?.totalPages ?? 0}
                totalElements={data?.totalElements ?? 0}
                onPageChange={setPage}
              />
            </>
          )}
        </section>
      </div>

      <Modal
        isOpen={isCreateOpen}
        title="Add New Patient"
        onClose={() => {
          if (!createPatientMutation.isPending) {
            setIsCreateOpen(false)
          }
        }}
      >
        <PatientForm
          onSubmit={handleCreatePatient}
          isSubmitting={createPatientMutation.isPending}
        />
      </Modal>
    </>
  )
}