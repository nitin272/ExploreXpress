import React from 'react';
import banner from '../../assets/images/about-banner.png';

const About = () => {
  return (
    <section className="flex flex-col items-center text-center bg-gray-100 py-10 animate-fadeIn">
      <div className="container mx-auto px-4 flex flex-wrap justify-between items-start">
        <div className="w-full lg:w-3/5 mb-6 lg:mb-0">
          <h2 className="text-3xl font-semibold text-blue-600 mb-5">Explore all tours of India with Explore Express.</h2>
          <ul className="list-none p-0">
            <li className="mb-10">
              <h3 className="text-2xl font-bold text-green-600 mb-3">Tour guide</h3>
              <p>With Explore Express, dive into the heart of India with our expert guides. Discover hidden gems and stories untold, making each journey unforgettable.</p>
            </li>
            <li className="mb-10">
              <h3 className="text-2xl font-bold text-orange-600 mb-3">Friendly price</h3>
              <p>Explore Express believes in making adventures accessible to all. Enjoy competitive pricing without compromising on quality or experience.</p>
            </li>
            <li className="mb-10">
              <h3 className="text-2xl font-bold text-red-600 mb-3">Reliable tour</h3>
              <p>Safety and reliability are our top priorities. Journey with us, knowing you're in capable hands, for a stress-free exploration of India’s wonders.</p>
            </li>
          </ul>
          <a href="#" className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300">Book Now</a>
        </div>
        <figure className="w-full lg:w-2/5 flex justify-center">
          <img src={banner} alt="about banner" className="max-w-full h-auto lg:max-w-3/4" loading="lazy" />
        </figure>
      </div>
    </section>
  );
}

export default About;

