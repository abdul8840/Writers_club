import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaThumbsUp } from 'react-icons/fa';

const generateUserIdentifier = () => {
  // Generate a random identifier for the user
  return `user_${Math.random().toString(36).substr(2, 9)}`;
};

const ListingItem = ({ listing }) => {
  const [likes, setLikes] = useState(() => {
    return parseInt(localStorage.getItem(`likes_${listing._id}`) || '0', 10);
  });

  const [liked, setLiked] = useState(() => {
    const userIdentifier = localStorage.getItem('userIdentifier');
    return localStorage.getItem(`liked_${listing._id}_${userIdentifier}`) === 'true';
  });

  useEffect(() => {
    // Generate and store user identifier in local storage
    let userIdentifier = localStorage.getItem('userIdentifier');
    if (!userIdentifier) {
      userIdentifier = generateUserIdentifier();
      localStorage.setItem('userIdentifier', userIdentifier);
    }

    // Check if the current user has liked the post
    const userLiked = localStorage.getItem(`liked_${listing._id}_${userIdentifier}`);
    if (userLiked === null) {
      setLiked(false); // Set liked to false for new user
    } else {
      setLiked(userLiked === 'true');
    }
  }, [listing._id]);

  const handleLike = () => {
    let updatedLikes = likes + 1;

    // Generate and retrieve user identifier
    const userIdentifier = localStorage.getItem('userIdentifier');

    // Update local storage for the current user
    localStorage.setItem(`liked_${listing._id}_${userIdentifier}`, 'true');
    localStorage.setItem(`likes_${listing._id}`, updatedLikes.toString());

    // Update state for the current user
    setLikes(updatedLikes);
    setLiked(true);
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
        <FaThumbsUp
          className={`fa-solid cursor-pointer ${liked ? 'text-blue-500' : ''}`}
          onClick={handleLike}
        />
        <p>Likes: {likes}</p>
      </div>
    </div>
  );
};

export default ListingItem;
