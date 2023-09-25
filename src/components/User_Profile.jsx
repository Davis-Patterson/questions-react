import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Q_Box from 'components/Q_Box';
import Q_Answer_Box from 'components/Q_Answer_Box';

const User_Profile = ({ token, isLoggedIn }) => {
  console.log('isLoggedIn', isLoggedIn);

  const [userInfo, setUserInfo] = useState(null);
  const [questionInfo, setQuestionInfo] = useState([]);
  const [answersInfo, setAnswersInfo] = useState([]);

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

  useEffect(() => {
    if (isLoggedIn) {
      const fetchUserInfo = async () => {
        if (isLoggedIn) {
          try {
            const userInfoUrl = `https://qb.fly.dev/auth/users/me/`;
            const userInfoResponse = await axios.get(userInfoUrl, {
              headers: {
                Accept: 'application/json',
                Authorization: `Token ${token}`,
              },
            });
            setUserInfo(userInfoResponse.data);
            const questionInfoUrl = 'https://qb.fly.dev/questions/me';
            const questionInfoResponse = await axios.get(questionInfoUrl, {
              headers: {
                Accept: 'application/json',
                Authorization: `Token ${token}`,
              },
            });
            setQuestionInfo(questionInfoResponse.data);
            const answerInfoUrl = 'https://qb.fly.dev/answers/me';
            const answerInfoResponse = await axios.get(answerInfoUrl, {
              headers: {
                Accept: 'application/json',
                Authorization: `Token ${token}`,
              },
            });
            setAnswersInfo(answerInfoResponse.data);
          } catch (error) {
            console.error('There was an error fetching data', error);
          }
        } else {
          setUserInfo(null);
        }
      };

      fetchUserInfo();
    }
  }, [token, isLoggedIn]);

  const formatPhoneNumber = (userPhone) => {
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
            <Link to={{ pathname: '/profile/edit' }} className='editButton'>
              EDIT
            </Link>
            {userImg === robohashUrl ? (
              <p className='attribution'>avatars generated by robohash.org</p>
            ) : null}
          </div>
          {isQuestions ? (
            <div className='userQuestionsContainer'>
              <p className='recentActivityText'>Questions</p>
              <div className='qBoxes'>
                {questionInfo &&
                  questionInfo.map((question) => (
                    <Link to={`/questions/${question.id}`} key={question.id}>
                      <Q_Box question={question} />
                    </Link>
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
