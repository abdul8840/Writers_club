import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  FaThumbsUp,
  FaBox,
  FaShare,
  FaComment,
  FaFlag,
  FaPoll,
  FaEye,
  FaHeart,
} from "react-icons/fa";
import ReportForm from "../components/ReportForm";
import Views from '../components/Views'

// import CommentForm from "../components/CommentForm";


export default function Listing() {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [showReportModal, setShowReportModal] = useState(false);
  const [ownerUsername, setOwnerUsername] = useState("");
  const [comments, setComments] = useState([]);
const [newComment, setNewComment] = useState('');

  // Opinion Poll States
  const [showPollModal, setShowPollModal] = useState(false);
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState([]);
  const [userVote, setUserVote] = useState(null);
  const [pollResults, setPollResults] = useState({});

  const { currentUser } = useSelector((state) => state.user);
  
  const params = useParams();

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

        const userIdentifier = localStorage.getItem('userIdentifier');
        const isLiked = localStorage.getItem(`liked_${data._id}_${userIdentifier}`);
        const likesCount = parseInt(localStorage.getItem(`likes_${data._id}`) || '0', 10);
        
        setLiked(isLiked === 'true');
        setLikes(likesCount);

        // Load poll results from local storage
        const storedPollResults = JSON.parse(localStorage.getItem(`pollResults_${params.listingId}`));
        if (storedPollResults) {
          setPollResults(storedPollResults);
        }

        

      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);

  useEffect(() => {
    const fetchOwnerUsername = async () => {
      try {
        const res = await fetch(`/api/user/${listing.userRef}`);
        const data = await res.json();
        if (data.success === false) {
          throw new Error("Failed to fetch owner username");
        }
        setOwnerUsername(data.username);
      } catch (error) {
        console.error("Error fetching owner username:", error);
      }
    };

    if (listing) {
      fetchOwnerUsername();
    }
  }, [listing]);

  useEffect(() => {
    const storedPollResults = JSON.parse(localStorage.getItem(`pollResults_${params.listingId}`));
    if (storedPollResults) {
      setPollResults(storedPollResults);
    }
  }, [params.listingId]);

  const handleLike = async () => {
    try {
      // Add null check for listing
      if (!listing) {
        console.error("Listing is null");
        return;
      }
  
      const userIdentifier = localStorage.getItem('userIdentifier');
      const isLiked = localStorage.getItem(`liked_${listing._id}_${userIdentifier}`);
      console.log("Is Liked:", isLiked);
  
      if (isLiked === 'true') {
        console.log("You have already liked this post.");
        return;
      }
  
      // If the user hasn't liked the post before, proceed with liking it
      const response = await fetch(`/api/listing/${listing._id}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: currentUser._id }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || "Failed to like listing");
      }
  
      const updatedLikes = data.likes;
  
      setListing(prevListing => ({ ...prevListing, likes: updatedLikes }));
      setLikes(updatedLikes);
      localStorage.setItem(`liked_${listing._id}_${userIdentifier}`, 'true');
      localStorage.setItem(`likes_${listing._id}`, updatedLikes.toString());
      console.log("Liked successfully");
  
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

  const handleOpenPollModal = () => {
    if (currentUser._id === listing.userRef) {
      setShowPollModal(true);
    } else {
      alert("Only the owner can create a poll.");
    }
  };

  const handleClosePollModal = () => {
    setShowPollModal(true);
  };

  const handlePollSubmit = () => {
    const newPoll = {
      question: pollQuestion,
      options: pollOptions,
    };
    
    const initialPollResults = newPoll.options.reduce((acc, option) => ({ ...acc, [option]: 0 }), {});
    setPollResults(initialPollResults);
    localStorage.setItem(`pollResults_${listing._id}`, JSON.stringify(initialPollResults));
    setShowPollModal(false);
  };

  const handleVote = (option) => {
    if (userVote) {
      console.log("You have already voted.");
      return;
    }
  
    setUserVote(option);
    setPollResults((prevResults) => {
      const newResults = {
        ...prevResults,
        [option]: prevResults[option] + 1,
      };
  
      // Update the poll results in local storage
      localStorage.setItem(`pollResults_${listing._id}`, JSON.stringify(newResults));
  
      return newResults;
    });
  };
  

  const calculatePercentage = (votes, total) => {
    return ((votes / total) * 100).toFixed(2);
  };

  const handleClearPoll = () => {
    setPollResults({});
    localStorage.removeItem(`pollResults_${listing._id}`);
  };

  const renderPollOptions = () => {
    return Object.entries(pollResults).map(([option, votes]) => (
      <div key={option} className="flex items-center gap-2 mt-2">
        <button 
          className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ${userVote === option ? 'bg-gray-500 cursor-not-allowed' : 'cursor-pointer'}`}
          onClick={() => handleVote(option)}
          disabled={userVote !== null}
        >
          {option}
        </button>
        <div className="w-1/2 bg-blue-200 h-5 rounded">
          <div className="bg-blue-400 h-5 rounded" style={{ width: `${calculatePercentage(votes, Object.values(pollResults).reduce((a, b) => a + b, 0))}%` }}></div>
        </div>
        <p className="ml-2 text-sm">{calculatePercentage(votes, Object.values(pollResults).reduce((a, b) => a + b, 0))}%</p>
      </div>
    ));
  };


  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch('/api/comments'); // Adjust the route if needed
        if (!response.ok) {
          throw new Error('Failed to fetch comments');
        }
        const data = await response.json();
        setComments(data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchComments();
  }, []);

  const handleDeleteComment = async (id) => {
    try {
      const response = await fetch(`/api/comments/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete comment');
      }
      setComments(comments.filter(comment => comment._id !== id));
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleUpdateComment = async (id, content) => {
    try {
      const response = await fetch(`/api/comments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });
      if (!response.ok) {
        throw new Error('Failed to update comment');
      }
      const updatedComment = await response.json();
      setComments(comments.map(comment =>
        comment._id === updatedComment._id ? updatedComment : comment
      ));
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      // Obtain userId from currentUser
      const userId = currentUser._id;
  
      // Ensure listingId is available from listing object or useParams
      const listingId = listing._id; // Assuming listing is available in component state
  
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newComment,
          userRef: userId,
          listingRef: listingId,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to submit comment'); // Throw an error if response is not ok
      }
  
      const comment = await response.json();
      setComments([...comments, comment]);
      setNewComment(''); // Clear the comment input field
    } catch (error) {
      console.error('Error submitting comment:', error);
      // Handle the error - you can set an error state or display an error message
    }
  };
  
  

  return (
    <main className="p-3 max-w-4xl mx-auto">
      {loading && <p className="text-center my-7 text-2xl">Loading...</p>}
      {error && <p className="text-center my-7 text-2xl">Something went wrong!</p>}
      {listing && listing._id && !loading && !error && (
        <div className="">
          
          

          {copied && <p className="copied-msg">Link copied!</p>}
          <div className="listing-details">
            <div className="text-center items-center gap-4 m-5 text-slate-500 text-sm">
              <h2>Welcome to <span className="text-pink-500">Writers club</span></h2>
              <p>We hope you enjoy the content</p>
              {/* <Views listingId={listing._id} userId={currentUser._id} /> */}
            </div>
            <p className="text-center text-2xl font-semibold">
              {listing.name}
              <div className="share-btn flex justify-center items-center gap-4 m-5">
                <FaShare className="text-slate-500 text-center size-5" onClick={handleCopyLink} />
                <div className="like-btn flex justify-center gap-1">
                  <FaHeart
                    className={`fa-solid size-5 cursor-pointer ${liked ? "text-red-500" : ""}`}
                    onClick={liked ? null : handleLike}
                  />
                  <span className="text-slate-500 text-sm ">{likes}</span>
                </div>
                {/* <FaComment className="text-slate-500 text-center size-5" /> */}
                <FaFlag className="text-slate-500 text-center size-5 cursor-pointer" onClick={handleOpenReportModal} />
                <FaPoll className="text-slate-500 text-center size-5 cursor-pointer" onClick={handleOpenPollModal} />
              <span className="flex items-center gap-1 text-slate-500">
              <FaEye />
              <Views listingId={listing._id} userId={currentUser._id} />
              </span>
              </div>
            </p>
            <div className="flex justify-center items-center mt-6 gap-2 text-slate-600 text-md font-bold text-center">
              {listing.shortdescription}
            </div>
            <p className="text-slate-800 mt-10 mb-10">
              {listing.story}
            </p>
            <div className="flex gap-4 mb-5">
              <h3 className="font-bold">Language: </h3>
              <p>{listing.type === "english" ? "English" : "Hindi"}</p>
            </div>
            <div className="flex gap-5 mb-5">
              <h3 className="font-bold">Categories:</h3>
              <ul className="text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6">
                {Object.entries(listing).map(([key, value]) => {
                  if (typeof value === "boolean" && value) {
                    return (
                      <li key={key} className="flex items-center gap-1 whitespace-nowrap">
                        <FaBox className="text-lg" />
                        {key.toUpperCase()}
                      </li>
                    );
                  }
                  return null;
                })}
              </ul>
            </div>
            <h3 className="mb-5"><span className="font-bold">Owner : </span>{ownerUsername}</h3>
            <h3 className="mb-5"><span className="font-bold">PostID : </span>{listing._id}</h3>

            

            {/* <Comment /> */}
            
            {showReportModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white p-6 rounded-lg w-120">
                  <h2 className="text-xl font-semibold mb-4">Report Post</h2>
                  <ReportForm />
                  <button className="mt-4 p-2 bg-green-500 text-white rounded hover:bg-green-600" onClick={handleCloseReportModal}>
                    Close
                  </button>
                </div>
              </div>
            )}

            {showPollModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white p-6 rounded-lg w-120">
                  <h2 className="text-xl font-semibold mb-4">Create Opinion Poll</h2>
                  <input
                    type="text"
                    placeholder="Poll Question"
                    className="border p-2 mb-2 w-full rounded"
                    value={pollQuestion}
                    onChange={(e) => setPollQuestion(e.target.value)}
                  />
                  <div className="mb-2">
                    {pollOptions.map((option, index) => (
                      <input
                        key={index}
                        type="text"
                        placeholder={`Option ${index + 1}`}
                        className="border p-2 mb-2 w-full rounded"
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...pollOptions];
                          newOptions[index] = e.target.value;
                          setPollOptions(newOptions);
                        }}
                      />
                    ))}
                    <button className="mt-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={() => setPollOptions([...pollOptions, ""])}>Add Option</button>
                  </div>
                  <button className="mr-2 p-2 bg-green-500 text-white rounded hover:bg-green-600" onClick={handlePollSubmit}>
                    Submit Poll
                  </button>
                  <button className="p-2 bg-red-500 text-white rounded hover:bg-red-600" onClick={handleClosePollModal}>
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {Object.keys(pollResults).length > 0 && (
              <div className="poll-results mt-4">
                <h3 className="text-xl font-semibold mb-2">Opinion Poll</h3>
                <p>{pollQuestion}</p>
                {renderPollOptions()}
                <button 
                  className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  onClick={handleClearPoll}
                >
                  Close Poll
                </button>
              </div>
            )}
          </div>
        </div>
      )}


<div className="mt-20">
      <h1 className="text-center font-bold">Add Comment</h1>
      {/* Display listing content */}

      {/* Comment Form */}
      <form onSubmit={(e) => handleCommentSubmit(e, userId)}>
        <div className="max-[1200px] ml-40">
        <input
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className='border p-3 rounded-lg mr-5 w-[500px] mb-4 mt-4'
          placeholder="Write your comment..."
          required
        />
        <button type="submit" className="bg-white border-2 border-black text-black font-bold mb-4 hover:bg-black hover:text-white px-6 py-2 rounded" >Submit</button>
        </div>
      </form>

      <div>
        <h2 className="text-center font-bold">Comments</h2>
        {comments.map((comment) => (
          <Comment
            key={comment._id}
            comment={comment}
            onDelete={handleDeleteComment}
            onUpdate={handleUpdateComment}
          />
        ))}
      </div>
    </div>


    </main>
  );
}
