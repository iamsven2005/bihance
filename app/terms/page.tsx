import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Mail, ChevronRight } from 'lucide-react';

const TermsOfService = () => {
  const sections = [
    { id: 'introduction', title: 'Introduction' },
    { id: 'data-collection', title: 'Data Collection' },
    { id: 'changes', title: 'Changes to Terms' },
    { id: 'contact', title: 'Contact Us' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold mb-2">Terms of Service</CardTitle>
          <CardDescription className="text-lg">
            Welcome to Bihance. By using our services, you agree to comply with and be bound by the following terms of service. Please review the following terms carefully.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <nav className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Table of Contents</h2>
            <ul className="space-y-2">
              {sections.map((section) => (
                <li key={section.id}>
                  <Link href={`#${section.id}`} className="flex items-center text-primary hover:underline">
                    <ChevronRight className="mr-2 h-4 w-4" />
                    {section.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="introduction" id="introduction">
              <AccordionTrigger>Introduction</AccordionTrigger>
              <AccordionContent>
                <p>Welcome to Bihance. By using our services, you agree to comply with and be bound by the following terms of service. Please review the following terms carefully.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="data-collection" id="data-collection">
              <AccordionTrigger>Data Collection</AccordionTrigger>
              <AccordionContent>
                <h3 className="font-semibold mb-2">1. Information We Collect</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>OpenID:</strong> Used for user authentication.</li>
                  <li><strong>Profile Information:</strong> Includes name, avatar, and other basic profile details.</li>
                  <li><strong>Email:</strong> Used for communication and account recovery.</li>
                </ul>

                <h3 className="font-semibold mt-4 mb-2">2. Use of Information</h3>
                <p>The information collected is used solely for the purposes of providing and improving our services, verifying user identity, and communicating with users.</p>

                <h3 className="font-semibold mt-4 mb-2">3. Data Security</h3>
                <p>We implement appropriate security measures to protect your data from unauthorized access, alteration, disclosure, or destruction.</p>

                <h3 className="font-semibold mt-4 mb-2">4. Data Sharing</h3>
                <p>We do not share, sell, or lease your personal information to third parties without your consent, except as required by law.</p>

                <h3 className="font-semibold mt-4 mb-2">5. User Rights</h3>
                <p>You have the right to access, update, or delete your personal information at any time. Please contact us at <Link href="mailto:support@bihance.app" className="text-primary hover:underline">support@bihance.app</Link> for any requests regarding your data.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="changes" id="changes">
              <AccordionTrigger>Changes to Terms</AccordionTrigger>
              <AccordionContent>
                <p>We may update these terms from time to time. We will notify users of any significant changes by posting a notice on our site.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="contact" id="contact">
              <AccordionTrigger>Contact Us</AccordionTrigger>
              <AccordionContent>
                <p>If you have any questions or concerns about these Terms of Service, please contact us at:</p>
                <Button asChild className="mt-2">
                  <Link href="mailto:support@bihance.app">
                    <Mail className="mr-2 h-4 w-4" />
                    support@bihance.app
                  </Link>
                </Button>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
};

export default TermsOfService;