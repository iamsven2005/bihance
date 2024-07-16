import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import React from 'react';

const PrivacyPolicy = () => {
    return (
        <Card className='bg-base-200 text-base-content m-5 p-5'>
            <CardHeader>
                <CardTitle>Privacy Policy</CardTitle>
                <CardDescription>
                    Welcome to our Privacy Policy page. Your privacy is critically important to us. At Bihance, we adhere to the following fundamental principles in line with Google's API Services User Data Policy:
                </CardDescription>
            </CardHeader>

            <CardContent className='flex gap-5 flex-col'>
                <CardDescription>
                    - We don’t ask you for personal information unless we truly need it.<br />
                    - We don’t share your personal information with anyone except to comply with the law, develop our products, or protect our rights.
                    <br />
                    - We don’t store personal information on our servers unless required for the ongoing operation of our site.
                    <br />
                    - We ensure all data usage is compliant with Google’s policies and have processes to maintain this compliance.</CardDescription>


                <CardTitle>Information We Collect</CardTitle>
                <CardDescription>Our application accesses and uses the following Google user data to provide you with a personalized and efficient experience:
                    <br />
                    - Email address
                    <br />
                    - Profile information (name, profile picture)
                </CardDescription>

                <CardTitle>User Consent</CardTitle>
                <CardDescription>
                    We obtain your explicit consent before accessing your Google user data. You have the right to revoke this consent at any time by managing your account settings or contacting us directly.
                </CardDescription>

                <CardTitle>How We Use Information</CardTitle>
                <CardDescription>We use the information we collect to:
                    <br />
                    - Authenticate and personalize your experience
                    <br />
                    - Improve our Services
                    <br />
                    -Communicate with you
                    <br />All data usage is in strict compliance with Google's API Services User Data Policy.
                </CardDescription>
                <CardTitle>Information Sharing</CardTitle>
                <CardDescription>We do not share Google user data with any third parties except as necessary to provide our services or as required by law. We ensure that any third-party services we use are compliant with Google's data policies.</CardDescription>

                <CardTitle>Data Security</CardTitle>
                <CardDescription>
                    We implement a variety of security measures to maintain the safety of your personal information. These measures include:
                    <br /> - Encryption of data in transit and at rest
                    <br />- Access controls to limit data access to authorized personnel
                    <br />- Regular audits and monitoring for security vulnerabilities
                </CardDescription>


                <CardTitle>Security Practices</CardTitle>
                <CardDescription>We utilize industry-leading services to ensure your data's security and integrity:
                <br/>
                        <p className='font-bold'>Neon:</p> Our database management is handled by Neon, which offers automated backups, encryption at rest and in transit, and stringent access controls to protect your data.
                    <br/>
                        <p className='font-bold'>Clerk:</p> We use Clerk for authentication and user management, ensuring secure user sessions with multi-factor authentication (MFA), secure password storage, and regular security updates.
                    <br/>
                        <p className='font-bold'>Vercel:</p> Our application is hosted on Vercel, which provides a secure hosting environment with continuous deployment, automated SSL, and DDoS protection.
                    <br/>
                    These third-party services are carefully selected and regularly reviewed to ensure they meet our stringent security standards and comply with all relevant data protection regulations.
                </CardDescription>
                <CardTitle>Data Retention and Deletion</CardTitle>
                <CardDescription>We retain your personal data only as long as necessary to provide our services or as required by law. You can request the deletion of your data at any time by contacting us.</CardDescription>

                <CardTitle>Third-Party Services</CardTitle>
                <CardDescription>
                    We use third-party services for hosting, data storage, and other functionalities. These services are:
                    <br/> - Next.js for the frontend framework
                    <br/> - Vercel for hosting and deployment
                    <br/> - Neon for database management
                    <br/> - Clerk for authentication and user management
                <br/>These third-party services may collect and store data on our behalf but are only authorized to use it for the specific purposes outlined in our agreements with them. We ensure these services comply with Google's data policies.
                </CardDescription>

                <CardTitle>Children's Privacy</CardTitle>
                <CardDescription>Our services are not intended for use by children under the age of 13. We do not knowingly collect personal data from children under 13. If we learn that we have collected such data, we will delete it as soon as possible.</CardDescription>

                <CardTitle>Changes to This Policy</CardTitle>
                <CardDescription>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. Changes are effective immediately upon posting.</CardDescription>
            </CardContent>
            <CardContent className='flex flex-col gap-5'>
                <CardTitle>Contact Us</CardTitle>
                <CardDescription>If you have any questions about this Privacy Policy, please contact us at <Link href="mailto:support@bihance.app">support@bihance.app</Link>.</CardDescription>
            </CardContent>

        </Card>
    );
};

export default PrivacyPolicy;
