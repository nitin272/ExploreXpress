import React from "react";
import { Link } from "react-router-dom";
import Navbar from '../../components/Navbar'; 
import Loading from '../../components/Load';

import shape1 from '../../assets/images/shape-1.png';
import shape2 from '../../assets/images/shape-2.png';
import shape3 from '../../assets/images/shape-3.png';
import heroBanner from '../../assets/images/hero-banner.png';
import "./Hero.css"; // Import custom CSS for animations

const Hero = () => {
    return (
        <div className="container mx-auto relative">

            <img src={shape1} alt="Vector Shape" className="hidden md:block absolute top-10 left-10 animate-spin-slow" width="61" height="61" />
            <img src={shape2} alt="Vector Shape" className="hidden md:block absolute top-1/4 right-10 animate-spin-slow animation-delay-100" width="56" height="74" />
            <img src={shape3} alt="Vector Shape" className="hidden md:block absolute bottom-10 left-1/3 animate-spin-slow animation-delay-200" width="57" height="72" />

            <div className="text-center p-6 md:text-left md:flex md:items-center md:justify-between">
                <div>
                    <p className="text-3xl text-yellow-400 font-bold tracking-wide mb-4 shadow-lg">
                        Explore Your Travel
                    </p>
                    <h2 className="text-4xl md:text-5xl text-blue-800 font-bold leading-tight mb-5">
                        Trusted Travel Agency
                    </h2>
                    <p className="text-gray-600 text-xl mb-5">
                        I travel not to go anywhere, but to go. I travel for travel's sake. The great affair is to move.
                    </p>
                    <div className="flex justify-center md:justify-start gap-4 flex-wrap">
                        <Link to="/about" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            Contact Us
                        </Link>
                    </div>
                </div>

                <figure className="w-full md:max-w-md">
                    <img src={heroBanner} alt="Hero Banner" className="w-full" loading="lazy" />
                </figure>
            </div>
        </div>
    );
};

export default Hero;
