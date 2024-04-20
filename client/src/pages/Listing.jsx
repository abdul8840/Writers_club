import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  FaThumbsUp,
  FaBox,
  FaShare,
  FaComment,
  FaFlag,
} from "react-icons/fa";
import ReportForm from "../components/ReportForm";

export default function Listing() {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const params = useParams();
  const [showReportModal, setShowReportModal] = useState(false);

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
        data.comedy = data.comedy === "true";
        data.horror = data.horror === "true";
        data.romance = data.romance === "true";
        data.scifi = data.scifi === "true";
        data.historic = data.historic === "true";
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

  useEffect(() => {
    const isLiked = localStorage.getItem(`liked_${listing?._id}`);
    if (isLiked) {
      setLiked(true);
    }
  }, [listing]);

  const handleLike = async () => {
    try {
      const response = await fetch(`/api/listings/${listing._id}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to like listing");
      }
      const data = await response.json();
      const updatedLikes = data.likes;
      setListing({ ...listing, likes: updatedLikes });
      setLiked(true);
      localStorage.setItem(`liked_${listing._id}`, true);
    } catch (error) {
      console.error("Error liking listing:", error);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handleOpenReportModal = () => {
    setShowReportModal(true);
  };

  const handleCloseReportModal = () => {
    setShowReportModal(false);
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      {loading && <p className="text-center my-7 text-2xl">Loading...</p>}
      {error && (
        <p className="text-center my-7 text-2xl">Something went wrong!</p>
      )}
      {listing && !loading && !error && (
        <div className="">
          {copied && <p className="copied-msg">Link copied!</p>}
          <div className="listing-details">
            <div className="text-center items-center gap-4 m-5 text-slate-500 text-sm">
              <h2>Welcome to <span className="text-pink-500">Writers club</span></h2>
              <p>We hope you enjoy the content</p>
              <p>{listing._id}</p>
              <p>{listing.userRef}</p>
              {/* <p>{landlord.username}</p> */}
            </div>
            <p className="text-center text-2xl font-semibold">
              {listing.name}
              <div className="share-btn flex justify-center items-center gap-4 m-5">
                <FaShare
                  className="text-slate-500 text-center size-5"
                  onClick={handleCopyLink}
                />
                <div className="like-btn flex justify-center gap-1">
                  <FaThumbsUp
                    className={`fa-solid size-5 cursor-pointer ${
                      liked ? "text-blue-500" : ""
                    }`}
                    onClick={liked ? null : handleLike}
                  />
                  <span className="text-slate-500 text-sm ">
                    {listing.likes}
                  </span>
                </div>
                <FaComment className="text-slate-500 text-center size-5" />
                <FaFlag
                  className="text-slate-500 text-center size-5 cursor-pointer"
                  onClick={handleOpenReportModal}
                />
              </div>
            </p>
            <div className="flex justify-center items-center mt-6 gap-2 text-slate-600 text-md font-bold text-center">
              {listing.shortdescription}
            </div>
            <p className="text-slate-800 mt-10 mb-10">
              <span className="font-semibold text-black">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</span>
              {listing.story}
            </p>
            <div className="flex gap-4 mb-10">
              <h3 className="font-bold">Language: </h3>
              <p className="">
                {listing.type === "english" ? "English" : "Hindi"}
              </p>
            </div>
            <div className="flex gap-5">
              <h3 className="font-bold">Categories:</h3>
              <ul className="text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6">
                {listing &&
                  Object.entries(listing).map(([key, value]) => {
                    if (typeof value === "boolean" && value) {
                      return (
                        <li
                          key={key}
                          className="flex items-center gap-1 whitespace-nowrap"
                        >
                          <FaBox className="text-lg" />
                          {key.toUpperCase()}
                        </li>
                      );
                    }
                    return null;
                  })}
              </ul>
            </div>
            {showReportModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white p-6 rounded-lg w-120">
                  <h2 className="text-xl font-semibold mb-4">Report Post</h2>
                  <ReportForm />
                  <button
                    className="mt-4 p-2 bg-green-500 text-white rounded hover:bg-green-600"
                    onClick={handleCloseReportModal}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>


          

        </div>
      )}

    </main>
  );
}
