import { importJWK, SignJWT } from 'jose';

// Test-only key: the Worker trusts its public half only where worker/e2e.env sets ACCESS_TEST_JWK.
const LLAVE = {
  kty: 'RSA',
  n: 'z-NDsuMVPBoxCj3GmIwSGqOy0jckfwmpVMM3UfttfOpcyoVrFFG_sZxTMwHrk4rHCuxNsWUy-2LJyG7jIDr_2sduNloCKb1MnaRDzKtdVXS_JgimH6fzFE_VgtKtk1aOF0kIq8QP-CmkmSbybR11AjPqUAn1iqkow9MtJTqvnC4s_oy3InXILJOvMpTdIN_dQo21LrTs3abbU5v6SrBknNMSqROmWZK124_fZecGgGqhmMTDACHtywOjGPXWmG2Wt1vHxZdRQW8Wl6NE45aTwl_UHEH1nNPU2gl0qQAU8tQrguQTTUtHb17LH5PWbm8-BcoLehodMndOZyi1SKsxHw',
  e: 'AQAB',
  d: 'X3aebPRImQvx_yD1JLIV0jPf9xapZMj8AFeQ_M23rog0yi9QR8lufNIrhp3YHy24T3TKDK9LJRNtU-RP2kodmcrA-qaEncQ2_aEkHUWIG6j76ixIlPrb7jTm-Cdk2-cAYwL_v1jOeIgu9MFky-SeCb_rVovsPJuHg71i2tjDMbVSV-JNd1kpZPQFamXV48taif076EmV34iwP4kRNGeOnWGcMRbABnbefzK6u4qYn4yHR3I69TU5K1_Gu5tcwg9VFB1OZ8NrHIOhz5q0CnVKJReDYZOerHZMhzDdUHxUvZzJQ-9TBWVoIboZYrUGlzeNPoeJfM3JLsfTaefZLf5i6Q',
  p: '9eMVg94ZBZsjUZUHOL4H9sW_r0vxepz_hZRpKF9H3i4rlTwHUiKR1yNLyHkfriX4TZTBITpvGSaE7IPIxvK_1DBToXxSqt8sVFUo9MDwh_yv_yyW6xneh3ceXhepoJJDa4g_CSctJbem0QjRX7JE-R2yaC1tkxqLu5PzGS9zXes',
  q: '2HAXG-lUfncF5YBmVOWgi9_dGw_x-8HnUDuaFNOtb2506h-OLZo9azpV2fuYEt0CjjvSAI4opBmYMF_BSlz9ppjf_rSRwMNC6u0_cXqizvTs_0wbbOmwsJV1wVBK1TtE1wId5h5BECASuw7jQOEDfA2KEwUFtB5kvKuXyAbhyJ0',
  dp: 'oozdw1BHIGKf5aXsoUFXSHcQMlW1LMavUWJ8Zjke7K1_GGgXut-ppBzsU3pnTBxD2x3U0x-rJGhHhYfValg-IotULjRe_iENUC8AJVWLbYrJ2ppipsdySgGgbLmd5M3sjiEC8w0YFpAjUptOtsHGQR21vJMTliT9bSLwmZy52sM',
  dq: 'eTFirz1bE6lgAt9_7X_bAxeqPlISZK9x78o___N7hQ7rpoFe4oggZh93HSU1RTK-EJjMgYUYmrK-NjAYEqS5X4TwwDWp-68alGOeh9NswMgCwP2DydudFXPLSSDFllqmtGI6DbXZJsde1aGDfLvCcL9AFmBUjkQKkl7fEaFQ4j0',
  qi: 'ppUYT3qhikMq4c1L8VTs7KNIsYQbkPyZZdHw7wvBlTu_u_kywFnnnLh8E8ACg5gkiAVE7FMT3zK_R2EluPGNtqNlSLo3eUtpdMoKfMPsks1vrF99wREF3olX4vygb6KQMhNcZCuQ9twqr_rdYkSeOUeOy8qtj5WZmgkStQb9KZ0',
  kid: 'e2e',
  alg: 'RS256',
};

/** A Cloudflare Access token as the e2e Worker expects it (worker/e2e.env). */
export async function tokenAcceso(): Promise<string> {
  return new SignJWT({ email: 'e2e@koshisoftware.pe' })
    .setProtectedHeader({ alg: 'RS256', kid: LLAVE.kid })
    .setIssuer('https://koshi-e2e.cloudflareaccess.com')
    .setAudience('e2e')
    .setExpirationTime('10m')
    .sign(await importJWK(LLAVE, 'RS256'));
}
