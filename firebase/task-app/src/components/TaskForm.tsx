import { useEffect, useState, type FormEvent } from 'react';
import { Button, Card, Form } from 'react-bootstrap';
import type { Task } from '../context/TasksContext';

interface Props {
  editing: Task | null;
  onSubmit: (title: string, description: string) => Promise<void>;
  onCancel: () => void;
}

const TaskForm = ({ editing, onSubmit, onCancel }: Props) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // Al editar, precarga los datos de la tarea
  useEffect(() => {
    setTitle(editing?.title ?? '');
    setDescription(editing?.description ?? '');
  }, [editing]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    await onSubmit(title.trim(), description.trim());
    setTitle('');
    setDescription('');
  };

  return (
    <Card className="task-form">
      <Card.Body>
        <Card.Title as="h2">{editing ? 'Editar tarea' : 'Nueva tarea'}</Card.Title>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="task-title">
            <Form.Label>Título</Form.Label>
            <Form.Control value={title} onChange={(e) => setTitle(e.target.value)} placeholder="¿Qué hay que hacer?" required />
          </Form.Group>
          <Form.Group className="mb-3" controlId="task-description">
            <Form.Label>Descripción</Form.Label>
            <Form.Control as="textarea" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Detalles opcionales" />
          </Form.Group>
          <div className="d-flex gap-2">
            <Button type="submit" variant="primary">
              {editing ? 'Guardar cambios' : 'Agregar tarea'}
            </Button>
            {editing && (
              <Button variant="outline-secondary" onClick={onCancel}>
                Cancelar
              </Button>
            )}
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default TaskForm;
