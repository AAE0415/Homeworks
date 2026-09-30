import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

function Login() {
  const { login } = useAuthContext();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (evt: React.FormEvent) => {
    evt.preventDefault();

    const success = login(email, password);

    if (!success) {
      setError("Correo o contraseña incorrectos.");
      return;
    }

    // replace: true evita que, tras iniciar sesión, el botón "Atrás" del
    // navegador regrese a la pantalla de login
    navigate("/libros", { replace: true });
  };

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <span className="login-kicker">Demo Login</span>
        <h1 className="login-title">Inicia sesión</h1>
        <p className="login-hint">
          Usa: <strong>user@mail.com</strong> / <strong>123</strong>
        </p>

        <label className="field">
          <span>Correo electrónico</span>
          <input
            type="email"
            value={email}
            onChange={(evt) => setEmail(evt.target.value)}
            placeholder="user@mail.com"
          />
        </label>

        <label className="field">
          <span>Contraseña</span>
          <input
            type="password"
            value={password}
            onChange={(evt) => setPassword(evt.target.value)}
            placeholder="••••••"
          />
        </label>

        {error && <span className="form-error">{error}</span>}

        <button type="submit">Iniciar sesión</button>
      </form>
    </div>
  );
}

export default Login;
