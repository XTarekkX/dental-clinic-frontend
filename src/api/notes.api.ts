import { axiosInstance } from './axiosInstance'
import type { Note, NoteRequest } from '../types/note.types'

export const createNote = async (payload: NoteRequest): Promise<Note> => {
  const { data } = await axiosInstance.post<Note>('/api/v1/notes', payload)
  return data
}

export const getNotesByPatientId = async (patientId: number): Promise<Note[]> => {
  const { data } = await axiosInstance.get<Note[]>(`/api/v1/notes/patient/${patientId}`)
  return data
}

export const updateNote = async (
  noteId: number,
  content: string,
): Promise<Note> => {
  const { data } = await axiosInstance.put<Note>(`/api/v1/notes/${noteId}`, content, {
    headers: {
      'Content-Type': 'text/plain',
    },
  })
  return data
}

export const deleteNote = async (noteId: number): Promise<void> => {
  await axiosInstance.delete(`/api/v1/notes/${noteId}`)
}