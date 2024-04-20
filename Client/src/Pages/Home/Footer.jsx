import React from 'react';
import './Footer.css';
import footerImg from '../../assets/images/footer-bg.png';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaGoogle } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="footer-main">
          
                <div className="footer-bottom-section">
                    <hr className="hr-footer" />
                    <a href="#" className="footer-logo">Tourest</a>
                    <p className="footer-copyright">
                        &copy; {new Date().getFullYear()} <a href="#" className="footer-creator-link">codewithsadee</a>. All Rights Reserved
                    </p>
                </div>
   
        </footer>
    );
};

export default Footer;
