import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Mail } from 'lucide-react';

const CookiesPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold mb-2">Cookies Policy</CardTitle>
          <CardDescription className="text-lg">
            Welcome to our Cookies Policy page. At Bihance, we use cookies and similar technologies to ensure our website works efficiently and to provide you with a great experience.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="what-are-cookies">
              <AccordionTrigger>What Are Cookies?</AccordionTrigger>
              <AccordionContent>
                Cookies are small text files stored on your device (computer, tablet, or mobile) when you visit a website. They help the website remember your preferences and activities, ensuring a smoother and more personalized browsing experience.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="types-of-cookies">
              <AccordionTrigger>Types of Cookies We Use</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc pl-5 space-y-2">
                  <li><span className="font-semibold">Essential Cookies:</span> Necessary for the website to function properly.</li>
                  <li><span className="font-semibold">Performance Cookies:</span> Collect information about how visitors use our website.</li>
                  <li><span className="font-semibold">Functionality Cookies:</span> Remember choices you make and provide enhanced features.</li>
                  <li><span className="font-semibold">Targeting/Advertising Cookies:</span> Deliver relevant advertisements and measure campaign effectiveness.</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="how-we-use-cookies">
              <AccordionTrigger>How We Use Cookies</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Authenticate and identify you on our site</li>
                  <li>Remember your preferences and settings</li>
                  <li>Understand how you interact with our website and improve our services</li>
                  <li>Deliver personalized content and advertising</li>
                  <li>Ensure the security of our website and your data</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="third-party-cookies">
              <AccordionTrigger>Third-Party Cookies</AccordionTrigger>
              <AccordionContent>
                <p>We use third-party services that may place cookies on your device, including:</p>
                <ul className="list-disc pl-5 space-y-2 mt-2">
                  <li>Google Analytics for website analytics</li>
                  <li>Vercel for hosting and performance monitoring</li>
                  <li>Clerk for user authentication</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="managing-preferences">
              <AccordionTrigger>Managing Your Cookie Preferences</AccordionTrigger>
              <AccordionContent>
                <p>You can manage your cookie preferences through your web browser settings. Most browsers allow you to:</p>
                <ul className="list-disc pl-5 space-y-2 mt-2">
                  <li>See what cookies you have and delete them on an individual basis</li>
                  <li>Block third-party cookies</li>
                  <li>Block cookies from specific sites</li>
                  <li>Block all cookies from being set</li>
                  <li>Delete all cookies when you close your browser</li>
                </ul>
                <p className="mt-2">Please note that if you choose to block or delete cookies, some features of our website may not function properly.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="data-security">
              <AccordionTrigger>Data Security</AccordionTrigger>
              <AccordionContent>
                <p>We take data security seriously and implement various measures to protect your information, including:</p>
                <ul className="list-disc pl-5 space-y-2 mt-2">
                  <li>Encryption of data in transit and at rest</li>
                  <li>Access controls to limit data access to authorized personnel</li>
                  <li>Regular audits and monitoring for security vulnerabilities</li>
                </ul>
                <p className="mt-2">We use industry-leading services like Neon for database management, Clerk for authentication, and Vercel for hosting to ensure your data&apos;s security and integrity.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="policy-changes">
              <AccordionTrigger>Changes to This Policy</AccordionTrigger>
              <AccordionContent>
                We may update our Cookies Policy from time to time. We will notify you of any changes by posting the new Cookies Policy on this page. Changes are effective immediately upon posting.
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="mt-8">
            <CardTitle className="text-xl mb-4">Contact Us</CardTitle>
            <CardDescription>
              If you have any questions about this Cookies Policy, please contact us:
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

export default CookiesPolicy;