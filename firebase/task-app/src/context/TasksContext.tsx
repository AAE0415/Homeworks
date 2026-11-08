import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { useCollection } from '../hooks/useCollection';

export interface Task {
  id: string;
  uid: string;
  title: string;
  description: string;
  done: boolean;
  createdAt: number;
}

interface TasksContextType {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  addTask: (title: string, description: string) => Promise<void>;
  editTask: (id: string, title: string, description: string) => Promise<void>;
  toggleTask: (id: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export const TasksProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const { getAll, add, update, remove } = useCollection<Task>('tasks');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const uid = user?.uid;

  // Carga las tareas del usuario cada vez que cambia la sesión
  useEffect(() => {
    if (!uid) {
      setTasks([]);
      return;
    }
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAll([['uid', '==', uid]]);
        setTasks(data.sort((a, b) => b.createdAt - a.createdAt));
      } catch {
        setError('No se pudieron cargar tus tareas.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [uid, getAll]);

  // Envuelve cada operación para manejar errores en un solo lugar
  const run = useCallback(async (action: () => Promise<void>) => {
    setError(null);
    try {
      await action();
    } catch {
      setError('Algo salió mal al guardar los cambios. Inténtalo de nuevo.');
    }
  }, []);

  const addTask = (title: string, description: string) =>
    run(async () => {
      if (!uid) return;
      const data = { uid, title, description, done: false, createdAt: Date.now() };
      const id = await add(data);
      setTasks((prev) => [{ id, ...data }, ...prev]);
    });

  const editTask = (id: string, title: string, description: string) =>
    run(async () => {
      await update(id, { title, description });
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, title, description } : t)));
    });

  const toggleTask = (id: string) =>
    run(async () => {
      const task = tasks.find((t) => t.id === id);
      if (!task) return;
      await update(id, { done: !task.done });
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
    });

  const deleteTask = (id: string) =>
    run(async () => {
      await remove(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    });

  return (
    <TasksContext.Provider value={{ tasks, loading, error, addTask, editTask, toggleTask, deleteTask }}>
      {children}
    </TasksContext.Provider>
  );
};

export const useTasks = () => {
  const ctx = useContext(TasksContext);
  if (!ctx) throw new Error('useTasks debe usarse dentro de <TasksProvider>');
  return ctx;
};
