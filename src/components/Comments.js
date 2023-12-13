import React, { useState, useEffect } from 'react';

const Comments = () => {
  const [comments, setComments] = useState([]);
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');

  useEffect(() => {
    fetch('/api/comments')
      .then((response) => response.json())
      .then((data) => setComments(data));
  }, []);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('/api/comments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, comment }),
    });

    if (response.ok) {
      const newComment = await response.json();
      setComments([...comments, newComment]);
      setName('');
      setComment('');
    }
  };

  return (
    <div>
      <h2>Comments</h2>
      <ul>
        {comments.map((c) => (
          <li key={c.id}>
            <strong>{c.name}:</strong> {c.comment}
          </li>
        ))}
      </ul>
      <form onSubmit={handleCommentSubmit}>
        <label>
          Name:
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <br />
        <label>
          Comment:
          <textarea value={comment} onChange={(e) => setComment(e.target.value)} />
        </label>
        <br />
        <button type="submit">Submit Comment</button>
      </form>
    </div>
  );
};

export default Comments;
