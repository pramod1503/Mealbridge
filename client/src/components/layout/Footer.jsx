import { Link } from 'react-router-dom';
import { FaUtensils, FaHeart, FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';
import styled from 'styled-components';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <FooterContainer>
      <div className="container">
        <FooterContent>
          <FooterSection>
            <FooterLogo to="/">
              <FaUtensils /> MealBridge
            </FooterLogo>
            <FooterText>
              Connecting food donors with those in need. Together we can reduce food waste and fight hunger.
            </FooterText>
            <SocialIcons>
              <SocialIcon href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <FaFacebook />
              </SocialIcon>
              <SocialIcon href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <FaTwitter />
              </SocialIcon>
              <SocialIcon href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <FaInstagram />
              </SocialIcon>
            </SocialIcons>
          </FooterSection>

          <FooterSection>
            <FooterHeading>Quick Links</FooterHeading>
            <FooterLinks>
              <FooterLink to="/">Home</FooterLink>
              <FooterLink to="/donations">Donations</FooterLink>
              <FooterLink to="/donate">Donate Food</FooterLink>
              <FooterLink to="/login">Login</FooterLink>
              <FooterLink to="/register">Sign Up</FooterLink>
            </FooterLinks>
          </FooterSection>

          <FooterSection>
            <FooterHeading>Contact Us</FooterHeading>
            <ContactInfo>
              <ContactItem>Email: info@mealbridge.org</ContactItem>
              <ContactItem>Phone: +1 (555) 123-4567</ContactItem>
              <ContactItem>Address: 123 Food St, Hunger City, HC 12345</ContactItem>
            </ContactInfo>
          </FooterSection>
        </FooterContent>

        <FooterBottom>
          <Copyright>
            &copy; {currentYear} MealBridge. All rights reserved.
          </Copyright>
          <FooterNote>
            Made with <FaHeart style={{ color: 'var(--error)' }} /> for a better world
          </FooterNote>
        </FooterBottom>
      </div>
    </FooterContainer>
  );
};

// Styled Components
const FooterContainer = styled.footer`
  background-color: #333;
  color: #fff;
  padding: 3rem 0 1.5rem;
  margin-top: 3rem;
`;

const FooterContent = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
`;

const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const FooterLogo = styled(Link)`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-light);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  
  &:hover {
    color: #fff;
  }
`;

const FooterText = styled.p`
  color: #ccc;
  margin-bottom: 1.5rem;
  line-height: 1.6;
`;

const SocialIcons = styled.div`
  display: flex;
  gap: 1rem;
`;

const SocialIcon = styled.a`
  color: #fff;
  font-size: 1.25rem;
  transition: var(--transition);
  
  &:hover {
    color: var(--primary-light);
    transform: translateY(-3px);
  }
`;

const FooterHeading = styled.h3`
  font-size: 1.25rem;
  margin-bottom: 1.5rem;
  color: #fff;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -0.5rem;
    width: 50px;
    height: 2px;
    background-color: var(--primary-color);
  }
`;

const FooterLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const FooterLink = styled(Link)`
  color: #ccc;
  transition: var(--transition);
  
  &:hover {
    color: var(--primary-light);
    padding-left: 5px;
  }
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const ContactItem = styled.p`
  color: #ccc;
`;

const FooterBottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1.5rem;
  border-top: 1px solid #444;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
`;

const Copyright = styled.p`
  color: #aaa;
  font-size: 0.875rem;
`;

const FooterNote = styled.p`
  color: #aaa;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

export default Footer; 