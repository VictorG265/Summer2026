import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Button,
    Chip,
    CircularProgress,
    Alert,
    TextField,
    IconButton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import productApi from '../../api/productApi.js';
import { useCart } from '../../context/CartContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

const ProductPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addItem } = useCart();
    const { isAdmin } = useAuth();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentImage, setCurrentImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await productApi.getById(id);
                setProduct(response.data);
            } catch (err) {
                setError('Товар не найден');
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handlePrevImage = () => {
        setCurrentImage(prev =>
            prev === 0 ? product.imagesUrl.length - 1 : prev - 1
        );
    };

    const handleNextImage = () => {
        setCurrentImage(prev =>
            prev === product.imagesUrl.length - 1 ? 0 : prev + 1
        );
    };

    const handleAddToCart = () => {
        addItem(product, quantity);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
        </Box>
    );

    if (error) return (
        <Alert severity="error">{error}</Alert>
    );

    return (
        <Box>

            {/* Кнопка назад */}
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate(-1)}
                sx={{ mb: 3 }}
            >
                Назад
            </Button>

            <Box sx={{
                display: 'flex',
                gap: 4,
                flexDirection: { xs: 'column', md: 'row' },
            }}>

                {/* Галерея — слайдер */}
                <Box sx={{ flex: 1 }}>
                    <Box sx={{
                        position: 'relative',
                        width: '100%',
                        aspectRatio: '1',
                        backgroundColor: 'background.paper',
                        borderRadius: 2,
                        overflow: 'hidden',
                    }}>
                        {/* Фото */}
                        <img
                            src={product.imagesUrl?.[currentImage] || '/placeholder.jpg'}
                            alt={product.name}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                            }}
                        />

                        {/* Стрелки слайдера */}
                        {product.imagesUrl?.length > 1 && (
                            <>
                                <IconButton
                                    onClick={handlePrevImage}
                                    sx={{
                                        position: 'absolute',
                                        left: 8,
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        backgroundColor: 'rgba(0,0,0,0.4)',
                                        color: 'white',
                                        '&:hover': {
                                            backgroundColor: 'rgba(0,0,0,0.6)',
                                        },
                                    }}
                                >
                                    <ArrowBackIosIcon />
                                </IconButton>
                                <IconButton
                                    onClick={handleNextImage}
                                    sx={{
                                        position: 'absolute',
                                        right: 8,
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        backgroundColor: 'rgba(0,0,0,0.4)',
                                        color: 'white',
                                        '&:hover': {
                                            backgroundColor: 'rgba(0,0,0,0.6)',
                                        },
                                    }}
                                >
                                    <ArrowForwardIosIcon />
                                </IconButton>

                                {/* Индикатор слайда */}
                                <Box sx={{
                                    position: 'absolute',
                                    bottom: 8,
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    display: 'flex',
                                    gap: 0.5,
                                }}>
                                    {product.imagesUrl.map((_, index) => (
                                        <Box
                                            key={index}
                                            onClick={() => setCurrentImage(index)}
                                            sx={{
                                                width: 8,
                                                height: 8,
                                                borderRadius: '50%',
                                                backgroundColor: index === currentImage
                                                    ? 'white'
                                                    : 'rgba(255,255,255,0.5)',
                                                cursor: 'pointer',
                                                transition: 'background-color 0.2s',
                                            }}
                                        />
                                    ))}
                                </Box>
                            </>
                        )}
                    </Box>
                </Box>

                {/* Информация о товаре */}
                <Box sx={{ flex: 1 }}>

                    {/* Теги */}
                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                        <Chip label={product.category} color="primary" />
                        <Chip label={product.country} variant="outlined" />
                    </Box>

                    {/* Название */}
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        {product.name}
                    </Typography>

                    {/* Описание */}
                    <Typography variant="body1" color="text.secondary" paragraph>
                        {product.description}
                    </Typography>

                    {/* Цена */}
                    <Typography variant="h4" color="primary" gutterBottom>
                        {product.price} ₽
                    </Typography>

                    {/* Остаток */}
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        В наличии: {product.stock} шт.
                    </Typography>

                    {/* Количество и кнопка — только для не-админов */}
                    {!isAdmin() && (
                        <Box sx={{ display: 'flex', gap: 2, mt: 3, alignItems: 'center' }}>
                            <TextField
                                label="Количество"
                                type="number"
                                value={quantity}
                                onChange={(e) => setQuantity(
                                    Math.max(1, Math.min(product.stock, Number(e.target.value)))
                                )}
                                inputProps={{ min: 1, max: product.stock }}
                                sx={{ width: 120 }}
                            />
                            <Button
                                variant="contained"
                                size="large"
                                startIcon={<ShoppingCartIcon />}
                                onClick={handleAddToCart}
                                disabled={product.stock === 0 || added}
                                sx={{ flexGrow: 1 }}
                            >
                                {added
                                    ? '✓ Добавлено!'
                                    : product.stock === 0
                                        ? 'Нет в наличии'
                                        : 'В корзину'
                                }
                            </Button>
                        </Box>
                    )}

                </Box>
            </Box>
        </Box>
    );
};

export default ProductPage;