// Utility functions for working with localStorage

// Keys for localStorage
export const STORAGE_KEYS = {
  CART_PRODUCTS: 'cartProducts',
  CART_PRODUCT_COUNTS: 'cartProductCounts'
};

// Save cart products to localStorage
export const saveCartProducts = (products: any[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.CART_PRODUCTS, JSON.stringify(products));
  } catch (error) {
    console.error('Error saving cart products to localStorage:', error);
  }
};

// Save cart product counts to localStorage
export const saveCartProductCounts = (productCounts: Record<string, number>) => {
  try {
    localStorage.setItem(STORAGE_KEYS.CART_PRODUCT_COUNTS, JSON.stringify(productCounts));
  } catch (error) {
    console.error('Error saving cart product counts to localStorage:', error);
  }
};

// Load cart products from localStorage
export const loadCartProducts = (): any[] => {
  try {
    const products = localStorage.getItem(STORAGE_KEYS.CART_PRODUCTS);
    return products ? JSON.parse(products) : [];
  } catch (error) {
    console.error('Error loading cart products from localStorage:', error);
    return [];
  }
};

// Load cart product counts from localStorage
export const loadCartProductCounts = (): Record<string, number> => {
  try {
    const productCounts = localStorage.getItem(STORAGE_KEYS.CART_PRODUCT_COUNTS);
    return productCounts ? JSON.parse(productCounts) : {};
  } catch (error) {
    console.error('Error loading cart product counts from localStorage:', error);
    return {};
  }
}; 