import React, { useState, useEffect, useMemo } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import styled from "styled-components";
import bg from './img/bg.png';
import { MainLayout } from './styles/Layouts';
import Orb from './Components/Orb/Orb';
import Navigation from './Components/Navigation/Navigation';
import Dashboard from './Components/Dashboard/Dashboard';
import Income from './Components/Income/Income';
import Expenses from './Components/Expenses/Expenses';
import LoginForm from './Components/LoginForm/LoginForm';
import SignupForm from './Components/SignupForm/SignupForm';
import { useGlobalContext } from './context/globalContext';

function App() {
  const [active, setActive] = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status
  const [reloadPage, setReloadPage] = useState(false); // State to track whether the page needs to be reloaded

  useEffect(() => {
    // Check local storage for login status on initial load
    const storedLoginStatus = localStorage.getItem('isLoggedIn');
    if (storedLoginStatus === 'true') {
      setIsLoggedIn(true);
    } else {
      // Reset active page and login status when not logged in
      setActive(1);
      setIsLoggedIn(false);
      localStorage.removeItem('activePage');
    }
    // Check local storage for the active page
    const storedActivePage = localStorage.getItem('activePage');
    if (storedActivePage) {
      setActive(Number(storedActivePage));
    }
  }, []);

  const { getIncomes } = useGlobalContext();

  const orbMemo = useMemo(() => {
    return <Orb />;
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      getIncomes();
    }
  }, [isLoggedIn]);

  // Function to handle login
  const handleLogin = (userData) => {
    // Logic to handle login (e.g., authenticate user)
    // After successful login, update isLoggedIn state to true
    setIsLoggedIn(true);
    // Store login status in local storage
    localStorage.setItem('isLoggedIn', 'true');
    // Set flag to reload page
    setReloadPage(true);
  }

  // Function to handle logout
  const handleLogout = () => {
    // Reset active page and login status
    setActive(1);
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('activePage');
  }

  // Function to render main content based on the active state
  const displayData = () => {
    switch (active) {
      case 1:
      case 2:
        return <Dashboard />;
      case 3:
        return <Income />;
      case 4:
        return <Expenses />;
      default:
        return <Dashboard />;
    }
  }

  // Function to handle page change
  const handlePageChange = (page) => {
    // Update active page state
    setActive(page);
    // Store active page in local storage
    localStorage.setItem('activePage', page);
  }

  useEffect(() => {
    // Reload the page if flag is set
    if (reloadPage) {
      window.location.reload();
      // Reset the flag
      setReloadPage(false);
    }
  }, [reloadPage]);

  return (
    <AppStyled bg={bg} className="App">
      {orbMemo}
      <MainLayout>
        {!isLoggedIn && (
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<SignupForm />} />
              <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
              {/* Redirect to login page if route not found */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </BrowserRouter>
        )}

        {isLoggedIn && (
          <>
            <Navigation active={active} setActive={handlePageChange} />
            <main>
              {/* Render  main content here based on the active state */}
              {displayData()}
            </main>
          </>
        )}
      </MainLayout>
    </AppStyled>
  );
}

const AppStyled = styled.div`
  height: 100vh;
  background-image: url(${props => props.bg});
  position: relative;
  main {
    flex: 1;
    background:#faedcd;
    border: 3px solid #FFFFFF;
    backdrop-filter: blur(4.5px);
    border-radius: 32px;
    overflow-x: hidden;
    &::-webkit-scrollbar {
      width: 0;
    }
  }
`;

export default App;
