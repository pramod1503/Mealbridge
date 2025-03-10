import { Link, useLocation } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { FaHome, FaHandHoldingHeart, FaUser, FaSignInAlt, FaUserPlus } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();

  return (
    <NavContainer>
      <NavBrand to="/">
        <LogoText>MealBridge</LogoText>
      </NavBrand>

      <NavLinks>
        <NavItem $isActive={location.pathname === '/'}>
          <NavLink to="/">
            <FaHome />
            <span>Home</span>
          </NavLink>
        </NavItem>

        <NavItem $isActive={location.pathname === '/donations'}>
          <NavLink to="/donations">
            <FaHandHoldingHeart />
            <span>Donations</span>
          </NavLink>
        </NavItem>

        {isAuthenticated ? (
          <>
            <NavItem $isActive={location.pathname === '/dashboard'}>
              <NavLink to="/dashboard">
                <FaUser />
                <span>Dashboard</span>
              </NavLink>
            </NavItem>
            <NavItem>
              <LogoutButton onClick={logout}>
                <FaSignInAlt />
                <span>Logout</span>
              </LogoutButton>
            </NavItem>
          </>
        ) : (
          <>
            <NavItem $isActive={location.pathname === '/login'}>
              <NavLink to="/login">
                <FaSignInAlt />
                <span>Login</span>
              </NavLink>
            </NavItem>
            <NavItem $isActive={location.pathname === '/register'}>
              <NavLink to="/register">
                <FaUserPlus />
                <span>Register</span>
              </NavLink>
            </NavItem>
          </>
        )}
      </NavLinks>
    </NavContainer>
  );
};

// Animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideIn = keyframes`
  from {
    transform: translateX(-20px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

// Styled Components
const NavContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
  backdrop-filter: blur(10px);
  animation: ${fadeIn} 0.5s ease-out;
`;

const NavBrand = styled(Link)`
  text-decoration: none;
  animation: ${slideIn} 0.5s ease-out;
`;

const LogoText = styled.h1`
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--primary-color);
  margin: 0;
  
  &:hover {
    animation: ${pulse} 0.5s ease-in-out;
  }
`;

const NavLinks = styled.ul`
  display: flex;
  gap: 1.5rem;
  list-style: none;
  margin: 0;
  padding: 0;

  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

const NavItem = styled.li`
  animation: ${fadeIn} 0.5s ease-out;
  animation-delay: ${props => props.index * 0.1}s;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: ${props => (props.$isActive ? '100%' : '0')};
    height: 2px;
    background-color: var(--primary-color);
    transition: width 0.3s ease;
  }

  &:hover::after {
    width: 100%;
  }
`;

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.$isActive ? 'var(--primary-color)' : 'var(--text-color)'};
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;

  svg {
    font-size: 1.2rem;
    transition: transform 0.3s ease;
  }

  &:hover {
    color: var(--primary-color);
    transform: translateY(-2px);

    svg {
      transform: scale(1.1);
    }
  }

  @media (max-width: 768px) {
    span {
      display: none;
    }
    svg {
      font-size: 1.5rem;
    }
  }
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-color);
  background: none;
  border: none;
  font-weight: 500;
  padding: 0.5rem;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.3s ease;

  svg {
    font-size: 1.2rem;
    transition: transform 0.3s ease;
  }

  &:hover {
    color: var(--primary-color);
    transform: translateY(-2px);

    svg {
      transform: scale(1.1);
    }
  }

  @media (max-width: 768px) {
    span {
      display: none;
    }
    svg {
      font-size: 1.5rem;
    }
  }
`;

export default Navbar; 