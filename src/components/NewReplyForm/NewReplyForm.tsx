import type { Types } from 'mongoose';
import { useState } from 'react';
import Spinner from '../Spinner/Spinner';
import { useAddReplyMutation, useGetCommentQuery, useUpdateShowReplyFormMutation } from '../../features/api/api.slice';

const NewReplyForm = ({ commentId }: { commentId: Types.ObjectId | undefined; }) => {
  const currentUser = {
    image: {
      png: "../../assets/avatars/image-juliusomo.png",
      webp: "../../assets/avatars/image-juliusomo.webp"
    },
    username: "juliusomo"
  };

  const [ addReply ] = useAddReplyMutation();

  const [ newContent, setNewContent ] = useState('');
  const [ errorDisplay, setErrorDisplay ] = useState('');

  if (!commentId) {
    return 'No comment to reply to';
  }

  const { data: comment, isLoading, isError, error } = useGetCommentQuery(commentId);

  if (isLoading) {
    return <Spinner />;
  }

  if (isError || !comment) {
    console.log(error);
    return <p>No comment to update!</p>;
  }

  const { _id, showReplyForm } = comment;

  if (!_id) {
    return <p>No comment to update!</p>;
  }

  const [ updateShowreplyForm ] = useUpdateShowReplyFormMutation();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      if (newContent.includes('@')) {
        const addedReply = await addReply([ _id, newContent ]).unwrap();
        console.log('fulfilled', addedReply);
        setNewContent('');
        const updateShowReplyForm = await updateShowreplyForm({ _id: addedReply.comment, showReplyForm: !showReplyForm }).unwrap();
        console.log('fulfilled', updateShowReplyForm);
      } else {
        setErrorDisplay('Your comment should start with @username, e.g. @ramsesmiron');
      }
    } catch (error) {
      console.error('rejected', error);
    }
  };

  return (
    <div className='new-comment' >
      <form className="new-comment-container" onSubmit={handleSubmit}>
        <img srcSet={(currentUser.image.png, currentUser.image.webp)} sizes='(max-width: 64px) 48px, 48px' src={currentUser.image.webp} alt={currentUser.username + 'Avatar'} className='avatar' />
        <label htmlFor='newContentId'></label>
        <textarea id='newContentId' name="newContent" value={newContent} placeholder="Add a reply..." onChange={(e) => setNewContent(e.target.value)}></textarea>
        {errorDisplay ? <div className='error'>{errorDisplay}</div> : null}
        <button type="submit" className="send-button" disabled={!newContent}>
          Reply
        </button>
      </form>
    </div>
  );
};

export default NewReplyForm;