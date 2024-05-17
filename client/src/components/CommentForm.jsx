import React, { useState } from 'react';

const CommentForm = ({ onSubmit }) => {
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(content);
    setContent('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input className='border p-3 rounded-lg' value={content} onChange={(e) => setContent(e.target.value)} />
      <button className="bg-white border-2 border-black text-black font-bold mb-4 hover:bg-black hover:text-white px-6 py-2 rounded" type="submit">Submit</button>
    </form>
  );
};

export default CommentForm;
