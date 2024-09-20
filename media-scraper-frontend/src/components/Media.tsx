import React, { useEffect, useState } from 'react';
import Container from './Container';
import { useGetMedia } from '../hooks/useGetMedia';

const mediaListStyle: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  width: '100%',
};

const centerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
};

const mediaItemStyle: React.CSSProperties = {
  margin: '10px 0',
  padding: '10px',
  border: '1px solid #ddd',
  borderRadius: '4px',
  width: 'calc(50% - 10px)', // 50% width with gap
  boxSizing: 'border-box',
};

const filterStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  marginBottom: '20px',
};

const inputStyle: React.CSSProperties = {
  margin: '0 10px',
  padding: '5px',
};

const paginationStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: '20px',
  width: '100%',
};
  
const buttonStyle: React.CSSProperties = {
  margin: '0 10px',
  padding: '5px 10px',
  cursor: 'pointer',
};

const Media: React.FC = () => {
  const [mediaType, setMediaType] = useState<string>('');
  const [searchText, setSearchText] = useState<string>('');
  const [debouncedSearchText, setDebouncedSearchText] = useState<string>(searchText);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchText]);

  const { data, isLoading, isError, error } = useGetMedia({
    page,
    limit,
    type: mediaType,
    search: debouncedSearchText,
  });

  if (isLoading) return <div style={centerStyle}>Loading...</div>;
  if (isError) return <div style={centerStyle}>Error: {error.message}</div>;

  const hasItems = data?.items && data.items.length > 0;

  return (
    <Container>
      <h2>Media Items</h2>
      <div style={filterStyle}>
        <select
          value={mediaType}
          onChange={(e) => setMediaType(e.target.value)}
          style={inputStyle}
        >
          <option value="">All Types</option>
          <option value="image">Image</option>
          <option value="video">Video</option>
        </select>
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search by title"
          style={inputStyle}
        />
        <div>
        <label htmlFor="itemsPerPage">Items per page: </label>
        <select
          id="itemsPerPage"
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
        >
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
          <option value="100">100</option>

        </select>
      </div>
      </div>
      <div style={mediaListStyle}>
        {hasItems ? (
          data.items.map((item) => (
            <div key={item.id} style={mediaItemStyle} className="media-item">
              {item.type === 'image' ? (
                <img src={item.url} alt={item.title} style={{ width: '100%', height: 'auto' }} />
              ) : item.type === 'video' ? (
                <div className="video-container">
                  <iframe
                    style={{ width: '100%', height: 'auto' }}
                    src={item.url}
                    title={item.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              ) : null}
              <p>Title: {item.title}</p>
              <p>Description: {item.description}</p>
            </div>
          ))
        ) : (
          <p>No media items found. Try adjusting your search or filter criteria.</p>
        )}l
      </div>
      {hasItems && (
        <div style={paginationStyle}>
        <span>Showing {data.items.length} of {data.totalItems} items</span>
        <div>
          <button 
            onClick={() => setPage(p => Math.max(1, p - 1))} 
            disabled={page === 1}
            style={buttonStyle}
          >
            Previous
          </button>
          <span>Page {data.currentPage} of {data.totalPages}</span>
          <button 
            onClick={() => setPage(p => p + 1)} 
            disabled={data.items.length < limit}
            style={buttonStyle}
          >
            Next
          </button>
        </div>
      </div>
      )}
    </Container>
  );
};

export default Media;
