import React, { useState, useEffect } from 'react';

function Feedback() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState('');
  const [error, setError] = useState('');
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    fetchFeedbacks();
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
      fetchFeedbacks(); // Fetch feedbacks again to update the list
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setError(error.message);
    }
  };

  return (
    <div className="feedback-container">
      <h1>Feedback Form</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <input
          className='peer block py-2.5 px-1 w-full text-sm text-gray-600 bg-transparent border-0 border-b-[2px] appearance-none focus:outline-none focus:ring-0 focus:border-[#FF6464] ${
            disabled ? "border-gray-300" : "border-gray-400'
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            place
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Message:</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          ></textarea>
        </div>
        <div>
          <label>Rating (out of 10):</label>
          <input
            type="number"
            min="1"
            max="10"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            required
          />
        </div>
        <button type="submit">Submit</button>
      </form>

      {error && <p>Error: {error}</p>}

      <h2>Feedbacks</h2>
      <ul>
        {feedbacks.map((feedback, index) => (
          <li key={index}>
            <strong>Name:</strong> {feedback.name}<br />
            <strong>Email:</strong> {feedback.email}<br />
            <strong>Message:</strong> {feedback.message}<br />
            <strong>Rating:</strong> {feedback.rating}/10
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Feedback;
