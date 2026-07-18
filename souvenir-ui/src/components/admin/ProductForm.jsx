import {
    Box,
    TextField,
    Button,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Typography,
    IconButton,
    Alert,
} from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';

const CATEGORIES = ['MAGNETS', 'MUGS', 'KEYCHAINS', 'PLATES', 'TOYS', 'CLOTHING', 'OTHER'];
const COUNTRIES = ['RUSSIA', 'FRANCE', 'ITALY', 'GERMANY', 'JAPAN', 'USA', 'OTHER'];

const ProductForm = ({ formData, onChange, onImageAdd, onImageRemove, onSubmit, loading, error, submitLabel }) => {

    return (
        <Box component="form" onSubmit={onSubmit}>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

                {/* Название */}
                <TextField
                    label="Название"
                    name="name"
                    value={formData.name}
                    onChange={onChange}
                    required
                    fullWidth
                />

                {/* Описание */}
                <TextField
                    label="Описание"
                    name="description"
                    value={formData.description}
                    onChange={onChange}
                    multiline
                    rows={4}
                    fullWidth
                />

                <Box sx={{ display: 'flex', gap: 2 }}>

                    {/* Категория */}
                    <FormControl fullWidth required>
                        <InputLabel>Категория</InputLabel>
                        <Select
                            name="category"
                            value={formData.category}
                            label="Категория"
                            onChange={onChange}
                        >
                            {CATEGORIES.map(cat => (
                                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* Страна */}
                    <FormControl fullWidth required>
                        <InputLabel>Страна</InputLabel>
                        <Select
                            name="country"
                            value={formData.country}
                            label="Страна"
                            onChange={onChange}
                        >
                            {COUNTRIES.map(c => (
                                <MenuItem key={c} value={c}>{c}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                </Box>

                <Box sx={{ display: 'flex', gap: 2 }}>

                    {/* Цена */}
                    <TextField
                        label="Цена (₽)"
                        name="price"
                        type="number"
                        value={formData.price}
                        onChange={onChange}
                        inputProps={{ min: 0, step: 0.01 }}
                        required
                        fullWidth
                    />

                    {/* Остаток */}
                    <TextField
                        label="Остаток (шт.)"
                        name="stock"
                        type="number"
                        value={formData.stock}
                        onChange={onChange}
                        inputProps={{ min: 0 }}
                        required
                        fullWidth
                    />

                </Box>

                {/* Изображения */}
                <Box>
                    <Typography variant="subtitle1" gutterBottom>
                        Изображения
                    </Typography>

                    {formData.imagesUrl.map((url, index) => (
                        <Box
                            key={index}
                            sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center' }}
                        >
                            <TextField
                                fullWidth
                                label={`URL изображения ${index + 1}`}
                                value={url}
                                onChange={(e) => {
                                    const newImages = [...formData.imagesUrl];
                                    newImages[index] = e.target.value;
                                    onChange({
                                        target: {
                                            name: 'imagesUrl',
                                            value: newImages,
                                        }
                                    });
                                }}
                                size="small"
                            />
                            <IconButton
                                color="error"
                                onClick={() => onImageRemove(index)}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Box>
                    ))}

                    <Button
                        startIcon={<AddPhotoAlternateIcon />}
                        onClick={onImageAdd}
                        variant="outlined"
                        size="small"
                    >
                        Добавить изображение
                    </Button>
                </Box>

                {/* Кнопка отправки */}
                <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={loading}
                    sx={{ mt: 1 }}
                >
                    {loading ? 'Сохранение...' : submitLabel}
                </Button>

            </Box>
        </Box>
    );
};

export default ProductForm;