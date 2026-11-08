import { Button, Container, Navbar } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AppNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <Navbar className="app-navbar">
      <Container>
        <Navbar.Brand>Mis tareas</Navbar.Brand>
        <div className="app-navbar__user">
          <span>{user?.displayName || user?.email}</span>
          <Button variant="outline-light" size="sm" onClick={handleLogout}>
            Cerrar sesión
          </Button>
        </div>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
