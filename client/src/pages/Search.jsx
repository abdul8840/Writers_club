import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ListingItem from '../components/ListingItem';

export default function Search() {
  const navigate = useNavigate();
  const [sidebardata, setSidebardata] = useState({
    searchTerm: '',
    type: 'all',
    drama: false,
    thriller: false,
    comedy: false,
    action: false,
    adventure: false,
    horror: false,
    romance: false,
    scifi: false,
    historic: false,
    sort: 'created_at',
    order: 'desc',
  });

  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      setShowMore(false);
      try {
        const urlParams = new URLSearchParams(location.search);
        const res = await fetch(`/api/listing/get?${urlParams.toString()}`);
        if (!res.ok) {
          throw new Error(`Failed to fetch listings. Status: ${res.status}`);
        }
        const data = await res.json();
        if (Array.isArray(data)) {
          setListings(data);
          if (data.length > 8) {
            setShowMore(true);
          }
        } else {
          console.error('Invalid API response:', data);
        }
      } catch (error) {
        console.error('Error fetching listings:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [location.search]);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setSidebardata((prevData) => ({
        ...prevData,
        [id]: checked,
      }));
    } else {
      setSidebardata((prevData) => ({
        ...prevData,
        [id]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    Object.entries(sidebardata).forEach(([key, value]) => {
      urlParams.set(key, value);
    });
    navigate(`/search?${urlParams.toString()}`);
  };

  const onShowMoreClick = async () => {
    const startIndex = listings.length;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex);
    try {
      const res = await fetch(`/api/listing/get?${urlParams.toString()}`);
      if (!res.ok) {
        throw new Error(`Failed to fetch listings. Status: ${res.status}`);
      }
      const data = await res.json();
      if (Array.isArray(data)) {
        setListings((prevListings) => [...prevListings, ...data]);
        if (data.length < 9) {
          setShowMore(false);
        }
      } else {
        console.error('Invalid API response:', data);
      }
    } catch (error) {
      console.error('Error fetching listings:', error);
      setError(error.message);
    }
  };

  return (
    <div className='flex flex-col md:flex-row'>
      <div className='p-7 border-b-2 md:border-r-2 md:min-h-screen'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
          <div className='flex items-center gap-2'>
            <label className='whitespace-nowrap font-semibold'>
              Search Term:
            </label>
            <input
              type='text'
              id='searchTerm'
              placeholder='Search...'
              className='border rounded-lg p-3 w-full'
              value={sidebardata.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className='flex gap-2 flex-wrap items-center'>
            <label className='font-semibold'>Type:</label>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='all'
                className='w-5'
                onChange={handleChange}
                checked={sidebardata.type === 'all'}
              />
              <span>english & hindi & marathi</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='english'
                className='w-5'
                onChange={handleChange}
                checked={sidebardata.type === 'english'}
              />
              <span>English</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='hindi'
                className='w-5'
                onChange={handleChange}
                checked={sidebardata.type === 'hindi'}
              />
              <span>Hindi</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='marathi'
                className='w-5'
                onChange={handleChange}
                checked={sidebardata.type === 'marathi'}
              />
              <span>Marathi</span>
            </div>
            {/* <div className='flex gap-2'>
              <input
                type='checkbox'
                id='offer'
                className='w-5'
                onChange={handleChange}
                checked={sidebardata.offer}
              />
              <span>Offer</span>
            </div> */}
          </div>
          <div className='flex gap-2 flex-wrap items-center'>
            <label className='font-semibold'>Amenities:</label>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='drama'
                className='w-5'
                onChange={handleChange}
                checked={sidebardata.drama}
              />
              <span>Drama</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='thriller'
                className='w-5'
                onChange={handleChange}
                checked={sidebardata.thriller}
              />
              <span>Thriller</span>
            </div>

            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='comedy'
                className='w-5'
                onChange={handleChange}
                checked={sidebardata.comedy}
              />
              <span>Comedy</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='action'
                className='w-5'
                onChange={handleChange}
                checked={sidebardata.action}
              />
              <span>Action</span>
            </div>

            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='adventure'
                className='w-5'
                onChange={handleChange}
                checked={sidebardata.adventure}
              />
              <span>Adventure</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='horror'
                className='w-5'
                onChange={handleChange}
                checked={sidebardata.horror}
              />
              <span>Horror</span>
            </div>

            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='romance'
                className='w-5'
                onChange={handleChange}
                checked={sidebardata.romance}
              />
              <span>Romance</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='scifi'
                className='w-5'
                onChange={handleChange}
                checked={sidebardata.scifi}
              />
              <span>Sci-Fi</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='historic'
                className='w-5'
                onChange={handleChange}
                checked={sidebardata.historic}
              />
              <span>Historic</span>
            </div>

          </div>
          {/* <div className='flex items-center gap-2'>
            <label className='font-semibold'>Sort:</label>
            <select
              onChange={handleChange}
              defaultValue={'created_at_desc'}
              id='sort_order'
              className='border rounded-lg p-3'
            >
              <option value='regularPrice_desc'>Price high to low</option>
              <option value='regularPrice_asc'>Price low to hight</option>
              <option value='createdAt_desc'>Latest</option>
              <option value='createdAt_asc'>Oldest</option>
            </select>
          </div>*/}
          <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>
            Search
          </button> 
        </form>
      </div>

      <div className='flex-2'>
        <h1 className='text-3xl font-semibold border-b p-3 text-center text-slate-700 mt-5'>
          Listing results:
        </h1>
        <div className='p-7 flex flex-wrap gap-10 justify-center'>
          {/* Render listings */}
          {!loading && error && (
            <p className='text-xl text-red-500'>{error}</p>
          )}
          {!loading && listings.length === 0 && !error && (
            <p className='text-xl text-slate-700'>No listing found!</p>
          )}
          {loading && (
            <p className='text-xl text-slate-700 text-center w-full'>
              Loading...
            </p>
          )}
          {!loading &&
            Array.isArray(listings) &&
            listings.map((listing) => (
              <ListingItem key={listing._id} listing={listing} />
            ))}
          {/* Show more button */}
          {showMore && (
            <button
              onClick={onShowMoreClick}
              className='text-green-700 hover:underline p-7 text-center w-full'
            >
              Show more
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
