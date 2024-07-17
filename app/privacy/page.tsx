import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import React from 'react';

const PrivacyPolicy = () => {
    return (
        <Card className='bg-base-200 text-base-content m-5 p-5'>
            <CardHeader>
                <CardTitle>Privacy Policy</CardTitle>
                <CardDescription>
                    Welcome to our Privacy Policy page. Your privacy is critically important to us. At Bihance, we adhere to the following fundamental principles in line with Google&apos;s API Services User Data Policy:
                </CardDescription>
            </CardHeader>

            <CardContent className='flex gap-5 flex-col'>
                <CardDescription>
                    - We don’t ask you for personal information unless we truly need it.<br />
                    - We don’t share your personal information with anyone except to comply with the law, develop our products, or protect our rights.<br />
                    - We don’t store personal information on our servers unless required for the ongoing operation of our site.<br />
                    - We ensure all data usage is compliant with Google’s policies and have processes to maintain this compliance.
                </CardDescription>

                <CardTitle>Owner and Data Controller</CardTitle>
                <CardDescription>
                    Bihance<br />
                    Owner contact email: <Link href="mailto:support@bihance.app">support@bihance.app</Link>
                </CardDescription>

                <CardTitle>Types of Data Collected</CardTitle>
                <CardDescription>
                    The owner does not provide a list of Personal Data types collected.<br />
                    Complete details on each type of Personal Data collected are provided in the dedicated sections of this privacy policy or by specific explanation texts displayed prior to the Data collection.<br />
                    Personal Data may be freely provided by the User, or, in case of Usage Data, collected automatically when using this Application.<br />
                    Unless specified otherwise, all Data requested by this Application is mandatory and failure to provide this Data may make it impossible for this Application to provide its services. In cases where this Application specifically states that some Data is not mandatory, Users are free not to communicate this Data without consequences to the availability or the functioning of the Service.<br />
                    Users who are uncertain about which Personal Data is mandatory are welcome to contact the Owner.<br />
                    Any use of Cookies – or of other tracking tools — by this Application or by the owners of third-party services used by this Application serves the purpose of providing the Service required by the User, in addition to any other purposes described in the present document and in the Cookie Policy.<br />
                    Users are responsible for any third-party Personal Data obtained, published or shared through this Application and confirm that they have the third party&apos;s consent to provide the Data to the Owner.
                </CardDescription>

                <CardTitle>Mode and Place of Processing the Data</CardTitle>
                <CardDescription>
                    <strong>Methods of processing</strong><br />
                    The Owner takes appropriate security measures to prevent unauthorized access, disclosure, modification, or unauthorized destruction of the Data.<br />
                    The Data processing is carried out using computers and/or IT enabled tools, following organizational procedures and modes strictly related to the purposes indicated. In addition to the Owner, in some cases, the Data may be accessible to certain types of persons in charge, involved with the operation of this Application (administration, sales, marketing, legal, system administration) or external parties (such as third-party technical service providers, mail carriers, hosting providers, IT companies, communications agencies) appointed, if necessary, as Data Processors by the Owner. The updated list of these parties may be requested from the Owner at any time.<br />
                    <strong>Place</strong><br />
                    The Data is processed at the Owner&apos;s operating offices and in any other places where the parties involved in the processing are located.<br />
                    Depending on the User&apos;s location, data transfers may involve transferring the User&apos;s Data to a country other than their own. To find out more about the place of processing of such transferred Data, Users can check the section containing details about the processing of Personal Data.<br />
                    <strong>Retention time</strong><br />
                    Unless specified otherwise in this document, Personal Data shall be processed and stored for as long as required by the purpose they have been collected for and may be retained for longer due to applicable legal obligation or based on the Users’ consent.
                </CardDescription>

                <CardTitle>Legal Basis of Processing</CardTitle>
                <CardDescription>
                    The Owner may process Personal Data relating to Users if one of the following applies:<br />
                    - Users have given their consent for one or more specific purposes.<br />
                    - Provision of Data is necessary for the performance of an agreement with the User and/or for any pre-contractual obligations thereof.<br />
                    - Processing is necessary for compliance with a legal obligation to which the Owner is subject.<br />
                    - Processing is related to a task that is carried out in the public interest or in the exercise of official authority vested in the Owner.<br />
                    - Processing is necessary for the purposes of the legitimate interests pursued by the Owner or by a third party.<br />
                    In any case, the Owner will gladly help to clarify the specific legal basis that applies to the processing, and in particular whether the provision of Personal Data is a statutory or contractual requirement, or a requirement necessary to enter into a contract.
                </CardDescription>

                <CardTitle>How We Use Information</CardTitle>
                <CardDescription>
                    We use the information we collect to:<br />
                    - Authenticate and personalize your experience<br />
                    - Improve our services<br />
                    - Communicate with you<br />
                    - Analyze usage patterns to improve our services<br />
                    - Ensure the security of our platform<br />
                    All data usage is in strict compliance with Google&apos;s API Services User Data Policy.
                </CardDescription>

                <CardTitle>Information Sharing</CardTitle>
                <CardDescription>
                    We do not share Google user data with any third parties except as necessary to provide our services or as required by law. We ensure that any third-party services we use are compliant with Google&apos;s data policies. Specifically:<br />
                    - We may share data with service providers who assist us in operating our services, subject to appropriate confidentiality and security measures.
                </CardDescription>

                <CardTitle>Data Security</CardTitle>
                <CardDescription>
                    We implement a variety of security measures to maintain the safety of your personal information. These measures include:<br />
                    - Encryption of data in transit and at rest<br />
                    - Access controls to limit data access to authorized personnel<br />
                    - Regular audits and monitoring for security vulnerabilities
                </CardDescription>

                <CardTitle>Security Practices</CardTitle>
                <CardDescription>
                    We utilize industry-leading services to ensure your data&apos;s security and integrity:<br />
                    <strong>Neon:</strong> Our database management is handled by Neon, which offers automated backups, encryption at rest and in transit, and stringent access controls to protect your data.<br />
                    <strong>Clerk:</strong> We use Clerk for authentication and user management, ensuring secure user sessions with multi-factor authentication (MFA), secure password storage, and regular security updates.<br />
                    <strong>Vercel:</strong> Our application is hosted on Vercel, which provides a secure hosting environment with continuous deployment, automated SSL, and DDoS protection.<br />
                    These third-party services are carefully selected and regularly reviewed to ensure they meet our stringent security standards and comply with all relevant data protection regulations.
                </CardDescription>

                <CardTitle>Data Retention and Deletion</CardTitle>
                <CardDescription>
                    We retain your personal data only as long as necessary to provide our services or as required by law. You can request the deletion of your data at any time by contacting us.<br />
                    Therefore:<br />
                    - Personal Data collected for purposes related to the performance of a contract between the Owner and the User shall be retained until such contract has been fully performed.<br />
                    - Personal Data collected for the purposes of the Owner’s legitimate interests shall be retained as long as needed to fulfill such purposes.<br />
                    The Owner may be allowed to retain Personal Data for a longer period whenever the User has given consent to such processing, as long as such consent is not withdrawn. Furthermore, the Owner may be obliged to retain Personal Data for a longer period whenever required to fulfil a legal obligation or upon order of an authority.<br />
                    Once the retention period expires, Personal Data shall be deleted. Therefore, the right of access, the right to erasure, the right to rectification and the right to data portability cannot be enforced after expiration of the retention period.
                </CardDescription>

                <CardTitle>Cookie Policy</CardTitle>
                <CardDescription>
                    This Application uses Trackers. To learn more, Users may consult the Cookie Policy.
                </CardDescription>

                <CardTitle>Legal Action</CardTitle>
                <CardDescription>
                    The User&apos;s Personal Data may be used for legal purposes by the Owner in Court or in the stages leading to possible legal action arising from improper use of this Application or the related Services.<br />
                    The User declares to be aware that the Owner may be required to reveal personal data upon request of public authorities.
                </CardDescription>

                <CardTitle>The Rights of Users</CardTitle>
                <CardDescription>
                    Users may exercise certain rights regarding their Data processed by the Owner.<br />
                    In particular, Users have the right to do the following, to the extent permitted by law:<br />
                    - Withdraw their consent at any time.<br />
                    - Object to processing of their Data.<br />
                    - Access their Data.<br />
                    - Verify and seek rectification.<br />
                    - Restrict the processing of their Data.<br />
                    - Have their Personal Data deleted or otherwise removed.<br />
                    - Receive their Data and have it transferred to another controller.<br />
                    - Lodge a complaint.<br />
                    Users are also entitled to learn about the legal basis for Data transfers abroad and about the security measures taken by the Owner to safeguard their Data.<br />
                    Any requests to exercise User rights can be directed to the Owner through the contact details provided in this document. Such requests are free of charge and will be answered by the Owner as early as possible and always within one month, providing Users with the information required by law. Any rectification or erasure of Personal Data or restriction of processing will be communicated by the Owner to each recipient, if any, to whom the Personal Data has been disclosed unless this proves impossible or involves disproportionate effort. At the Users’ request, the Owner will inform them about those recipients.
                </CardDescription>

                <CardTitle>Additional Information for Users</CardTitle>
                <CardDescription>
                    <strong>Users in Switzerland</strong><br />
                    This section applies to Users in Switzerland, and, for such Users, supersedes any other possibly divergent or conflicting information contained in the privacy policy.<br />
                    <strong>Users in Brazil</strong><br />
                    This section applies to Users in Brazil according to the &quot;Lei Geral de Proteção de Dados&quot; (the &quot;LGPD&quot;), and for such Users, it supersedes any other possibly divergent or conflicting information contained in the privacy policy.<br />
                    <strong>Users in the United States</strong><br />
                    This section applies to all Users who are residents in the United States. For such Users, this information supersedes any other possibly divergent or conflicting provisions contained in the privacy policy.
                </CardDescription>

                <CardTitle>Changes to This Policy</CardTitle>
                <CardDescription>
                    We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. Changes are effective immediately upon posting. Should the changes affect processing activities performed on the basis of the User’s consent, the Owner shall collect new consent from the User, where required.
                </CardDescription>

                <CardTitle>Contact Us</CardTitle>
                <CardDescription>
                    If you have any questions about this Privacy Policy, please contact us at <Link href="mailto:support@bihance.app">support@bihance.app</Link>.
                </CardDescription>
            </CardContent>
        </Card>
    );
};

export default PrivacyPolicy;
