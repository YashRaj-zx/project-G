import React from 'react';

const Contact: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Contact Us</h1>

      <div className="max-w-2xl mx-auto text-center">
        <p className="text-lg mb-4">
          Have a question or want to get in touch? We'd love to hear from you!
          Please use the information below to contact us.
        </p>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
          <p className="text-lg">
            Email: <a href="mailto:info@example.com" className="text-blue-600 hover:underline">info@example.com</a>
          </p>
          <p className="text-lg">
            Phone: <a href="tel:+1234567890" className="text-blue-600 hover:underline">+1 (234) 567-890</a>
          </p>
          <p className="text-lg">
            Address: 123 Main Street, Anytown, USA 12345
          </p>
        </div>

        {/* Optional: Add a simple contact form here */}
        {/*
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Send us a message</h2>
          <form className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Your Name"
              className="p-3 border border-gray-300 rounded-md"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="p-3 border border-gray-300 rounded-md"
            />
            <textarea
              placeholder="Your Message"
              rows={6}
              className="p-3 border border-gray-300 rounded-md"
            ></textarea>
            <button
              type="submit"
              className="bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition"
            >
              Send Message
            </button>
          </form>
        </div>
        */}
      </div>
    </div>
  );
};

export default Contact;