import { Button, Form, ListGroup } from 'react-bootstrap';
import type { Task } from '../context/TasksContext';

interface Props {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const TaskItem = ({ task, onToggle, onEdit, onDelete }: Props) => (
  <ListGroup.Item className={`task-item ${task.done ? 'task-item--done' : ''}`}>
    <Form.Check
      type="checkbox"
      id={`done-${task.id}`}
      checked={task.done}
      onChange={() => onToggle(task.id)}
      aria-label={`Marcar "${task.title}" como ${task.done ? 'pendiente' : 'hecha'}`}
    />
    <div className="task-item__text">
      <strong>{task.title}</strong>
      {task.description && <p>{task.description}</p>}
    </div>
    <div className="task-item__actions">
      <Button size="sm" variant="outline-primary" onClick={() => onEdit(task)}>
        Editar
      </Button>
      <Button size="sm" variant="outline-danger" onClick={() => onDelete(task.id)}>
        Eliminar
      </Button>
    </div>
  </ListGroup.Item>
);

export default TaskItem;
