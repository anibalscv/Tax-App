import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_jRneheRX_MXLe7tDdVRb3Jcd83bZSxgp3');

async function sendEmail() {
  try {
    const { data, error } = await resend.emails.send({
      from: 'TaxFlow <onboarding@resend.dev>',
      to: ['anibalscv@gmail.com'],
      subject: 'Prueba de correo de TaxFlow (Resend)',
      html: '<h1>¡Hola!</h1><p>Esta es una prueba de envío de correo desde Resend configurada para TaxFlow.</p>'
    });

    if (error) {
      console.error('Error al enviar el correo:', error);
    } else {
      console.log('Correo enviado con éxito:', data);
    }
  } catch (err) {
    console.error('Excepción al enviar:', err);
  }
}

sendEmail();
