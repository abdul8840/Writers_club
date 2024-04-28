// commentActions.js
export const addComment = (commentData) => {
  return async (dispatch) => {
    try {
      const response = await fetch('http://localhost:3000/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(commentData)
      });
      const data = await response.json();
      // Dispatch action or update state accordingly
      dispatch({ type: 'ADD_COMMENT', payload: data }); // Example dispatch
    } catch (error) {
      // Handle error
      console.error('Error adding comment:', error);
    }
  };
};

export const editComment = (commentId, updatedContent) => {
  return async (dispatch) => {
    try {
      const response = await fetch(`http://localhost:3000/comments/${commentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: updatedContent })
      });
      const data = await response.json();
      // Dispatch action or update state accordingly
      dispatch({ type: 'EDIT_COMMENT', payload: data }); // Example dispatch
    } catch (error) {
      // Handle error
      console.error('Error editing comment:', error);
    }
  };
};

export const deleteComment = (commentId) => {
  return async (dispatch) => {
    try {
      const response = await fetch(`http://localhost:3000/comments/${commentId}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      // Dispatch action or update state accordingly
      dispatch({ type: 'DELETE_COMMENT', payload: commentId }); // Example dispatch
    } catch (error) {
      // Handle error
      console.error('Error deleting comment:', error);
    }
  };
};

export const likeComment = (commentId) => {
  return async (dispatch) => {
    try {
      const response = await fetch(`http://localhost:3000/comments/${commentId}/like`, {
        method: 'POST'
      });
      const data = await response.json();
      // Dispatch action or update state accordingly
      dispatch({ type: 'LIKE_COMMENT', payload: data }); // Example dispatch
    } catch (error) {
      // Handle error
      console.error('Error liking comment:', error);
    }
  };
};
