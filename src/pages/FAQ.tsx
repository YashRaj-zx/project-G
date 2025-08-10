typescriptreact
import React from 'react';

const FAQ: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Frequently Asked Questions</h1>

      <div className="space-y-6">
        <div className="border-b pb-4">
          <h2 className="text-xl font-semibold mb-2">What is your service?</h2>
          <p className="text-gray-700">
            Our service provides a comprehensive solution for [brief description of your service].
          </p>
        </div>

        <div className="border-b pb-4">
          <h2 className="text-xl font-semibold mb-2">How does it work?</h2>
          <p className="text-gray-700">
            Our service works by [brief explanation of how your service works]. You can follow these steps: [list basic steps].
          </p>
        </div>

        <div className="border-b pb-4">
          <h2 className="text-xl font-semibold mb-2">What are the pricing options?</h2>
          <p className="text-gray-700">
            We offer various pricing plans to suit your needs. You can find detailed information on our <a href="/pricing" className="text-blue-600 hover:underline">Pricing page</a>.
          </p>
        </div>

        <div className="border-b pb-4">
          <h2 className="text-xl font-semibold mb-2">Is there a free trial?</h2>
          <p className="text-gray-700">
            Yes, we offer a free trial for new users. You can sign up <a href="/signup" className="text-blue-600 hover:underline">here</a> to get started.
          </p>
        </div>

        <div className="border-b pb-4">
          <h2 className="text-xl font-semibold mb-2">How can I contact support?</h2>
          <p className="text-gray-700">
            You can contact our support team through the contact form on our <a href="/contact" className="text-blue-600 hover:underline">Contact page</a> or by emailing us at [your support email address].
          </p>
        </div>

        {/* Add more FAQ items as needed */}
      </div>
    </div>
  );
};

export default FAQ;