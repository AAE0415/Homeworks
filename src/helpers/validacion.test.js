import { describe, expect, it } from 'vitest';
import { limpiarTelefono, traducirErrorAuth, validarIngreso, validarRegistro } from './validacion';

const valido = { nombre: 'Laura Gómez', telefono: '315 237 7306', barrio_id: 'ciudad-jardin', email: 'laura@correo.com', password: 'contraseña123' };

describe('validarRegistro', () => {
  it('sin errores con datos correctos', () => {
    expect(validarRegistro(valido)).toEqual({});
  });

  it('pide nombre, barrio y correo válido', () => {
    const e = validarRegistro({ ...valido, nombre: ' ', barrio_id: '', email: 'laura@' });
    expect(Object.keys(e).sort()).toEqual(['barrio_id', 'email', 'nombre']);
  });

  it('el celular debe tener 10 dígitos y empezar por 3', () => {
    expect(validarRegistro({ ...valido, telefono: '315 23' }).telefono).toMatch(/10 dígitos/);
    expect(validarRegistro({ ...valido, telefono: '6023334455' }).telefono).toBeDefined();
    expect(validarRegistro({ ...valido, telefono: '+57 315-237-7306' }).telefono).toBeUndefined();
  });

  it('la contraseña necesita al menos 8 caracteres', () => {
    expect(validarRegistro({ ...valido, password: '1234567' }).password).toMatch(/8/);
  });
});

describe('validarIngreso', () => {
  it('pide correo y contraseña', () => {
    expect(Object.keys(validarIngreso({ email: '', password: '' })).sort()).toEqual(['email', 'password']);
    expect(validarIngreso({ email: 'a@b.co', password: 'x' })).toEqual({});
  });
});

describe('limpiarTelefono', () => {
  it('deja solo los 10 dígitos colombianos', () => {
    expect(limpiarTelefono('+57 315-237-7306')).toBe('3152377306');
    expect(limpiarTelefono('315 237 7306')).toBe('3152377306');
  });
});

describe('traducirErrorAuth', () => {
  it('traduce los errores comunes de Supabase', () => {
    expect(traducirErrorAuth({ message: 'Invalid login credentials' })).toMatch(/correo o la contraseña/);
    expect(traducirErrorAuth({ message: 'User already registered' })).toMatch(/ya está registrado/);
    expect(traducirErrorAuth({ message: 'Email not confirmed' })).toMatch(/confirma/);
    expect(traducirErrorAuth({ message: 'algo raro' })).toMatch(/No pudimos/);
  });
});

describe('validarCheckout', () => {
  const ok = { fecha_entrega_id: 1, personas: '8', nombre_recibe: 'Laura', barrio_id: 'capri', direccion: 'Calle 16 # 105-40', enCobertura: true };

  it('sin errores con datos completos', async () => {
    const { validarCheckout } = await import('./validacion');
    expect(validarCheckout(ok)).toEqual({});
  });

  it('pide fecha, personas, nombre, barrio en cobertura y dirección', async () => {
    const { validarCheckout } = await import('./validacion');
    const e = validarCheckout({ fecha_entrega_id: null, personas: '0', nombre_recibe: '', barrio_id: 'jamundi', direccion: ' ', enCobertura: false });
    expect(Object.keys(e).sort()).toEqual(['barrio_id', 'direccion', 'fecha_entrega_id', 'nombre_recibe', 'personas']);
    expect(e.barrio_id).toMatch(/WhatsApp/);
  });
});

describe('validarComprobante', () => {
  it('acepta imágenes y PDF de hasta 5 MB', async () => {
    const { validarComprobante } = await import('./validacion');
    expect(validarComprobante({ type: 'image/jpeg', size: 1_000_000 })).toBeNull();
    expect(validarComprobante({ type: 'application/pdf', size: 5 * 1024 * 1024 })).toBeNull();
  });

  it('rechaza otros formatos, archivos grandes o vacío', async () => {
    const { validarComprobante } = await import('./validacion');
    expect(validarComprobante({ type: 'text/plain', size: 10 })).toMatch(/foto o un PDF/);
    expect(validarComprobante({ type: 'image/png', size: 6 * 1024 * 1024 })).toMatch(/5 MB/);
    expect(validarComprobante(null)).toMatch(/Elige/);
  });
});
