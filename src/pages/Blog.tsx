import React from 'react';

const Blog: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Our Blog</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Placeholder Blog Post 1 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-2">Blog Post Title 1</h2>
          <p className="text-gray-600 text-sm mb-4">Published on January 1, 2023</p>
          <p className="text-gray-700">
            This is a brief summary of the first blog post. It should give readers an idea
            of what the post is about and encourage them to read more.
          </p>
          <a href="#" className="text-blue-500 mt-4 inline-block">Read More</a>
        </div>

        {/* Placeholder Blog Post 2 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-2">Blog Post Title 2</h2>
          <p className="text-gray-600 text-sm mb-4">Published on February 15, 2023</p>
          <p className="text-gray-700">
            Another placeholder for a blog post summary. This demonstrates how multiple
            posts could be displayed on the page.
          </p>
          <a href="#" className="text-blue-500 mt-4 inline-block">Read More</a>
        </div>

        {/* Placeholder Blog Post 3 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-2">Blog Post Title 3</h2>
          <p className="text-gray-600 text-sm mb-4">Published on March 10, 2023</p>
          <p className="text-gray-700">
            A third example of a blog post placeholder. You would replace these with
            actual blog post data fetched from an API or CMS.
          </p>
          <a href="#" className="text-blue-500 mt-4 inline-block">Read More</a>
        </div>
      </div>
    </div>
  );
};

export default Blog;