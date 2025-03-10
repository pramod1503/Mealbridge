import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  FaMapMarkerAlt, 
  FaClock, 
  FaUtensils, 
  FaUser, 
  FaCalendarAlt,
  FaCheckCircle,
  FaArrowLeft
} from 'react-icons/fa';
import { format } from 'date-fns';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';

const DonationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [donation, setDonation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reserving, setReserving] = useState(false);

  useEffect(() => {
    const fetchDonation = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/api/donations/${id}`);
        
        if (res.data.success) {
          setDonation(res.data.data);
        } else {
          setError('Failed to load donation details');
        }
      } catch (err) {
        console.error('Error fetching donation:', err);
        setError('Donation not found or no longer available');
      } finally {
        setLoading(false);
      }
    };

    fetchDonation();
  }, [id]);

  const handleReserveDonation = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to reserve this donation');
      navigate('/login');
      return;
    }

    try {
      setReserving(true);
      const res = await api.put(`/api/donations/${id}/reserve`);
      
      if (res.data.success) {
        toast.success('Donation reserved successfully!');
        setDonation(res.data.data);
      } else {
        toast.error('Failed to reserve donation');
      }
    } catch (err) {
      console.error('Error reserving donation:', err);
      toast.error(err.response?.data?.message || 'Failed to reserve donation');
    } finally {
      setReserving(false);
    }
  };

  if (loading) {
    return (
      <LoadingContainer>
        <div className="loading-spinner"></div>
        <p>Loading donation details...</p>
      </LoadingContainer>
    );
  }

  if (error || !donation) {
    return (
      <ErrorContainer>
        <ErrorIcon>
          <FaUtensils />
        </ErrorIcon>
        <h2>Oops! {error}</h2>
        <p>The donation you're looking for may have been removed or is no longer available.</p>
        <BackButton to="/donations">
          <FaArrowLeft /> Back to Donations
        </BackButton>
      </ErrorContainer>
    );
  }

  const isExpired = new Date(donation.expiryDate) < new Date();
  const isOwner = isAuthenticated && user?._id === donation.donor?._id;
  const isReservedByMe = isAuthenticated && user?._id === donation.recipient;
  const canReserve = 
    isAuthenticated && 
    donation.status === 'available' && 
    !isOwner && 
    !isExpired && 
    user?.role === 'recipient';

  return (
    <DetailsContainer>
      <BackLink to="/donations">
        <FaArrowLeft /> Back to Donations
      </BackLink>
      
      <DetailsWrapper>
        <DetailsHeader>
          <h1>{donation.title}</h1>
          <StatusBadge status={donation.status}>
            {donation.status}
          </StatusBadge>
        </DetailsHeader>
        
        <DetailsGrid>
          <ImageSection>
            <DonationImage 
              src={
                donation.images && donation.images.length > 0
                  ? donation.images[0]
                  : 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80'
              } 
              alt={donation.title} 
            />
            
            {isOwner && (
              <OwnerActions>
                <ActionButton to={`/donations/edit/${donation._id}`}>
                  Edit Donation
                </ActionButton>
              </OwnerActions>
            )}
            
            {canReserve && (
              <ReserveButton
                onClick={handleReserveDonation}
                disabled={reserving}
              >
                {reserving ? 'Reserving...' : 'Reserve This Donation'}
              </ReserveButton>
            )}
            
            {isReservedByMe && (
              <ReservedByMeMessage>
                <FaCheckCircle /> You have reserved this donation
              </ReservedByMeMessage>
            )}
          </ImageSection>
          
          <InfoSection>
            <DetailCard>
              <DetailGroup>
                <DetailLabel>Description</DetailLabel>
                <DetailValue>{donation.description}</DetailValue>
              </DetailGroup>
              
              <Row>
                <DetailGroup>
                  <DetailLabel>Quantity</DetailLabel>
                  <DetailValue>
                    {donation.quantity} {donation.quantityUnit}
                  </DetailValue>
                </DetailGroup>
                
                <DetailGroup>
                  <DetailLabel>Food Type</DetailLabel>
                  <DetailValue>{donation.type}</DetailValue>
                </DetailGroup>
              </Row>
              
              <Row>
                <DetailGroup>
                  <DetailLabel>
                    <FaUser /> Donor
                  </DetailLabel>
                  <DetailValue>
                    {donation.donor?.name || 'Anonymous'}
                    {donation.donor?.organization && ` (${donation.donor.organization})`}
                  </DetailValue>
                </DetailGroup>
                
                <DetailGroup>
                  <DetailLabel>
                    <FaCalendarAlt /> Posted
                  </DetailLabel>
                  <DetailValue>
                    {new Date(donation.createdAt).toLocaleDateString()}
                  </DetailValue>
                </DetailGroup>
              </Row>
              
              <Row>
                <DetailGroup>
                  <DetailLabel>
                    <FaClock /> Expires
                  </DetailLabel>
                  <DetailValue className={isExpired ? 'expired' : ''}>
                    {format(new Date(donation.expiryDate), 'PPP p')}
                    {isExpired && ' (Expired)'}
                  </DetailValue>
                </DetailGroup>
              </Row>
              
              <DetailGroup>
                <DetailLabel>
                  <FaMapMarkerAlt /> Location
                </DetailLabel>
                <DetailValue>
                  {donation.address.street && `${donation.address.street}, `}
                  {donation.address.city}
                  {donation.address.state && `, ${donation.address.state}`}
                  {donation.address.zipCode && ` ${donation.address.zipCode}`}
                  {donation.address.country && `, ${donation.address.country}`}
                </DetailValue>
              </DetailGroup>
              
              {(donation.pickupTime.start || donation.pickupTime.end) && (
                <DetailGroup>
                  <DetailLabel>Pickup Time</DetailLabel>
                  <DetailValue>
                    {donation.pickupTime.start && format(new Date(donation.pickupTime.start), 'PPP p')}
                    {donation.pickupTime.start && donation.pickupTime.end && ' - '}
                    {donation.pickupTime.end && format(new Date(donation.pickupTime.end), 'PPP p')}
                  </DetailValue>
                </DetailGroup>
              )}
              
              {donation.pickupInstructions && (
                <DetailGroup>
                  <DetailLabel>Pickup Instructions</DetailLabel>
                  <DetailValue>{donation.pickupInstructions}</DetailValue>
                </DetailGroup>
              )}
              
              {Object.values(donation.dietaryInfo).some(val => val) && (
                <DetailGroup>
                  <DetailLabel>Dietary Information</DetailLabel>
                  <DietaryTags>
                    {donation.dietaryInfo.isVegetarian && (
                      <DietaryTag>Vegetarian</DietaryTag>
                    )}
                    {donation.dietaryInfo.isVegan && (
                      <DietaryTag>Vegan</DietaryTag>
                    )}
                    {donation.dietaryInfo.isGlutenFree && (
                      <DietaryTag>Gluten Free</DietaryTag>
                    )}
                    {donation.dietaryInfo.isNutFree && (
                      <DietaryTag>Nut Free</DietaryTag>
                    )}
                    {donation.dietaryInfo.isDairyFree && (
                      <DietaryTag>Dairy Free</DietaryTag>
                    )}
                  </DietaryTags>
                </DetailGroup>
              )}
            </DetailCard>
          </InfoSection>
        </DetailsGrid>
      </DetailsWrapper>
    </DetailsContainer>
  );
};

// Styled Components
const DetailsContainer = styled.div`
  padding: 2rem 0;
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-color);
  margin-bottom: 1.5rem;
  transition: var(--transition);
  
  &:hover {
    color: var(--primary-color);
  }
`;

const DetailsWrapper = styled.div`
  background-color: var(--white);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  overflow: hidden;
`;

const DetailsHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  h1 {
    font-size: 1.75rem;
    color: var(--text-color);
    margin: 0;
  }
  
  @media (max-width: 576px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    
    h1 {
      font-size: 1.5rem;
    }
  }
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.4rem 1rem;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  
  ${props => {
    switch(props.status) {
      case 'available':
        return `
          background-color: rgba(76, 175, 80, 0.1);
          color: var(--success);
        `;
      case 'reserved':
        return `
          background-color: rgba(255, 152, 0, 0.1);
          color: var(--warning);
        `;
      case 'completed':
        return `
          background-color: rgba(33, 150, 243, 0.1);
          color: var(--info);
        `;
      case 'cancelled':
        return `
          background-color: rgba(244, 67, 54, 0.1);
          color: var(--error);
        `;
      default:
        return `
          background-color: rgba(0, 0, 0, 0.1);
          color: var(--text-light);
        `;
    }
  }}
`;

const DetailsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ImageSection = styled.div`
  position: relative;
  border-right: 1px solid #eee;
  
  @media (max-width: 768px) {
    border-right: none;
    border-bottom: 1px solid #eee;
  }
`;

const DonationImage = styled.img`
  width: 100%;
  height: 300px;
  object-fit: cover;
  
  @media (max-width: 768px) {
    height: 250px;
  }
`;

const OwnerActions = styled.div`
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  right: 1rem;
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled(Link)`
  display: inline-block;
  width: 100%;
  padding: 0.75rem;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  text-align: center;
  border-radius: var(--border-radius);
  backdrop-filter: blur(4px);
  transition: var(--transition);
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.8);
    color: white;
  }
