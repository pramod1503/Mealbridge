import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  :root {
    --primary-color: #4CAF50;
    --primary-dark: #388E3C;
    --text-color: #333333;
    --text-light: #666666;
    --white: #ffffff;
    --background-color: #f5f5f5;
    --border-radius: 8px;
    --box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    --transition: all 0.3s ease;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    line-height: 1.5;
    background-color: var(--background-color);
    color: var(--text-color);
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  button {
    font-family: inherit;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  /* Loading Spinner */
  .loading-spinner-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: var(--background-color);
  }

  .loading-spinner {
    width: 50px;
    height: 50px;
    border: 3px solid var(--background-color);
    border-radius: 50%;
    border-top-color: var(--primary-color);
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export default GlobalStyles; 