import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { FaPlus, FaEdit, FaTrash, FaCheckCircle } from 'react-icons/fa';
import styled from 'styled-components';
import api from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [donations, setDonations] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [activeTab, setActiveTab] = useState('donations');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // Fetch user's donations
        if (user.role === 'donor' || user.role === 'admin') {
          const donationsRes = await api.get('/api/donations?donor=' + user._id);
          setDonations(donationsRes.data.data || []);
        }
        
        // Fetch user's reservations
        if (user.role === 'recipient' || user.role === 'admin') {
          const reservationsRes = await api.get('/api/donations?recipient=' + user._id);
          setReservations(reservationsRes.data.data || []);
        }
        
      } catch (err) {
        setError('Failed to load your data. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  const handleDeleteDonation = async (id) => {
    if (window.confirm('Are you sure you want to delete this donation?')) {
      try {
        await api.delete(`/api/donations/${id}`);
        setDonations(donations.filter(donation => donation._id !== id));
      } catch (err) {
        setError('Failed to delete donation. Please try again.');
        console.error(err);
      }
    }
  };

  const renderDonations = () => {
    if (donations.length === 0) {
      return (
        <EmptyState>
          <p>You haven't made any donations yet.</p>
          <Link to="/donate" className="btn btn-primary">
            <FaPlus /> Create New Donation
          </Link>
        </EmptyState>
      );
    }

    return (
      <TableContainer>
        <Table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Type</th>
              <th>Quantity</th>
              <th>Status</th>
              <th>Expiry Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {donations.map((donation) => (
              <tr key={donation._id}>
                <td>{donation.title}</td>
                <td>{donation.type}</td>
                <td>{donation.quantity} {donation.quantityUnit}</td>
                <td>
                  <StatusBadge status={donation.status}>
                    {donation.status}
                  </StatusBadge>
                </td>
                <td>{new Date(donation.expiryDate).toLocaleDateString()}</td>
                <td>
                  <ActionButtons>
                    <ActionButton
                      to={`/donations/${donation._id}`}
                      title="View Details"
                    >
                      <FaCheckCircle />
                    </ActionButton>
                    <ActionButton
                      to={`/donations/edit/${donation._id}`}
                      title="Edit Donation"
                    >
                      <FaEdit />
                    </ActionButton>
                    <DeleteButton
                      onClick={() => handleDeleteDonation(donation._id)}
                      title="Delete Donation"
                    >
                      <FaTrash />
                    </DeleteButton>
                  </ActionButtons>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableContainer>
    );
  };

  const renderReservations = () => {
    if (reservations.length === 0) {
      return (
        <EmptyState>
          <p>You haven't reserved any donations yet.</p>
          <Link to="/donations" className="btn btn-primary">
            Browse Available Donations
          </Link>
        </EmptyState>
      );
    }

    return (
      <TableContainer>
        <Table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Donor</th>
              <th>Type</th>
              <th>Quantity</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation) => (
              <tr key={reservation._id}>
                <td>{reservation.title}</td>
                <td>{reservation.donor?.name || 'Unknown'}</td>
                <td>{reservation.type}</td>
                <td>{reservation.quantity} {reservation.quantityUnit}</td>
                <td>
                  <StatusBadge status={reservation.status}>
                    {reservation.status}
                  </StatusBadge>
                </td>
                <td>
                  <ActionButton
                    to={`/donations/${reservation._id}`}
                    title="View Details"
                  >
                    <FaCheckCircle />
                  </ActionButton>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableContainer>
    );
  };

  if (loading) {
    return (
      <LoadingContainer>
        <div className="loading-spinner"></div>
        <p>Loading your dashboard...</p>
      </LoadingContainer>
    );
  }

  return (
    <DashboardContainer>
      <DashboardHeader>
        <h1>Welcome, {user.name}</h1>
        <p>Manage your food donations and reservations here</p>
      </DashboardHeader>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <TabsContainer>
        <TabButton
          $active={activeTab === 'donations'}
          onClick={() => setActiveTab('donations')}
          disabled={user.role === 'recipient'}
        >
          My Donations
        </TabButton>
        <TabButton
          $active={activeTab === 'reservations'}
          onClick={() => setActiveTab('reservations')}
          disabled={user.role === 'donor'}
        >
          My Reservations
        </TabButton>
      </TabsContainer>

      <TabContent>
        {activeTab === 'donations' && user.role !== 'recipient' && (
          <div>
            <TabContentHeader>
              <h2>My Donations</h2>
              <Link to="/donate" className="btn btn-primary">
                <FaPlus /> New Donation
              </Link>
            </TabContentHeader>
            {renderDonations()}
          </div>
        )}

        {activeTab === 'reservations' && user.role !== 'donor' && (
          <div>
            <TabContentHeader>
              <h2>My Reservations</h2>
              <Link to="/donations" className="btn btn-primary">
                Browse More
              </Link>
            </TabContentHeader>
            {renderReservations()}
          </div>
        )}
      </TabContent>
    </DashboardContainer>
  );
};

// Styled Components
const DashboardContainer = styled.div`
  padding: 2rem 0;
`;

const DashboardHeader = styled.div`
  margin-bottom: 2rem;
  
  h1 {
    font-size: 2rem;
    margin-bottom: 0.5rem;
    color: var(--text-color);
  }
  
  p {
    color: var(--text-light);
  }
`;

const TabsContainer = styled.div`
  display: flex;
  border-bottom: 1px solid #ddd;
  margin-bottom: 2rem;
`;

const TabButton = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  background: ${({ $active }) => $active ? 'var(--primary-color)' : 'transparent'};
  color: ${({ $active }) => $active ? 'white' : 'var(--text-color)'};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: var(--border-radius);
  
  &:hover:not(:disabled) {
    background: var(--primary-dark);
    color: white;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const TabContent = styled.div`
  margin-bottom: 2rem;
`;

const TabContentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  
  h2 {
    font-size: 1.5rem;
    color: var(--text-color);
  }
`;

const TableContainer = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  th, td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #eee;
  }
  
  th {
    font-weight: 600;
    color: var(--text-color);
    background-color: #f9f9f9;
  }
  
  tr:hover {
    background-color: #f5f5f5;
  }
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 50px;
  font-size: 0.75rem;
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

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  color: var(--text-light);
  transition: var(--transition);
  
  &:hover {
    background-color: #eee;
    color: var(--primary-color);
  }
`;

const DeleteButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  border: none;
  background: none;
  color: var(--text-light);
  cursor: pointer;
  transition: var(--transition);
  
  &:hover {
    background-color: #eee;
    color: var(--error);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  background-color: var(--white);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  
  p {
    font-size: 1.1rem;
    color: var(--text-light);
    margin-bottom: 1.5rem;
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
`;

export default Dashboard; 