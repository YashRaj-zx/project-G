import React from 'react';

const Careers: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Careers</h1>
      <div className="prose lg:prose-xl">
        <p>
          We are always looking for talented and passionate individuals to join our team.
          Explore our current openings and see if there's a role that's right for you.
        </p>
        <h2 className="text-2xl font-semibold mt-8 mb-4">Current Openings</h2>
        <ul className="list-disc pl-6">
          <li>Software Engineer (Frontend)</li>
          <li>Software Engineer (Backend)</li>
          <li>Product Manager</li>
          <li>UX/UI Designer</li>
          <li>Marketing Specialist</li>
        </ul>
        <p className="mt-6">
          If you don't see an opening that matches your skills and interests but believe you
          can contribute to our company, feel free to send us your resume and cover letter.
        </p>
      </div>
    </div>
  );
};

export default Careers;