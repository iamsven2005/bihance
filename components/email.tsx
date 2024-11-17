import * as React from 'react';

interface EmailTemplateProps {
  firstName: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  firstName,
}) => (
  <div style={{
    fontFamily: 'Arial, sans-serif',
    lineHeight: 1.6,
    color: '#333',
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
  }}>
    <h1 style={{
      color: '#4a4a4a',
      fontSize: '24px',
      marginBottom: '20px',
    }}>Welcome to Bihance, {firstName}!</h1>
    
    <p>Thank you for getting in touch with us! We&apos;re excited to learn more about your event management needs and how we can help streamline your processes.</p>
    
    <h2 style={{
      color: '#4a4a4a',
      fontSize: '20px',
      marginTop: '30px',
      marginBottom: '15px',
    }}>Here&apos;s what you can do with Bihance:</h2>
    
    <ul style={{
      paddingLeft: '20px',
      marginBottom: '20px',
    }}>
      <li>Create and manage multiple events</li>
      <li>Send invitations and track attendance</li>
      <li>Manage and collborate in realtime</li>
      <li>And many more</li>
    </ul>
    
    <p>To get started, simply click the button below to access your Bihance dashboard:</p>
    
    <a href="https://bihance.app/dashboard" style={{
      display: 'inline-block',
      backgroundColor: '#007bff',
      color: '#ffffff',
      padding: '12px 24px',
      textDecoration: 'none',
      borderRadius: '5px',
      fontWeight: 'bold',
      margin: '20px 0',
    }}>
      Go to My Bihance Dashboard
    </a>
    <p>You can reply to this email for support or reach out to +65 89342899 contact us.</p>

    <p>We can&apos;t wait to see the amazing events you&apos;ll create with Bihance!</p>
    
    <p>Best regards,<br />The Bihance Team</p>
    
    <hr style={{
      border: 'none',
      borderTop: '1px solid #e0e0e0',
      margin: '30px 0',
    }} />
    
    <p style={{
      fontSize: '12px',
      color: '#888',
      textAlign: 'center' as const,
    }}>
      © 2023 Bihance.app | <a href="https://bihance.app/terms" style={{ color: '#007bff', textDecoration: 'none' }}>Terms of Service</a> | <a href="https://bihance.app/privacy" style={{ color: '#007bff', textDecoration: 'none' }}>Privacy Policy</a>
    </p>
  </div>
);