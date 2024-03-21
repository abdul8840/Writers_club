import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Contact from "../components/contact";
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from "react-icons/fa";

export default function Listing() {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <main>
      {loading && <p className="text-center my-7 text-2xl">Loading...</p>}
      {error && (
        <p className="text-center my-7 text-2xl">Something went wrong!</p>
      )}
      {listing && !loading && !error && (
        <div>
          {/* Image Slider */}
          <div className="image-slider">
            {listing.imageUrls.map((url, index) => (
              <div key={index}>
                <img src={url} alt={`Image ${index}`} />
              </div>
            ))}
          </div>
          {/* Share Button */}
          <div className="share-btn">
            <FaShare className="text-slate-500" onClick={handleCopyLink} />
          </div>
          {copied && <p className="copied-msg">Link copied!</p>}
          {/* Listing Details */}
          <div className="listing-details">
            <p className="text-2xl font-semibold">
              {listing.name}{" "}
              {/* {listing.offer
                ? listing.discountPrice.toLocaleString('en-US')
                : listing.regularPrice.toLocaleString('en-US')} */}
              {listing.type === "english"}
            </p>
            <p className="flex items-center mt-6 gap-2 text-slate-600  text-sm">
              <FaMapMarkerAlt className="text-green-700" />
              {listing.shortdescription}
            </p>
            <div className="flex gap-4">
              <p className="bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                {listing.type === "english" ? "English" : "Hindi"}
              </p>

              {/* {listing.offer && (
                <p className='bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                  ${+listing.regularPrice - +listing.discountPrice} OFF
                </p>
              )} */}
            </div>
            <p className="text-slate-800">
              <span className="font-semibold text-black">Description - </span>
              {listing.story}
            </p>
            <ul className="text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6">
  {listing && Object.entries(listing).map(([key, value]) => {
    if (typeof value === 'boolean' && value) {
      return (
        <li key={key} className="flex items-center gap-1 whitespace-nowrap">
          <FaChair className="text-lg" />
          {key.toUpperCase()}
        </li>
      );
    }
    return null;
  })}
</ul>



            {currentUser && listing.userRef !== currentUser._id && !contact && (
              <button
                onClick={() => setContact(true)}
                className="bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3"
              >
                Contact landlord
              </button>
            )}
            {contact && <Contact listing={listing} />}
          </div>
        </div>
      )}
    </main>
  );
}
