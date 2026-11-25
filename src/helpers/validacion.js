// Validaciones de los formularios de cuenta y traducción de errores de Supabase Auth.

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** "+57 315-237-7306" → "3152377306" */
export function limpiarTelefono(telefono = '') {
  const digitos = String(telefono).replace(/\D/g, '');
  return digitos.length === 12 && digitos.startsWith('57') ? digitos.slice(2) : digitos;
}

export function validarTelefono(telefono) {
  return /^3\d{9}$/.test(limpiarTelefono(telefono))
    ? null
    : 'Escribe los 10 dígitos de tu celular, por ejemplo 315 237 7306.';
}

export function validarRegistro({ nombre, telefono, barrio_id, email, password }) {
  const errores = {};
  if (!nombre?.trim()) errores.nombre = 'Escribe tu nombre.';
  const tel = validarTelefono(telefono);
  if (tel) errores.telefono = tel;
  if (!barrio_id) errores.barrio_id = 'Elige tu barrio.';
  if (!EMAIL.test(email ?? '')) errores.email = 'Escribe un correo válido, por ejemplo laura@correo.com.';
  if ((password ?? '').length < 8) errores.password = 'La contraseña necesita al menos 8 caracteres.';
  return errores;
}

export function validarIngreso({ email, password }) {
  const errores = {};
  if (!EMAIL.test(email ?? '')) errores.email = 'Escribe tu correo.';
  if (!password) errores.password = 'Escribe tu contraseña.';
  return errores;
}

/** Mensajes de Supabase Auth en español claro. */
export function traducirErrorAuth(error) {
  const m = error?.message ?? '';
  if (/invalid login credentials/i.test(m)) return 'El correo o la contraseña no coinciden. Revísalos e inténtalo de nuevo.';
  if (/already registered|already been registered/i.test(m)) return 'Ese correo ya está registrado. Ingresa con tu contraseña.';
  if (/email not confirmed/i.test(m)) return 'Primero confirma tu correo con el enlace que te enviamos.';
  if (/password should be at least/i.test(m)) return 'La contraseña necesita al menos 8 caracteres.';
  if (/rate limit|too many/i.test(m)) return 'Hiciste muchos intentos seguidos. Espera un minuto e inténtalo de nuevo.';
  if (/failed to fetch|network/i.test(m)) return 'No hay conexión con el servidor. Revisa tu internet.';
  return 'No pudimos completar la operación. Inténtalo de nuevo en un momento.';
}
