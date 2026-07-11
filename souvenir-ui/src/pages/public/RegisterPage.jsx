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

const RegisterPage = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        login: '',
        password: '',
        fio: '',
        email: '',
        phone: '',
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
            await authApi.register(formData);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Ошибка регистрации');
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
                        Регистрация
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
                        <TextField
                            fullWidth
                            label="ФИО"
                            name="fio"
                            value={formData.fio}
                            onChange={handleChange}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="Телефон"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            margin="normal"
                        />
                        <Button
                            fullWidth
                            type="submit"
                            variant="contained"
                            size="large"
                            disabled={loading}
                            sx={{ mt: 2 }}
                        >
                            {loading ? 'Загрузка...' : 'Зарегистрироваться'}
                        </Button>
                    </Box>

                    <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
                        Уже есть аккаунт?{' '}
                        <Link to="/login" style={{ color: 'inherit' }}>
                            Войти
                        </Link>
                    </Typography>

                </CardContent>
            </Card>
        </Box>
    );
};

export default RegisterPage;