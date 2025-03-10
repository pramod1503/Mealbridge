import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaHandHoldingHeart, FaUsers, FaLeaf, FaMapMarkedAlt } from 'react-icons/fa';

const Home = () => {
  return (
    <>
      <HeroSection>
        <HeroContent>
          <HeroTitle>Share Food, Share Love</HeroTitle>
          <HeroSubtitle>
            Join our community in reducing food waste and helping those in need
          </HeroSubtitle>
          <HeroButtons>
            <PrimaryButton to="/donations">Browse Donations</PrimaryButton>
            <SecondaryButton to="/donations/create">Make a Donation</SecondaryButton>
          </HeroButtons>
        </HeroContent>
        <HeroImage src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80" alt="Food Donation" />
      </HeroSection>

      <FeaturesSection>
        <SectionTitle>How It Works</SectionTitle>
        <FeaturesGrid>
          <FeatureCard>
            <FeatureIcon>
              <FaHandHoldingHeart />
            </FeatureIcon>
            <FeatureTitle>Donate Food</FeatureTitle>
            <FeatureDescription>
              Share your excess food with those who need it most. Every donation makes a difference.
            </FeatureDescription>
          </FeatureCard>
          <FeatureCard>
            <FeatureIcon>
              <FaUsers />
            </FeatureIcon>
            <FeatureTitle>Connect</FeatureTitle>
            <FeatureDescription>
              Join a community of donors and recipients working together to reduce food waste.
            </FeatureDescription>
          </FeatureCard>
          <FeatureCard>
            <FeatureIcon>
              <FaLeaf />
            </FeatureIcon>
            <FeatureTitle>Reduce Waste</FeatureTitle>
            <FeatureDescription>
              Help the environment by preventing food waste and supporting sustainability.
            </FeatureDescription>
          </FeatureCard>
          <FeatureCard>
            <FeatureIcon>
              <FaMapMarkedAlt />
            </FeatureIcon>
            <FeatureTitle>Local Impact</FeatureTitle>
            <FeatureDescription>
              Make a difference in your local community by sharing with neighbors in need.
            </FeatureDescription>
          </FeatureCard>
        </FeaturesGrid>
      </FeaturesSection>

      <ImpactSection>
        <ImpactContent>
          <ImpactTitle>Our Impact</ImpactTitle>
          <ImpactStats>
            <StatCard>
              <StatNumber>1000+</StatNumber>
              <StatLabel>Meals Shared</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>500+</StatNumber>
              <StatLabel>Active Donors</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>50+</StatNumber>
              <StatLabel>Communities</StatLabel>
            </StatCard>
          </ImpactStats>
        </ImpactContent>
      </ImpactSection>

      <CTASection>
        <CTAContent>
          <CTATitle>Ready to Make a Difference?</CTATitle>
          <CTAText>
            Join MealBridge today and be part of the solution to food waste and hunger.
          </CTAText>
          <CTAButton to="/register">Get Started Now</CTAButton>
        </CTAContent>
      </CTASection>
    </>
  );
};

// Styled Components
const HeroSection = styled.section`
  display: flex;
  align-items: center;
  min-height: 80vh;
  padding: 2rem;
  background: linear-gradient(135deg, var(--primary-color) 0%, #2c7744 100%);
  color: white;
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const HeroContent = styled.div`
  flex: 1;
  z-index: 1;
  padding: 2rem;
`;

const HeroTitle = styled.h1`
  font-size: 4rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  line-height: 1.2;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.5rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const HeroButtons = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 768px) {
    justify-content: center;
    flex-wrap: wrap;
  }
`;

const HeroImage = styled.img`
  flex: 1;
  max-width: 50%;
  object-fit: cover;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  
  @media (max-width: 768px) {
    max-width: 100%;
    margin-top: 2rem;
  }
`;

const Button = styled(Link)`
  display: inline-block;
  padding: 1rem 2rem;
  border-radius: 50px;
  font-weight: 600;
  text-decoration: none;
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const PrimaryButton = styled(Button)`
  background-color: white;
  color: var(--primary-color);
  
  &:hover {
    background-color: #f0f0f0;
  }
`;

const SecondaryButton = styled(Button)`
  background-color: transparent;
  border: 2px solid white;
  color: white;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const FeaturesSection = styled.section`
  padding: 5rem 2rem;
  background-color: #f9f9f9;
`;

const SectionTitle = styled.h2`
  text-align: center;
  font-size: 2.5rem;
  color: var(--text-color);
  margin-bottom: 3rem;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const FeatureCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 15px;
  text-align: center;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const FeatureIcon = styled.div`
  font-size: 2.5rem;
  color: var(--primary-color);
  margin-bottom: 1rem;
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  color: var(--text-color);
  margin-bottom: 1rem;
`;

const FeatureDescription = styled.p`
  color: var(--text-light);
  line-height: 1.6;
`;

const ImpactSection = styled.section`
  padding: 5rem 2rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
`;

const ImpactContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const ImpactTitle = styled.h2`
  text-align: center;
  font-size: 2.5rem;
  color: var(--text-color);
  margin-bottom: 3rem;
`;

const ImpactStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  text-align: center;
`;

const StatCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
`;

const StatNumber = styled.div`
  font-size: 3rem;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 1.2rem;
  color: var(--text-light);
`;

const CTASection = styled.section`
  padding: 5rem 2rem;
  background: var(--primary-color);
  color: white;
`;

const CTAContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
`;

const CTATitle = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
`;

const CTAText = styled.p`
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.9;
`;

const CTAButton = styled(Button)`
  background-color: white;
  color: var(--primary-color);
  font-size: 1.2rem;
  padding: 1.2rem 3rem;
  
  &:hover {
    background-color: #f0f0f0;
  }
`;

export default Home; 