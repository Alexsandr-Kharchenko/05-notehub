import { useCallback, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Toaster, toast } from "react-hot-toast";
import { useDebounce } from "use-debounce";

import SearchBox from "../SearchBox/SearchBox";
import NoteList from "../NoteList/NoteList";
import Pagination from "../Pagination/Pagination";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

import type { Note } from "../../types/note";
import { fetchNotes, createNote, deleteNote } from "../../services/noteService";
import type { FetchNotes, CreateNote } from "../../services/noteService";

import styles from "./App.module.css";

export default function App() {
  const [page, setPage] = useState(1);
  const [perPage] = useState(12);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);
  const [isModalOpen, setModalOpen] = useState(false);

  const queryClient = useQueryClient();

  // --- Fetch нотаток ---
  const query = useQuery<FetchNotes, Error>({
    queryKey: ["notes", page, perPage, debouncedSearch],
    queryFn: () => fetchNotes(page, perPage, debouncedSearch),
    retry: false,
  });

  const data = query.data as FetchNotes | undefined;

  // --- Дані нотаток ---
  const notes: Note[] = data?.notes ?? [];

  const totalPages: number = data?.totalPages ?? 0;

  // --- Створення нотатки ---
  const handleCreate = useCallback(
    async (payload: CreateNote) => {
      try {
        const newNote = await createNote(payload);
        toast.success("Note created");
        setModalOpen(false);

        queryClient.setQueryData<FetchNotes>(
          ["notes", page, perPage, debouncedSearch],
          (old) => {
            if (!old) {
              return {
                notes: [newNote],
                totalPages: 1,
                totalDocs: 1,
                page: 1,
                limit: perPage,
              };
            }
            return {
              ...old,
              notes: [newNote, ...old.notes],
              totalDocs: old.totalDocs + 1,
            };
          }
        );
      } catch {
        toast.error("Failed to create note");
      }
    },
    [queryClient, page, perPage, debouncedSearch]
  );

  // --- Видалення нотатки ---
  const handleDelete = useCallback(
    async (id: string) => {
      try {
        await deleteNote(id);
        toast.success("Note deleted");

        queryClient.setQueryData<FetchNotes>(
          ["notes", page, perPage, debouncedSearch],
          (old) => {
            if (!old) return old;
            return { ...old, notes: old.notes.filter((n) => n.id !== id) };
          }
        );
      } catch {
        toast.error("Failed to delete note");
      }
    },
    [queryClient, page, perPage, debouncedSearch]
  );

  return (
    <div className={styles.app}>
      <Toaster position="top-right" />

      <header className={styles.toolbar}>
        <SearchBox
          value={search}
          onChange={(v) => {
            setSearch(v);
            setPage(1);
          }}
        />
        {totalPages > 1 && (
          <Pagination
            pageCount={totalPages}
            currentPage={page}
            onPageChange={(p) => setPage(p)}
          />
        )}
        <div>
          <button className={styles.button} onClick={() => setModalOpen(true)}>
            Create note +
          </button>
        </div>
      </header>

      <main className={styles.content}>
        {query.isLoading && <Loader />}
        {query.isError && <ErrorMessage />}

        {!query.isLoading && !query.isError && notes.length > 0 && (
          <NoteList notes={notes} onDelete={handleDelete} />
        )}

        {!query.isLoading && !query.isError && notes.length === 0 && (
          <p className={styles.empty}>No notes found.</p>
        )}
      </main>

      {isModalOpen && (
        <Modal onClose={() => setModalOpen(false)}>
          <NoteForm
            onCancel={() => setModalOpen(false)}
            onSubmit={handleCreate}
          />
        </Modal>
      )}
    </div>
  );
}
