import React from 'react';

const About = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 pt-32 pb-16 text-center">
      <h1 className="font-serif text-4xl text-deep-green mb-6">Our Philosophy</h1>
      <p className="text-gray-600 leading-relaxed mb-8">
        At Meraki, we believe yoga is more than just physical exercise; it is a path to self-discovery.
        Founded in 2015, our studio has been a sanctuary for thousands of students looking to reconnect with themselves.
      </p>
      <div className="aspect-w-16 aspect-h-9 rounded-2xl overflow-hidden mb-8">
        <img src="https://picsum.photos/seed/studio/1200/600" alt="Studio" className="object-cover w-full h-96 rounded-2xl" />
      </div>
    </div>
  );
};
export default About;