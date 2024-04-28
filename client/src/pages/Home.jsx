import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ListingItem from '../components/ListingItem';
import CarouselBasicExample from '../components/CarouselBasicExample';

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
  ]);

  useEffect(() => {
    const fetchListings = async (category) => {
      try {
        const res = await fetch(`/api/listing/get?${category.key}=true&limit=4`);
        const data = await res.json();
        setCategories(prevCategories => 
          prevCategories.map(prevCategory => 
            prevCategory.key === category.key ? { ...prevCategory, listings: data } : prevCategory
          )
        );
      } catch (error) {
        console.log(error);
      }
    };

    categories.forEach(category => fetchListings(category));
  }, []);

  return (
    <div className=''>
      
      <CarouselBasicExample/>

      

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
              <div className='flex flex-wrap gap-5'>
                {category.listings.map((listing) => (
                  <ListingItem listing={listing} key={listing._id}/>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
