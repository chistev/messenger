export async function handle({ event, resolve }) {
    if (event.url.pathname === '/') {
      return Response.redirect('http://localhost:5173/messages', 302);
    }
  
    return resolve(event);
  }
  