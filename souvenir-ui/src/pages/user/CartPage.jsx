import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    IconButton,
    TextField,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useCart } from '../../context/CartContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import orderApi from '../../api/orderApi.js';

const CartPage = () => {
    const { items, removeItem, updateQuantity, clearCart, totalPrice } = useCart();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const [dialogOpen, setDialogOpen] = useState(false);
    const [address, setAddress] = useState({
        country: '',
        city: '',
        street: '',
        house: '',
        apartment: '',
        zipCode: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleAddressChange = (e) => {
        setAddress(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    // Оформление заказа — создаём отдельный заказ для каждого товара
    const handleOrder = async () => {
        setLoading(true);
        setError(null);

        try {
            // Для каждого товара в корзине создаём отдельный заказ
            await Promise.all(items.map(item =>
                orderApi.create({
                    productId: item.product.id,
                    quantity: item.quantity,
                    address,
                })
            ));

            clearCart();
            setSuccess(true);
            setDialogOpen(false);

            setTimeout(() => navigate('/orders/my'), 2000);

        } catch (err) {
            setError(err.response?.data?.message || 'Ошибка при оформлении заказа');
        } finally {
            setLoading(false);
        }
    };

    // Пустая корзина
    if (items.length === 0) {
        return (
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '50vh',
                gap: 2,
            }}>
                <ShoppingCartIcon sx={{ fontSize: 80, color: 'text.secondary' }} />
                <Typography variant="h5" color="text.secondary">
                    Корзина пуста
                </Typography>
                <Button variant="contained" onClick={() => navigate('/')}>
                    Перейти в каталог
                </Button>
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                Корзина
            </Typography>

            {success && (
                <Alert severity="success" sx={{ mb: 2 }}>
                    Заказы успешно оформлены! Перенаправляем...
                </Alert>
            )}

            <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>

                {/* Список товаров */}
                <Box sx={{ flex: 1 }}>
                    {items.map(item => (
                        <Card key={item.product.id} sx={{ mb: 2 }}>
                            <CardContent>
                                <Box sx={{
                                    display: 'flex',
                                    gap: 2,
                                    alignItems: 'center',
                                }}>

                                    {/* Фото */}
                                    <img
                                        src={item.product.imagesUrl?.[0] || '/placeholder.jpg'}
                                        alt={item.product.name}
                                        style={{
                                            width: 80,
                                            height: 80,
                                            objectFit: 'cover',
                                            borderRadius: 8,
                                            cursor: 'pointer',
                                        }}
                                        onClick={() => navigate(`/products/${item.product.id}`)}
                                    />

                                    {/* Информация */}
                                    <Box sx={{ flexGrow: 1 }}>
                                        <Typography variant="h6">
                                            {item.product.name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {item.product.price} ₽ за шт.
                                        </Typography>
                                    </Box>

                                    {/* Количество */}
                                    <TextField
                                        type="number"
                                        value={item.quantity}
                                        onChange={(e) => updateQuantity(
                                            item.product.id,
                                            Number(e.target.value)
                                        )}
                                        inputProps={{
                                            min: 1,
                                            max: item.product.stock,
                                        }}
                                        sx={{ width: 80 }}
                                        size="small"
                                    />

                                    {/* Сумма */}
                                    <Typography
                                        variant="h6"
                                        color="primary"
                                        sx={{ minWidth: 100, textAlign: 'right' }}
                                    >
                                        {(item.product.price * item.quantity).toFixed(2)} ₽
                                    </Typography>

                                    {/* Удалить */}
                                    <IconButton
                                        color="error"
                                        onClick={() => removeItem(item.product.id)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>

                                </Box>
                            </CardContent>
                        </Card>
                    ))}
                </Box>

                {/* Итог */}
                <Card sx={{ width: { xs: '100%', md: 300 }, height: 'fit-content' }}>
                    <CardContent>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            Итого
                        </Typography>
                        <Divider sx={{ mb: 2 }} />

                        {items.map(item => (
                            <Box
                                key={item.product.id}
                                sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}
                            >
                                <Typography variant="body2" noWrap sx={{ maxWidth: 150 }}>
                                    {item.product.name} × {item.quantity}
                                </Typography>
                                <Typography variant="body2">
                                    {(item.product.price * item.quantity).toFixed(2)} ₽
                                </Typography>
                            </Box>
                        ))}

                        <Divider sx={{ my: 2 }} />

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            <Typography variant="h6" fontWeight="bold">
                                Сумма:
                            </Typography>
                            <Typography variant="h6" color="primary" fontWeight="bold">
                                {totalPrice.toFixed(2)} ₽
                            </Typography>
                        </Box>

                        <Button
                            fullWidth
                            variant="contained"
                            size="large"
                            onClick={() => {
                                if (!isAuthenticated()) {
                                    navigate('/login');
                                } else {
                                    setDialogOpen(true);
                                }
                            }}
                        >
                            Оформить заказ
                        </Button>

                        <Button
                            fullWidth
                            variant="outlined"
                            color="error"
                            sx={{ mt: 1 }}
                            onClick={clearCart}
                        >
                            Очистить корзину
                        </Button>

                    </CardContent>
                </Card>

            </Box>

            {/* Диалог ввода адреса */}
            <Dialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Адрес доставки</DialogTitle>
                <DialogContent>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                        <TextField
                            label="Страна"
                            name="country"
                            value={address.country}
                            onChange={handleAddressChange}
                            required
                            fullWidth
                        />
                        <TextField
                            label="Город"
                            name="city"
                            value={address.city}
                            onChange={handleAddressChange}
                            required
                            fullWidth
                        />
                        <TextField
                            label="Улица"
                            name="street"
                            value={address.street}
                            onChange={handleAddressChange}
                            required
                            fullWidth
                        />
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField
                                label="Дом"
                                name="house"
                                value={address.house}
                                onChange={handleAddressChange}
                                required
                                fullWidth
                            />
                            <TextField
                                label="Квартира"
                                name="apartment"
                                value={address.apartment}
                                onChange={handleAddressChange}
                                fullWidth
                            />
                        </Box>
                        <TextField
                            label="Индекс"
                            name="zipCode"
                            value={address.zipCode}
                            onChange={handleAddressChange}
                            required
                            fullWidth
                        />
                    </Box>

                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setDialogOpen(false)}>
                        Отмена
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleOrder}
                        disabled={loading}
                    >
                        {loading ? 'Оформление...' : 'Подтвердить заказ'}
                    </Button>
                </DialogActions>
            </Dialog>

        </Box>
    );
};

export default CartPage;