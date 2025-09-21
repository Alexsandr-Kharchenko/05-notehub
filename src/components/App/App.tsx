import { useState } from "react";
import { Toaster } from "react-hot-toast";
import { useDebounce } from "use-debounce";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import SearchBox from "../SearchBox/SearchBox";
import NoteList from "../NoteList/NoteList";
import Pagination from "../Pagination/Pagination";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

import type { Note } from "../../types/note";
import { fetchNotes, type FetchNotes } from "../../services/noteService";

import styles from "./App.module.css";

export default function App() {
  const [page, setPage] = useState(1);
  const [perPage] = useState(12);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);
  const [isModalOpen, setModalOpen] = useState(false);

  const queryClient = useQueryClient();

  const query = useQuery<FetchNotes, Error>({
    queryKey: ["notes", page, perPage, debouncedSearch],
    queryFn: () => fetchNotes(page, perPage, debouncedSearch),
    retry: false,

    placeholderData: () => {
      const previousData = queryClient.getQueryData<FetchNotes>([
        "notes",
        page - 1,
        perPage,
        debouncedSearch,
      ]);
      return previousData ?? { notes: [], totalPages: 0 };
    },
  });

  const data = query.data;
  const notes: Note[] = data?.notes ?? [];
  const totalPages: number = data?.totalPages ?? 0;

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
        {query.isLoading || query.isFetching ? (
          <Loader />
        ) : query.isError ? (
          <ErrorMessage />
        ) : notes.length === 0 ? (
          <p className={styles.empty}>No notes found.</p>
        ) : (
          <NoteList notes={notes} />
        )}
      </main>

      {isModalOpen && (
        <Modal onClose={() => setModalOpen(false)}>
          <NoteForm onCancel={() => setModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
}
