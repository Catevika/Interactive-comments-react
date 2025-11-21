import { useState } from 'react';
import { useEditCommentMutation } from '../../features/api/api.slice';

type Props = {
  _id: string | undefined,
  content: string,
  updatedAt: Date | undefined,
  setEdit: React.Dispatch<React.SetStateAction<boolean>>;
};

const EditCommentForm = ({ _id, content, setEdit }: Props) => {
  const [text, setText] = useState(content);
  const [editComment] = useEditCommentMutation();

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>,
  ): void => {
    setText(e.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const editedComment = await editComment({ _id, updatedAt: new Date(), content: text }).unwrap();
      console.log('fulfilled', editedComment);
      setEdit(false);
    } catch (error) {
      console.error('rejected', error);
    }
  };

  return (
    <form className="new-comment-container update" onSubmit={handleSubmit}>
      <label htmlFor='contentId'></label>
      <textarea id='contentId' name="content" value={text} onChange={handleChange}></textarea>
      <button type="submit" className="send-button">
        Update
      </button>
    </form>
  );
};

export default EditCommentForm;