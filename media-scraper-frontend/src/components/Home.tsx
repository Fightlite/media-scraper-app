import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Link } from 'react-router-dom';
import Container from './Container';

const buttonStyle: React.CSSProperties = {
  backgroundColor: '#4CAF50',
  border: 'none',
  color: 'white',
  padding: '15px 32px',
  textAlign: 'center',
  textDecoration: 'none',
  display: 'inline-block',
  fontSize: '16px',
  margin: '10px',
  cursor: 'pointer',
  borderRadius: '4px',
};

const Home: React.FC = () => {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();

    useEffect(() => {
    if (isAuthenticated) {
      getAccessTokenSilently().then(token => {
        sessionStorage.setItem('token', token);
        console.log('Set token successfully!');
      });
    }
  }, [isAuthenticated, getAccessTokenSilently]);

  return (
    <Container>
      <h1>Welcome to my Media Scraper Application</h1>
      {isAuthenticated && (
        <div>
          <Link to="/scrape" style={buttonStyle}>Scrape</Link>
          <Link to="/media" style={buttonStyle}>View Media</Link>
        </div>
      )}
    </Container>
  );
};

export default Home;
