import { useState, useEffect} from "react";

import { Link } from "react-router-dom";
import Loading from "../../components/Load";
const MidHome = () => {
    const [hotels, setHotels] = useState([]);
    const [restaurants, setRestaurants] = useState([]);
    const [places, setPlaces] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

   
    const apiurl = "https://explorexpress-n2ek.onrender.com";

    
    useEffect(() => {
        const fetchData = async () => {
          try {
            const responses = await Promise.all([
              fetch(`${apiurl}/hotels`),
              fetch(`${apiurl}/restaurants`),
              fetch(`${apiurl}/places`)
            ]);
            const data = await Promise.all(responses.map(response => response.json()));
    
            setHotels(data[0]);
            setRestaurants(data[1]);
            setPlaces(data[2]);
          } catch (err) {
            console.error("Error fetching data:", err);
            setError(err.message);
          } finally {
            setIsLoading(false);
          }
        };
    
        fetchData();
      }, []);
    
      if (isLoading) return <Loading /> ;
      if (error) return <p>Error fetching data: {error}</p>;

    return(
<>
        <section className="popular-places">
        <h4 className='main-heading'>Popular Destinations</h4>
        <div className="places-container">
          {places.slice(0, 5).map(place => ( 
            <div key={place._id} className="place">
              <img src={place.image1} alt={place.name} />
              <div className="place-details">
                <h5>{place.name}</h5>
                <Link to={`/place/${place._id}`} className="details-link">More Details</Link>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      <section className="famous-restaurants">
        <h4 className='main-heading'>Famous Restaurants</h4>
        <div className="restaurants-container">
          {restaurants.slice(0,3).map(restaurant => (
            <div key={restaurant._id} className="restaurant">
              <img src={restaurant.image1} alt={restaurant.name} />
              <div className="restaurant-details">
                <h5>{restaurant.name}</h5>
                <Link to={`/restaurant/${restaurant._id}`} className="details-link">More Details</Link>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      <section className="famous-hotels">
        <h4 className='main-heading' >Famous Hotels</h4>
        <div className="hotels-container">
          {hotels.map(hotel => (
            <div key={hotel._id} className="hotel">
              <img src={hotel.image1} alt={hotel.name} />
              <div className="hotel-details">
                <h5>{hotel.name}</h5>
                <Link to={`/hotel/${hotel._id}`} className="details-link">More Details</Link>
              </div>
            </div>
          ))}
        </div>
      </section>
</>      



    )
}

export default MidHome