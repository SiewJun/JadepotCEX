import React from 'react';   // eslint-disable-line
import SignInForm from '../Components/SignInForm';
import { useNavigate } from 'react-router-dom';

const SignInPage = () => {
  const navigate = useNavigate();

  const handleSignIn = (token) => {
    // Store Token: Save the authentication token in local storage
    localStorage.setItem('authToken', token);
    // Update User Interface: Redirect the user to the index page
    navigate('/');
  };

  return (
    <div>
      <SignInForm onSignIn={handleSignIn} />
    </div>
  );
};

export default SignInPage;
