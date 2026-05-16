import { FileText, Plus } from 'lucide-react'
import type { Note } from '../../types/note.types'
import { EmptyState } from './EmptyState'
import { formatDateTime } from '../../utils/formatters'

interface AppointmentNotesSectionProps {
  notes: Note[]
  canAddNote: boolean
  onAddNote: () => void
}

export function AppointmentNotesSection({
  notes,
  canAddNote,
  onAddNote,
}: AppointmentNotesSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Appointment notes: <span className="font-semibold">{notes.length}</span>
        </div>

        {canAddNote && (
          <button
            type="button"
            onClick={onAddNote}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:from-emerald-700 hover:to-emerald-600"
          >
            <Plus className="h-4 w-4" />
            Add Note
          </button>
        )}
      </div>

      {notes.length === 0 ? (
        <EmptyState
          title="No notes for this appointment"
          description={
            canAddNote
              ? 'Add a clinical note for this visit while the appointment is in progress.'
              : 'No notes were linked to this appointment.'
          }
        />
      ) : (
        <div className="space-y-4">
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
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-base font-semibold text-slate-900">
                        {note.doctorFullName}
                      </h3>
                      <p className="text-sm text-slate-500">
                        Added {formatDateTime(note.createdAt)}
                      </p>
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
      )}
    </div>
  )
}