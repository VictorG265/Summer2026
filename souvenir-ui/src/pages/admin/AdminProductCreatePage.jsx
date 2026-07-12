import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ProductForm from '../../components/admin/ProductForm.jsx';
import productApi from '../../api/productApi.js';

const AdminProductCreatePage = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: '',
        country: '',
        price: '',
        stock: '',
        imagesUrl: [],
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleImageAdd = () => {
        setFormData(prev => ({
            ...prev,
            imagesUrl: [...prev.imagesUrl, ''],
        }));
    };

    const handleImageRemove = (index) => {
        setFormData(prev => ({
            ...prev,
            imagesUrl: prev.imagesUrl.filter((_, i) => i !== index),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await productApi.create({
                ...formData,
                price: Number(formData.price),
                stock: Number(formData.stock),
                imagesUrl: formData.imagesUrl.filter(url => url.trim() !== ''),
            });
            navigate('/admin/products');
        } catch (err) {
            setError(err.response?.data?.message || 'Ошибка создания товара');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box>
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate('/admin/products')}
                sx={{ mb: 3 }}
            >
                Назад
            </Button>

            <Typography variant="h4" fontWeight="bold" gutterBottom>
                Добавить товар
            </Typography>

            <Box sx={{ maxWidth: 700 }}>
                <ProductForm
                    formData={formData}
                    onChange={handleChange}
                    onImageAdd={handleImageAdd}
                    onImageRemove={handleImageRemove}
                    onSubmit={handleSubmit}
                    loading={loading}
                    error={error}
                    submitLabel="Создать товар"
                />
            </Box>
        </Box>
    );
};

export default AdminProductCreatePage;