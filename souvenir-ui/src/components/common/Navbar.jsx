import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Button,
    Badge,
    Box,
    Drawer,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Divider,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import HomeIcon from '@mui/icons-material/Home';

import { useAuth } from '../../context/AuthContext.jsx';
import { useCart } from '../../context/CartContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';

const Navbar = () => {
    const { isAuthenticated, isAdmin, logout } = useAuth();
    const { totalItems } = useCart();
    const { mode, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const [drawerOpen, setDrawerOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
        setDrawerOpen(false);
    };

    // Ссылки для обычного пользователя
    const userLinks = [
        { label: 'Главная', path: '/', icon: <HomeIcon /> },
        { label: 'Профиль', path: '/profile', icon: <AccountCircleIcon /> },
        { label: 'Мои заказы', path: '/orders/my', icon: <ShoppingCartIcon /> },
    ];

    // Ссылки для админа
    const adminLinks = [
        { label: 'Товары', path: '/admin/products', icon: <AdminPanelSettingsIcon /> },
        { label: 'Заказы', path: '/admin/orders', icon: <ShoppingCartIcon /> },
        { label: 'Пользователи', path: '/admin/users', icon: <AccountCircleIcon /> },
    ];

    return (
        <>
            <AppBar position="sticky">
                <Toolbar>

                    {/* Кнопка мобильного меню */}
                    <IconButton
                        color="inherit"
                        edge="start"
                        onClick={() => setDrawerOpen(true)}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>

                    {/* Логотип */}
                    <Typography
                        variant="h6"
                        component={Link}
                        to="/"
                        sx={{
                            flexGrow: 1,
                            color: 'inherit',
                            textDecoration: 'none',
                            fontWeight: 'bold',
                        }}
                    >
                        🎁 SouvenirShop
                    </Typography>

                    {/* Десктопное меню */}
                    <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 1 }}>

                        <Button color="inherit" component={Link} to="/">
                            Главная
                        </Button>

                        {isAuthenticated() && !isAdmin() && (
                            <>
                                <Button color="inherit" component={Link} to="/profile">
                                    Профиль
                                </Button>
                                <Button color="inherit" component={Link} to="/orders/my">
                                    Мои заказы
                                </Button>
                            </>
                        )}

                        {isAdmin() && (
                            <>
                                <Button color="inherit" component={Link} to="/admin/products">
                                    Товары
                                </Button>
                                <Button color="inherit" component={Link} to="/admin/orders">
                                    Заказы
                                </Button>
                                <Button color="inherit" component={Link} to="/admin/users">
                                    Пользователи
                                </Button>
                            </>
                        )}

                    </Box>

                    {/* Переключатель темы */}
                    <IconButton color="inherit" onClick={toggleTheme}>
                        {mode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
                    </IconButton>

                    {/* Корзина — только для не-админов */}
                    {!isAdmin() && (
                        <IconButton color="inherit" component={Link} to="/cart">
                            <Badge badgeContent={totalItems} color="error">
                                <ShoppingCartIcon />
                            </Badge>
                        </IconButton>
                    )}

                    {/* Кнопки входа/выхода */}
                    {isAuthenticated() ? (
                        <IconButton color="inherit" onClick={handleLogout}>
                            <LogoutIcon />
                        </IconButton>
                    ) : (
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button color="inherit" component={Link} to="/login">
                                Войти
                            </Button>
                            <Button
                                variant="outlined"
                                color="inherit"
                                component={Link}
                                to="/register"
                            >
                                Регистрация
                            </Button>
                        </Box>
                    )}

                </Toolbar>
            </AppBar>

            {/* Мобильное меню (Drawer) */}
            <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
            >
                <Box sx={{ width: 250 }}>
                    <Typography variant="h6" sx={{ p: 2, fontWeight: 'bold' }}>
                        🎁 SouvenirShop
                    </Typography>
                    <Divider />

                    <List>
                        {/* Общие ссылки */}
                        {userLinks.map(link => (
                            <ListItem
                                key={link.path}
                                onClick={() => {
                                    navigate(link.path);
                                    setDrawerOpen(false);
                                }}
                                sx={{ cursor: 'pointer' }}
                            >
                                <ListItemIcon>{link.icon}</ListItemIcon>
                                <ListItemText primary={link.label} />
                            </ListItem>
                        ))}

                        {/* Ссылки админа */}
                        {isAdmin() && (
                            <>
                                <Divider />
                                <Typography
                                    variant="caption"
                                    sx={{ px: 2, py: 1, display: 'block' }}
                                >
                                    Администрирование
                                </Typography>
                                {adminLinks.map(link => (
                                    <ListItem
                                        key={link.path}
                                        onClick={() => {
                                            navigate(link.path);
                                            setDrawerOpen(false);
                                        }}
                                        sx={{ cursor: 'pointer' }}
                                    >
                                        <ListItemIcon>{link.icon}</ListItemIcon>
                                        <ListItemText primary={link.label} />
                                    </ListItem>
                                ))}
                            </>
                        )}

                        <Divider />

                        {/* Выход */}
                        {isAuthenticated() && (
                            <ListItem onClick={handleLogout} sx={{ cursor: 'pointer' }}>
                                <ListItemIcon><LogoutIcon /></ListItemIcon>
                                <ListItemText primary="Выйти" />
                            </ListItem>
                        )}
                    </List>
                </Box>
            </Drawer>
        </>
    );
};

export default Navbar;