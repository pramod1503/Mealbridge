import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUtensils, FaBars, FaTimes } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import styled from 'styled-components';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <NavbarContainer>
      <div className="container">
        <NavbarContent>
          <Logo to="/">
            <FaUtensils /> MealBridge
          </Logo>

          <MenuToggle onClick={toggleMenu}>
            {isOpen ? <FaTimes /> : <FaBars />}
          </MenuToggle>

          <NavMenu $isOpen={isOpen}>
            <NavItem>
              <NavLink to="/" onClick={() => setIsOpen(false)}>
                Home
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/donations" onClick={() => setIsOpen(false)}>
                Donations
              </NavLink>
            </NavItem>
            
            {isAuthenticated ? (
              <>
                <NavItem>
                  <NavLink to="/dashboard" onClick={() => setIsOpen(false)}>
                    Dashboard
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink to="/donate" onClick={() => setIsOpen(false)}>
                    Donate Food
                  </NavLink>
                </NavItem>
                <NavItem>
                  <LogoutButton onClick={handleLogout}>
                    Logout
                  </LogoutButton>
                </NavItem>
              </>
            ) : (
              <>
                <NavItem>
                  <NavLink to="/login" onClick={() => setIsOpen(false)}>
                    Login
                  </NavLink>
                </NavItem>
                <NavItem>
                  <SignUpButton to="/register" onClick={() => setIsOpen(false)}>
                    Sign Up
                  </SignUpButton>
                </NavItem>
              </>
            )}
          </NavMenu>
        </NavbarContent>
      </div>
    </NavbarContainer>
  );
};

// Styled Components
const NavbarContainer = styled.nav`
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
`;

const NavbarContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-color);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    color: var(--primary-dark);
  }
`;

const MenuToggle = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--text-color);
  cursor: pointer;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const NavMenu = styled.ul`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: #fff;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 1rem 0;
    transform: ${({ $isOpen }) => $isOpen ? 'translateY(0)' : 'translateY(-100%)'};
    opacity: ${({ $isOpen }) => $isOpen ? '1' : '0'};
    visibility: ${({ $isOpen }) => $isOpen ? 'visible' : 'hidden'};
    transition: all 0.3s ease;
    z-index: 99;
  }
`;

const NavItem = styled.li`
  @media (max-width: 768px) {
    width: 100%;
    text-align: center;
  }
`;

const NavLink = styled(Link)`
  color: var(--text-color);
  font-weight: 500;
  padding: 0.5rem;
  
  &:hover {
    color: var(--primary-color);
  }
  
  @media (max-width: 768px) {
    display: block;
    padding: 0.75rem 0;
  }
`;

const SignUpButton = styled(Link)`
  background-color: var(--primary-color);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius);
  font-weight: 500;
  
  &:hover {
    background-color: var(--primary-dark);
    color: white;
  }
  
  @media (max-width: 768px) {
    display: inline-block;
    margin: 0.5rem 0;
  }
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  color: var(--text-color);
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  padding: 0.5rem;
  
  &:hover {
    color: var(--error);
  }
  
  @media (max-width: 768px) {
    display: block;
    width: 100%;
    padding: 0.75rem 0;
  }
`;

export default Navbar; 