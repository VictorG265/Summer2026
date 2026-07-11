import { Box, Typography, Link } from '@mui/material';

const Footer = () => {
    return (
        <Box
            component="footer"
            sx={{
                py: 3,
                px: 2,
                mt: 'auto',
                textAlign: 'center',
                borderTop: '1px solid',
                borderColor: 'divider',
                backgroundColor: 'background.paper',
            }}
        >
            <Typography variant="body2" color="text.secondary">
                © {new Date().getFullYear()} SouvenirShop — Все права защищены
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Сделано с ❤️ в рамках учебной практики
            </Typography>
        </Box>
    );
};

export default Footer;