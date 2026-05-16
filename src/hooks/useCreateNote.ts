import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { createNote } from '../api/notes.api'
import { queryKeys } from '../utils/queryKeys'
import type { NoteRequest } from '../types/note.types'

interface UseCreateNoteOptions {
  patientId: number
  onSuccess?: () => void
}

export const useCreateNote = ({
  patientId,
  onSuccess,
}: UseCreateNoteOptions) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: NoteRequest) => createNote(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.patients.notes(patientId),
      })
      toast.success('Note added successfully')
      onSuccess?.()
    },
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : 'Failed to create note'
      toast.error(message)
    },
  })
}