import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaDonate, FaUtensils, FaLeaf, FaCheck, FaBan } from 'react-icons/fa';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import api from '../services/api';

const DonationForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'cooked meal',
    quantity: '',
    quantityUnit: 'servings',
    expiryDate: '',
    // Address
    'address.street': '',
    'address.city': '',
    'address.state': '',
    'address.zipCode': '',
    'address.country': '',
    // Dietary info
    'dietaryInfo.isVegetarian': false,
    'dietaryInfo.isVegan': false,
    'dietaryInfo.isGlutenFree': false,
    'dietaryInfo.isNutFree': false,
    'dietaryInfo.isDairyFree': false,
    // Pickup info
    'pickupTime.start': '',
    'pickupTime.end': '',
    pickupInstructions: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.title || !formData.description || !formData.quantity || !formData.expiryDate) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    try {
      setLoading(true);
      
      // Restructure the data for API
      const donationData = {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        quantity: formData.quantity,
        quantityUnit: formData.quantityUnit,
        expiryDate: formData.expiryDate,
        address: {
          street: formData['address.street'],
          city: formData['address.city'],
          state: formData['address.state'],
          zipCode: formData['address.zipCode'],
          country: formData['address.country']
        },
        dietaryInfo: {
          isVegetarian: formData['dietaryInfo.isVegetarian'],
          isVegan: formData['dietaryInfo.isVegan'],
          isGlutenFree: formData['dietaryInfo.isGlutenFree'],
          isNutFree: formData['dietaryInfo.isNutFree'],
          isDairyFree: formData['dietaryInfo.isDairyFree']
        },
        pickupTime: {
          start: formData['pickupTime.start'],
          end: formData['pickupTime.end']
        },
        pickupInstructions: formData.pickupInstructions
      };
      
      const response = await api.post('/api/donations', donationData);
      
      if (response.data.success) {
        toast.success('Donation created successfully!');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error creating donation:', error);
      toast.error(error.response?.data?.message || 'Failed to create donation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormContainer>
      <FormHeader>
        <FormIcon>
          <FaDonate />
        </FormIcon>
        <h1>Create a Food Donation</h1>
        <p>Share your surplus food with those in need</p>
      </FormHeader>

      <DonationFormElement onSubmit={handleSubmit}>
        <FormSection>
          <SectionTitle>Donation Information</SectionTitle>
          
          <FormGroup>
            <Label htmlFor="title">Title*</Label>
            <Input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="E.g., Freshly Cooked Pasta, Surplus Bread, etc."
              required
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="description">Description*</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the food you're donating, including any relevant details about preparation, storage, etc."
              rows="4"
              required
            />
          </FormGroup>
          
          <Row>
            <FormGroup>
              <Label htmlFor="type">Food Type*</Label>
              <Select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
              >
                <option value="cooked meal">Cooked Meal</option>
                <option value="raw ingredients">Raw Ingredients</option>
                <option value="packaged food">Packaged Food</option>
                <option value="beverages">Beverages</option>
                <option value="bakery">Bakery</option>
                <option value="fruits & vegetables">Fruits & Vegetables</option>
                <option value="other">Other</option>
              </Select>
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="quantity">Quantity*</Label>
              <QuantityContainer>
                <QuantityInput
                  type="number"
                  id="quantity"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  min="1"
                  required
                />
                <QuantityUnitSelect
                  id="quantityUnit"
                  name="quantityUnit"
                  value={formData.quantityUnit}
                  onChange={handleChange}
                >
                  <option value="servings">Servings</option>
                  <option value="kg">Kilograms</option>
                  <option value="lbs">Pounds</option>
                  <option value="items">Items</option>
                  <option value="boxes">Boxes</option>
                  <option value="liters">Liters</option>
                </QuantityUnitSelect>
              </QuantityContainer>
            </FormGroup>
          </Row>
          
          <FormGroup>
            <Label htmlFor="expiryDate">Expiry Date*</Label>
            <Input
              type="datetime-local"
              id="expiryDate"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              required
            />
          </FormGroup>
        </FormSection>
        
        <FormSection>
          <SectionTitle>Dietary Information</SectionTitle>
          <DietaryInfo>
            <CheckboxGroup>
              <CheckboxLabel>
                <input
                  type="checkbox"
                  name="dietaryInfo.isVegetarian"
                  checked={formData['dietaryInfo.isVegetarian']}
                  onChange={handleChange}
                />
                <span>Vegetarian</span>
              </CheckboxLabel>
              
              <CheckboxLabel>
                <input
                  type="checkbox"
                  name="dietaryInfo.isVegan"
                  checked={formData['dietaryInfo.isVegan']}
                  onChange={handleChange}
                />
                <span>Vegan</span>
              </CheckboxLabel>
              
              <CheckboxLabel>
                <input
                  type="checkbox"
                  name="dietaryInfo.isGlutenFree"
                  checked={formData['dietaryInfo.isGlutenFree']}
                  onChange={handleChange}
                />
                <span>Gluten Free</span>
              </CheckboxLabel>
              
              <CheckboxLabel>
                <input
                  type="checkbox"
                  name="dietaryInfo.isNutFree"
                  checked={formData['dietaryInfo.isNutFree']}
                  onChange={handleChange}
                />
                <span>Nut Free</span>
              </CheckboxLabel>
              
              <CheckboxLabel>
                <input
                  type="checkbox"
                  name="dietaryInfo.isDairyFree"
                  checked={formData['dietaryInfo.isDairyFree']}
                  onChange={handleChange}
                />
                <span>Dairy Free</span>
              </CheckboxLabel>
            </CheckboxGroup>
          </DietaryInfo>
        </FormSection>
        
        <FormSection>
          <SectionTitle>Pickup Location</SectionTitle>
          
          <FormGroup>
            <Label htmlFor="address.street">Street Address</Label>
            <Input
              type="text"
              id="address.street"
              name="address.street"
              value={formData['address.street']}
              onChange={handleChange}
              placeholder="Street address"
            />
          </FormGroup>
          
          <Row>
            <FormGroup>
              <Label htmlFor="address.city">City*</Label>
              <Input
                type="text"
                id="address.city"
                name="address.city"
                value={formData['address.city']}
                onChange={handleChange}
                placeholder="City"
                required
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="address.state">State/Province</Label>
              <Input
                type="text"
                id="address.state"
                name="address.state"
                value={formData['address.state']}
                onChange={handleChange}
                placeholder="State/Province"
              />
            </FormGroup>
          </Row>
          
          <Row>
            <FormGroup>
              <Label htmlFor="address.zipCode">ZIP/Postal Code</Label>
              <Input
                type="text"
                id="address.zipCode"
                name="address.zipCode"
                value={formData['address.zipCode']}
                onChange={handleChange}
                placeholder="ZIP/Postal Code"
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="address.country">Country</Label>
              <Input
                type="text"
                id="address.country"
                name="address.country"
                value={formData['address.country']}
                onChange={handleChange}
                placeholder="Country"
              />
            </FormGroup>
          </Row>
        </FormSection>
        
        <FormSection>
          <SectionTitle>Pickup Information</SectionTitle>
          
          <Row>
            <FormGroup>
              <Label htmlFor="pickupTime.start">Pickup Start Time</Label>
              <Input
                type="datetime-local"
                id="pickupTime.start"
                name="pickupTime.start"
                value={formData['pickupTime.start']}
                onChange={handleChange}
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="pickupTime.end">Pickup End Time</Label>
              <Input
                type="datetime-local"
                id="pickupTime.end"
                name="pickupTime.end"
                value={formData['pickupTime.end']}
                onChange={handleChange}
              />
            </FormGroup>
          </Row>
          
          <FormGroup>
            <Label htmlFor="pickupInstructions">Pickup Instructions</Label>
            <Textarea
              id="pickupInstructions"
              name="pickupInstructions"
              value={formData.pickupInstructions}
              onChange={handleChange}
              placeholder="Provide any specific instructions for pickup (e.g., 'Ring doorbell', 'Ask for John at reception', etc.)"
              rows="3"
            />
          </FormGroup>
        </FormSection>
        
        <FormButtons>
          <CancelButton type="button" onClick={() => navigate('/dashboard')}>
            <FaBan /> Cancel
          </CancelButton>
          <SubmitButton type="submit" disabled={loading}>
            {loading ? 'Creating...' : <><FaCheck /> Create Donation</>}
          </SubmitButton>
        </FormButtons>
      </DonationFormElement>
    </FormContainer>
  );
};

// Styled Components
const FormContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const FormHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  
  h1 {
    font-size: 2rem;
    color: var(--text-color);
    margin-bottom: 0.5rem;
  }
  
  p {
    color: var(--text-light);
  }
`;

const FormIcon = styled.div`
  font-size: 3rem;
  color: var(--primary-color);
  margin-bottom: 1rem;
`;

const DonationFormElement = styled.form`
  background-color: var(--white);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  padding: 2rem;
`;

const FormSection = styled.div`
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #eee;
  
  &:last-child {
    border-bottom: none;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  color: var(--text-color);
  margin-bottom: 1.5rem;
  position: relative;
  padding-left: 1.5rem;
  
  &:before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 20px;
    background-color: var(--primary-color);
    border-radius: 2px;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: var(--text-color);
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: var(--border-radius);
  font-size: 1rem;
  transition: var(--transition);
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: var(--border-radius);
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  transition: var(--transition);
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: var(--border-radius);
  font-size: 1rem;
  background-color: white;
  cursor: pointer;
  transition: var(--transition);
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
  }
`;

const QuantityContainer = styled.div`
  display: flex;
`;

const QuantityInput = styled.input`
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-right: none;
  border-top-left-radius: var(--border-radius);
  border-bottom-left-radius: var(--border-radius);
  font-size: 1rem;
  transition: var(--transition);
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
  }
`;

const QuantityUnitSelect = styled.select`
  width: 120px;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-top-right-radius: var(--border-radius);
  border-bottom-right-radius: var(--border-radius);
  font-size: 1rem;
  background-color: white;
  cursor: pointer;
  transition: var(--transition);
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
  }
`;

const DietaryInfo = styled.div`
  background-color: #f9f9f9;
  padding: 1.5rem;
  border-radius: var(--border-radius);
`;

const CheckboxGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  
  input {
    cursor: pointer;
  }
  
  span {
    font-size: 0.95rem;
  }
`;

const FormButtons = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 2rem;
  
  @media (max-width: 576px) {
    flex-direction: column-reverse;
  }
`;

const SubmitButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
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

const CancelButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: transparent;
  color: var(--text-color);
  border: 1px solid #ddd;
  border-radius: var(--border-radius);
  font-size: 1rem;
  cursor: pointer;
  transition: var(--transition);
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

export default DonationForm; 