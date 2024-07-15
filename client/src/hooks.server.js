export async function handle({ event, resolve }) {
    if (event.url.pathname === '/') {
      return Response.redirect('https://svelte-of1p.onrender.com/messages', 302);
    }
  
    return resolve(event);
  }
  