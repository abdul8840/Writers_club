import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ListingItem from '../components/ListingItem';

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch('/api/listing/get?offer=true&limit=4');
        const data = await res.json();
        setOfferListings(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchOfferListings();
  }, []);

  const handleRadioChange = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div>
      {/* top */}
      <div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto'>
        <h1 className='text-slate-700 font-bold text-3xl lg:text-6xl'>
           <span className='text-slate-500'>Disclaimer</span>
          <br />
          Before Signup/login you have to follow the below instructions.
        </h1>
        <div className='text-gray-400 text-xs sm:text-sm'>
          <ul>
            <li>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quis adipisci odit quos assumenda nostrum aspernatur?</li>
            <li>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quis adipisci odit quos assumenda nostrum aspernatur?</li>
            <li>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quis adipisci odit quos assumenda nostrum aspernatur?</li>
            <li>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quis adipisci odit quos assumenda nostrum aspernatur?</li>
          </ul>
        </div>
        <Link
          to={'/search'}
          className='text-xs sm:text-sm text-blue-800 font-bold hover:underline'
        >
          Let's get started...
        </Link>
      </div>

      {/* Image Slider with Radio Buttons */}
      <div className='image-slider'>
        {offerListings &&
          offerListings.length > 0 &&
          offerListings.map((listing, index) => (
            <div
              key={listing._id}
              className={`image-slide ${
                currentIndex === index ? 'active' : ''
              }`}
            >
              <img src={listing.imageUrls[currentIndex]} alt='' />
            </div>
          ))}
        {/* Radio buttons */}
        <div className='radio-buttons'>
          {offerListings &&
            offerListings.length > 0 &&
            offerListings[0].imageUrls.map((_, index) => (
              <input
                key={index}
                type='radio'
                name='image-slide'
                value={index}
                checked={currentIndex === index}
                onChange={() => handleRadioChange(index)}
              />
            ))}
        </div>
      </div>

      {/* Listing results for offer */}
      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10'>
        {offerListings && offerListings.length > 0 && (
          <div className=''>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>
                Recent offers
              </h2>
              <Link
                className='text-sm text-blue-800 hover:underline'
                to={'/search?offer=true'}
              >
                Show more offers
              </Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {offerListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
