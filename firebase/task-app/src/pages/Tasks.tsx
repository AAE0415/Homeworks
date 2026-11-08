import { useState } from 'react';
import { Alert, Badge, Col, Container, ListGroup, Row, Spinner } from 'react-bootstrap';
import AppNavbar from '../components/AppNavbar';
import TaskForm from '../components/TaskForm';
import TaskItem from '../components/TaskItem';
import { useTasks, type Task } from '../context/TasksContext';

const Tasks = () => {
  const { tasks, loading, error, addTask, editTask, toggleTask, deleteTask } = useTasks();
  const [editing, setEditing] = useState<Task | null>(null);

  const pending = tasks.filter((t) => !t.done).length;

  const handleSubmit = async (title: string, description: string) => {
    if (editing) {
      await editTask(editing.id, title, description);
      setEditing(null);
    } else {
      await addTask(title, description);
    }
  };

  const handleDelete = async (id: string) => {
    if (editing?.id === id) setEditing(null);
    await deleteTask(id);
  };

  return (
    <>
      <AppNavbar />
      <Container className="tasks-page">
        <Row className="g-4">
          <Col lg={5}>
            <TaskForm editing={editing} onSubmit={handleSubmit} onCancel={() => setEditing(null)} />
          </Col>
          <Col lg={7}>
            <div className="tasks-page__header">
              <h2>Tus tareas</h2>
              <Badge bg="primary">{pending} pendientes</Badge>
            </div>
            {error && <Alert variant="danger">{error}</Alert>}
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" role="status" aria-label="Cargando tareas" />
              </div>
            ) : tasks.length === 0 ? (
              <p className="tasks-page__empty">Aún no tienes tareas. Agrega la primera con el formulario.</p>
            ) : (
              <ListGroup>
                {tasks.map((task) => (
                  <TaskItem key={task.id} task={task} onToggle={toggleTask} onEdit={setEditing} onDelete={handleDelete} />
                ))}
              </ListGroup>
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Tasks;
