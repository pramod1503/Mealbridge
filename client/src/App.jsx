import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './components/Navbar';
import AppRoutes from './routes';
import GlobalStyles from './styles/GlobalStyles';

const App = () => {
  return (
    <Router>
      <GlobalStyles />
      <Navbar />
      <main className="container">
        <AppRoutes />
      </main>
    </Router>
  );
};

export default App; 