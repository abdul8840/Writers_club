import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaThumbsUp } from 'react-icons/fa'; // Import the thumbs-up icon

const ListingItem = ({ listing }) => {
  const [likes, setLikes] = useState(listing.likes);
  const [liked, setLiked] = useState(false); // State to track whether the listing has been liked

  useEffect(() => {
    // Check if the user has already liked this listing based on local storage
    const isLiked = localStorage.getItem(`liked_${listing._id}`);
    if (isLiked) {
      setLiked(true);
    }
  }, [listing._id]);

  const handleLike = async () => {
    try {
      const response = await fetch(`/api/listings/${listing._id}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to like listing');
      }

      const data = await response.json();
      const updatedLikes = data.likes;
      setLikes(updatedLikes);
      setLiked(true); // Set liked to true after successfully liking the listing

      // Store the like status in local storage
      localStorage.setItem(`liked_${listing._id}`, true);
    } catch (error) {
      console.error('Error liking listing:', error);
    }
  };

  return (
    <div className='bg-white card shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[250px]'>
      <Link to={`/listing/${listing._id}`}>
        <img
          src={listing.imageUrls[0] || 'https://via.placeholder.com/300'}
          alt='listing cover'
          className='cover_image'
        />
        <div className='cover_content'>
          <p className='truncate text-lg font-semibold text-slate-700'>
            {listing.name}
          </p>
          <div className='flex items-center gap-1'>
            <p className='text-sm text-gray-600 truncate w-full'>
              {listing.shortdescription}
            </p>
          </div>
          <p className='text-sm text-gray-600 line-clamp-2'>
            {listing.story}
          </p>
        </div>
      </Link>
      <div className="flex items-center gap-1 m-5">
        {/* Render Font Awesome icon conditionally based on like status */}
        <FaThumbsUp
          className={`fa-solid cursor-pointer ${liked ? 'text-blue-500' : ''}`}
          onClick={liked ? null : handleLike} // Disable like action if already liked
        />
        <p>Likes: {likes}</p>
      </div>
    </div>
  );
};

export default ListingItem;
