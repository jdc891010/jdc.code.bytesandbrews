import { useState, useEffect } from "react";

const PrivacyPolicy = () => {
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
        <h1 className="text-3xl md:text-4xl font-bold text-coffee-brown mb-6">Privacy Policy</h1>
        <p className="text-sm text-gray-600 mb-8">Last Updated: {lastUpdated}</p>
        
        <div className="prose max-w-none">
          <p className="mb-6">
            Brews and Bytes ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our website and services. By using Brews and Bytes, you agree to the collection and use of information in accordance with this policy.
          </p>

          <h2 className="text-2xl font-bold text-coffee-brown mt-8 mb-4">Information We Collect</h2>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">Speed Data Metrics</h3>
          <p className="mb-4">
            Our primary data collection focuses on technical performance metrics related to coffee shop environments. When you use our Wi-Fi speed test feature, we collect:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Download and upload speed measurements</li>
            <li>Latency (ping) data</li>
            <li>Jitter measurements</li>
            <li>Connection type information (e.g., Wi-Fi, cellular)</li>
            <li>Device type and operating system information</li>
            <li>Timestamp of the test</li>
            <li>General geographic location (city/region level only, not precise location)</li>
          </ul>
          <p className="mb-4">
            This data is collected solely to provide our core service of mapping coffee shop Wi-Fi quality and is not linked to any personally identifiable information.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">Voluntarily Provided Information</h3>
          <p className="mb-4">
            We collect information you voluntarily provide when:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Submitting coffee shop information or reviews</li>
            <li>Contacting us through our support channels</li>
            <li>Participating in surveys or feedback requests</li>
            <li>Subscribing to our newsletter</li>
          </ul>
          <p className="mb-4">
            This may include your name, email address, and any other information you choose to share with us.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">Automatically Collected Information</h3>
          <p className="mb-4">
            When you access our website, we may automatically collect certain information:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>IP address</li>
            <li>Browser type and version</li>
            <li>Operating system</li>
            <li>Referring URLs</li>
            <li>Pages visited and time spent on our site</li>
          </ul>
          <p className="mb-4">
            This information is used for analytical purposes to improve our website and user experience.
          </p>

          <h2 className="text-2xl font-bold text-coffee-brown mt-8 mb-4">Information We Do NOT Collect</h2>
          <p className="mb-4">
            We want to be explicit about what we do not collect:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>We do NOT collect precise location data (GPS coordinates)</li>
            <li>We do NOT track your movements or location history</li>
            <li>We do NOT collect personal identification information unless voluntarily provided</li>
            <li>We do NOT collect financial information</li>
            <li>We do NOT collect information from third-party sources</li>
          </ul>

          <h2 className="text-2xl font-bold text-coffee-brown mt-8 mb-4">How We Use Your Information</h2>
          <p className="mb-4">
            We use the information we collect for the following purposes:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>To provide and maintain our services</li>
            <li>To improve and personalize your experience</li>
            <li>To analyze website usage and performance</li>
            <li>To communicate with you about our services</li>
            <li>To respond to your inquiries and support requests</li>
            <li>To send you newsletters and updates (if subscribed)</li>
            <li>To monitor and analyze trends and usage patterns</li>
          </ul>

          <h2 className="text-2xl font-bold text-coffee-brown mt-8 mb-4">Data Sharing and Disclosure</h2>
          <p className="mb-4">
            We do not sell, trade, or otherwise transfer your personally identifiable information to third parties. We may share aggregated, non-personally identifiable information publicly and with our partners.
          </p>
          <p className="mb-4">
            We may disclose your information if required by law or if we believe such action is necessary to:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Comply with legal obligations</li>
            <li>Protect and defend our rights and property</li>
            <li>Prevent or investigate possible wrongdoing in connection with our service</li>
            <li>Protect the personal safety of users or the public</li>
          </ul>

          <h2 className="text-2xl font-bold text-coffee-brown mt-8 mb-4">Data Security</h2>
          <p className="mb-4">
            We implement appropriate security measures to protect against unauthorized access, alteration, disclosure, or destruction of your personal information. However, please note that no method of transmission over the internet or electronic storage is 100% secure.
          </p>

          <h2 className="text-2xl font-bold text-coffee-brown mt-8 mb-4">Your Rights</h2>
          <p className="mb-4">
            You have the right to:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Access the personal information we hold about you</li>
            <li>Request correction of inaccurate information</li>
            <li>Request deletion of your information</li>
            <li>Object to or restrict processing of your information</li>
            <li>Withdraw consent for data processing</li>
          </ul>
          <p className="mb-4">
            To exercise these rights, please contact us using the information provided below.
          </p>

          <h2 className="text-2xl font-bold text-coffee-brown mt-8 mb-4">Data Retention</h2>
          <p className="mb-4">
            We retain your information for as long as necessary to provide our services and fulfill the purposes outlined in this policy, unless a longer retention period is required by law.
          </p>

          <h2 className="text-2xl font-bold text-coffee-brown mt-8 mb-4">Children's Privacy</h2>
          <p className="mb-4">
            Our services are not intended for individuals under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected personal information from a child under 13, we will take steps to delete such information.
          </p>

          <h2 className="text-2xl font-bold text-coffee-brown mt-8 mb-4">Changes to This Privacy Policy</h2>
          <p className="mb-4">
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
          </p>

          <h2 className="text-2xl font-bold text-coffee-brown mt-8 mb-4">Contact Us</h2>
          <p className="mb-4">
            If you have any questions about this Privacy Policy, please contact us at:
          </p>
          <div className="bg-gray-100 p-4 rounded-lg mb-6">
            <p className="font-semibold">Brews and Bytes</p>
            <p>Email: privacy@brewsandbytes.com</p>
            <p>Website: www.brewsandbytes.com</p>
          </div>

          <p className="mt-8 text-sm text-gray-600">
            By using Brews and Bytes, you acknowledge that you have read and understood this Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;