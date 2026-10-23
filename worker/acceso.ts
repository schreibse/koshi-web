import {
  createRemoteJWKSet,
  importJWK,
  jwtVerify,
  type JWTVerifyGetKey,
} from 'jose';

const llaveros = new Map<string, JWTVerifyGetKey>();

/** Whether Cloudflare Access let this request through: a valid token for our team and app. */
export async function autorizado(request: Request, env: Env): Promise<boolean> {
  const token = request.headers.get('Cf-Access-Jwt-Assertion');
  const { ACCESS_TEAM_DOMAIN: equipo, ACCESS_AUD: audiencia } = env;
  if (!token || !equipo || !audiencia) return false;
  const opciones = {
    issuer: equipo,
    audience: audiencia,
    algorithms: ['RS256'],
  };
  try {
    // The e2e server signs its own tokens; with its key set, Access's keys are never consulted.
    if (env.ACCESS_TEST_JWK) {
      const llave = await importJWK(JSON.parse(env.ACCESS_TEST_JWK), 'RS256');
      await jwtVerify(token, llave, opciones);
    } else {
      await jwtVerify(token, llavero(equipo), opciones);
    }
    return true;
  } catch {
    return false;
  }
}

function llavero(equipo: string): JWTVerifyGetKey {
  let llaves = llaveros.get(equipo);
  if (!llaves) {
    llaves = createRemoteJWKSet(new URL('/cdn-cgi/access/certs', equipo));
    llaveros.set(equipo, llaves);
  }
  return llaves;
}
