import axios from 'axios';
import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import Q_Box from 'components/Q_Box';
import Q_Answer_Box from 'components/Q_Answer_Box';
import AuthContext from './AuthContext';
import ScrollToTop from './ScrollToTop';

const User_Profile = ({ isLoggedIn }) => {
  const { username } = useParams();
  const { token } = useContext(AuthContext);

  const [userInfo, setUserInfo] = useState([]);
  const [myInfo, setMyInfo] = useState([]);
  const [bookmarkInfo, setBookmarkInfo] = useState([]);
  const [questionInfo, setQuestionInfo] = useState([]);
  const [answersInfo, setAnswersInfo] = useState([]);

  const isBookmarks = bookmarkInfo.length > 0;
  const isQuestions = questionInfo.length > 0;
  const isAnswers = answersInfo.length > 0;

  const robohashUrl = userInfo
    ? `https://robohash.org/${userInfo.username}${userInfo.id}.png`
    : null;

  let userImg;
  if (userInfo) {
    if (userInfo.photo === null) {
      userImg = robohashUrl;
    } else {
      userImg = userInfo.photo;
    }
  }

  console.log('myInfo ', myInfo);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const profileUrl = `https://qb.fly.dev/profiles/${username}`;
        const profileResponse = await axios.get(profileUrl);
        setUserInfo(profileResponse.data);
        setQuestionInfo(profileResponse.data.questions);
        setAnswersInfo(profileResponse.data.answers);
      } catch (error) {
        console.error('There was an error fetching data', error);
      }
    };

    fetchUserInfo();
  }, [username]);

  useEffect(() => {
    if (isLoggedIn) {
      const fetchMyInfo = async () => {
        if (isLoggedIn) {
          try {
            const userInfoUrl = `https://qb.fly.dev/auth/users/me/`;
            const userInfoResponse = await axios.get(userInfoUrl, {
              headers: {
                Accept: 'application/json',
                Authorization: `Token ${token}`,
              },
            });
            setMyInfo(userInfoResponse.data);
          } catch (error) {
            console.error('There was an error fetching data', error);
          }
        } else {
          setMyInfo(null);
        }
      };

      fetchMyInfo();
    }
  }, [token, isLoggedIn]);

  const formatPhoneNumber = (userPhone) => {
    if (!userPhone) return null;
    let formatted = userPhone;
    if (formatted[0] === '+') {
      formatted = formatted.slice(1);
    }
    const match = formatted.match(/^(\d{1})(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return (
        '+' + match[1] + ' ' + '(' + match[2] + ') ' + match[3] + '-' + match[4]
      );
    }
    return null;
  };

  if (userInfo) {
    return (
      <>
        <ScrollToTop />
        <div className='profileContainer'>
          <div className='profileInfoContainer'>
            <div className='profileInfoBox'>
              <h2 className='profileInfo'>Username: {userInfo.username}</h2>
              <h4 className='profileInfo'>
                Name: {userInfo.first_name || 'N/A'} {userInfo.last_name}
              </h4>
              <h5 className='profileInfo'>
                Phone: {formatPhoneNumber(userInfo.phone) || 'N/A'}
              </h5>
              <h5 className='profileInfo'>Email: {userInfo.email || 'N/A'}</h5>
            </div>
            <div className='userImgContainer'>
              <img className='userImg' src={userImg}></img>
            </div>
            {myInfo.username === userInfo.username ? (
              <Link to={{ pathname: '/profile/edit' }} className='editButton'>
                EDIT
              </Link>
            ) : (
              <div className='placeholder-box'></div>
            )}
            {userImg === robohashUrl ? (
              <p className='attribution'>avatars generated by robohash.org</p>
            ) : null}
          </div>
          {/* needs logic for Link to determine if it's a question or answer */}
          {/* {isBookmarks ? (
            <div className='userQuestionsContainer'>
              <p className='recentActivityText'>Questions</p>
              <div className='qBoxes'>
                {bookmarkInfo &&
                  bookmarkInfo.map((bookmark, index) => (
                    <Link to={`/questions/${question.id}`} key={index}>
                      <Q_Box question={question} />
                    </Link>
                  ))}
              </div>
            </div>
          ) : null} */}
          {isQuestions ? (
            <div className='userQuestionsContainer'>
              <p className='recentActivityText'>Questions</p>
              <div className='qBoxes'>
                {questionInfo &&
                  questionInfo.map((question, index) => (
                    <Q_Box question={question} key={index} />
                  ))}
              </div>
            </div>
          ) : null}
          {isAnswers ? (
            <div className='userQuestionsContainer'>
              <p className='recentActivityText'>Answers</p>
              <div className='qBoxes'>
                {answersInfo &&
                  answersInfo.map((answer, index) => (
                    <Link to={`/questions/${answer.question}`} key={index}>
                      <Q_Answer_Box
                        isLoggedIn={isLoggedIn}
                        token={token}
                        answer={answer}
                      />
                    </Link>
                  ))}
              </div>
            </div>
          ) : null}
        </div>
      </>
    );
  } else {
    return (
      <>
        <div className='profileContainer'>
          <div className='profileInfoContainer'>
            <div className='noInfoContainer'>
              <h2>User Profile</h2>
              <h4>No User Data Found</h4>
            </div>
          </div>
        </div>
      </>
    );
  }
};

export default User_Profile;
