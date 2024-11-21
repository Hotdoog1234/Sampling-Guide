import React, { useState, useEffect } from 'react';
<<<<<<< HEAD
import data from './data.json';
import './App.css';
=======
import { saveAs } from 'file-saver'; // For downloading the file
import * as XLSX from 'xlsx'; // Import xlsx for Excel export
import { setLogLevel } from "firebase/app";
import { ref, set, onValue } from "firebase/database";
import database from "./firebaseConfig"; // Import Firebase configuration
import data from "./data.json"; // Import your data
import "./App.css";

// Enable Firebase Debug Logs
setLogLevel("debug");
>>>>>>> development

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
<<<<<<< HEAD
  const [filteredData, setFilteredData] = useState([]); // Start with an empty array
  const [datesSampled, setDatesSampled] = useState({});
=======
  const [filteredData, setFilteredData] = useState([]);
  const [datesSampled, setDatesSampled] = useState({});
  const [samplerNames, setSamplerNames] = useState({}); // New state for storing sampler names
>>>>>>> development

  useEffect(() => {
    if (category) {
      const values = [...new Set(guideData.map(item => item[category] || "N/A"))];
      setUniqueValues(values);
<<<<<<< HEAD
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
=======
      setFilteredData([]);
    }
  }, [category, guideData]);

  // Fetch data from Firebase in real-time
  useEffect(() => {
    const datesRef = ref(database, "dates");
    onValue(datesRef, (snapshot) => {
      const data = snapshot.val() || {};
      console.log("Fetched dates from Firebase:", data); // Debug log
      setDatesSampled(data); // Update the state
    });

    const samplerRef = ref(database, "samplers"); // Fetch sampler names
    onValue(samplerRef, (snapshot) => {
      const data = snapshot.val() || {};
      console.log("Fetched sampler names from Firebase:", data); // Debug log
      setSamplerNames(data); // Update the state
    });
  }, []);
>>>>>>> development

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
<<<<<<< HEAD
    setDatesSampled(prevDates => ({
      ...prevDates,
      [siteName]: date
    }));
    localStorage.setItem(`dateSampled-${siteName}`, date);
  };

  const openGoogleMaps = (longitude, latitude) => {
const lon = parseFloat(longitude);    
const lat = parseFloat(latitude);
=======
    // Sanitize the siteName by replacing invalid characters
    const sanitizedSiteName = siteName.replace(/[.#$[\]]/g, "_");

    console.log("Attempting to write to Firebase:", { siteName, date });

    const dateRef = ref(database, `dates/${sanitizedSiteName}`);
    set(dateRef, { date })
      .then(() => {
        console.log("Successfully written to Firebase:", { sanitizedSiteName, date });
      })
      .catch((error) => {
        console.error("Error writing to Firebase:", error);
      });
  };

  // Handle the change of sampler name input
  const handleSamplingChange = (siteName, samplerName) => {
    const sanitizedSiteName = siteName.replace(/[.#$[\]]/g, "_");

    console.log("Attempting to write sampler to Firebase:", { siteName, samplerName });

    const samplerRef = ref(database, `samplers/${sanitizedSiteName}`);
    set(samplerRef, { samplerName })
      .then(() => {
        console.log("Successfully written sampler to Firebase:", { sanitizedSiteName, samplerName });
      })
      .catch((error) => {
        console.error("Error writing sampler to Firebase:", error);
      });
  };

  const openGoogleMaps = (longitude, latitude) => {
    const lon = parseFloat(longitude);
    const lat = parseFloat(latitude);
>>>>>>> development

    if (!isNaN(lat) && !isNaN(lon)) {
      const url = `https://www.google.com/maps?q=${lat},${lon}`;
      window.open(url, '_blank');
    } else {
      alert("Latitude and Longitude not available or not in the correct format for this site.");
    }
  };

<<<<<<< HEAD
  return (
    <div className="app-container">
      <header>
        <img src={`${process.env.PUBLIC_URL}/logo.jpg`} alt="Company Logo" className="company-logo" />
        <h1>Sampling Guide</h1>
      </header>
      <main>
=======
  // Function to export data to Excel
  const exportToExcel = () => {
    // Prepare the data structure for Excel
    const excelData = Object.keys(datesSampled).map((siteName) => ({
      SiteName: siteName,
      DateSampled: datesSampled[siteName].date,
      Sampler: samplerNames[siteName]?.samplerName || "N/A" // Adding sampler name to the data
    }));

    // Create a new worksheet from the data
    const ws = XLSX.utils.json_to_sheet(excelData);

    // Create a new workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Site Data");

    // Write the workbook to a file
    const excelFile = XLSX.write(wb, { bookType: "xlsx", type: "array" });

    // Use file-saver to download the file
    saveAs(new Blob([excelFile]), "sampling_guide_data.xlsx");
  };

  return (
    <div className="app-container">
      <header>
        <h1>Sampling Guide</h1>
      </header>
      <main>
        <button onClick={exportToExcel}>Export to Excel</button>
        
>>>>>>> development
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
<<<<<<< HEAD
              const dateSampled = datesSampled[siteName] || "";
=======
              const sanitizedSiteName = siteName.replace(/[.#$[\]]/g, "_");
              const dateSampled = datesSampled[sanitizedSiteName]?.date || "";
              const samplerName = samplerNames[sanitizedSiteName]?.samplerName || ""; // Get sampler name
>>>>>>> development
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
<<<<<<< HEAD
=======

>>>>>>> development
                  <label><strong>Date Sampled:</strong></label>
                  <input 
                    type="date" 
                    value={dateSampled} 
                    onChange={(e) => handleDateChange(siteName, e.target.value)} 
                  />
                  <br />
<<<<<<< HEAD
=======

                  <label><strong>Who did the Sampling:</strong></label>
                  <input
                    type="text"
                    value={samplerName}
                    onChange={(e) => handleSamplingChange(siteName, e.target.value)}
                    placeholder="Enter name"
                  />
                  <br />

>>>>>>> development
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
<<<<<<< HEAD
        <p>&copy; 2024 Sampling Guide</p>
=======
        <p>&copy; 2024 Shield Environmental Associates Sampling Guide</p>
>>>>>>> development
      </footer>
    </div>
  );
}

export default App;
<<<<<<< HEAD
=======

>>>>>>> development
