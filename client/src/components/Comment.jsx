import React, { useState } from 'react';

const Comment = ({ comment, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(comment.content);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setContent(comment.content);
  };

  const handleUpdate = () => {
    onUpdate(comment._id, content);
    setIsEditing(false);
  };

  return (
    <div>
      {isEditing ? (
        <div>
          <textarea value={content} onChange={(e) => setContent(e.target.value)} />
          <button onClick={handleUpdate}>Update</button>
          <button onClick={handleCancel}>Cancel</button>
        </div>
      ) : (
        <div>
          <p>{comment.content}</p>
          <button onClick={handleEdit}>Edit</button>
          <button onClick={() => onDelete(comment._id)}>Delete</button>
        </div>
      )}
    </div>
  );
};

export default Comment;
