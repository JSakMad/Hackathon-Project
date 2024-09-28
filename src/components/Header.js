import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import LoginButton from './LoginButton';
import LogoutButton from './LogoutButton';
import Profile from './Profile';
import { useAuth0 } from '@auth0/auth0-react';
import { toast } from 'react-toastify';

function Header() {
  const { isAuthenticated, isLoading } = useAuth0();

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      toast.success('Successfully logged in!');
    }
  }, [isAuthenticated, isLoading]);

  return (
    <header>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/dashboard">Dashboard</Link></li>
          {isAuthenticated ? <LogoutButton /> : <LoginButton />}
          {isAuthenticated && <Profile />}
        </ul>
      </nav>
    </header>
  );
}

export default Header;
