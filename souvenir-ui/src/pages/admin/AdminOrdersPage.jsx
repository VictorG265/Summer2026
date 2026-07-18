import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    CircularProgress,
    Alert,
    Select,
    MenuItem,
    FormControl,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import orderApi from '../../api/orderApi.js';

const STATUS_COLORS = {
    PENDING: 'warning',
    CONFIRMED: 'info',
    SHIPPED: 'primary',
    DELIVERED: 'success',
    CANCELLED: 'error',
};

const STATUS_LABELS = {
    PENDING: 'Ожидает',
    CONFIRMED: 'Подтверждён',
    SHIPPED: 'Отправлен',
    DELIVERED: 'Доставлен',
    CANCELLED: 'Отменён',
};

const ALL_STATUSES = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

const AdminOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteId, setDeleteId] = useState(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await orderApi.getAll();
            setOrders(Array.isArray(response.data) ? response.data : []);
        } catch (err) {
            setError('Ошибка загрузки заказов');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            const response = await orderApi.updateStatus(orderId, newStatus);
            setOrders(prev => prev.map(o =>
                o.id === orderId ? response.data : o
            ));
        } catch (err) {
            setError('Ошибка обновления статуса');
        }
    };

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await orderApi.delete(deleteId);
            setOrders(prev => prev.filter(o => o.id !== deleteId));
            setDeleteId(null);
        } catch (err) {
            setError('Ошибка удаления заказа');
        } finally {
            setDeleting(false);
        }
    };

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
        </Box>
    );

    return (
        <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                Управление заказами
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Пользователь</TableCell>
                            <TableCell>Товар</TableCell>
                            <TableCell>Кол-во</TableCell>
                            <TableCell>Сумма</TableCell>
                            <TableCell>Адрес</TableCell>
                            <TableCell>Дата</TableCell>
                            <TableCell>Статус</TableCell>
                            <TableCell align="center">Действия</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders.map(order => (
                            <TableRow key={order.id} hover>
                                <TableCell>{order.id}</TableCell>
                                <TableCell>{order.userId}</TableCell>
                                <TableCell>{order.productName}</TableCell>
                                <TableCell>{order.quantity}</TableCell>
                                <TableCell>
                                    {(order.priceSnapshot * order.quantity).toFixed(2)} ₽
                                </TableCell>
                                <TableCell>
                                    {order.address.city}, {order.address.street}
                                </TableCell>
                                <TableCell>
                                    {new Date(order.createdAt).toLocaleDateString('ru-RU')}
                                </TableCell>
                                <TableCell>
                                    {/* Выпадающий список смены статуса */}
                                    <FormControl size="small">
                                        <Select
                                            value={order.status}
                                            onChange={(e) =>
                                                handleStatusChange(order.id, e.target.value)
                                            }
                                            renderValue={(value) => (
                                                <Chip
                                                    label={STATUS_LABELS[value]}
                                                    color={STATUS_COLORS[value]}
                                                    size="small"
                                                />
                                            )}
                                        >
                                            {ALL_STATUSES.map(status => (
                                                <MenuItem key={status} value={status}>
                                                    <Chip
                                                        label={STATUS_LABELS[status]}
                                                        color={STATUS_COLORS[status]}
                                                        size="small"
                                                    />
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </TableCell>
                                <TableCell align="center">
                                    <IconButton
                                        color="error"
                                        onClick={() => setDeleteId(order.id)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Диалог подтверждения удаления */}
            <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
                <DialogTitle>Удалить заказ?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Это действие нельзя отменить.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteId(null)}>
                        Отмена
                    </Button>
                    <Button
                        color="error"
                        variant="contained"
                        onClick={handleDelete}
                        disabled={deleting}
                    >
                        {deleting ? 'Удаление...' : 'Удалить'}
                    </Button>
                </DialogActions>
            </Dialog>

        </Box>
    );
};

export default AdminOrdersPage;