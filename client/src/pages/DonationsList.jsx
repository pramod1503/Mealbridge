import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaFilter, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import styled from 'styled-components';
import { format, formatDistanceToNow, isValid } from 'date-fns';
import api from '../services/api';

// Utility function to safely format date
const formatExpiryDate = (dateString) => {
  if (!dateString) return 'No expiry date';
  
  // Log the date string for debugging
  console.log('Formatting date:', dateString);
  
  try {
    const date = new Date(dateString);
    // Check if the date is valid and not too far in the future or past
    if (!isValid(date) || date.getFullYear() > 2100 || date.getFullYear() < 2000) {
      console.warn('Invalid date detected:', dateString);
      return 'Invalid date';
    }
    return formatDistanceToNow(date, { addSuffix: true });
  } catch (error) {
    console.error('Error formatting date:', error, 'Date string:', dateString);
    return 'Invalid date';
  }
};

// Error Fallback component
const ErrorFallback = ({ error }) => (
  <ErrorContainer>
    <h2>Something went wrong displaying this donation</h2>
    <pre>{error.message}</pre>
  </ErrorContainer>
);

const DonationsList = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    city: '',
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        setLoading(true);
        const res = await api.get('/api/donations');
        
        // Log the first donation for debugging
        if (res.data.data.length > 0) {
          console.log('First donation data:', res.data.data[0]);
        }
        
        // Validate and clean the data before setting state
        const cleanedDonations = res.data.data.map(donation => ({
          ...donation,
          expiryDate: donation.expiryDate ? new Date(donation.expiryDate).toISOString() : null
        }));
        
        setDonations(cleanedDonations);
        setError('');
      } catch (err) {
        console.error('Error fetching donations:', err);
        setError('Failed to fetch donations. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters({
      ...filters,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // Filter donations based on search term and filters
  const filteredDonations = donations.filter((donation) => {
    // Search term filter
    if (
      searchTerm &&
      !donation.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !donation.description.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }

    // Type filter
    if (filters.type && donation.type !== filters.type) {
      return false;
    }

    // City filter
    if (
      filters.city &&
      !donation.address?.city?.toLowerCase().includes(filters.city.toLowerCase()) &&
      !donation.location?.address?.city?.toLowerCase().includes(filters.city.toLowerCase())
    ) {
      return false;
    }

    // Dietary filters
    if (filters.isVegetarian && !donation.dietaryInfo.isVegetarian) {
      return false;
    }
    if (filters.isVegan && !donation.dietaryInfo.isVegan) {
      return false;
    }
    if (filters.isGlutenFree && !donation.dietaryInfo.isGlutenFree) {
      return false;
    }

    return true;
  });

  if (loading) {
    return (
      <LoadingContainer>
        <div className="loading-spinner"></div>
        <p>Loading donations...</p>
      </LoadingContainer>
    );
  }

  return (
    <DonationsContainer>
      <PageHeader>
        <h1>Available Food Donations</h1>
        <p>Browse and reserve available food donations in your area</p>
      </PageHeader>

      <SearchFilterContainer>
        <SearchBar>
          <SearchIcon>
            <FaSearch />
          </SearchIcon>
          <SearchInput
            type="text"
            placeholder="Search donations..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </SearchBar>

        <FilterButton onClick={toggleFilters}>
          <FaFilter /> Filters
        </FilterButton>
      </SearchFilterContainer>

      {showFilters && (
        <FiltersContainer>
          <FilterGroup>
            <FilterLabel>Food Type</FilterLabel>
            <FilterSelect
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
            >
              <option value="">All Types</option>
              <option value="cooked meal">Cooked Meals</option>
              <option value="raw ingredients">Raw Ingredients</option>
              <option value="packaged food">Packaged Food</option>
              <option value="beverages">Beverages</option>
              <option value="bakery">Bakery</option>
              <option value="fruits & vegetables">Fruits & Vegetables</option>
              <option value="other">Other</option>
            </FilterSelect>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>City</FilterLabel>
            <FilterInput
              type="text"
              name="city"
              value={filters.city}
              onChange={handleFilterChange}
              placeholder="Enter city name"
            />
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Dietary Preferences</FilterLabel>
            <CheckboxGroup>
              <CheckboxLabel>
                <input
                  type="checkbox"
                  name="isVegetarian"
                  checked={filters.isVegetarian}
                  onChange={handleFilterChange}
                />
                Vegetarian
              </CheckboxLabel>
              <CheckboxLabel>
                <input
                  type="checkbox"
                  name="isVegan"
                  checked={filters.isVegan}
                  onChange={handleFilterChange}
                />
                Vegan
              </CheckboxLabel>
              <CheckboxLabel>
                <input
                  type="checkbox"
                  name="isGlutenFree"
                  checked={filters.isGlutenFree}
                  onChange={handleFilterChange}
                />
                Gluten Free
              </CheckboxLabel>
            </CheckboxGroup>
          </FilterGroup>
        </FiltersContainer>
      )}

      {error && <ErrorMessage>{error}</ErrorMessage>}

      {!loading && filteredDonations.length === 0 && (
        <NoDonationsMessage>
          <p>No donations found matching your criteria.</p>
          <p>Try adjusting your filters or check back later for new donations.</p>
        </NoDonationsMessage>
      )}

      <DonationsGrid>
        {filteredDonations.map((donation) => (
          <SafeDonationCard key={donation._id} donation={donation} />
        ))}
      </DonationsGrid>
    </DonationsContainer>
  );
};

// Styled Components
const DonationsContainer = styled.div`
  padding: 2rem 0;
`;

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  
  h1 {
    font-size: 2.25rem;
    color: var(--text-color);
    margin-bottom: 0.5rem;
  }
  
  p {
    color: var(--text-light);
    font-size: 1.1rem;
  }
`;

const SearchFilterContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const SearchBar = styled.div`
  flex: 1;
  position: relative;
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-light);
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #ddd;
  border-radius: var(--border-radius);
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
  }
