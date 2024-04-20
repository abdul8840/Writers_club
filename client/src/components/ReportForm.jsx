import React, { useState } from 'react';

const ReportForm = () => {
  const [reportData, setReportData] = useState({
    postId: '',
    reason: '',
    userId: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReportData({
      ...reportData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!reportData.postId || !reportData.reason || !reportData.userId) {
        throw new Error('Missing required fields');
      }

      const response = await fetch('http://localhost:3000/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reportData),
      });

      const responseData = await response.json();

      if (response.ok) {
        alert('Report submitted successfully');
        setReportData({
          postId: '',
          reason: '',
          userId: '',
        });
      } else {
        throw new Error(responseData.message || 'Failed to submit report');
      }
    } catch (error) {
      alert('Error submitting report: ' + error.message);
      console.error('Error submitting report:', error);
    }
  };

  return (
    <div>
      <h2>Report Post</h2>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <input
            className='border p-3 rounded-lg'
            type="text"
            name="postId"
            placeholder='Post ID:'
            value={reportData.postId}
            onChange={handleChange}
          />
        
          <select name="reason" className='border p-3 rounded-lg' value={reportData.reason} onChange={handleChange}>
            <option value="">Select Reason</option>
            <option value="sexual content">Sexual Content</option>
            <option value="violent or repulsive content">Violent or Repulsive Content</option>
            <option value="spam or misleading">Spam or Misleading</option>
            <option value="child abuse">Child Abuse</option>
            <option value="harmful and dangerous acts">Harmful and Dangerous Acts</option>
            <option value="copyright issue">Copyright Issue</option>
          </select>
        
          <input
            className='border p-3 rounded-lg'
            type="text"
            name="userId"
            placeholder='User ID:'
            value={reportData.userId}
            onChange={handleChange}
          />
        
        <button className="mt-4 p-2 bg-red-500 text-white rounded hover:bg-red-600" type="submit">Submit Report</button>
      </form>
    </div>
  );
};

export default ReportForm;
