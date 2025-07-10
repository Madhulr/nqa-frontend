import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './DemoList.css';
import { IoSearch } from "react-icons/io5";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSave } from '@fortawesome/free-solid-svg-icons';

const Class_List = () => {
  const navigate = useNavigate();
  // const staticData = [
  //   {
  //     name: 'Rohan Iyer',
  //     phone: '+91 56785 43210',
  //     email: 'rohan.iyer@example.com',
  //     packageCode: 'MRS005',
  //     package: 'MERN Stack',
  //     placement: 'Yes',
  //     dataLink: 'https://example.com/data1',
  //     dataUpdated: '2024-05-01',
  //   },
  //   {
  //     name: 'Meera Nambiar',
  //     phone: '+91 51234 56789',
  //     email: 'meera.n@example.com',
  //     packageCode: 'DA0005',
  //     package: 'Data Analytics',
  //     placement: 'No',
  //     dataLink: 'https://example.com/data2',
  //     dataUpdated: '2024-05-10',
  //   },
  // ];

  const [backendData, setBackendData] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editData, setEditData] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchClassList = async () => {
      const token = localStorage.getItem('access');
      try {
        const response = await axios.get('http://localhost:8000/api/enquiries/', {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        const filtered = response.data
          .filter(item => item.move_to_hr === true &&
            item.move_to_placements !== true )
          .map(item => ({
            id: item.id,
            name: item.fullName || item.name || '',
            phone: item.phone || '',
            email: item.email || '',
            packageCode: item.packageCode || item.batch_code || '',
            package: item.package || item.packageName || item.batch_subject || '',
            placement: item.placement || '',
            dataLink: item.data_link || '',             //  Map to camelCase
            dataUpdated: item.data_updated || '',       //  Map to camelCase
            moveToPlacements: item.move_to_placements || false //  Optional
          }));
  
        setBackendData(filtered);
      } catch (error) {
        console.error('Error fetching class list:', error.response?.data || error.message);
      }
    };
  
    fetchClassList();
  }, []);
  
  
  

  const combinedData = backendData;

  // FIX: Check for name/email existence before toLowerCase
  const filteredData = combinedData.filter(
    (item) =>
      (item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.email && item.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleMoveToPlacementList = async (item) => {
    const token = localStorage.getItem('access');
    const payload = {
      move_to_placements: true,
    };
  
    try {
      await axios.patch(`http://localhost:8000/api/enquiries/${item.id}/`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      // Navigate after successful update
      navigate('/placement-list', { state: { user: item } });
  
    } catch (error) {
      console.error('Failed to move to placement list:', error.response?.data || error.message);
    }
  };
  

  const handleEditClick = (index) => {
    setEditIndex(index);
    setEditData(combinedData[index]);
  };

  const handleSaveClick = async () => {
    const token = localStorage.getItem('access');
  
    try {
      await axios.patch(`http://localhost:8000/api/enquiries/${editData.id}/`, {
        placement: editData.placement,
        data_link: editData.dataLink,
        data_updated: editData.dataUpdated
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      const updatedData = [...combinedData];
      updatedData[editIndex] = editData;
      setBackendData(updatedData);
      setEditIndex(null);
    } catch (error) {
      console.error('Failed to update:', error.response?.data || error.message);
      alert('Failed to save placement info.');
    }
  };
  

  const handleChange = (field, value) => {
    setEditData((prevData) => ({ ...prevData, [field]: value }));
  };

  return (
    <div className="demo-list-container" style={{ width: '100%' }}>
      <div className="header">
        <h2>Class List</h2>
        <div className="search-box">
          <input
            type="text"
            placeholder="Search"
            aria-label="Search"
            role="searchbox"
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            tabIndex={0}
          />
          <button className="search-button" tabIndex={0} aria-label="Search">
            <IoSearch />
          </button>
        </div>
      </div>
      <div className="demo-table-wrapper" style={{ width: '100%', overflowX: 'auto' }}>
        <table className="demo-table">
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Phone Number</th>
              <th>Email Address</th>
              <th>Package Code</th>
              <th>Package</th>
              <th>Placement</th>
              <th>Data Link</th>
              <th>Data Updated</th>
              <th>Placement List</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td>{item.phone}</td>
                <td>{item.email}</td>
                <td>{item.packageCode || item.batch_code || 'N/A'}</td>
                <td>{item.package || item.packageName || item.batch_subject || 'N/A'}</td>
                <td>
                  {editIndex === index ? (
                    <input
                      type="text"
                      value={editData.placement}
                      onChange={(e) => handleChange('placement', e.target.value)}
                    />
                  ) : (
                    item.placement
                  )}
                </td>
                <td>
                  {editIndex === index ? (
                    <input
                      type="text"
                      value={editData.dataLink || ''}
                      onChange={(e) => handleChange('dataLink', e.target.value)}
                    />
                  ) : (
                    <a href={item.dataLink} target="_blank" rel="noopener noreferrer">
                      {item.dataLink || 'N/A'}
                    </a>
                  )}
                </td>
                
                <td>
                    {editIndex === index ? (
                      <input
                        type="date"
                        value={editData.dataUpdated || ''}
                        onChange={(e) => handleChange('dataUpdated', e.target.value)}
                        max={new Date().toISOString().split('T')[0]} // ✅ restrict future dates
                      />
                    ) : (
                      item.dataUpdated || 'N/A'
                    )}
                </td>

                  <td>
                  {editIndex === index ? (
                    <span className="icon-btn save-btn" onClick={handleSaveClick}>
                      <FontAwesomeIcon icon={faSave} />
                    </span>
                  ) : (
                    <>
                      <span
                        className="icon-btn edit-btn"
                        onClick={() => handleEditClick(index)}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </span>
                      <button
                        className="move-btn"
                        onClick={() => handleMoveToPlacementList(item)}
                      >
                        Move to Placement List
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Class_List;