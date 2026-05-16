import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { updateNote } from '../api/notes.api'
import { queryKeys } from '../utils/queryKeys'

interface UseUpdateNoteOptions {
  patientId: number
  onSuccess?: () => void
}

export const useUpdateNote = ({
  patientId,
  onSuccess,
}: UseUpdateNoteOptions) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ noteId, content }: { noteId: number; content: string }) =>
      updateNote(noteId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.patients.notes(patientId),
      })
      toast.success('Note updated successfully')
      onSuccess?.()
    },
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : 'Failed to update note'
      toast.error(message)
    },
  })
}