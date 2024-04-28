import React, { useState, useEffect } from 'react';
import { FaStar } from "react-icons/fa";

function Feedback() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState('');
  const [error, setError] = useState('');
  const [feedbacks, setFeedbacks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [totalCount, setTotalCount] = useState(0); 

  useEffect(() => {
    fetchFeedbacks();
    fetchTotalCount();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/feedback');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setFeedbacks(data);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
      setError(error.message);
    }
  };

  const fetchTotalCount = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/feedback/count');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setTotalCount(data.count);
    } catch (error) {
      console.error("Error fetching total count:", error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newFeedback = {
      name,
      email,
      message,
      rating
    };

    try {
      const response = await fetch('http://localhost:3000/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newFeedback),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setName('');
      setEmail('');
      setMessage('');
      setRating('');
      fetchFeedbacks();
      fetchTotalCount();
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setError(error.message);
    }
  };

  return (
    <div className="feedback-container p-4 ">
      <h1 className="text-xl mb-6 mt-4 text-center font-bold">Give Your Feedback</h1>
      <div className="max-w-2xl m-auto flex justify-between">
        <h2 className="text-xl mb-2">Total Feedbacks: ({totalCount})</h2>
        <button 
          className="bg-white border-2 border-black text-black font-bold py-2 px-4 rounded mb-4 hover:bg-black hover:text-white"
          onClick={() => setShowForm(!showForm)}
        >
          Add Feedback
        </button>
      </div>
      <hr className='h-2' />

      <div className="p-3 max-w-lg mx-auto">
        {showForm && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="mb-4">
            <input
              className="border p-3 w-full rounded-lg"
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <input
              className="border p-3 w-full rounded-lg"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <textarea
              className="border p-3 w-full rounded-lg"
              placeholder="Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="mb-4">
            <input
              className="border p-3 w-full rounded-lg"
              type="number"
              min="1"
              max="10"
              placeholder="Rating (out of 10)"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              required
            />
          </div>
          <button 
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            type="submit"
          >
            Submit
          </button>
        </form>
        )}
      </div>

      {error && <p className="text-red-500 mb-4">Error: {error}</p>}

      <h2 className="text-xl mb-4 text-center font-900">All Feedbacks</h2>
      <ul className='max-w-6xl m-auto flex flex-wrap gap-5'>
        {feedbacks.map((feedback, index) => (
          <li key={index} className="mb-2 w-[270px] content-stretch bg-white border-2 p-6 rounded-lg shadow-md">
            <span className='block text-center font-bold text-slate-500'>{feedback.name}</span>
            <span className='block text-center mb-2 text-gray-500 font-900'>{feedback.email}</span>
            <span className='block text-center mb-2'><div className="flex justify-center gap-2"><FaStar className="text-red-400 text-center size-5" />{feedback.rating}/10</div></span>
            <span className='block text-center mb-2'>{feedback.message}</span>
            <span className='block text-center text-gray-400 mt-2'><p className='text-xs'>{formatDate(feedback.createdAt)}</p></span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Feedback;
