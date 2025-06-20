import React, { useState, useEffect } from 'react';
import './PlacementList.css';
import { IoSearch } from "react-icons/io5";

const PlacementList = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const sampleData = [
      {
        fullName: "John Doe",
        phone: "+91 98765 43210",
        email: "john.doe@example.com",
        startDate: "PKG001",
        salary: "Full Stack Development",
      },
      {
        fullName: "Jane Smith",
        phone: "+91 87654 32109",
        email: "jane.smith@example.com",
        startDate: "PKG002",
        salary: "Data Science",
      }
    ];
    setData(sampleData);
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
      paddingTop: '1.5rem', // Align with sidebar pt-6
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
                  <td>{item.startDate}</td>
                  <td className="text-right">{item.salary}</td>
                  <td>
                    <button style={buttonStyle('primary')}>View More</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PlacementList;