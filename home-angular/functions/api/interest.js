export async function onRequestPost(context) {
  try {
    const body = await context.request.json();
    const { email, website } = body;

    // Basic validation & honeypot check (website should be empty)
    if (!email || website) {
      return new Response(JSON.stringify({ error: 'Invalid request' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Call Resend API to send the email
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${context.env.RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'To Vision Website <info@tovision.sa>',
        to: ['info@tovision.sa'],
        subject: 'New Interest Form Submission',
        html: `<p>You have a new interest submission from: <strong>${email}</strong></p>`
      })
    });

    if (!resendResponse.ok) {
      throw new Error('Failed to send email');
    }

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