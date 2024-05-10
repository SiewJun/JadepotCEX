import React from 'react';  // eslint-disable-line
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivateRoutes from './utils/PrivateRoutes';
import SignUpPage from './Pages/SignUpPage';
import SignInPage from './Pages/SignInPage';
import IndexPage from './Pages/IndexPage';
import ProfilePage from './Pages/ProfilePage';
import TradingPage from './Pages/TradingPage';
import TradingPairPage from './Pages/TradingPairPage';
import WalletPage from './Pages/WalletPage';

const App = () => {

  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/" element={<IndexPage />} />
        <Route path="/trading" element={<TradingPage />} />
        <Route path="/trading/:name" element={<TradingPairPage />} />
        <Route element={<PrivateRoutes/>}>
          <Route path='/profile' element={<ProfilePage />}></Route>
          <Route path='/wallet' element={<WalletPage />}></Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
