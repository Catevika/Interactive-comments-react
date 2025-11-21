import { useState } from 'react';
import { useAddReplyMutation, useReplyUpdateShowReplyFormMutation } from '../../features/api/api.slice';

type Props = {
  comment: string | undefined;
  _id: string | undefined;
  showReplyForm: boolean;
};

const NewReplyFormReply = ({ comment, _id, showReplyForm }: Props) => {
  const currentUser = {
    image: {
      png: "../../assets/avatars/image-juliusomo.png",
      webp: "../../assets/avatars/image-juliusomo.webp"
    },
    username: "juliusomo"
  };

  if (!_id || !comment) {
    return <p>No Reply to update!</p>;
  }

  const [addReply] = useAddReplyMutation();

  const [newContent, setNewContent] = useState('');
  const [errorDisplay, setErrorDisplay] = useState('');

  const [replyUpdateShowreplyForm] = useReplyUpdateShowReplyFormMutation();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      if (newContent.includes('@')) {
        const addedReply = await addReply([comment, newContent]).unwrap();
        console.log('fulfilled', addedReply);
        setNewContent('');
        const replyUpdatedShowreplyForm = await replyUpdateShowreplyForm({ comment, _id, showReplyForm: !showReplyForm }).unwrap();
        console.log('fulfilled', replyUpdatedShowreplyForm);
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
        <img srcSet={(currentUser.image.png + ' 1440w', currentUser.image.webp + ' 815w')} sizes='(max-width: 1440px) 815px' src={currentUser.image.png} alt={currentUser.username + 'Avatar'} className='avatar' />
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

export default NewReplyFormReply;