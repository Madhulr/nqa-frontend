import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PlacementList.css';
import { IoSearch } from "react-icons/io5";

const PlacementList = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPlacementList = async () => {
      const token = localStorage.getItem('access');
      try {
        const response = await axios.get('http://localhost:8000/api/enquiries/', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const filtered = response.data
          .filter(item => item.move_to_placements === true)
          .map(item => ({
            fullName: item.fullName || item.name || '',
            phone: item.phone || '',
            email: item.email || '',
            packageCode: item.packageCode || item.batch_code || '',
            package: item.package || item.packageName || item.batch_subject || '',
          }));

        setData(filtered);
      } catch (error) {
        console.error('Error fetching placement list:', error.response?.data || error.message);
      }
    };

    fetchPlacementList();
  }, []);

  const filteredData = data.filter(item =>
    item.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const buttonStyle = (variant) => {
    switch (variant) {
      case 'primary':
        return {
          padding: '10px 20px',
          border: 'none',
          borderRadius: '5px',
          color: '#FFFFFF',
          fontWeight: 600,
          cursor: 'pointer',
          fontSize: '1rem',
          fontFamily: "'Afacad', sans-serif",
          backgroundColor: '#031D4E',
          width: '100px',
          height: '44px',
          marginLeft: '-20px'
        };
      case 'ghost':
        return {
          padding: '10px 20px',
          border: 'none',
          borderRadius: '5px',
          fontWeight: 600,
          cursor: 'pointer',
          fontSize: '1rem',
          backgroundColor: '#FFFFFF',
          fontFamily: "'Afacad', sans-serif",
          color: '#031D4E',
          width: '100px',
          height: '44px'
        };
      case 'outline':
      default:
        return {
          padding: '10px 20px',
          border: '1px solid rgb(3, 29, 78)',
          borderRadius: '5px',
          backgroundColor: 'rgb(226, 236, 255)',
          color: 'rgb(3, 29, 78)',
          fontWeight: 600,
          cursor: 'pointer',
          fontSize: '1rem',
          fontFamily: "'Afacad', sans-serif",
          width: '123px',
          height: '44px'
        };
    }
  };

  return (
    <div style={{
      width: '1140px',
      padding: '3rem',
      paddingTop: '1.5rem',
      background: '#fff',
      flex: 1,
      fontFamily: "'Afacad', sans-serif"
    }}>
      <div className="placement-list-container" style={{ margin: 0, boxShadow: 'none', padding: 0 }}>
        <div className="header">
          <h2>Placement List</h2>
          <form className="search-form" onSubmit={e => e.preventDefault()}>
            <div className="search-input-container">
              <input
                type="text"
                placeholder="Search"
                aria-label="Search"
                role="searchbox"
                className="search-input"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                tabIndex={0}
              />
              <button className="search-button" tabIndex={0} aria-label="Search">
                <IoSearch />
              </button>
            </div>
          </form>
        </div>
        <div className="table-container">
          <table className="placement-table">
            <thead>
              <tr>
                <th>Full Name</th>
                <th>Phone Number</th>
                <th>Email Address</th>
                <th>Package Code</th>
                <th>Package</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, idx) => (
                <tr key={idx} className={idx % 2 === 1 ? "alternate-row" : ""}>
                  <td>{item.fullName}</td>
                  <td>{item.phone}</td>
                  <td>{item.email}</td>
                  <td>{item.packageCode}</td>
                  <td className="text-right">{item.package}</td>
                  <td>
                    <button style={buttonStyle('primary')}>View More</button>
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '1rem' }}>
                    No matching students found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PlacementList;
