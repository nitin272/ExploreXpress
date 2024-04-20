import React,{useState} from "react";
import { Link } from "react-router-dom";
import "./Hero.css"
import Navbar from '../../components/Navbar'; 
import Loading from '../../components/Load';

import shape1 from '../../assets/images/shape-1.png';
import shape2 from '../../assets/images/shape-2.png';
import shape3 from '../../assets/images/shape-3.png';
import heroBanner from '../../assets/images/hero-banner.png';

const Hero = () => {
    return(


<div className="container">

<img src={shape1} width="61" height="61" alt="Vector Shape" className="shape shape-1" />
<img src={shape2} width="56" height="74" alt="Vector Shape" className="shape shape-2" />
<img src={shape3} width="57" height="72" alt="Vector Shape" className="shape shape-3" />

<div className="hero-content">
  <p className="section-subtitle">Explore Your Travel</p>
  <h2 className="hero-title">Trusted Travel Agency</h2>
  <p className="hero-text">
    I travel not to go anywhere, but to go. I travel for travel's sake the great affair is to move.
  </p>
  <div className="btn-group">
    
    <Link to="/about" className="btn btn-primary">Contact Us</Link>

  </div>
</div>

<figure className="hero-banner">
  <img src={heroBanner} width="686" height="812" loading="lazy" alt="hero banner" className="w-100" />
</figure>

</div>


    )
}

export default Hero 