import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DemoList.css';
import { IoSearch } from "react-icons/io5";

const DemoList = ({ isSidebarOpen }) => {
  const [demoData, setDemoData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');


  useEffect(() => {
    fetchDemoList();
  }, []);
  const fetchDemoList = async () => {
    const token = localStorage.getItem('access');
    try {
      const response = await axios.get('http://localhost:8000/api/enquiries/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Map Enquiry fields to DemoList table columns
      // setDemoData(
      //   response.data
      //     .filter(item => item.move_to_demo) // Only show demo students
      //     .map((item) => ({
      //       id: item.id,
      //       name: item.name,
      //       phone: item.phone,
      //       email: item.email,
      //       code: item.batch_code || '',
      //       package: item.module || '',
      //       status: item.demo_class_status || '',
      //     }))
      // );
      setDemoData(response.data)
      // console.log('DemoList data:', response.data);
    } catch (error) {
      setDemoData([]);
      // Optionally show error toast
    }
  };


  // Move: delete from EnquiryList (if you want to remove from demo view)
  const handleMoveBackToEnquiryList = async (id) => {
    const token = localStorage.getItem('access');
    try {
      await axios.delete(`http://localhost:8000/api/enquiries/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDemoData((prev) => prev.filter((u) => u.id !== id));
    } catch (error) {
      // Optionally show toast.error('Failed to move')
    }
  };


  // Update status in EnquiryList
  const handleStatusChange = async (id, newStatus) => {
    console.log('Changing status for', id, 'to', newStatus);
    const token = localStorage.getItem('access');
    const user = demoData.find((u) => u.id === id);
    if (!user) return;
    try {
      const payload = {
        name: user.name,
        phone: user.phone,
        email: user.email,
        batch_code: user.code,
        module: user.package,
        demo_class_status: newStatus,
      };
      await axios.put(`http://localhost:8000/api/enquiries/${id}/`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDemoData((prev) =>
        prev.map((u) =>
          u.id === id ? { ...u, status: newStatus } : u
        )
      );
    } catch (error) {
      // Optionally show toast.error('Failed to update status')
    }
  };

  const filteredData = demoData.filter((user) =>
    (user.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  console.log('Filtered data:', filteredData);
  console.log('demo data:', demoData);

  return (
    <div className={`demo-list-container ${!isSidebarOpen ? 'sidebar-closed' : ''}`}>
      <div className="header">
        <h2>Demo List</h2>
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
      <table className="demo-table">
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Phone Number</th>
            <th>Email Address</th>
            <th>Package Code</th>
            <th>Package</th>
            <th>Demo Class Status</th>
            <th>Move?</th>
          </tr>
        </thead>
        <tbody>
          {/* {filteredData.length === 0 ? ( */}


          {demoData.length > 0 && demoData.map((user, index) => {
            console.log('User:', user);
            return <tr key={index}>
              <td>{user.fullName}</td>
              <td>{user.phone}</td>
              <td>{user.email}</td>
              <td>{user.code}</td>
              <td>{user.package}</td>
              <td>
                <select
                  className="demo-status-select"
                  value={user.status}
                  onChange={(e) => handleStatusChange(user.id, e.target.value)}
                  style={{
                    width: '150px',
                    height: '35px',
                    padding: '5px',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    backgroundColor: '#fff',
                    fontSize: '14px'
                  }}
                >
                  <option value="Not yet started">Not yet started</option>
                  <option value="In progress">In progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </td>
              <td>
                <button
                  className={`move-btn ${user.status !== 'Completed' ? 'disabled-btn' : ''}`}
                  disabled={user.status !== 'Completed'}
                  onClick={() => handleMoveBackToEnquiryList(user.id)}
                >
                  move
                </button>
              </td>
            </tr>
          })
          }

        </tbody>
      </table>
    </div>
  );
};

export default DemoList;