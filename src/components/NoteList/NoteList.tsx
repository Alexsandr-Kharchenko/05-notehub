import type { Note } from "../types/note";
import styles from "./NoteList.module.css";

interface NoteListProps {
  notes: Note[];
  onDelete: (id: string) => void;
}

export default function NoteList({ notes, onDelete }: NoteListProps) {
  if (!notes || !notes.length)
    return <p className={styles.empty}>Нотаток немає 😔</p>;

  return (
    <ul className={styles.list}>
      {notes.map((n) => (
        <li key={n.id} className={styles.listItem}>
          <h2 className={styles.title}>{n.title}</h2>
          <p className={styles.content}>{n.content || "Без тексту"}</p>
          <div className={styles.footer}>
            <span className={styles.tag}>{n.tag}</span>
            <button className={styles.button} onClick={() => onDelete(n.id)}>
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
