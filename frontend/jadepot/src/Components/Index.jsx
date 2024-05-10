import React from 'react';  // eslint-disable-line
import NavBar from '../Components/NavBar'; 

const Index = () => {
  return (
    <div>
      <NavBar />
      <div className="container mx-auto">
        <h1 className="text-3xl text-text1 font-semibold mt-8">Welcome to Your Website</h1>
        <p className="mt-4 text-text1">This is the main content of your index page.</p>
      </div>
    </div>
  );
};

export default Index;
