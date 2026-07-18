import { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Alert,
    Divider,
} from '@mui/material';
import userApi from '../../api/userApi.js';
import authApi from '../../api/authApi.js';
import { useAuth } from '../../context/AuthContext.jsx';

const ProfilePage = () => {
    const { login: authLogin } = useAuth();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const [formData, setFormData] = useState({
        login: '',
        password: '',
        fio: '',
        email: '',
        phone: '',
    });


    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await userApi.getMe();
                const currentUser = response.data;
                setUser(currentUser);
                setFormData({
                    login: currentUser.login,
                    password: '',
                    fio: currentUser.fio,
                    email: currentUser.email,
                    phone: currentUser.phone || '',
                });
            } catch (err) {
                setError('Ошибка загрузки профиля');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        setSuccess(null);

        try {
            await userApi.update(user.id, formData);
            setSuccess('Профиль успешно обновлён');

            // Если логин изменился — перелогиниваемся
            if (formData.password) {
                const loginResponse = await authApi.login({
                    login: formData.login,
                    password: formData.password,
                });
                authLogin(loginResponse.data.token, loginResponse.data.role);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Ошибка обновления профиля');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return null;

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Card sx={{ width: '100%', maxWidth: 500 }}>
                <CardContent sx={{ p: 4 }}>

                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                        Мой профиль
                    </Typography>

                    <Divider sx={{ mb: 3 }} />

                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

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
                            label="Новый пароль"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            margin="normal"
                            helperText="Оставьте пустым, если не хотите менять пароль"
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
                            disabled={saving}
                            sx={{ mt: 2 }}
                        >
                            {saving ? 'Сохранение...' : 'Сохранить изменения'}
                        </Button>
                    </Box>

                </CardContent>
            </Card>
        </Box>
    );
};

export default ProfilePage;