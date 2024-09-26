import React from 'react';
import { Spinner, Col, Row } from 'react-bootstrap';
import './Loader.scss'; // Optional: For custom styles

interface LoaderProps {
  size?: 'sm' | 'lg';
  variant?: 'border' | 'grow';
  fullscreen?: boolean;
}

const Loader: React.FC<LoaderProps> = ({ size = 'lg', variant = 'border', fullscreen = false }) => {
  return (
    <div className={`loader-container ${fullscreen ? 'fullscreen' : ''}`}>
      <Row className="justify-content-center align-items-center">
        <Col className="text-center">
          <Spinner animation={variant} />
        </Col>
      </Row>
    </div>
  );
};

export default Loader;