`;

const ReserveButton = styled.button`
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  right: 1rem;
  padding: 0.75rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  
  &:hover {
    background-color: var(--primary-dark);
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const ReservedByMeMessage = styled.div`
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  right: 1rem;
  padding: 0.75rem;
  background-color: rgba(76, 175, 80, 0.9);
  color: white;
  border-radius: var(--border-radius);
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const InfoSection = styled.div`
  padding: 1.5rem;
`;

const DetailCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
`;

const DetailGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const DetailLabel = styled.span`
  font-weight: 600;
  color: var(--text-light);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  svg {
    color: var(--primary-color);
  }
`;

const DetailValue = styled.span`
  color: var(--text-color);
  line-height: 1.6;
  
  &.expired {
    color: var(--error);
  }
`;

const DietaryTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const DietaryTag = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background-color: rgba(76, 175, 80, 0.1);
  color: var(--primary-color);
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 600;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
`;

const ErrorContainer = styled.div`
  text-align: center;
  padding: 4rem 1rem;
  max-width: 600px;
  margin: 0 auto;
  
  h2 {
    font-size: 1.75rem;
    color: var(--text-color);
    margin-bottom: 1rem;
  }
  
  p {
    color: var(--text-light);
    margin-bottom: 2rem;
  }
`;

const ErrorIcon = styled.div`
  font-size: 4rem;
  color: var(--text-light);
  margin-bottom: 1.5rem;
`;

const BackButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: var(--primary-color);
  color: white;
  border-radius: var(--border-radius);
  font-weight: 600;
  transition: var(--transition);
  
  &:hover {
    background-color: var(--primary-dark);
    color: white;
  }
`;

export default DonationDetails; 