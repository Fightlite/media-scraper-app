import React, { useState } from 'react';
import Container from './Container';
import { useScrapeUrls } from '../hooks/useScrapeUrls';

const formStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
};

const textareaStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: '300px',
  height: '150px',
  margin: '10px 0',
};

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

const ScrapeUrls: React.FC = () => {
  const [urls, setUrls] = useState('');
  const scrapeUrlsMutation = useScrapeUrls();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const urlList = urls.split(',').filter(url => url.trim() !== '');
    scrapeUrlsMutation.mutate(urlList, {
      onSuccess: (data) => {
        console.log('Scraped URLs:', data.message);
      },
      onError: (error) => {
        console.error('Error scraping URLs:', error);
      },
    });
  };

  return (
    <Container>
      <h2>Scrape URLs</h2>
      <form onSubmit={handleSubmit} style={formStyle}>
        <textarea
          style={textareaStyle}
          value={urls}
          onChange={(e) => setUrls(e.target.value)}
          placeholder="Enter URLs, separated by commas"
        />
        <button type="submit" style={buttonStyle} disabled={scrapeUrlsMutation.isPending}>
          {scrapeUrlsMutation.isPending ? 'Scraping...' : 'Submit'}
        </button>
      </form>
      {scrapeUrlsMutation.isError && (
        <div style={{ color: 'red', marginTop: '10px' }}>
          Error: {scrapeUrlsMutation?.error?.message}
        </div>
      )}
      {scrapeUrlsMutation.isSuccess && (
        <div style={{ color: 'green', marginTop: '10px' }}>
          Successfully scraped URLs
        </div>
      )}
    </Container>
  );
};

export default ScrapeUrls;
