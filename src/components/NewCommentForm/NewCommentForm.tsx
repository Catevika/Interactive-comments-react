import { useState } from 'react';
import { useAddCommentMutation } from '../../features/api/api.slice';
import './newCommentForm.css';

const NewCommentForm = () => {
  const currentUser = {
    image: {
      png: "../../assets/avatars/image-juliusomo.png",
      webp: "../../assets/avatars/image-juliusomo.webp"
    },
    username: "juliusomo"
  };

  const [ addComment ] = useAddCommentMutation();
  const [ newContent, setNewContent ] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const addedComment = await addComment(newContent).unwrap();
      console.log('fulfilled', addedComment);
      setNewContent('');
    } catch (error) {
      console.error('rejected', error);
    }
  };

  return (
    <div className='new-comment' >
      <form className="new-comment-container" onSubmit={handleSubmit}>
        <img srcSet={(currentUser.image.png + ' 1440w', currentUser.image.webp + ' 815w')} sizes='(max-width: 1440px) 815px' src={currentUser.image.png} alt={currentUser.username + 'Avatar'} className='avatar' />
        <label htmlFor='newContentId'></label>
        <textarea id='newContentId' name="newContent" value={newContent} placeholder="Add a comment..." onChange={(e) => setNewContent(e.target.value)}></textarea>
        <button type="submit" className="send-button" disabled={!newContent}>
          Send
        </button>
      </form>
    </div>
  );
};

export default NewCommentForm;