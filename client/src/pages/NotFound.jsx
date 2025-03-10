import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaExclamationTriangle, FaHome } from 'react-icons/fa';

const NotFound = () => {
  return (
    <NotFoundContainer>
      <NotFoundContent>
        <NotFoundIcon>
          <FaExclamationTriangle />
        </NotFoundIcon>
        <NotFoundTitle>404</NotFoundTitle>
        <NotFoundSubtitle>Page Not Found</NotFoundSubtitle>
        <NotFoundText>
          The page you are looking for does not exist or has been moved.
        </NotFoundText>
        <HomeButton to="/">
          <FaHome /> Go to Home
        </HomeButton>
      </NotFoundContent>
    </NotFoundContainer>
  );
};

// Styled Components
const NotFoundContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 70vh;
  padding: 2rem 1rem;
`;

const NotFoundContent = styled.div`
  text-align: center;
  max-width: 500px;
`;

const NotFoundIcon = styled.div`
  font-size: 4rem;
  color: var(--warning);
  margin-bottom: 1rem;
`;

const NotFoundTitle = styled.h1`
  font-size: 5rem;
  font-weight: 700;
  color: var(--text-color);
  margin-bottom: 0.5rem;
`;

const NotFoundSubtitle = styled.h2`
  font-size: 1.75rem;
  color: var(--text-color);
  margin-bottom: 1rem;
`;

const NotFoundText = styled.p`
  font-size: 1.1rem;
  color: var(--text-light);
  margin-bottom: 2rem;
`;

const HomeButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background-color: var(--primary-color);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: var(--border-radius);
  font-weight: 600;
  transition: var(--transition);
  
  &:hover {
    background-color: var(--primary-dark);
    color: white;
  }
`;

export default NotFound; 