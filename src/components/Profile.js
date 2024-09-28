import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return (
    isAuthenticated && (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img src={user.picture} alt={user.name} style={{ borderRadius: '50%', height: '40px', width: '40px', marginLeft: '10px' }} />
        {/* Optionally show the user name next to the picture */}
        {/* <span style={{ marginLeft: '10px', color: 'white' }}>{user.name}</span> */}
      </div>
    )
  );
};

export default Profile;
