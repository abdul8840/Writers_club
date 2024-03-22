import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ListingItem from '../components/ListingItem';

export default function Home() {
  
  const [categories, setCategories] = useState([
    { name: 'Thriller', key: 'thriller', listings: [] },
    { name: 'Action', key: 'action', listings: [] },
    { name: 'Comedy', key: 'comedy', listings: [] },
    { name: 'Drama', key: 'drama', listings: [] },
    { name: 'Adventure', key: 'adventure', listings: [] },
    { name: 'Horror', key: 'horror', listings: [] },
    { name: 'Scifi', key: 'scifi', listings: [] },
    { name: 'Romance', key: 'romance', listings: [] },
    { name: 'Historic', key: 'historic', listings: [] },
    // Add more categories as needed
  ]);

  useEffect(() => {
    const fetchListings = async (category) => {
      try {
        const res = await fetch(`/api/listing/get?${category.key}=true&limit=3`);
        const data = await res.json();
        setCategories((prevCategories) => {
          return prevCategories.map((prevCategory) => {
            if (prevCategory.key === category.key) {
              return { ...prevCategory, listings: data };
            }
            return prevCategory;
          });
        });
      } catch (error) {
        console.log(error);
      }
    };

    categories.forEach((category) => fetchListings(category));
  }, []);

  return (
    <div>
      {/* Top Section */}
      <div className='flex flex-col gap-6 p-10 max-w-6xl mx-auto'>
        <h1 className='text-slate-700 font-bold text-3xl lg:text-6xl'>
          <span className='text-slate-500'>Disclaimer</span>
          <br />
          Before Signup/login you have to follow the below instructions.
        </h1>
        <div className='text-gray-400 text-sm'>
          <ul>
            <li>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quis adipisci odit quos assumenda nostrum aspernatur?</li>
            <li>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quis adipisci odit quos assumenda nostrum aspernatur?</li>
            <li>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quis adipisci odit quos assumenda nostrum aspernatur?</li>
            <li>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quis adipisci odit quos assumenda nostrum aspernatur?</li>
          </ul>
        </div>
        <Link to={'/search'} className='text-sm text-blue-800 font-bold hover:underline'>
          Let's get started...
        </Link>
      </div>


      {/* Listing results for all categories */}
      {categories.map((category) => (
        <div key={category.key} className='max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10'>
          {category.listings && category.listings.length > 0 && (
            <div className=''>
              <div className='my-3'>
                <h2 className='text-2xl font-semibold text-slate-600'>
                  Recent {category.name} Stories
                </h2>
                <Link className='text-sm text-blue-800 hover:underline' to={`/search?${category.key}=true`}>
                  Show More {category.name} Stories
                </Link>
              </div>
              <div className='flex flex-wrap gap-4'>
                {category.listings.map((listing) => (
                  <ListingItem listing={listing} key={listing._id} />
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
