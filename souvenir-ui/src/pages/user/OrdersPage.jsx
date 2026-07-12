import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Alert,
    Divider,
} from '@mui/material';
import orderApi from '../../api/orderApi.js';

// Цвета статусов
const STATUS_COLORS = {
    PENDING: 'warning',
    CONFIRMED: 'info',
    SHIPPED: 'primary',
    DELIVERED: 'success',
    CANCELLED: 'error',
};

// Перевод статусов
const STATUS_LABELS = {
    PENDING: 'Ожидает',
    CONFIRMED: 'Подтверждён',
    SHIPPED: 'Отправлен',
    DELIVERED: 'Доставлен',
    CANCELLED: 'Отменён',
};

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await orderApi.getMyOrders();
                setOrders(response.data);
            } catch (err) {
                setError('Ошибка загрузки заказов');
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
        </Box>
    );

    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                Мои заказы
            </Typography>

            {orders.length === 0 ? (
                <Typography variant="h6" color="text.secondary" textAlign="center" sx={{ py: 8 }}>
                    У вас пока нет заказов
                </Typography>
            ) : (
                orders.map(order => (
                    <Card key={order.id} sx={{ mb: 2 }}>
                        <CardContent>

                            {/* Шапка заказа */}
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                mb: 2,
                            }}>
                                <Typography variant="h6" fontWeight="bold">
                                    Заказ №{order.id}
                                </Typography>
                                <Chip
                                    label={STATUS_LABELS[order.status]}
                                    color={STATUS_COLORS[order.status]}
                                />
                            </Box>

                            <Divider sx={{ mb: 2 }} />

                            {/* Информация о товаре */}
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                mb: 1,
                            }}>
                                <Typography variant="body1">
                                    {order.productName}
                                </Typography>
                                <Typography variant="body1">
                                    {order.quantity} шт. × {order.priceSnapshot} ₽
                                </Typography>
                            </Box>

                            {/* Итого */}
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                mb: 2,
                            }}>
                                <Typography variant="body2" color="text.secondary">
                                    Итого:
                                </Typography>
                                <Typography variant="body1" color="primary" fontWeight="bold">
                                    {(order.priceSnapshot * order.quantity).toFixed(2)} ₽
                                </Typography>
                            </Box>

                            <Divider sx={{ mb: 2 }} />

                            {/* Адрес */}
                            <Typography variant="body2" color="text.secondary">
                                Адрес: {order.address.country}, {order.address.city},{' '}
                                ул. {order.address.street}, д. {order.address.house}
                                {order.address.apartment && `, кв. ${order.address.apartment}`}
                            </Typography>

                            {/* Дата */}
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                Дата заказа: {new Date(order.createdAt).toLocaleDateString('ru-RU')}
                            </Typography>

                        </CardContent>
                    </Card>
                ))
            )}
        </Box>
    );
};

export default OrdersPage;