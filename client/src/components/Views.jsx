import React, { useState, useEffect } from 'react';

const Views = ({ listingId, userId }) => {
  const [visitCount, setVisitCount] = useState(0);
  const [visited, setVisited] = useState(false);

  useEffect(() => {
    // Check if user has visited
    const checkVisit = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/visit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ listingId, userId }),
        });

        if (!response.ok) {
          throw new Error('Error counting visit');
        }

        const data = await response.json();
        setVisitCount(data.visitCount);
        setVisited(true);
      } catch (error) {
        console.error('Error counting visit:', error);
      }
    };

    checkVisit();
  }, [listingId, userId]);

  return (
    <div>
      <p className='text-sm'>{visitCount}</p>
      {/* {visited ? <p>You've visited this post.</p> : <p>Thanks for visiting!</p>} */}
    </div>
  );
};

export default Views;
