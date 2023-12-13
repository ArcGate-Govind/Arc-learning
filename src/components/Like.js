import React, { useState } from 'react';

const LikeButton = () => {
  const [likes, setLikes] = useState(0);

  const handleLike = () => {
    setLikes(likes + 1);
  };

  return (
    <div>
      <button onClick={handleLike}>Like</button>
      <p>{likes} {likes === 0 ? 'like' : 'likes'}</p>
    </div>
  );
};

export default LikeButton;
