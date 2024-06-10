interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  status: 'pending' | 'completed';
}

interface ConfirmableNote extends Note {
  requiresConfirmation: true;
}

interface DefaultNote extends Note {
  requiresConfirmation: false;
}

type TodoNote = ConfirmableNote | DefaultNote;

interface TodoList {
  addNote: (note: TodoNote) => void;
  deleteNote: (id: string) => void;
  editNote: (id: string, updatedNote: Partial<TodoNote>, confirmed?: boolean) => void;
  getNoteById: (id: string) => TodoNote | undefined;
  getAllNotes: () => TodoNote[];
  markAsCompleted: (id: string) => void;
  getStats: () => { total: number; pending: number };
  searchNotes: (query: string) => TodoNote[];
  sortNotes: (criteria: 'status' | 'createdAt') => TodoNote[];
}

class TodoListImpl implements TodoList {
  private notes: TodoNote[] = [];

  addNote = (note: TodoNote): void => {
    if (note.title.trim() === '' || note.content.trim() === '') {
      throw new Error('Note title and content cannot be empty.');
    }
    this.notes.push(note);
  };

  deleteNote = (id: string): void => {
    this.notes = this.notes.filter(note => note.id !== id);
  };

  editNote = (id: string, updatedNote: Partial<TodoNote>, confirmed: boolean = false): void => {
    const note = this.notes.find(note => note.id === id);
    if (!note) throw new Error('Note not found.');
    if (note.requiresConfirmation && !confirmed) {
      throw new Error('Note requires confirmation to edit.');
    }
    Object.assign(note, updatedNote, { updatedAt: new Date() });
  };

  getNoteById = (id: string): TodoNote | undefined => {
    return this.notes.find(note => note.id === id);
  };

  getAllNotes = (): TodoNote[] => {
    return this.notes;
  };

  markAsCompleted = (id: string): void => {
    const note = this.notes.find(note => note.id === id);
    if (!note) throw new Error('Note is not found.');
    note.status = 'completed';
    note.updatedAt = new Date();
  };

  getStats = (): { total: number; pending: number } => {
    const total = this.notes.length;
    const pending = this.notes.filter(note => note.status === 'pending').length;
    return { total, pending };
  };

  searchNotes = (query: string): TodoNote[] => {
    return this.notes.filter(note => note.title.includes(query) || note.content.includes(query));
  };

  sortNotes = (criteria: 'status' | 'createdAt'): TodoNote[] => {
    return this.notes.slice().sort((a, b) => {
      if (criteria === 'status') {
        return a.status.localeCompare(b.status);
      } else {
        return a.createdAt.getTime() - b.createdAt.getTime();
      }
    });
  };
}
