import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { FaUserPlus, FaEye, FaEyeSlash } from 'react-icons/fa';
import styled from 'styled-components';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'donor',
    phone: '',
    organization: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { register } = useAuth();
  const navigate = useNavigate();
  
  const { name, email, password, confirmPassword, role, phone, organization } = formData;
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all required fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    
    try {
      // Remove confirmPassword before sending to API
      const userData = { ...formData };
      delete userData.confirmPassword;
      
      const success = await register(userData);
      if (success) {
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <RegisterContainer>
      <RegisterCard>
        <RegisterHeader>
          <FaUserPlus />
          <h2>Create an Account</h2>
        </RegisterHeader>
        
        <RegisterForm onSubmit={handleSubmit}>
          {error && <ErrorAlert>{error}</ErrorAlert>}
          
          <FormGroup>
            <Label htmlFor="name">Full Name*</Label>
            <Input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="email">Email Address*</Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="password">Password*</Label>
            <PasswordWrapper>
              <Input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
              <PasswordToggle 
                type="button" 
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </PasswordToggle>
            </PasswordWrapper>
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="confirmPassword">Confirm Password*</Label>
            <Input
              type={showPassword ? 'text' : 'password'}
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="role">I am a*</Label>
            <Select
              id="role"
              name="role"
              value={role}
              onChange={handleChange}
              required
            >
              <option value="donor">Food Donor</option>
              <option value="recipient">Food Recipient (NGO/Individual)</option>
            </Select>
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              type="tel"
              id="phone"
              name="phone"
              value={phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="organization">Organization Name (if applicable)</Label>
            <Input
              type="text"
              id="organization"
              name="organization"
              value={organization}
              onChange={handleChange}
              placeholder="Enter your organization name"
            />
          </FormGroup>
          
          <SubmitButton 
            type="submit" 
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </SubmitButton>
        </RegisterForm>
        
        <RegisterFooter>
          <p>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </RegisterFooter>
      </RegisterCard>
    </RegisterContainer>
  );
};

// Styled Components
const RegisterContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem 1rem;
`;

const RegisterCard = styled.div`
  background-color: #fff;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  width: 100%;
  max-width: 550px;
  padding: 2rem;
`;

const RegisterHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
  
  svg {
    font-size: 2.5rem;
    color: var(--primary-color);
    margin-bottom: 1rem;
  }
  
  h2 {
    font-size: 1.75rem;
    color: var(--text-color);
    text-align: center;
  }
`;

const RegisterForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 600;
  color: var(--text-color);
`;

const Input = styled.input`
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

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: var(--border-radius);
  font-size: 1rem;
  transition: var(--transition);
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
  }
`;

const PasswordWrapper = styled.div`
  position: relative;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--text-light);
  cursor: pointer;
  font-size: 1rem;
  
  &:hover {
    color: var(--primary-color);
  }
`;

const SubmitButton = styled.button`
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  padding: 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  margin-top: 1rem;
  
  &:hover {
    background-color: var(--primary-dark);
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const ErrorAlert = styled.div`
  background-color: rgba(244, 67, 54, 0.1);
  color: var(--error);
  padding: 0.75rem;
  border-radius: var(--border-radius);
  border: 1px solid var(--error);
  margin-bottom: 1rem;
`;

const RegisterFooter = styled.div`
  margin-top: 2rem;
  text-align: center;
  color: var(--text-light);
  
  a {
    color: var(--primary-color);
    font-weight: 600;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

export default Register; 