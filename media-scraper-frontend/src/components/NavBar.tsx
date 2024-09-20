import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Link } from 'react-router-dom';

const navStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  backgroundColor: '#333',
  color: 'white',
  padding: '1rem',
  zIndex: 1000
};

const ulStyle: React.CSSProperties = {
  listStyle: 'none',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  margin: 0,
  padding: 0
};

const linkStyle: React.CSSProperties = {
  textDecoration: 'none',
  color: 'white',
  fontWeight: 'bold',
  marginRight: '2rem'
};

const buttonStyle: React.CSSProperties = {
  backgroundColor: '#4CAF50',
  border: 'none',
  color: 'white',
  padding: '10px 20px',
  textAlign: 'center',
  textDecoration: 'none',
  display: 'inline-block',
  fontSize: '16px',
  margin: '4px 2px',
  cursor: 'pointer',
  borderRadius: '4px'
};

const NavBar: React.FC = () => {
  const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0();

  return (
    <nav style={navStyle}>
      <ul style={ulStyle}>
        <li>
          <Link to="/" style={linkStyle}>Home</Link>
          {isAuthenticated && (<Link to="/scrape" style={linkStyle}>Scrape</Link>)}
          {isAuthenticated && (<Link to="/media" style={linkStyle}>Media</Link>)}
        </li>
        <li>
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: '1rem' }}>Hello, {user?.email}</span>
              <button style={buttonStyle} onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
                Log Out
              </button>
            </div>
          ) : (
            <button style={buttonStyle} onClick={() => loginWithRedirect()}>Log In</button>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
