import { useState, useEffect } from "react";

const TermsOfService = () => {
  const [lastUpdated, setLastUpdated] = useState("");

  useEffect(() => {
    // Set the last updated date to today
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    setLastUpdated(formattedDate);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-coffee-brown mb-6">Terms of Service</h1>
        <p className="text-sm text-gray-600 mb-8">Last Updated: {lastUpdated}</p>
        
        <div className="prose max-w-none">
          <p className="mb-6">
            Welcome to Brews and Bytes. These Terms of Service ("Terms") govern your access to and use of our website and services. By accessing or using Brews and Bytes, you agree to be bound by these Terms and our Privacy Policy.
          </p>

          <h2 className="text-2xl font-bold text-coffee-brown mt-8 mb-4">1. Acceptance of Terms</h2>
          <p className="mb-4">
            By accessing or using Brews and Bytes ("the Service"), you agree to comply with and be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, please do not use our Service.
          </p>

          <h2 className="text-2xl font-bold text-coffee-brown mt-8 mb-4">2. Description of Service</h2>
          <p className="mb-4">
            Brews and Bytes provides a platform for discovering coffee shops with quality Wi-Fi, community features for remote workers and digital nomads, and tools for evaluating coffee shop environments. Our services include but are not limited to:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Wi-Fi speed testing and mapping</li>
            <li>Coffee shop discovery and reviews</li>
            <li>Community forums and discussion boards</li>
            <li>Content related to remote work and coffee culture</li>
          </ul>

          <h2 className="text-2xl font-bold text-coffee-brown mt-8 mb-4">3. Eligibility</h2>
          <p className="mb-4">
            You must be at least 13 years of age to use our Service. By agreeing to these Terms, you represent and warrant that you meet this eligibility requirement.
          </p>

          <h2 className="text-2xl font-bold text-coffee-brown mt-8 mb-4">4. Account Registration</h2>
          <p className="mb-4">
            To access certain features of our Service, you may be required to create an account. You agree to:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Provide accurate, current, and complete information</li>
            <li>Maintain and promptly update your account information</li>
            <li>Maintain the security of your account credentials</li>
            <li>Notify us immediately of any unauthorized use of your account</li>
          </ul>
          <p className="mb-4">
            You are responsible for all activities that occur under your account.
          </p>

          <h2 className="text-2xl font-bold text-coffee-brown mt-8 mb-4">5. User Conduct</h2>
          <p className="mb-4">
            You agree not to use our Service to:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Violate any laws or regulations</li>
            <li>Infringe upon the rights of others</li>
            <li>Post or transmit harmful, threatening, or offensive content</li>
            <li>Engage in any activity that could damage or disrupt our Service</li>
            <li>Attempt to gain unauthorized access to our systems</li>
            <li>Use our Service for any commercial purpose without our express written consent</li>
          </ul>

          <h2 className="text-2xl font-bold text-coffee-brown mt-8 mb-4">6. Content Ownership and License</h2>
          <p className="mb-4">
            You retain ownership of any content you submit to our Service. By submitting content, you grant Brews and Bytes a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and display your content for the purpose of providing our Service.
          </p>
          <p className="mb-4">
            You represent and warrant that you have all necessary rights to submit any content you provide to our Service and that your content does not violate these Terms or any third-party rights.
          </p>

          <h2 className="text-2xl font-bold text-coffee-brown mt-8 mb-4">7. Intellectual Property</h2>
          <p className="mb-4">
            All content, features, and functionality of our Service, including but not limited to text, graphics, logos, and software, are the exclusive property of Brews and Bytes and are protected by copyright, trademark, and other intellectual property laws.
          </p>

          <h2 className="text-2xl font-bold text-coffee-brown mt-8 mb-4">8. Third-Party Services</h2>
          <p className="mb-4">
            Our Service may contain links to third-party websites or services that are not owned or controlled by Brews and Bytes. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites or services.
          </p>

          <h2 className="text-2xl font-bold text-coffee-brown mt-8 mb-4">9. Disclaimer of Warranties</h2>
          <p className="mb-4">
            Our Service is provided "as is" and "as available" without warranties of any kind, either express or implied. Brews and Bytes disclaims all warranties, including but not limited to:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Merchantability</li>
            <li>Non-infringement</li>
            <li>Accuracy of information</li>
            <li>Timeliness of service</li>
          </ul>
          <p className="mb-4">
            We do not warrant that our Service will be uninterrupted or error-free.
          </p>

          <h2 className="text-2xl font-bold text-coffee-brown mt-8 mb-4">10. Limitation of Liability</h2>
          <p className="mb-4">
            To the maximum extent permitted by law, Brews and Bytes shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or use.
          </p>
          <p className="mb-4">
            In no event shall our total liability exceed the amount you have paid to Brews and Bytes in the past twelve months.
          </p>

          <h2 className="text-2xl font-bold text-coffee-brown mt-8 mb-4">11. Indemnification</h2>
          <p className="mb-4">
            You agree to indemnify and hold harmless Brews and Bytes, its affiliates, officers, agents, and employees from any claim or demand, including reasonable attorneys' fees, made by any third party due to or arising out of your use of our Service or violation of these Terms.
          </p>

          <h2 className="text-2xl font-bold text-coffee-brown mt-8 mb-4">12. Termination</h2>
          <p className="mb-4">
            We may terminate or suspend your access to our Service immediately, without prior notice, for any reason, including but not limited to breach of these Terms.
          </p>
          <p className="mb-4">
            Upon termination, your right to use our Service will cease immediately.
          </p>

          <h2 className="text-2xl font-bold text-coffee-brown mt-8 mb-4">13. Changes to Terms</h2>
          <p className="mb-4">
            We reserve the right to modify these Terms at any time. We will notify you of any changes by posting the new Terms on this page and updating the "Last Updated" date.
          </p>
          <p className="mb-4">
            Your continued use of our Service after any such changes constitutes your acceptance of the new Terms.
          </p>

          <h2 className="text-2xl font-bold text-coffee-brown mt-8 mb-4">14. Governing Law</h2>
          <p className="mb-4">
            These Terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction], without regard to its conflict of law provisions.
          </p>

          <h2 className="text-2xl font-bold text-coffee-brown mt-8 mb-4">15. Contact Information</h2>
          <p className="mb-4">
            If you have any questions about these Terms of Service, please contact us at:
          </p>
          <div className="bg-gray-100 p-4 rounded-lg mb-6">
            <p className="font-semibold">Brews and Bytes</p>
            <p>Email: terms@brewsandbytes.com</p>
            <p>Website: www.brewsandbytes.com</p>
          </div>

          <p className="mt-8 text-sm text-gray-600">
            By using Brews and Bytes, you acknowledge that you have read, understood, and agreed to these Terms of Service.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;