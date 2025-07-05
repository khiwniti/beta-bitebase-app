import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - BiteBase",
  description: "BiteBase Privacy Policy",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-sm rounded-lg px-6 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
          
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 mb-6">
              Last updated: {new Date().toLocaleDateString()}
            </p>
            
            <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Information We Collect</h2>
            <p className="text-gray-700 mb-6">
              We collect information you provide directly to us, such as when you create an account, use our services, or contact us.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-900 mb-4">2. How We Use Your Information</h2>
            <p className="text-gray-700 mb-6">
              We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Information Sharing</h2>
            <p className="text-gray-700 mb-6">
              We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Data Security</h2>
            <p className="text-gray-700 mb-6">
              We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Contact Us</h2>
            <p className="text-gray-700">
              If you have any questions about this Privacy Policy, please contact us at privacy@bitebase.app.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}