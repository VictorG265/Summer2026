import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { isAuthenticated, isAdmin } = useAuth();

    // Не авторизован → на страницу входа
    if (!isAuthenticated()) {
        return <Navigate to="/login" />;
    }

    // Требуется админ, но пользователь не админ → на главную
    if (adminOnly && !isAdmin()) {
        return <Navigate to="/" />;
    }

    return children;
};

export default ProtectedRoute;