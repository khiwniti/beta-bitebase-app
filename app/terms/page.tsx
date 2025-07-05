import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service - BiteBase",
  description: "BiteBase Terms of Service",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-sm rounded-lg px-6 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
          
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 mb-6">
              Last updated: {new Date().toLocaleDateString()}
            </p>
            
            <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 mb-6">
              By accessing and using BiteBase, you accept and agree to be bound by these terms and conditions.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Use of Service</h2>
            <p className="text-gray-700 mb-6">
              BiteBase is a restaurant intelligence platform. You agree to use the service only for lawful purposes.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Privacy</h2>
            <p className="text-gray-700 mb-6">
              Your privacy is important to us. Please review our Privacy Policy for information about how we collect and use your data.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Contact</h2>
            <p className="text-gray-700">
              If you have any questions about these Terms of Service, please contact us at support@bitebase.app.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}