import React, { useState, useContext } from 'react';
import axios from 'axios';
import { Button, TextField, Box } from '@mui/material';
import AuthContext from './AuthContext';
import { useNavigate } from 'react-router-dom';

const Q_Create = () => {
  const { token } = useContext(AuthContext);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  // const [author, setAuthor] = useState("");

  const navigate = useNavigate();

  const handleCreateClick = () => {
    if (token) {
      setShowForm(true);
    } else {
      setShowForm(false);
      navigate('/login');
    }
  };

  const handleSubmitClick = async (e) => {
    e.preventDefault();

    const questionData = {
      title,
      body,
    };

    try {
      const response = await axios.post(
        'https://qb.fly.dev/questions',
        questionData,
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Token ${token}`,
          },
        }
      );

      // Hide the form and reset fields
      setShowForm(false);
      setTitle('');
      setBody('');
    } catch (error) {
      console.error('There was an error creating the question:', error);
    }
  };

  return (
    <Box>
      <Button variant='contained' color='primary' onClick={handleCreateClick}>
        Ask A Question
      </Button>

      {showForm && (
        <form onSubmit={handleSubmitClick}>
          <TextField
            label='Title'
            variant='outlined'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            label='Body'
            variant='outlined'
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />

          <Button type='submit' variant='contained' color='secondary'>
            Submit
          </Button>
        </form>
      )}
    </Box>
  );
};

export default Q_Create;
