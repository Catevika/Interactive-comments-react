import type { Types } from 'mongoose';
import type { Reply } from '../../app/types';
import { useState } from 'react';
import moment from 'moment';
import Spinner from '../Spinner/Spinner';
import CommentScore from '../CommentScore/CommentScore';
import EditCommentForm from '../EditCommentForm/EditCommentForm';
import NewReplyForm from '../NewReplyForm/NewReplyForm';
import ReplyCard from '../ReplyCard/ReplyCard';
import AlertDialog from '../AlertDialog/AlertDialog';
import { useGetCommentQuery, useUpdateShowReplyFormMutation, useDeleteCommentMutation } from '../../features/api/api.slice';
import './commentCard.css';

const { updateLocale } = moment;

updateLocale('en', {
  relativeTime: {
    past: "%s ago",
    s: 'a few seconds',
    ss: '%ds',
    m: "1min",
    mm: "%dmin",
    h: "1h",
    hh: "%dh"
  }
});


const CommentCard = ({ commentId }: { commentId: Types.ObjectId; }) => {
  if (!commentId) return <p>No comment yet!</p>;
  const { data: comment, isLoading, isError, error } = useGetCommentQuery(commentId);

  const [ edit, setEdit ] = useState<boolean>(false);
  const [ open, setOpen ] = useState(false);

  const [ updateShowreplyForm ] = useUpdateShowReplyFormMutation();
  const [ deleteComment ] = useDeleteCommentMutation();

  if (isLoading) {
    return <Spinner />;
  }

  if (isError || !comment) {
    console.log(error);
    return <p>No comment yet!</p>;
  }

  const { _id, score, user, createdAt, updatedAt, content, replies, showReplyForm } = comment;

  const toggleForm = async () => {
    try {
      const updatedShowReplyForm = await updateShowreplyForm({ _id, showReplyForm: !showReplyForm }).unwrap();
      console.log('fulfilled', updatedShowReplyForm);
    } catch (error) {
      console.error('rejected', error);
    }
  };

  const handleEdit = () => {
    setEdit(true);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleDeleteComment = async () => {
    try {
      await deleteComment(_id).unwrap();
      console.log('fulfilled');
    } catch (error) {
      console.error('rejected', error);
    }
  };

  return (
    <>
      <div className="comment-container">
        <div className="comment-counter">
          <CommentScore _id={_id} updatedAt={updatedAt} score={score} />
        </div>
        <div className="comment-sub-container">
          <div className="comment-name-container">
            <div className="comment-name-group">
              <img srcSet={(user.image.png, user.image.webp)} sizes='(max-width: 64px) 24px, 24px' src={user.image.webp} alt={user.username + 'Avatar'} className='avatar' />
              <p className="comment-name">{user.username}</p>
              {user.username === "juliusomo" ? <p className="reply-name-you">you</p> : null}
              <p className="comment-created">{updatedAt ? moment(updatedAt).fromNow() : moment(createdAt).fromNow()}</p>
            </div>
            <div className='reply-btn-reply'>
              {user.username !== "juliusomo" ? <button className="comment-btn" onClick={toggleForm}>
                <svg className="reply-icon" width="14" height="13" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M.227 4.316 5.04.16a.657.657 0 0 1 1.085.497v2.189c4.392.05 7.875.93 7.875 5.093 0 1.68-1.082 3.344-2.279 4.214-.373.272-.905-.07-.767-.51 1.24-3.964-.588-5.017-4.829-5.078v2.404c0 .566-.664.86-1.085.496L.227 5.31a.657.657 0 0 1 0-.993Z"
                    fill="#5357B6" />
                </svg>
                <span className="comment-btn-label">&nbsp;{showReplyForm === true ? 'Cancel Reply' : 'Reply'}</span>
              </button> : null}
            </div>
            {open ? <AlertDialog open={open} setOpen={setOpen} handleDeleteComment={handleDeleteComment} /> : null}
            <div className='reply-btn-edit-delete'>
              {user.username === "juliusomo" ? <button className="reply-btn-you delete" onClick={handleOpen}>
                <svg width="12" height="14" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M1.167 12.448c0 .854.7 1.552 1.555 1.552h6.222c.856 0 1.556-.698 1.556-1.552V3.5H1.167v8.948Zm10.5-11.281H8.75L7.773 0h-3.88l-.976 1.167H0v1.166h11.667V1.167Z"
                    fill="#ED6368" />
                </svg>
                &nbsp;Delete
              </button> : null}
              {user.username === "juliusomo" ? <button className="reply-btn-you edit" onClick={handleEdit}>
                <svg width="14" height="14" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M13.479 2.872 11.08.474a1.75 1.75 0 0 0-2.327-.06L.879 8.287a1.75 1.75 0 0 0-.5 1.06l-.375 3.648a.875.875 0 0 0 .875.954h.078l3.65-.333c.399-.04.773-.216 1.058-.499l7.875-7.875a1.68 1.68 0 0 0-.061-2.371Zm-2.975 2.923L8.159 3.449 9.865 1.7l2.389 2.39-1.75 1.706Z"
                    fill="#5357B6" />
                </svg>
                &nbsp;Edit
              </button> : null}
            </div>
          </div>
          <div className="comment-content-container">
            {edit === false ?
              <div className="comment-content">
                {content}
              </div>
              : <div className="comment-content">
                <EditCommentForm _id={_id} updatedAt={updatedAt} content={content} setEdit={setEdit} />
              </div>}
          </div>
        </div>
      </div>
      {showReplyForm === true ? <NewReplyForm commentId={_id} /> : null}
      <div className="replies-container">
        <div className='replies'>
          {
            replies.map((reply: Reply) =>
              <ReplyCard key={reply._id?.toString()} replyId={reply._id} commentId={_id} />
            )}
        </div>
      </div>
    </>
  );
};

export default CommentCard;

