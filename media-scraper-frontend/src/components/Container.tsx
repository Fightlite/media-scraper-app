import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
}

const containerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 'calc(100vh - 60px)',
  padding: '20px',
  boxSizing: 'border-box',
  width: '100%',
  maxWidth: '800px',
  margin: '0 auto',
};

const contentStyle: React.CSSProperties = {
  width: '100%',
  textAlign: 'center',
};

const Container: React.FC<ContainerProps> = ({ children }) => {
  return (
    <div style={containerStyle}>
      <div style={contentStyle}>
        {children}
      </div>
    </div>
  );
};

export default Container;
