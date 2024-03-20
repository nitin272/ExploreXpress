import React, { useState } from "react";
import axios from 'axios';
import Navbar from "../components/Navbar";
import "./Train.css";

const Train = () => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const fetchTrains = async () => {
    const options = {
      method: 'GET',
      url: 'https://irctc1.p.rapidapi.com/api/v1/searchTrain',
      params: { query: from }, 
      headers: {
        'X-RapidAPI-Key': 'b36ecb5623msh532f6ff506ca988p1be5b2jsn5ebb790f733a',
        'X-RapidAPI-Host': 'irctc1.p.rapidapi.com'
      }
    };

    try {
      const response = await axios.request(options);

      console.log(response.data);
   
      setSearchResults(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error(error);
      setSearchResults([]); 
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchTrains();
  };

  return (
    <>
      <Navbar />
      <div className='home__container'>
        <div className='home'>
          <p>Search Your Train</p>
          <form onSubmit={handleSubmit}>
            <div className='inputs'>
              <div className='from home__input'>
                <p>FROM</p>
                <input
                  type="text"
                  value={from}
                  onChange={e => setFrom(e.target.value)}
                  placeholder="Enter source station"
                />
              </div>
              <div className='to home__input'>
                <p>TO</p>
                <input
                  type="text"
                  value={to}
                  onChange={e => setTo(e.target.value)}
                  placeholder="Enter destination station"
                />
              </div>
              <div className='departure home__input'>
                <p>DEPARTURE DATE</p>
                <input
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                />
              </div>
            </div>
            <button className='home__search' type="submit">SEARCH</button>
          </form>
        </div>
      </div>
      <h2 className="search-results-title">Search Results</h2>
      <div className="train-details">
        {searchResults.map(train => (
          <div key={train.id} className="train-detail-item">
            <p><strong>Train Name:</strong> {train.name}</p>
            <p><strong>From:</strong> {train.from} <strong>To:</strong> {train.to}</p>
            <p><strong>Departure:</strong> {train.departure} <strong>Arrival:</strong> {train.arrival}</p>
          </div>
        ))}
      </div>
    </>
  );
};

export default Train;
