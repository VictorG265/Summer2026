import { Card, CardMedia, CardContent, CardActions, Typography, Button, Box, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useCart } from '../../context/CartContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

const ProductCard = ({ product }) => {
    const navigate = useNavigate();
    const { addItem } = useCart();
    const { isAdmin } = useAuth();

    const handleAddToCart = (e) => {
        // Останавливаем переход на страницу товара
        e.stopPropagation();
        addItem(product, 1);
    };

    return (
        <Card
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6,
                },
            }}
            onClick={() => navigate(`/products/${product.id}`)}
        >
            {/* Фото товара */}
            <CardMedia
                component="img"
                height="200"
                image={product.imagesUrl?.[0] || '/placeholder.jpg'}
                alt={product.name}
                sx={{ objectFit: 'cover' }}
            />

            <CardContent sx={{ flexGrow: 1 }}>

                {/* Категория и страна */}
                <Box sx={{ display: 'flex', gap: 0.5, mb: 1, flexWrap: 'wrap' }}>
                    <Chip label={product.category} size="small" color="primary" />
                    <Chip label={product.country} size="small" variant="outlined" />
                </Box>

                {/* Название */}
                <Typography variant="h6" gutterBottom noWrap>
                    {product.name}
                </Typography>

                {/* Описание */}
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                    }}
                >
                    {product.description}
                </Typography>

                {/* Цена */}
                <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                    {product.price} ₽
                </Typography>

                {/* Остаток */}
                <Typography variant="caption" color="text.secondary">
                    В наличии: {product.stock} шт.
                </Typography>

            </CardContent>

            {/* Кнопка добавления в корзину */}
            {!isAdmin() && (
                <CardActions>
                    <Button
                        fullWidth
                        variant="contained"
                        startIcon={<ShoppingCartIcon />}
                        onClick={handleAddToCart}
                        disabled={product.stock === 0}
                    >
                        {product.stock === 0 ? 'Нет в наличии' : 'В корзину'}
                    </Button>
                </CardActions>
            )}

        </Card>
    );
};

export default ProductCard;