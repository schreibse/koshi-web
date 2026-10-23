import { exportJWK, generateKeyPair, SignJWT, type CryptoKey } from 'jose';
import { beforeAll, describe, expect, it } from 'vitest';
import { autorizado } from './acceso';

const EQUIPO = 'https://koshi-test.cloudflareaccess.com';
let privada: CryptoKey;
let env: Env;

beforeAll(async () => {
  const par = await generateKeyPair('RS256');
  privada = par.privateKey;
  env = {
    ACCESS_TEAM_DOMAIN: EQUIPO,
    ACCESS_AUD: 'aud',
    ACCESS_TEST_JWK: JSON.stringify(await exportJWK(par.publicKey)),
  } as Env;
});

const token = (cambios: { aud?: string; iss?: string; exp?: string } = {}) =>
  new SignJWT({ email: 'a@b.pe' })
    .setProtectedHeader({ alg: 'RS256' })
    .setIssuer(cambios.iss ?? EQUIPO)
    .setAudience(cambios.aud ?? 'aud')
    .setExpirationTime(cambios.exp ?? '5m')
    .sign(privada);

const pedir = (jwt?: string) =>
  new Request('https://koshisoftware.pe/admin/', {
    headers: jwt ? { 'Cf-Access-Jwt-Assertion': jwt } : {},
  });

describe('autorizado', () => {
  it('lets a valid token through', async () => {
    expect(await autorizado(pedir(await token()), env)).toBe(true);
  });

  it('refuses a request without a token', async () => {
    expect(await autorizado(pedir(), env)).toBe(false);
  });

  it.each([
    ['another app', { aud: 'otra' }],
    ['another team', { iss: 'https://otro.cloudflareaccess.com' }],
    ['an expired token', { exp: '-1m' }],
  ])('refuses %s', async (_, cambios) => {
    expect(await autorizado(pedir(await token(cambios)), env)).toBe(false);
  });

  it('refuses everyone while Access is not configured', async () => {
    const sinEquipo = { ...env, ACCESS_TEAM_DOMAIN: '' };
    expect(await autorizado(pedir(await token()), sinEquipo)).toBe(false);
  });

  it('refuses a token signed with another key', async () => {
    const otra = await generateKeyPair('RS256');
    const ajeno = await new SignJWT({})
      .setProtectedHeader({ alg: 'RS256' })
      .setIssuer(EQUIPO)
      .setAudience('aud')
      .setExpirationTime('5m')
      .sign(otra.privateKey);
    expect(await autorizado(pedir(ajeno), env)).toBe(false);
  });
});
