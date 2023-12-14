import React, { useEffect, useState } from 'react';
import { Outlet, Route, Routes, Link, ScrollRestoration, useNavigate } from 'react-router-dom';
import AdminMobileSidebar from './components/sidebar/AdminMobileSidebar';
import AdminSidebar from './components/sidebar/AdminSidebar';
import MobileSidebar from './components/sidebar/MobileSidebar';
import Sidebar from './components/sidebar/Sidebar';
import useFetchProducts from './Hooks/useFetchProduct';
import SignIn from './pages/Account/SignIn';
import SignUp from './pages/Account/SignUp';
import Nav from './pages/Home/components/Nav/Nav';

interface UserLogging {
  username: string;
  password: string;
  favourites: any[];
}

// ... (your existing imports)

function Layout() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { products, loading } = useFetchProducts();
  const { login,signup } = useFetchProducts();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false); // New state
  const navigate = useNavigate();

  const handleToggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);
 const handleLogin = async (user: UserLogging) => {
  try {
  
  await login(user);

    // Check if login was successful
    setIsAdmin(user.username === 'admin');
    setIsAuthenticated(true);

    

    // Navigate based on user role
    if (user.username === 'admin') {
      navigate('/admin');
    } else {
      navigate('/');
    }
  } catch (error) {
    console.error('Login failed:', error);
  }
};




  const handleLogout = () => {
    // Clear user from localStorage on logout
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    window.location.reload()

  

    // Redirect to login page after logout
    navigate('/');
  };
  const handleSignUpClick = () => {
    setShowSignUp(true);
  };

  return (
    <div className="flex">
      {isAuthenticated && (
        <>
          {isAdmin ? (
            <div className={`md:w-1/5 shadow-xl border-none border-r z-50 fixed bg-primary ${isDarkMode ? 'sidebar' : ''}`}>
              <AdminSidebar toggleDarkMode={handleToggleDarkMode} products={products} />
              <AdminMobileSidebar isDarkMode={isDarkMode} toggleDarkMode={handleToggleDarkMode} />
            </div>
          ) : (
            <div className={`md:w-1/5 shadow-xl border-none border-r z-50 fixed bg-primary ${isDarkMode ? 'sidebar' : ''}`}>
              <Sidebar toggleDarkMode={handleToggleDarkMode} products={products} logout={handleLogout}/>
              <MobileSidebar isDarkMode={isDarkMode} toggleDarkMode={handleToggleDarkMode} />
            </div>
          )}
          <Nav isDark={isDarkMode} products={products} />
        </>
      )}
      <div className="md:ml-[20%] md:mt-[5%] pb-10 mt-[32%] w-full block">
        <ScrollRestoration />
        {isAuthenticated ? (
          <Outlet />
        ) : showSignUp ? (  
          <SignUp showSignIn={() => setShowSignUp(false)} />
        ) : (  
          <SignIn onClick={handleLogin} showSignUp={handleSignUpClick} />
        )}
      </div>
    </div>
  );
}

export default Layout;
