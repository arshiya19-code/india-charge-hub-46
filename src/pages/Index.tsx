
import { Navigate } from 'react-router-dom';

// Redirect from the Index page to the HomePage
const Index = () => {
  return <Navigate to="/" replace />;
};

export default Index;
