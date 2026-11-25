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

export function validarCheckout({ fecha_entrega_id, personas, nombre_recibe, barrio_id, direccion, enCobertura }) {
  const errores = {};
  if (!fecha_entrega_id) errores.fecha_entrega_id = 'Elige la fecha de entrega.';
  if (!(Number(personas) >= 1)) errores.personas = 'Escribe para cuántas personas es la cena.';
  if (!nombre_recibe?.trim()) errores.nombre_recibe = 'Escribe quién recibe el pedido.';
  if (!barrio_id) errores.barrio_id = 'Elige el barrio de entrega.';
  else if (!enCobertura) errores.barrio_id = 'Ese barrio está fuera de cobertura. Escríbenos por WhatsApp y lo revisamos.';
  if (!direccion?.trim()) errores.direccion = 'Escribe la dirección de entrega.';
  return errores;
}

const MAX_COMPROBANTE = 5 * 1024 * 1024;

export function validarComprobante(archivo) {
  if (!archivo) return 'Elige la foto o el PDF del comprobante.';
  if (!/^image\//.test(archivo.type) && archivo.type !== 'application/pdf') return 'Sube una foto o un PDF del comprobante.';
  if (archivo.size > MAX_COMPROBANTE) return 'El archivo pesa más de 5 MB. Toma una foto más liviana.';
  return null;
}
