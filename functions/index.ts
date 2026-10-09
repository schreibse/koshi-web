import { preferredLocale } from '@koshi/shared/locale/util';

// Only `/` runs this function; everything else is served as static files.
export const onRequestGet = ({ request }: { request: Request }): Response => {
  const locale = preferredLocale(request.headers.get('Accept-Language'));
  return new Response(null, {
    status: 302,
    headers: {
      Location: new URL(`/${locale}/`, request.url).toString(),
      Vary: 'Accept-Language',
      'Cache-Control': 'private, no-store',
    },
  });
};

export const onRequestHead = onRequestGet;
