import React from "react";
import { Link } from 'react-router-dom';

export default function CarouselBasicExample({ currentUser }){
  const categories = [
    "Thriller",
    "Comedy",
    "Sci-Fi",
    "Action",
    "Romance",
    "Horror",
    "Adventure",
    "Historic",
  ];

  return (
    <div>
      <div 
        className="bg-gray-900 text-white py-20 relative"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('https://images.unsplash.com/photo-1602722053020-af31042989d5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
          backgroundSize: 'cover',
          backgroundPosition: 'left',
          backdropFilter: 'blur(10px)',
        }}
      >
        <div className="container mx-auto px-4">
          <p>{currentUser ? `Welcome, ${currentUser.username}` : 'Welcome'}</p>
          <h1 className="text-5xl font-bold mb-4">Your Reading Platform</h1>
          <p className="text-lg mb-8">Read your favorite Stories like thriller, comedy, sci-fi, and more</p>
          <button className="bg-white border-2 border-black text-black font-bold mb-4 hover:bg-black hover:text-white px-6 py-2 rounded">
            <Link to={`/search?category=`}>Start Reading</Link>
          </button>
        </div>
        <div className="mt-10 container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((category, index) => (
              <Link key={index} to={`/search?category=${category.toLowerCase()}`} className="bg-white text-black p-4 rounded hover:bg-white-600 transition-colors duration-300">
                <h3 className="text-xl font-semibold">{category}</h3>
              </Link>
            ))}
          </div>
        </div>
      </div>
      
    </div>
  );
}
