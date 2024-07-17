import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import React from 'react';

const CookiesPolicy = () => {
  return (
    <Card className='bg-base-200 text-base-content m-5 p-5'>
      <CardHeader>
        <CardTitle>Cookies Policy</CardTitle>
        <CardDescription>
          Welcome to our Cookies Policy page. At Bihance, we use cookies and similar technologies to ensure our website works efficiently and to provide you with a great experience. This policy explains what cookies are, how we use them, and how you can manage your preferences.
        </CardDescription>
      </CardHeader>

      <CardContent className='flex gap-5 flex-col'>
        <CardTitle>What Are Cookies?</CardTitle>
        <CardDescription>
          Cookies are small text files stored on your device (computer, tablet, or mobile) when you visit a website. They help the website remember your preferences and activities, ensuring a smoother and more personalized browsing experience.
        </CardDescription>

        <CardTitle>Types of Cookies We Use</CardTitle>
        <CardDescription>
          We use the following types of cookies on our site:
          <br />
          <p className='font-bold'>1. Essential Cookies:</p> These cookies are necessary for the website to function properly. They enable you to navigate our site and use its features.
          <br />
          <p className='font-bold'>2. Performance Cookies:</p> These cookies collect information about how visitors use our website, such as which pages are visited most often. This helps us improve our website and provide a better user experience.
          <br />
          <p className='font-bold'>3. Functionality Cookies:</p> These cookies allow our website to remember choices you make (such as your username, language, or region) and provide enhanced, more personal features.
          <br />
          <p className='font-bold'>4. Targeting/Advertising Cookies:</p> These cookies are used to deliver relevant advertisements to you. They also help us measure the effectiveness of our advertising campaigns.
        </CardDescription>

        <CardTitle>How We Use Cookies</CardTitle>
        <CardDescription>
          We use cookies to:
          <br />
          - Authenticate and identify you on our site
          <br />
          - Remember your preferences and settings
          <br />
          - Understand how you interact with our website and improve our services
          <br />
          - Deliver personalized content and advertising
          <br />
          - Ensure the security of our website and your data
        </CardDescription>

        <CardTitle>Third-Party Cookies</CardTitle>
        <CardDescription>
          We also use third-party services that may place cookies on your device. These services help us analyze our website&apos;s usage, deliver personalized content, and manage our advertising campaigns. Our third-party partners include:
          <br />
          - Google Analytics for website analytics
          <br />
          - Vercel for hosting and performance monitoring
          <br />
          - Clerk for user authentication
        </CardDescription>

        <CardTitle>Managing Your Cookie Preferences</CardTitle>
        <CardDescription>
          You can manage your cookie preferences through your web browser settings. Most browsers allow you to:
          <br />
          - See what cookies you have and delete them on an individual basis
          <br />
          - Block third-party cookies
          <br />
          - Block cookies from specific sites
          <br />
          - Block all cookies from being set
          <br />
          - Delete all cookies when you close your browser
          <br />
          Please note that if you choose to block or delete cookies, some features of our website may not function properly.
        </CardDescription>

        <CardTitle>Data Security</CardTitle>
        <CardDescription>
          We take data security seriously and implement various measures to protect your information. These include:
          <br />
          - Encryption of data in transit and at rest
          <br />
          - Access controls to limit data access to authorized personnel
          <br />
          - Regular audits and monitoring for security vulnerabilities
          <br />
          We use industry-leading services like Neon for database management, Clerk for authentication, and Vercel for hosting to ensure your data&apos;s security and integrity.
        </CardDescription>

        <CardTitle>Changes to This Policy</CardTitle>
        <CardDescription>
          We may update our Cookies Policy from time to time. We will notify you of any changes by posting the new Cookies Policy on this page. Changes are effective immediately upon posting.
        </CardDescription>
      </CardContent>

      <CardContent className='flex flex-col gap-5'>
        <CardTitle>Contact Us</CardTitle>
        <CardDescription>
          If you have any questions about this Cookies Policy, please contact us at <Link href="mailto:support@bihance.app">support@bihance.app</Link>.
        </CardDescription>
      </CardContent>
    </Card>
  );
};

export default CookiesPolicy;
