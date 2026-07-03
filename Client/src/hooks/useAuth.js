import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';

// Lets any component do `const { user, login, logout } = useAuth()`
// instead of importing useContext + AuthContext everywhere.
const useAuth = () => useContext(AuthContext);

export default useAuth;