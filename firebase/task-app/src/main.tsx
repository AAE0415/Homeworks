import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/main.scss';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { TasksProvider } from './context/TasksContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      {/* TasksProvider va dentro de AuthProvider porque necesita el usuario */}
      <TasksProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </TasksProvider>
    </AuthProvider>
  </React.StrictMode>
);
