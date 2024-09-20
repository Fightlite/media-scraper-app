import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { useDispatch } from 'react-redux';
import { setAuth, clearAuth } from './store/authSlice';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Auth0ProviderWithHistory from './auth/auth0-provider-with-history';
import AuthenticatedRoute from './components/AuthenticatedRoute';
import NavBar from './components/NavBar';
import Home from './components/Home';
import Media from './components/Media';
import ScrapeUrls from './components/ScrapeUrls';

const appStyle: React.CSSProperties = {
  paddingTop: '60px'
};

const queryClient = new QueryClient();

const App = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useAuth0();

  React.useEffect(() => {
    if (isAuthenticated && user) {
      dispatch(setAuth({ isAuthenticated, user }));
    } else {
      dispatch(clearAuth());
    }
  }, [isAuthenticated, user, dispatch]);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Auth0ProviderWithHistory>
          <div style={appStyle}>
            <NavBar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route 
                path="/scrape" 
                element={
                  <AuthenticatedRoute>
                    <ScrapeUrls />
                  </AuthenticatedRoute>
                } 
              />
              <Route 
                path="/media" 
                element={
                  <AuthenticatedRoute>
                    <Media />
                  </AuthenticatedRoute>
                } 
              />
            </Routes>
          </div>
        </Auth0ProviderWithHistory>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
