import type { Note } from "../../types/note";
import styles from "./NoteList.module.css";

interface NoteListProps {
  notes: Note[];
  onDelete: (id: string) => void;
}

export default function NoteList({ notes, onDelete }: NoteListProps) {
  if (!notes || notes.length === 0)
    return <p className={styles.empty}>Нотаток немає 😔</p>;

  return (
    <ul className={styles.list}>
      {notes.map((note) => (
        <li key={note.id} className={styles.listItem}>
          <h2 className={styles.title}>{note.title}</h2>
          <p className={styles.content}>{note.content || "Без тексту"}</p>
          <div className={styles.footer}>
            {note.tag && <span className={styles.tag}>{note.tag}</span>}
            <span className={styles.date}>
              {new Date(note.createdAt).toLocaleDateString()}
            </span>
            <button className={styles.button} onClick={() => onDelete(note.id)}>
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
