import { Box, Button, TextField } from "@mui/material";
import React, { useState, useContext } from "react";
import axios from "axios";
import AuthContext from "./AuthContext";

const Q_Edit = ({ questionID }) => {
  const { token } = useContext(AuthContext);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  // const [author, setAuthor] = useState("");

  const handleEditClick = async (e) => {
    if (token) {
      // go to edit page
      setShowForm(!showForm);
    } else {
      // go to login page
      alert("You must be logged in to edit a question.");
    }
  };
  
  const handleSubmitClick = async (e) => {
    e.preventDefault();

    const questionData = {
      title,
      body,
    };

    try {
      const response = await axios.patch(
        `https://qb.fly.dev/questions/${questionID}`, questionData,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Token ${token}`,
          },
        }
      );

      // Hide the form and reset fields
      setShowForm(false);
      setTitle("");
      setBody("");
    } catch (error) {
      console.error("There was an error editing the question:", error);
    }
  };

  return (
    <Box>
      <Button variant="contained" color="secondary" onClick={handleEditClick}>
        Edit Question
      </Button>

      {showForm && (
        <form onSubmit={handleSubmitClick}>
          <TextField
            label="Title"
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            label="Body"
            variant="outlined"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />

          <Button type="submit" variant="contained" color="secondary">
            Submit
          </Button>
        </form>
      )}
    </Box>
  );
};

export default Q_Edit;
