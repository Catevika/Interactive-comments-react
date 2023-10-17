import type { Types } from 'mongoose';
import { useState } from 'react';
import { useEditReplyMutation } from '../../features/api/api.slice';

type Props = {
  comment: Types.ObjectId | undefined;
  _id: Types.ObjectId | undefined;
  updatedAt: Date | undefined;
  content: string;
  setEdit: React.Dispatch<React.SetStateAction<boolean>>;
};

const EditReplyForm = ({ comment, _id, updatedAt, content, setEdit }: Props) => {
  const [ text, setText ] = useState(content);
  const [ editReply ] = useEditReplyMutation();


  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>,
  ): void => {
    setText(e.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const editedReply = await editReply({ comment, _id, updatedAt: new Date(), content: text });
      console.log('fulfilled', editedReply);
      setEdit(false);
    } catch (error) {
      console.error('rejected', error);
    }
  };

  return (
    <form className="new-comment-container" onSubmit={handleSubmit}>
      <textarea id='contentId' name="content" value={text} onChange={handleChange}></textarea>
      <button type="submit" className="send-button">
        Update
      </button>
    </form>
  );
};

export default EditReplyForm;