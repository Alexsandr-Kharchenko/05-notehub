import { Formik, Form, Field, ErrorMessage as FE } from "formik";
import * as Yup from "yup";
import styles from "./NoteForm.module.css";
import type { Note } from "../../types/note";

interface NoteFormProps {
  onSubmit: (values: {
    title: string;
    content?: string;
    tag: Note["tag"];
  }) => void;
  onCancel: () => void;
}

const validationSchema = Yup.object({
  title: Yup.string().min(3).max(50).required("Title is required"),
  content: Yup.string().max(500),
  tag: Yup.mixed<string>()
    .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"])
    .required("Tag required"),
});

export default function NoteForm({ onSubmit, onCancel }: NoteFormProps) {
  return (
    <Formik
      initialValues={{ title: "", content: "", tag: "Todo" }}
      validationSchema={validationSchema}
      onSubmit={(values, actions) => {
        // Кастуємо tag до строгої множини
        onSubmit({
          ...values,
          tag: values.tag as Note["tag"],
        });
        actions.setSubmitting(false);
      }}
    >
      {({ isSubmitting }) => (
        <Form className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="title">Title</label>
            <Field id="title" name="title" className={styles.input} />
            <FE name="title" component="span" className={styles.error} />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="content">Content</label>
            <Field
              as="textarea"
              id="content"
              name="content"
              rows={8}
              className={styles.textarea}
            />
            <FE name="content" component="span" className={styles.error} />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="tag">Tag</label>
            <Field as="select" id="tag" name="tag" className={styles.select}>
              <option value="Todo">Todo</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Meeting">Meeting</option>
              <option value="Shopping">Shopping</option>
            </Field>
            <FE name="tag" component="span" className={styles.error} />
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              Create note
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
