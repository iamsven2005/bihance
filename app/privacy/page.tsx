import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Mail } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold mb-2">Privacy Policy</CardTitle>
          <CardDescription className="text-lg">
            Welcome to our Privacy Policy page. At Bihance, we adhere to the following fundamental principles in line with Google&apos;s API Services User Data Policy:
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="principles">
              <AccordionTrigger>Key Principles</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc pl-5 space-y-2">
                  <li>We don&apos;t ask you for personal information unless we truly need it.</li>
                  <li>We don&apos;t share your personal information with anyone except to comply with the law, develop our products, or protect our rights.</li>
                  <li>We don&apos;t store personal information on our servers unless required for the ongoing operation of our site.</li>
                  <li>We ensure all data usage is compliant with Google&apos;s policies and have processes to maintain this compliance.</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="owner">
              <AccordionTrigger>Owner and Data Controller</AccordionTrigger>
              <AccordionContent>
                <p>Bihance</p>
                <p>Owner contact email: <Link href="mailto:support@bihance.app" className="text-primary hover:underline">support@bihance.app</Link></p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="data-collected">
              <AccordionTrigger>Types of Data Collected</AccordionTrigger>
              <AccordionContent>
                <p>Our application accesses and uses the following Google user data:</p>
                <ul className="list-disc pl-5 space-y-2 mt-2">
                  <li><strong>Email address:</strong> Used for authentication, communication, and account recovery.</li>
                  <li><strong>Profile information (name, profile picture):</strong> Used to personalize your experience within the application.</li>
                </ul>
                <p className="mt-2">Users grant permission for this access through the Google OAuth consent screen.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="consent">
              <AccordionTrigger>User Consent</AccordionTrigger>
              <AccordionContent>
                <p>We obtain your explicit consent before accessing your Google user data. You have the right to revoke this consent at any time by managing your account settings or contacting us directly.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="data-usage">
              <AccordionTrigger>How We Use Information</AccordionTrigger>
              <AccordionContent>
                <p>We use the information we collect to:</p>
                <ul className="list-disc pl-5 space-y-2 mt-2">
                  <li>Authenticate and personalize your experience</li>
                  <li>Improve our services</li>
                  <li>Communicate with you</li>
                  <li>Analyze usage patterns to improve our services</li>
                  <li>Ensure the security of our platform</li>
                </ul>
                <p className="mt-2">All data usage is in strict compliance with Google&apos;s API Services User Data Policy.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="data-sharing">
              <AccordionTrigger>Information Sharing</AccordionTrigger>
              <AccordionContent>
                <p>We do not share Google user data with any third parties except as necessary to provide our services or as required by law. We ensure that any third-party services we use are compliant with Google&apos;s data policies.</p>
                <p className="mt-2">Specifically, we may share data with service providers who assist us in operating our services, subject to appropriate confidentiality and security measures.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="data-security">
              <AccordionTrigger>Data Security</AccordionTrigger>
              <AccordionContent>
                <p>We implement a variety of security measures to maintain the safety of your personal information. These measures include:</p>
                <ul className="list-disc pl-5 space-y-2 mt-2">
                  <li>Encryption of data in transit and at rest</li>
                  <li>Access controls to limit data access to authorized personnel</li>
                  <li>Regular audits and monitoring for security vulnerabilities</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="security-practices">
              <AccordionTrigger>Security Practices</AccordionTrigger>
              <AccordionContent>
                <p>We utilize industry-leading services to ensure your data&apos;s security and integrity:</p>
                <ul className="list-disc pl-5 space-y-2 mt-2">
                  <li><strong>Neon:</strong> Our database management is handled by Neon, which offers automated backups, encryption at rest and in transit, and stringent access controls to protect your data.</li>
                  <li><strong>Clerk:</strong> We use Clerk for authentication and user management, ensuring secure user sessions with multi-factor authentication (MFA), secure password storage, and regular security updates.</li>
                  <li><strong>Vercel:</strong> Our application is hosted on Vercel, which provides a secure hosting environment with continuous deployment, automated SSL, and DDoS protection.</li>
                </ul>
                <p className="mt-2">These third-party services are carefully selected and regularly reviewed to ensure they meet our stringent security standards and comply with all relevant data protection regulations.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="data-retention">
              <AccordionTrigger>Data Retention and Deletion</AccordionTrigger>
              <AccordionContent>
                <p>We retain your personal data only as long as necessary to provide our services or as required by law. You can request the deletion of your data at any time by contacting us.</p>
                <ul className="list-disc pl-5 space-y-2 mt-2">
                  <li>Personal Data collected for purposes related to the performance of a contract between the Owner and the User shall be retained until such contract has been fully performed.</li>
                  <li>Personal Data collected for the purposes of the Owner&apos;s legitimate interests shall be retained as long as needed to fulfill such purposes.</li>
                  <li>The Owner may be allowed to retain Personal Data for a longer period whenever the User has given consent to such processing, as long as such consent is not withdrawn.</li>
                </ul>
                <p className="mt-2">Once the retention period expires, Personal Data shall be deleted. Therefore, the right of access, the right to erasure, the right to rectification and the right to data portability cannot be enforced after expiration of the retention period.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="cookie-policy">
              <AccordionTrigger>Cookie Policy</AccordionTrigger>
              <AccordionContent>
                <p>This Application uses Trackers. To learn more, Users may consult the Cookie Policy.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="legal-action">
              <AccordionTrigger>Legal Action</AccordionTrigger>
              <AccordionContent>
                <p>The User&apos;s Personal Data may be used for legal purposes by the Owner in Court or in the stages leading to possible legal action arising from improper use of this Application or the related Services.</p>
                <p className="mt-2">The User declares to be aware that the Owner may be required to reveal personal data upon request of public authorities.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="user-rights">
              <AccordionTrigger>The Rights of Users</AccordionTrigger>
              <AccordionContent>
                <p>Users may exercise certain rights regarding their Data processed by the Owner. In particular, Users have the right to do the following, to the extent permitted by law:</p>
                <ul className="list-disc pl-5 space-y-2 mt-2">
                  <li>Withdraw their consent at any time.</li>
                  <li>Object to processing of their Data.</li>
                  <li>Access their Data.</li>
                  <li>Verify and seek rectification.</li>
                  <li>Restrict the processing of their Data.</li>
                  <li>Have their Personal Data deleted or otherwise removed.</li>
                  <li>Receive their Data and have it transferred to another controller.</li>
                  <li>Lodge a complaint.</li>
                </ul>
                <p className="mt-2">Any requests to exercise User rights can be directed to the Owner through the contact details provided in this document. Such requests are free of charge and will be answered by the Owner as early as possible and always within one month.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="additional-info">
              <AccordionTrigger>Additional Information for Users</AccordionTrigger>
              <AccordionContent>
                <p><strong>Users in Switzerland:</strong> This section applies to Users in Switzerland, and, for such Users, supersedes any other possibly divergent or conflicting information contained in the privacy policy.</p>
                <p className="mt-2"><strong>Users in Brazil:</strong> This section applies to Users in Brazil according to the &quot;Lei Geral de Proteção de Dados&quot; (the &quot;LGPD&quot;), and for such Users, it supersedes any other possibly divergent or conflicting information contained in the privacy policy.</p>
                <p className="mt-2"><strong>Users in the United States:</strong> This section applies to all Users who are residents in the United States. For such Users, this information supersedes any other possibly divergent or conflicting provisions contained in the privacy policy.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="policy-changes">
              <AccordionTrigger>Changes to This Policy</AccordionTrigger>
              <AccordionContent>
                <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. Changes are effective immediately upon posting. Should the changes affect processing activities performed on the basis of the User&apos;s consent, the Owner shall collect new consent from the User, where required.</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="mt-8">
            <CardTitle className="text-xl mb-4">Contact Us</CardTitle>
            <CardDescription>
              If you have any questions about this Privacy Policy, please contact us:
            </CardDescription>
            <Button asChild className="mt-2">
              <Link href="mailto:support@bihance.app">
                <Mail className="mr-2 h-4 w-4" />
                support@bihance.app
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrivacyPolicy;