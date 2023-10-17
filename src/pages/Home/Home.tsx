import CommentCard from '../../components/CommentCard/CommentCard';
import NewCommentForm from '../../components/NewCommentForm/NewCommentForm';
import Spinner from '../../components/Spinner/Spinner';
import { useGetCommentsQuery } from '../../features/api/api.slice';

const Home = () => {
  const { data: comments, isLoading, isError } = useGetCommentsQuery();

  if (isLoading) { return <Spinner />; }

  if (isError || !comments) {
    return <div>No comment yet.</div>;
  }

  const sortedComments = comments.slice().sort((a: any, b: any) => b.score - a.score);

  return (
    <>
      <div className='interactive-comments-container'>
        {sortedComments.map((comment) =>
          comment._id ? <CommentCard key={comment._id?.toString()} commentId={comment._id} /> : <div>No comment yet.</div>
        )}
      </div>
      <NewCommentForm />
    </>
  );
};

export default Home;