import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';

// Общие компоненты
import Navbar from './components/common/Navbar.jsx';
import Footer from './components/common/Footer.jsx';
import ProtectedRoute from './components/common/ProtectedRoute.jsx';

// Публичные страницы
import HomePage from './pages/public/HomePage.jsx';
import ProductPage from './pages/public/ProductPage.jsx';
import LoginPage from './pages/public/LoginPage.jsx';
import RegisterPage from './pages/public/RegisterPage.jsx';

// Страницы пользователя
import CartPage from './pages/user/CartPage.jsx';
import OrdersPage from './pages/user/OrdersPage.jsx';
import ProfilePage from './pages/user/ProfilePage.jsx';

// Страницы админа
import AdminProductsPage from './pages/admin/AdminProductsPage.jsx';
import AdminProductCreatePage from './pages/admin/AdminProductCreatePage.jsx';
import AdminProductEditPage from './pages/admin/AdminProductEditPage.jsx';
import AdminOrdersPage from './pages/admin/AdminOrdersPage.jsx';
import AdminUsersPage from './pages/admin/AdminUsersPage.jsx';

const App = () => {
    const { isAuthenticated, isAdmin } = useAuth();

    return (
        <>
            <Navbar />
            <main className="page-wrapper">
                <div className="container">
                    <Routes>

                        {/* Публичные маршруты */}
                        <Route path="/" element={<HomePage />} />
                        <Route path="/products/:id" element={<ProductPage />} />
                        <Route path="/login" element={
                            isAuthenticated()
                                ? <Navigate to="/" />
                                : <LoginPage />
                        } />
                        <Route path="/register" element={
                            isAuthenticated()
                                ? <Navigate to="/" />
                                : <RegisterPage />
                        } />

                        {/* Маршруты для авторизованных пользователей */}
                        <Route path="/cart" element={
                            <ProtectedRoute>
                                <CartPage />
                            </ProtectedRoute>
                        } />
                        <Route path="/orders/my" element={
                            <ProtectedRoute>
                                <OrdersPage />
                            </ProtectedRoute>
                        } />
                        <Route path="/profile" element={
                            <ProtectedRoute>
                                <ProfilePage />
                            </ProtectedRoute>
                        } />

                        {/* Маршруты для админа */}
                        <Route path="/admin/products" element={
                            <ProtectedRoute adminOnly>
                                <AdminProductsPage />
                            </ProtectedRoute>
                        } />
                        <Route path="/admin/products/create" element={
                            <ProtectedRoute adminOnly>
                                <AdminProductCreatePage />
                            </ProtectedRoute>
                        } />
                        <Route path="/admin/products/:id" element={
                            <ProtectedRoute adminOnly>
                                <AdminProductEditPage />
                            </ProtectedRoute>
                        } />
                        <Route path="/admin/orders" element={
                            <ProtectedRoute adminOnly>
                                <AdminOrdersPage />
                            </ProtectedRoute>
                        } />
                        <Route path="/admin/users" element={
                            <ProtectedRoute adminOnly>
                                <AdminUsersPage />
                            </ProtectedRoute>
                        } />

                        {/* Любой неизвестный маршрут → на главную */}
                        <Route path="*" element={<Navigate to="/" />} />

                    </Routes>
                </div>
            </main>
            <Footer />
        </>
    );
};

export default App;