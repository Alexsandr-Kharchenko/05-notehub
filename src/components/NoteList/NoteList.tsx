import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Note } from "../../types/note";
import styles from "./NoteList.module.css";
import { deleteNote } from "../../services/noteService";

interface NoteListProps {
  notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();

  const { mutate: removeNote, isPending } = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  if (!notes || notes.length === 0) {
    return <p className={styles.empty}>Нотаток немає 😔</p>;
  }

  return (
    <ul className={styles.list}>
      {notes.map((note) => (
        <li key={note.id} className={styles.listItem}>
          <h2 className={styles.title}>{note.title}</h2>
          <p className={styles.content}>{note.content || "Без тексту"}</p>
          <div className={styles.footer}>
            {note.tag && <span className={styles.tag}>{note.tag}</span>}
            <span className={styles.date}>
              {note.createdAt
                ? new Date(note.createdAt).toLocaleDateString()
                : ""}
            </span>
            <button
              className={styles.button}
              onClick={() => removeNote(note.id)}
              disabled={isPending}
            >
              {isPending ? "Deleting..." : "Delete"}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
