import React, { useState, useEffect } from 'react';
import data from './data.json';
import './App.css';

function App() {
  const [guideData] = useState(data);
  const [category, setCategory] = useState('');
  const [categories] = useState([
    "Job Number",
    "KPDES\nPermit #",
    "AI#",
    "Site Name",
    "Sampling Frequency"
  ]);
  const [uniqueValues, setUniqueValues] = useState([]);
  const [filteredData, setFilteredData] = useState([]); // Start with an empty array
  const [datesSampled, setDatesSampled] = useState({});

  useEffect(() => {
    if (category) {
      const values = [...new Set(guideData.map(item => item[category] || "N/A"))];
      setUniqueValues(values);
      setFilteredData([]); // Reset filtered data when category changes
    }
  }, [category, guideData]);

  // Load initial dates from localStorage
  useEffect(() => {
    const initialDates = {};
    guideData.forEach(item => {
      const siteName = item["Site Name"];
      if (siteName) {
        initialDates[siteName] = localStorage.getItem(`dateSampled-${siteName}`) || "";
      }
    });
    setDatesSampled(initialDates);
  }, [guideData]);

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  const handleValueChange = (event) => {
    const selectedValue = event.target.value;
    if (selectedValue) {
      const filtered = guideData.filter(item => (item[category] || "N/A") === selectedValue);
      setFilteredData(filtered);
    } else {
      setFilteredData([]);
    }
  };

  const handleDateChange = (siteName, date) => {
    setDatesSampled(prevDates => ({
      ...prevDates,
      [siteName]: date
    }));
    localStorage.setItem(`dateSampled-${siteName}`, date);
  };

  const openGoogleMaps = (longitude, latitude) => {
const lon = parseFloat(longitude);    
const lat = parseFloat(latitude);

    if (!isNaN(lat) && !isNaN(lon)) {
      const url = `https://www.google.com/maps?q=${lat},${lon}`;
      window.open(url, '_blank');
    } else {
      alert("Latitude and Longitude not available or not in the correct format for this site.");
    }
  };

  return (
    <div className="app-container">
      <header>
        <img src={`${process.env.PUBLIC_URL}/logo.jpg`} alt="Company Logo" className="company-logo" />
        <h1>Sampling Guide</h1>
      </header>
      <main>
        <div>
          <label>Select Category:</label>
          <select onChange={handleCategoryChange} value={category}>
            <option value="">--Select--</option>
            {categories.map((cat, index) => (
              <option key={index} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {category && (
          <div>
            <label>Select Value:</label>
            <select onChange={handleValueChange}>
              <option value="">--Select--</option>
              {uniqueValues.map((val, index) => (
                <option key={index} value={val}>{val}</option>
              ))}
            </select>
          </div>
        )}

        <section>
          {filteredData.length > 0 ? (
            filteredData.map((item, index) => {
              const siteName = item["Site Name"];
              const dateSampled = datesSampled[siteName] || "";
              const latitude = item["Latitude"];
              const longitude = item["Longitude"];

              return (
                <div key={index} className="data-entry">
                  <h3>Entry {index + 1}</h3>
                  <p><strong>Job Number:</strong> {item["Job Number"] || "N/A"}</p>
                  <p><strong>Permit #:</strong> {item["KPDES\nPermit #"] || "N/A"}</p>
                  <p><strong>AI #:</strong> {item["AI#"] || "N/A"}</p>
                  <p><strong>Site Name:</strong> {siteName || "N/A"}</p>
                  <p><strong>DMR Official:</strong> {item["DMR Official \n(Phone #)"] || "N/A"}</p>
                  <p><strong>Address:</strong> {item["Address"] || "N/A"}</p>
                  <p><strong>Latitude:</strong> {latitude || "N/A"}</p>
                  <p><strong>Longitude:</strong> {longitude || "N/A"}</p>
                  <p><strong>Outfall #:</strong> {item["Outfall #"] || "N/A"}</p>
                  <p><strong>Sampling Frequency:</strong> {item["Sampling Frequency"] || "N/A"}</p>
                  <p><strong>Sampling Status:</strong> {item["Sampling Status"] || "N/A"}</p>
                  <p><strong>Parameters:</strong> {item["Parameters"] || "N/A"}</p>
                  <label><strong>Date Sampled:</strong></label>
                  <input 
                    type="date" 
                    value={dateSampled} 
                    onChange={(e) => handleDateChange(siteName, e.target.value)} 
                  />
                  <br />
                  <button onClick={() => openGoogleMaps(latitude, longitude)}>Google Maps</button>
                  <hr />
                </div>
              );
            })
          ) : (
            <p>Please select a category and a value to display results.</p>
          )}
        </section>
      </main>
      <footer>
        <p>&copy; 2024 Sampling Guide</p>
      </footer>
    </div>
  );
}

export default App;
