import { Children, cloneElement, useId } from 'react';

// Campo de formulario con etiqueta, ayuda y error accesibles.
// Uso: <Campo label="Correo" error={errores.email}><input type="email" … /></Campo>
// El hijo recibe id, aria-invalid y aria-describedby automáticamente.

export default function Campo({ label, ayuda, error, children, opcional = false }) {
  const id = useId();
  const idAyuda = `${id}-ayuda`;
  const control = Children.only(children);
  const describedBy = error || ayuda ? idAyuda : undefined;

  return (
    <div className={`campo${error ? ' campo--error' : ''}`}>
      <label htmlFor={id}>
        {label}{opcional && <span className="ayuda"> (opcional)</span>}
      </label>
      {cloneElement(control, {
        id,
        className: `control ${control.props.className ?? ''}`.trim(),
        'aria-invalid': error ? true : undefined,
        'aria-describedby': describedBy,
      })}
      {(error || ayuda) && <span className="ayuda" id={idAyuda}>{error || ayuda}</span>}
    </div>
  );
}
