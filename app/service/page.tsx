import Head from 'next/head';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>Terms of Service</title>
      </Head>
      <div className="max-w-4xl w-full space-y-8 p-10 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-center">Terms of Service</h1>
        <section>
          <h2 className="text-2xl font-semibold">Introduction</h2>
          <p>Welcome to Bihance. By using our services, you agree to comply with and be bound by the following terms of service. Please review the following terms carefully.</p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold">Data Collection</h2>
          <div className="ml-4">
            <h3 className="text-xl font-semibold">1. Information We Collect</h3>
            <ul className="list-disc list-inside">
              <li><strong>OpenID:</strong> Used for user authentication.</li>
              <li><strong>Profile Information:</strong> Includes name, avatar, and other basic profile details.</li>
              <li><strong>Email:</strong> Used for communication and account recovery.</li>
            </ul>
          </div>
          <div className="ml-4">
            <h3 className="text-xl font-semibold">2. Use of Information</h3>
            <p>The information collected is used solely for the purposes of providing and improving our services, verifying user identity, and communicating with users.</p>
          </div>
          <div className="ml-4">
            <h3 className="text-xl font-semibold">3. Data Security</h3>
            <p>We implement appropriate security measures to protect your data from unauthorized access, alteration, disclosure, or destruction.</p>
          </div>
          <div className="ml-4">
            <h3 className="text-xl font-semibold">4. Data Sharing</h3>
            <p>We do not share, sell, or lease your personal information to third parties without your consent, except as required by law.</p>
          </div>
          <div className="ml-4">
            <h3 className="text-xl font-semibold">5. User Rights</h3>
            <p>You have the right to access, update, or delete your personal information at any time. Please contact us at <a href="mailto:support@bihance.app" className="text-blue-600">support@bihance.app</a> for any requests regarding your data.</p>
          </div>
        </section>
        <section>
          <h2 className="text-2xl font-semibold">Changes to Terms</h2>
          <p>We may update these terms from time to time. We will notify users of any significant changes by posting a notice on our site.</p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold">Contact Us</h2>
          <p>If you have any questions or concerns about these Terms of Service, please contact us at <a href="mailto:support@bihance.app" className="text-blue-600">support@bihance.app</a>.</p>
        </section>
      </div>
    </div>
  );
}
