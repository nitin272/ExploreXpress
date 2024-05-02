import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaGoogle } from 'react-icons/fa';

// Define social links and their colors for hover states
const socialLinks = [
  { icon: FaFacebookF, href: "https://facebook.com", color: "#3b5998" },
  { icon: FaTwitter, href: "https://twitter.com", color: "#1DA1F2" },
  { icon: FaInstagram, href: "https://instagram.com", color: "#C13584" },
  { icon: FaLinkedinIn, href: "https://linkedin.com", color: "#0A66C2" },
  { icon: FaGoogle, href: "https://google.com", color: "#DB4437" }
];

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white p-4">
        <div className="max-w-screen-xl mx-auto flex flex-col items-center">
            <div className="w-full flex justify-center space-x-4 py-2">
                {socialLinks.map((link, index) => (
                    <a key={index} href={link.href} className="transition duration-300 ease-in-out transform hover:rotate-360 hover:scale-125">
                        {/* Use the icon component correctly */}
                        <link.icon className="text-2xl text-white hover:text-opacity-100" style={{ color: link.color, transition: 'color 0.3s ease-in-out' }} />
                    </a>
                ))}
            </div>
            <hr className="my-2 border-gray-700 w-full" />
            <div className="flex flex-col items-center space-y-2">
                <a href="#" className="text-lg font-bold hover:text-gray-300 transition duration-300 ease-in-out">Tourest</a>
                <p className="text-sm text-gray-400">
                    &copy; {new Date().getFullYear()} <a href="#" className="hover:underline">codewithsadee</a>. All Rights Reserved
                </p>
            </div>
        </div>
    </footer>
  );
};

export default Footer;
