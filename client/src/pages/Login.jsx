import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { FaSignInAlt, FaEye, FaEyeSlash } from 'react-icons/fa';
import styled from 'styled-components';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const { email, password } = formData;
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    setLoading(true);
    
    try {
      const success = await login(email, password);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <LoginContainer>
      <LoginCard>
        <LoginHeader>
          <FaSignInAlt />
          <h2>Login to Your Account</h2>
        </LoginHeader>
        
        <LoginForm onSubmit={handleSubmit}>
          {error && <ErrorAlert>{error}</ErrorAlert>}
          
          <FormGroup>
            <Label htmlFor="email">Email Address</Label>
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
            <Label htmlFor="password">Password</Label>
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
          
          <SubmitButton 
            type="submit" 
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </SubmitButton>
        </LoginForm>
        
        <LoginFooter>
          <p>
            Don't have an account? <Link to="/register">Sign Up</Link>
          </p>
        </LoginFooter>
      </LoginCard>
    </LoginContainer>
  );
};

// Styled Components
const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: 2rem 1rem;
`;

const LoginCard = styled.div`
  background-color: #fff;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  width: 100%;
  max-width: 450px;
  padding: 2rem;
`;

const LoginHeader = styled.div`
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

const LoginForm = styled.form`
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

const LoginFooter = styled.div`
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

export default Login; 