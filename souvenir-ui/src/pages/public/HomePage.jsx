import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Grid,
    TextField,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    CircularProgress,
    Alert,
    InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ProductCard from '../../components/common/ProductCard.jsx';
import productApi from '../../api/productApi.js';

const CATEGORIES = ['ALL', 'MAGNETS', 'MUGS', 'KEYCHAINS', 'PLATES', 'TOYS', 'CLOTHING', 'OTHER'];
const COUNTRIES = ['ALL', 'RUSSIA', 'FRANCE', 'ITALY', 'GERMANY', 'JAPAN', 'USA', 'OTHER'];

const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('ALL');
    const [country, setCountry] = useState('ALL');

    // Загрузка товаров с учётом фильтров
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);

            try {
                let response;

                if (search) {
                    response = await productApi.searchByName(search);
                } else if (category !== 'ALL' && country !== 'ALL') {
                    response = await productApi.filter(category, country);
                } else if (category !== 'ALL') {
                    response = await productApi.getByCategory(category);
                } else if (country !== 'ALL') {
                    response = await productApi.getByCountry(country);
                } else {
                    response = await productApi.getAll();
                }

                setProducts(Array.isArray(response.data) ? response.data : []);
            } catch (err) {
                setError('Ошибка загрузки товаров');
            } finally {
                setLoading(false);
            }
        };

        // Задержка поиска чтобы не делать запрос на каждую букву
        const timeout = setTimeout(fetchProducts, 300);
        return () => clearTimeout(timeout);

    }, [search, category, country]);

    return (
        <Box>

            {/* Заголовок */}
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                Каталог сувениров
            </Typography>

            {/* Фильтры */}
            <Box sx={{
                display: 'flex',
                gap: 2,
                mb: 4,
                flexWrap: 'wrap',
            }}>
                <TextField
                    label="Поиск по названию"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    sx={{ flexGrow: 1, minWidth: 200 }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />

                <FormControl sx={{ minWidth: 150 }}>
                    <InputLabel>Категория</InputLabel>
                    <Select
                        value={category}
                        label="Категория"
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        {CATEGORIES.map(cat => (
                            <MenuItem key={cat} value={cat}>
                                {cat === 'ALL' ? 'Все категории' : cat}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl sx={{ minWidth: 150 }}>
                    <InputLabel>Страна</InputLabel>
                    <Select
                        value={country}
                        label="Страна"
                        onChange={(e) => setCountry(e.target.value)}
                    >
                        {COUNTRIES.map(c => (
                            <MenuItem key={c} value={c}>
                                {c === 'ALL' ? 'Все страны' : c}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            {/* Состояния загрузки и ошибки */}
            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                    <CircularProgress />
                </Box>
            )}

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {/* Список товаров */}
            {!loading && !error && (
                <>
                    {products.length === 0 ? (
                        <Typography
                            variant="h6"
                            color="text.secondary"
                            textAlign="center"
                            sx={{ py: 8 }}
                        >
                            Товары не найдены
                        </Typography>
                    ) : (
                        <Grid container spacing={3}>
                            {products.map(product => (
                                <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                                    <ProductCard product={product} />
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </>
            )}

        </Box>
    );
};

export default HomePage;