import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Head from 'next/head';
import Link from 'next/link';

export default function TermsOfService() {
  return (
    <Card className='bg-base-200 text-base-content m-5 p-5'>
      <CardHeader>
        <CardTitle>Terms of Service</CardTitle>
      </CardHeader>

        <CardContent className='flex gap-5 flex-col'>
          <CardTitle className="text-2xl font-semibold">Introduction</CardTitle>
          <CardDescription>Welcome to Bihance. By using our services, you agree to comply with and be bound by the following terms of service. Please review the following terms carefully.</CardDescription>
          <CardTitle className="text-2xl font-semibold">Data Collection</CardTitle>

          <CardDescription>
            - 1. Information We Collect
            <br/>
            <div className='font-bold'>OpenID:</div> Used for user authentication.
            <br/><div className='font-bold'>Profile Information:</div> Includes name, avatar, and other basic profile details.
            <br/>
            <div className='font-bold'>Email:</div> Used for communication and account recovery.
          <br/>

          - 2. Use of Information
            <br/>The information collected is used solely for the purposes of providing and improving our services, verifying user identity, and communicating with users.<br/>
            -3. Data Security
            <br/>
            We implement appropriate security measures to protect your data from unauthorized access, alteration, disclosure, or destruction.
            <br/>
            - 4. Data Sharing
            <br/>
            We do not share, sell, or lease your personal information to third parties without your consent, except as required by law.
            <br/>
            - 5. User Rights
            <br/>
            You have the right to access, update, or delete your personal information at any time. Please contact us at <Link href="mailto:support@bihance.app" className="text-blue-600">support@bihance.app</Link> for any requests regarding your data.
            </CardDescription>
          <CardTitle className="text-2xl font-semibold">Changes to Terms</CardTitle>
          <CardDescription>We may update these terms from time to time. We will notify users of any significant changes by posting a notice on our site.</CardDescription>
          </CardContent>


        <CardContent>
          <CardTitle className="text-2xl font-semibold">Contact Us</CardTitle>
          <CardDescription>If you have any questions or concerns about these Terms of Service, please contact us at <Link href="mailto:support@bihance.app" className="text-blue-600">support@bihance.app</Link>.</CardDescription>
        </CardContent>
    </Card>
  );
}
