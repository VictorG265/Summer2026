import { createContext, useContext, useState } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {

    const [items, setItems] = useState([]);

    // Добавить товар в корзину
    const addItem = (product, quantity = 1) => {
        setItems(prev => {

            // Если товар уже есть в корзине — увеличиваем количество
            const existing = prev.find(item => item.product.id === product.id);
            if (existing) {
                return prev.map(item =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }

            // Если товара нет — добавляем новую позицию
            return [...prev, { product, quantity }];
        });
    };

    // Удалить товар из корзины
    const removeItem = (productId) => {
        setItems(prev => prev.filter(item => item.product.id !== productId));
    };

    // Изменить количество товара
    const updateQuantity = (productId, quantity) => {
        if (quantity <= 0) {
            removeItem(productId);
            return;
        }
        setItems(prev => prev.map(item =>
            item.product.id === productId
                ? { ...item, quantity }
                : item
        ));
    };

    // Очистить корзину
    const clearCart = () => setItems([]);

    // Общее количество товаров
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

    // Итоговая сумма
    const totalPrice = items.reduce(
        (sum, item) => sum + item.product.price * item.quantity, 0
    );

    return (
        <CartContext.Provider value={{
            items,
            addItem,
            removeItem,
            updateQuantity,
            clearCart,
            totalItems,
            totalPrice
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);