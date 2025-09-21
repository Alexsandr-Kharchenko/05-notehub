import axios from "axios";
import type { Note } from "../components/types/note";

const api = axios.create({
  baseURL: "https://notehub-public.goit.study/api",
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_NOTEHUB_TOKEN}`,
    "Content-Type": "application/json;charset=utf-8",
  },
});

export type FetchNotes = {
  notes: Note[]; // саме так як повертає бекенд
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
};

export interface CreateNote {
  title: string;
  content?: string;
  tag: Note["tag"];
}

export interface DeleteNote {
  message: string;
  note: Note;
}

// --- Запити --- //
export async function fetchNotes(
  page = 1,
  perPage = 12,
  search = ""
): Promise<FetchNotes> {
  const params: Record<string, string | number> = { page, perPage };
  if (search) params.search = search;

  const { data } = await api.get<FetchNotes>("/notes", { params });
  return data;
}

export async function createNote(note: CreateNote): Promise<Note> {
  const { data } = await api.post<Note>("/notes", note);
  return data;
}

export async function deleteNote(id: string): Promise<DeleteNote> {
  const { data } = await api.delete<DeleteNote>(`/notes/${id}`);
  return data;
}
