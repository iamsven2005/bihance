import { EmailTemplate } from '@/components/email';
import { NextRequest } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    // Parse the request body to access the data sent from the client
    const { firstName, email, phone, message } = await req.json();

    // Send email to the user
    const { data: userEmailData, error: userEmailError } = await resend.emails.send({
      from: 'support@bihance.app',
      to: [email],
      subject: 'Enquiry',
      react: EmailTemplate({ firstName }),
    });

    // If there's an error sending to the user, return immediately
    if (userEmailError) {
      return Response.json({ error: userEmailError }, { status: 500 });
    }

    // Send email to support with the sender's details
    const { data: supportEmailData, error: supportEmailError } = await resend.emails.send({
      from: 'support@bihance.app',
      to: ['sales@bihance.app'],
      subject: 'New Contact Form Submission',
      html: `
        <h3>New Contact Submission</h3>
        <p><strong>Name:</strong> ${firstName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Message:</strong><br/>${message}</p>
      `,
    });

    // If there's an error sending to support, return an error
    if (supportEmailError) {
      return Response.json({ error: supportEmailError }, { status: 500 });
    }

    return Response.json({ userEmailData, supportEmailData });
  } catch (error) {
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
