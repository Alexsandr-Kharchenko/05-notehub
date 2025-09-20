export interface NoteTag {
  id?: string;
  name: "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";
}

export interface Note {
  _id: string;
  title: string;
  content?: string;
  tag: NoteTag["name"];
  createdAt?: string;
  updatedAt?: string;
}
