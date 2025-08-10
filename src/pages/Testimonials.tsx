typescriptreact
import React from 'react';

const Testimonials: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">What Our Users Say</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Placeholder Testimonial 1 */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
          <p className="text-gray-700 italic mb-4">
            "This product has completely changed the way I work. It's intuitive, efficient, and the results are amazing!"
          </p>
          <p className="text-right font-semibold">- Satisfied User</p>
        </div>

        {/* Placeholder Testimonial 2 */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
          <p className="text-gray-700 italic mb-4">
            "I was skeptical at first, but after trying it, I'm a true believer. Highly recommended!"
          </p>
          <p className="text-right font-semibold">- Happy Customer</p>
        </div>

        {/* Placeholder Testimonial 3 */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
          <p className="text-gray-700 italic mb-4">
            "The support team is incredible! They were so helpful and quick to respond to my questions."
          </p>
          <p className="text-right font-semibold">- Grateful Client</p>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;