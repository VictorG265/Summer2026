import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ProductForm from '../../components/admin/ProductForm.jsx';
import productApi from '../../api/productApi.js';

const AdminProductEditPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    // Загружаем данные товара
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await productApi.getById(id);
                setFormData({
                    ...response.data,
                    imagesUrl: response.data.imagesUrl || [],
                });
            } catch (err) {
                setError('Ошибка загрузки товара');
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

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
        setSaving(true);
        setError(null);

        try {
            await productApi.update(id, {
                ...formData,
                price: Number(formData.price),
                stock: Number(formData.stock),
                imagesUrl: formData.imagesUrl.filter(url => url.trim() !== ''),
            });
            navigate('/admin/products');
        } catch (err) {
            setError(err.response?.data?.message || 'Ошибка обновления товара');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
        </Box>
    );

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
                Редактировать товар #{id}
            </Typography>

            <Box sx={{ maxWidth: 700 }}>
                <ProductForm
                    formData={formData}
                    onChange={handleChange}
                    onImageAdd={handleImageAdd}
                    onImageRemove={handleImageRemove}
                    onSubmit={handleSubmit}
                    loading={saving}
                    error={error}
                    submitLabel="Сохранить изменения"
                />
            </Box>
        </Box>
    );
};

export default AdminProductEditPage;