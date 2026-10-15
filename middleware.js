export const config = {
  matcher: ['/:path*'],
};

export default function middleware(request) {
  const authHeader = request.headers.get('authorization');

  if (authHeader) {
    const [scheme, encoded] = authHeader.split(' ');
    if (scheme === 'Basic' && encoded) {
      const decoded = atob(encoded);
      const colonIndex = decoded.indexOf(':');
      const user = decoded.substring(0, colonIndex);
      const pwd = decoded.substring(colonIndex + 1);

      const validUser = process.env.AUTH_USER;
      const validPass = process.env.AUTH_PASS;

      if (user === validUser && pwd === validPass) {
        return; // pass through to static file
      }
    }
  }

  return new Response('Authentication Required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Dashboard"',
    },
  });
}
