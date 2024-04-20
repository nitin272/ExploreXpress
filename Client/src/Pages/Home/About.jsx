import './About.css'
import React from 'react'
import banner from '../../assets/images/about-banner.png'


const About = () => {
    


    return(
        <section class="section about">
    <div class="container">
        <div class="about-content">
            <h2 class="section-title">Explore all tours of India with Explore Express.</h2>
            <ul class="about-list">
                <li class="about-item">
                    <h3>Tour guide</h3>
                    <p>With Explore Express, dive into the heart of India with our expert guides. Discover hidden gems and stories untold, making each journey unforgettable.</p>
                </li>
                <li class="about-item">
                    <h3>Friendly price</h3>
                    <p>Explore Express believes in making adventures accessible to all. Enjoy competitive pricing without compromising on quality or experience.</p>
                </li>
                <li class="about-item">
                    <h3>Reliable tour</h3>
                    <p>Safety and reliability are our top priorities. Journey with us, knowing you're in capable hands, for a stress-free exploration of India’s wonders.</p>
                </li>
            </ul>
            <a href="#" class="btn-primary">Book Now </a>
        </div>
        <figure >
            <img src={banner} width="650" height="700" loading="lazy" alt="about banner"/>
        </figure>
    </div>
</section>
    )




}

export default About