import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHotel, faTrain, faUtensils, faLandmark, faPalette, faMapMarkedAlt, faTags, faMap, faShieldAlt} from '@fortawesome/free-solid-svg-icons';
import { faFacebookF,faTwitter, faInstagram, faLinkedinIn, faGoogle } from '@fortawesome/free-brands-svg-icons';
import Navbar from '../../components/Navbar'; 
import Loading from '../../components/Load';
import banner from '../../assets/images/about-banner.png';
import shape1 from '../../assets/images/shape-1.png';
import shape2 from '../../assets/images/shape-2.png';
import shape3 from '../../assets/images/shape-3.png';
import heroBanner from '../../assets/images/hero-banner.png';
import heroBgBottom from '../../assets/images/hero-bg-bottom.png';
import heroBgTop from '../../assets/images/hero-bg-top.png';
import MidHome from './midHome';
import Footer from '../../components/Footer';
import Hero from './Hero';
import About from './About';
const Home = () => {
  const [isLoading, setIsLoading] = useState(true);  

  useEffect(() => {

    setTimeout(() => {
      setIsLoading(false); 
    }, 1000);  
  }, []);

  if (isLoading) {
    return <Loading />;  // Show loading component while data is loading
  }

  return (
    <>
      <div className="home-container">
        <Navbar />
        <main className="hero-section">
          <div className="navigation-options">
            <ul>
              <li style={{ color: "#4B5320" }}>
                <Link to='/Hotel'>
                  <FontAwesomeIcon icon={faHotel} style={{ color: "#8A2BE2", fontSize: "33px" }} /> Hotels
                </Link>
              </li>
              <li style={{ color: "black" }}>
                <Link to="/Restaurent">
                  <FontAwesomeIcon icon={faUtensils} style={{ color: "#FF5722", fontSize: "33px" }} /> Restaurants
                </Link>
              </li>
              <li style={{ color: "Black" }}>
                <Link to="/places">
                  <FontAwesomeIcon icon={faLandmark} style={{ color: " #f95959", fontSize: "33px" }} />Destinations
                </Link>
              </li>
              <li style={{ color: "black" }}>
                <Link to="/culture">
                  <FontAwesomeIcon icon={faPalette} style={{ color: " #fdc57b", fontSize: "33px" }} /> Culture
                </Link>
              </li>
            </ul>
          </div>
          <h2 className='heading'>Explore the world with ExploreXpress</h2>
        </main>
      </div>

      <section className="section hero">
     <Hero />
     </section>

<MidHome />
<section>
  <About />
</section>


{/* <About /> */}
<footer>
  <Footer />
</footer>






    
    </>
  );
};

export default Home;
