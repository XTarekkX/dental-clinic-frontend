import { FileText, Pencil, Trash2 } from 'lucide-react'
import type { Note } from '../../types/note.types'
import { EmptyState } from '../../components/common/EmptyState'
import { formatDateTime } from '../../utils/formatters'

interface PatientNotesTabProps {
  notes: Note[]
  onEdit: (note: Note) => void
  onDelete: (note: Note) => void
}

export function PatientNotesTab({
  notes,
  onEdit,
  onDelete,
}: PatientNotesTabProps) {
  if (notes.length === 0) {
    return (
      <EmptyState
        title="No clinical notes found"
        description="Doctor notes for this patient will appear here once added."
      />
    )
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
        Total notes: <span className="font-semibold">{notes.length}</span>
      </div>

      {notes.map((note) => (
        <article
          key={note.id}
          className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm"
        >
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <FileText className="h-5 w-5" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <h3 className="text-base font-semibold text-slate-900">
                    {note.doctorFullName}
                  </h3>
                  <p className="text-sm text-slate-500">
                    Added {formatDateTime(note.createdAt)}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {note.appointmentDate && (
                    <div className="rounded-xl bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600">
                      Appointment: {formatDateTime(note.appointmentDate)}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => onEdit(note)}
                    className="inline-flex items-center gap-2 rounded-xl border border-emerald-100 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-700"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => onDelete(note)}
                    className="inline-flex items-center gap-2 rounded-xl border border-red-100 bg-white px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </button>
                </div>
              </div>

              <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-700 whitespace-pre-wrap">
                {note.content}
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}