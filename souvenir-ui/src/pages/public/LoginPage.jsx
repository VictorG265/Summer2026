import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Alert,
} from '@mui/material';
import authApi from '../../api/authApi.js';
import { useAuth } from '../../context/AuthContext.jsx';

const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        login: '',
        password: '',
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const response = await authApi.login(formData);
            login(response.data.token, response.data.role);

            // Перенаправляем в зависимости от роли
            if (response.data.role === 'ADMIN') {
                navigate('/admin/products');
            } else {
                navigate('/');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Ошибка входа');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '60vh',
        }}>
            <Card sx={{ width: '100%', maxWidth: 400 }}>
                <CardContent sx={{ p: 4 }}>

                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                        Вход
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Логин"
                            name="login"
                            value={formData.login}
                            onChange={handleChange}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="Пароль"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            margin="normal"
                            required
                        />
                        <Button
                            fullWidth
                            type="submit"
                            variant="contained"
                            size="large"
                            disabled={loading}
                            sx={{ mt: 2 }}
                        >
                            {loading ? 'Загрузка...' : 'Войти'}
                        </Button>
                    </Box>

                    <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
                        Нет аккаунта?{' '}
                        <Link to="/register" style={{ color: 'inherit' }}>
                            Зарегистрироваться
                        </Link>
                    </Typography>

                </CardContent>
            </Card>
        </Box>
    );
};

export default LoginPage;