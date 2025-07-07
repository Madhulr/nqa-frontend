import './EnquiryList.css';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { useState, useEffect } from 'react';
import axios from 'axios';

const EnquiryList = ({ isSidebarOpen }) => {
  const [showBatchMove, setShowBatchMove] = useState(false);
  const [batchSubject, setBatchSubject] = useState("");
  const [batchCode, setBatchCode] = useState("");
  const [enquiries, setEnquiries] = useState([]);
  useEffect(() => {
    const fetchEnquiries = () => {
      const token = localStorage.getItem('access');
      axios.get('/api/enquiries/', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => {
          // Map backend fields to frontend fields if needed
          const mapped = res.data.map((item) => ({
            id: item.id,
            fullName: item.fullName || '',
            phone: item.phone || '',
            email: item.email || '',
            current_location: item.location || '',
            module: item.module || '',
            trainingMode: item.trainingMode || '',
            trainingTimings: item.trainingTimings || '',
            startTime: item.startTime || '',
            calling1: item.calling1 || '',
            calling2: item.calling2 || '',
            calling3: item.calling3 || '',
            calling4: item.calling4 || '',
            calling5: item.calling5 || '',
            previousInteraction: item.previousInteraction || '',
          }));
          setEnquiries(mapped);
        })
        .catch(err => {
          // Optionally handle error
        });
    };
    fetchEnquiries();
    const handler = () => fetchEnquiries();
    window.addEventListener('enquiryAdded', handler);
    return () => window.removeEventListener('enquiryAdded', handler);
  }, []);
  const [searchTerm, setSearchTerm] = useState('');
  const [mode, setMode] = useState('single');
  const [editRowId, setEditRowId] = useState(null);
  const [editData, setEditData] = useState({});
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);

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

  const handleMoveToDemoList = (ids) => {
    const selectedEnquiries = enquiries.filter((e) => ids.includes(e.id));
    setSelectedEnquiry(selectedEnquiries);
    setShowBatchMove(true);
  };

  const handleEditClick = (id) => {
    setEditRowId(id);
    const enquiry = enquiries.find((e) => e.id === id);
    setEditData(enquiry);
  };

  const handleSaveClick = async () => {
    try {
      const token = localStorage.getItem('access');
      // Send POST request to update the enquiry in the backend (not typical for update, but as requested)
      const response = await axios.post(
        `/api/enquiries/${editRowId}/`,
        editData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      // Update local state with backend response to ensure latest data is shown
      setEnquiries((prev) =>
        prev.map((e) => (e.id === editRowId ? { ...e, ...response.data } : e))
      );
      setEditRowId(null);
    } catch (error) {
      alert('Failed to save changes.');
    }
  };

  // Batch move: set move_to_demo true and update batch fields in backend for all selected
  const handleBatchMoveSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access');
    try {
      await Promise.all(selectedEnquiry.map(async (enq) => {
        // Fetch full object for each enquiry
        const { data } = await axios.get(`/api/enquiries/${enq.id}/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Ensure all fields are present and not undefined (fill with empty string if needed)
        const allFields = {
          id: data.id,
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          current_location: data.location || '',
          module: data.module || '',
          timing: data.trainingMode || '',
          trainingTime: data.trainingTimings || '',
          startTime: data.startTime || '',
          profession: data.profession || '',
          qualification: data.qualification || '',
          experience: data.experience || '',
          referral: data.referral || '',
          consent: data.consent || false,
          calling1: data.calling1 || '',
          calling2: data.calling2 || '',
          calling3: data.calling3 || '',
          calling4: data.calling4 || '',
          calling5: data.calling5 || '',
          previous_interaction: data.previousInteraction || '',
          status: data.status || '',
          batch_code: batchCode,
          batch_subject: batchSubject,
          demo_class_status: data.demo_class_status || '',
          payment_status: data.payment_status || false,
          move_to_demo: true,
          admin_notes: data.admin_notes || '',
          placement_status: data.placement_status || '',
          placement_notes: data.placement_notes || '',
          interview_status: data.interview_status || '',
          interview_notes: data.interview_notes || '',
        };
        await axios.put(`/api/enquiries/${enq.id}/`, allFields, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }));
      setEnquiries((prev) => prev.map((e) =>
        selectedEnquiry.some(se => se.id === e.id)
          ? { ...e, move_to_demo: true, batch_code: batchCode, batch_subject: batchSubject }
          : e
      ));
    } catch (error) {
      let msg = 'Batch move failed.';
      if (error.response && error.response.data) {
        msg += '\n' + JSON.stringify(error.response.data);
        // Optionally log to console for debugging
        console.error('Batch move error:', error.response.data);
      } else {
        console.error('Batch move error:', error);
      }
      alert(msg);
    }
    setBatchSubject("");
    setBatchCode("");
    setShowBatchMove(false);
  };

  const filtered = enquiries.filter((e) =>
    e.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { field: 'fullName', headerName: 'Full Name', width: 180, editable: true },
    { field: 'phone', headerName: 'Phone Number', width: 180, editable: true },
    { field: 'email', headerName: 'Email Address', width: 250, editable: true },
    { field: 'current_location', headerName: 'Current Location', width: 180, editable: true },
    { field: 'module', headerName: 'Subject / Module', width: 180, editable: true },
    { field: 'trainingMode', headerName: 'Training Mode', width: 150, editable: true },
    { field: 'trainingTimings', headerName: 'Training Timings', width: 180, editable: true },
    { field: 'startTime', headerName: 'Start Time', width: 150, editable: true },
    { field: 'calling1', headerName: 'Calling 1', width: 150, editable: true, renderCell: (params) => editRowId === params.row.id ? (
      <input
        type="text"
        value={editData.calling1 ?? ''}
        onChange={e => setEditData(prev => ({ ...prev, calling1: e.target.value }))}
        style={{ width: '100%' }}
      />
    ) : (
      params.value
    ) },
    { field: 'calling2', headerName: 'Calling 2', width: 150, editable: true, renderCell: (params) => editRowId === params.row.id ? (
      <input
        type="text"
        value={editData.calling2 ?? ''}
        onChange={e => setEditData(prev => ({ ...prev, calling2: e.target.value }))}
        style={{ width: '100%' }}
      />
    ) : (
      params.value
    ) },
    { field: 'calling3', headerName: 'Calling 3', width: 150, editable: true, renderCell: (params) => editRowId === params.row.id ? (
      <input
        type="text"
        value={editData.calling3 ?? ''}
        onChange={e => setEditData(prev => ({ ...prev, calling3: e.target.value }))}
        style={{ width: '100%' }}
      />
    ) : (
      params.value
    ) },
    { field: 'calling4', headerName: 'Calling 4', width: 150, editable: true, renderCell: (params) => editRowId === params.row.id ? (
      <input
        type="text"
        value={editData.calling4 ?? ''}
        onChange={e => setEditData(prev => ({ ...prev, calling4: e.target.value }))}
        style={{ width: '100%' }}
      />
    ) : (
      params.value
    ) },
    { field: 'calling5', headerName: 'Calling 5', width: 150, editable: true, renderCell: (params) => editRowId === params.row.id ? (
      <input
        type="text"
        value={editData.calling5 ?? ''}
        onChange={e => setEditData(prev => ({ ...prev, calling5: e.target.value }))}
        style={{ width: '100%' }}
      />
    ) : (
      params.value
    ) },
    { field: 'previousInteraction', headerName: 'Previous Interaction', width: 220, editable: true },
    {
      field: 'action',
      headerName: 'Action',
      width: 200,
      renderCell: (params) => (
        <div style={{ display: 'flex', gap: '5px' }}>
          {editRowId === params.row.id ? (
            <button style={buttonStyle('primary')} onClick={handleSaveClick}>Save</button>
          ) : (
            <>
              <button style={buttonStyle('outline')} onClick={() => handleEditClick(params.row.id)}>Edit</button>
              <button style={buttonStyle('primary')} onClick={() => handleMoveToDemoList([params.row.id])}>Move</button>
            </>
          )}
        </div>
      ),
      sortable: false,
      filterable: false,
      headerClassName: 'table-header',
    },
  ];

  return (
    <div className={`enquiry-list-page ${!isSidebarOpen ? 'sidebar-closed' : ''}`}>
      <div className="toolbar">
        <div className="title">Enquiry List</div>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="mode-buttons">
          <button
            className={mode === 'single' ? 'active' : ''}
            style={buttonStyle('primary')}
            onClick={() => {
              setMode('single');
              if (selectedRows.length > 0) {
                handleMoveToDemoList(selectedRows);
              }
            }}
          >
            Move .....
          </button>
        </div>
      </div>

      <div className="table-container">
        <Box sx={{ height: 580, width: '100%' }}>
          <DataGrid
            rows={filtered}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            checkboxSelection
            disableRowSelectionOnClick
            onSelectionModelChange={(newSelection) => {
              setSelectedRows(newSelection);
            }}
            processRowUpdate={(newRow, oldRow) => {
              if (editRowId === newRow.id) {
                setEditData((prev) => ({ ...prev, ...newRow }));
              }
              return newRow;
            }}
            experimentalFeatures={{ newEditingApi: true }}
          />
        </Box>
      </div>

      {showBatchMove && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Batch Move</h2>
            <p>
              Enter the below details to move the students to the demo list, <br />
              make sure you selected students are of the same batch and <br />
              subject before you batch move.
            </p>
            <form onSubmit={handleBatchMoveSubmit}>
              <div>
                <label htmlFor="batch-subject">Batch Subject</label>
                <input
                  id="batch-subject"
                  type="text"
                  placeholder="Enter Batch Subject"
                  value={batchSubject}
                  onChange={(e) => setBatchSubject(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="batch-code">Package Batch Code</label>
                <input
                  id="batch-code"
                  type="text"
                  placeholder="Enter Batch Code"
                  value={batchCode}
                  onChange={(e) => setBatchCode(e.target.value)}
                />
              </div>
              <div>
              <button type="button" style={buttonStyle('outline')} onClick={() => setShowBatchMove(false)}>Cancel</button>
              <button type="submit" style={buttonStyle('primary')}>Batch Move</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnquiryList;