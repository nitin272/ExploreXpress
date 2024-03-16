import React, { useState } from "react";
import Navbar from "../components/Navbar";
import "./Train.css";

const Train = () => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const results = [
      { id: 1, name: 'Express 101', from: 'Station 1', to: 'Station 2', departure: '08:00 AM', arrival: '10:00 AM' },
      { id: 2, name: 'Express 202', from: 'Station 3', to: 'Station 4', departure: '09:00 AM', arrival: '11:30 AM' },
    ];
    setSearchResults(results);
  };

  return (
    <>
      <div>
        <Navbar />
      </div>
      <div className='home__container'>
        <div className='home'>
          <p>Search Your Train</p>
          <form onSubmit={handleSubmit}>
            <div className='inputs'>
              <div className='from home__input'>
                <p>FROM</p>
                <select defaultValue='2'>
                  <option value=''>Select City</option>
                </select>
              </div>
              <div className='to home__input'>
                <p>TO</p>
                <select defaultValue='2'>
                  <option value='dehli'>Select City</option>
                </select>
              </div>
              <div className='departure home__input'>
                <p>DEPARTURE DATE</p>
                <input type="date" />
              </div>
            </div>
            <div>
              <button className='home__search' type="submit">SEARCH</button>
            </div>
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