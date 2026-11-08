import { Route, Routes } from 'react-router-dom';
import { PrivateRoute, PublicRoute } from './components/RouteGuards';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Register from './pages/Register';
import Tasks from './pages/Tasks';

const App = () => (
  <Routes>
    <Route element={<PublicRoute />}>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Route>
    <Route element={<PrivateRoute />}>
      <Route path="/" element={<Tasks />} />
    </Route>
    <Route path="/*" element={<NotFound />} />
  </Routes>
);

export default App;
