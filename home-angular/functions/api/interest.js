export async function onRequestPost(context) {
  try {
    const body = await context.request.json();
    const { email, website } = body;

    // Basic validation (and optional honeypot check for 'website')
    if (!email || website) {
      return new Response(JSON.stringify({ error: 'Invalid request' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // TODO: Forward to your email service, database, or CRM (e.g., SendGrid, Resend, etc.)

    return new Response(JSON.stringify({ message: 'Success' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}