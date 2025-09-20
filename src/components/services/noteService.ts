import axios from "axios";
import type { Note } from "../types/note";

const api = axios.create({
  baseURL: "https://notehub-public.goit.study/api",
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_NOTEHUB_TOKEN}`,
    "Content-Type": "application/json;charset=utf-8",
  },
});

export type FetchNotesResponse = {
  notes: Note[];
  totalPages: number;
  totalDocs: number;
  limit: number;
  page: number;
};

export interface CreateNoteDTO {
  title: string;
  content?: string;
  tag: Note["tag"];
}

// 🔹 Важливо: параметр perPage, не limit
export async function fetchNotes(
  page = 1,
  perPage = 12,
  search = ""
): Promise<FetchNotesResponse> {
  const params: Record<string, string | number> = { page, perPage };
  if (search) params.search = search;

  const { data } = await api.get<FetchNotesResponse>("/notes", { params });
  return data;
}

export async function createNote(note: CreateNoteDTO): Promise<Note> {
  const { data } = await api.post<Note>("/notes", note);
  return data;
}

export async function deleteNote(
  id: string
): Promise<{ deletedCount?: number }> {
  const { data } = await api.delete<{ deletedCount?: number }>(`/notes/${id}`);
  return data;
}
