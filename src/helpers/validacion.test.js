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
