import Q_Box from 'components/Q_Box';
import Q_Create from './Q_Create';
import { Link, useNavigate, useParams } from 'react-router-dom';

const Q_Feed = ({ token, searchResults, itemsPerPage }) => {
  const page = parseInt(useParams().page, 10);
  const navigate = useNavigate();
  const numPerPage = itemsPerPage;

  const firstPage = 1;
  const lastPage = Math.ceil(searchResults.length / itemsPerPage);

  const paginateData = () => {
    const startIndex = page * numPerPage - numPerPage;
    const endIndex = startIndex + numPerPage;
    return searchResults.slice(startIndex, endIndex);
  };

  const nextPage = () => {
    navigate(`/page/${parseInt(page) + 1}`);
  };

  const prevPage = () => {
    navigate(`/page/${parseInt(page) - 1}`);
  };

  if (Array.isArray(paginateData())) {
    return (
      <>
        <div className='qFeedContainer'>
          {paginateData() &&
            paginateData().map((question, index) => (
              <Link to={`/questions/${question.id}`} key={index}>
                <Q_Box question={question} />
              </Link>
            ))}
          <div className='paginationControlsContainer'>
            <div className='prevContainer'>
              <p
                onClick={page === firstPage || page === 0 ? null : prevPage}
                className={page === firstPage ? 'disabledPrev' : 'prevButton'}
              >
                Prev
              </p>
            </div>
            <div className='nextContainer'>
              <p
                onClick={page === lastPage || page === 0 ? null : nextPage}
                className={page === lastPage ? 'disabledNext' : 'nextButton'}
              >
                Next
              </p>
            </div>
          </div>
          <Q_Create token={token} />
        </div>
      </>
    );
  }
};
export default Q_Feed;
