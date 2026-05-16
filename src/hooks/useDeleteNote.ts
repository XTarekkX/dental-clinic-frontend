import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { deleteNote } from '../api/notes.api'
import { queryKeys } from '../utils/queryKeys'

interface UseDeleteNoteOptions {
  patientId: number
}

export const useDeleteNote = ({ patientId }: UseDeleteNoteOptions) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (noteId: number) => deleteNote(noteId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.patients.notes(patientId),
      })
      toast.success('Note deleted successfully')
    },
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : 'Failed to delete note'
      toast.error(message)
    },
  })
}