`;

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: var(--white);
  border: 1px solid #ddd;
  border-radius: var(--border-radius);
  font-size: 1rem;
  cursor: pointer;
  transition: var(--transition);
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

const FiltersContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background-color: var(--white);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FilterLabel = styled.label`
  font-weight: 600;
  color: var(--text-color);
`;

const FilterSelect = styled.select`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: var(--border-radius);
  font-size: 1rem;
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
  }
`;

const FilterInput = styled.input`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: var(--border-radius);
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  
  input {
    cursor: pointer;
  }
`;

const DonationsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
`;

const DonationCard = styled.div`
  background-color: var(--white);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  overflow: hidden;
  transition: var(--transition);
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
`;

const DonationImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const DonationContent = styled.div`
  padding: 1.5rem;
`;

const DonationTitle = styled.h3`
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  color: var(--text-color);
`;

const DonationMeta = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  color: var(--text-light);
  font-size: 0.875rem;
`;

const DonationMetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const DonationDescription = styled.p`
  color: var(--text-light);
  margin-bottom: 1.5rem;
  line-height: 1.6;
`;

const DonationFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DonationQuantity = styled.span`
  font-weight: 600;
  color: var(--text-color);
`;

const ViewButton = styled(Link)`
  background-color: var(--primary-color);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius);
  font-weight: 500;
  transition: var(--transition);
  
  &:hover {
    background-color: var(--primary-dark);
    color: white;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
`;

const ErrorMessage = styled.div`
  background-color: rgba(244, 67, 54, 0.1);
  color: var(--error);
  padding: 1rem;
  border-radius: var(--border-radius);
  border: 1px solid var(--error);
  margin-bottom: 2rem;
  text-align: center;
`;

const NoDonationsMessage = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: var(--text-light);
  
  p:first-child {
    font-size: 1.25rem;
    margin-bottom: 0.5rem;
    color: var(--text-color);
  }
`;

const ErrorContainer = styled.div`
  padding: 1rem;
  margin: 1rem 0;
  background-color: var(--error-bg, #fff3f3);
  border: 1px solid var(--error, #ff4444);
  border-radius: var(--border-radius);
  
  h2 {
    color: var(--error, #ff4444);
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
  }
  
  pre {
    font-size: 0.9rem;
    white-space: pre-wrap;
    word-break: break-word;
  }
`;

// Update the DonationCard rendering to use error boundary
const SafeDonationCard = ({ donation }) => {
  try {
    return (
      <DonationCard key={donation._id}>
        <DonationImage
          src={
            donation.images && donation.images.length > 0
              ? donation.images[0]
              : 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80'
          }
          alt={donation.title}
        />
        <DonationContent>
          <DonationTitle>{donation.title}</DonationTitle>
          <DonationMeta>
            <DonationMetaItem>
              <FaMapMarkerAlt />
              {donation.address?.city || donation.location?.address?.city || 'No location'}
            </DonationMetaItem>
            <DonationMetaItem>
              <FaClock />
              {formatExpiryDate(donation.expiryDate)}
            </DonationMetaItem>
          </DonationMeta>
          <DonationDescription>
            {donation.description?.length > 100
              ? `${donation.description.substring(0, 100)}...`
              : donation.description}
          </DonationDescription>
          <DonationFooter>
            <DonationQuantity>
              {donation.quantity} {donation.quantityUnit}
            </DonationQuantity>
            <ViewButton to={`/donations/${donation._id}`}>
              View Details
            </ViewButton>
          </DonationFooter>
        </DonationContent>
      </DonationCard>
    );
  } catch (error) {
    return <ErrorFallback error={error} />;
  }
};

export default DonationsList; 