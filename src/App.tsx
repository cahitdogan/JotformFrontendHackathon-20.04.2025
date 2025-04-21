import { useState, useEffect } from "react";
import { Routes, Route } from "react-router";
import Header from "./sections/Header";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Favorites from "./pages/Favorites";
import Cart from "./pages/Cart";
import { Toaster } from "sonner";
import { 
  loadCartProducts, 
  loadCartProductCounts,
  loadFavoriteProducts,
  saveCartProducts, 
  saveCartProductCounts,
  saveFavoriteProducts
} from "./utils/localStorage";

function App() {
  const [isProductImageDialogVisible, setIsProductImageDialogVisible] = useState(false);
  const [activeImageForDialog, setActiveImageForDialog] = useState(null);
  const [shoppingCartProducts, setShoppingCartProducts] = useState(() => loadCartProducts());
  const [shoppingCartProductCounts, setShoppingCartProductCounts] = useState(() => loadCartProductCounts());
  const [favoriteProducts, setFavoriteProducts] = useState(() => loadFavoriteProducts());
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    saveCartProducts(shoppingCartProducts);
  }, [shoppingCartProducts]);

  useEffect(() => {
    saveCartProductCounts(shoppingCartProductCounts);
  }, [shoppingCartProductCounts]);

  useEffect(() => {
    saveFavoriteProducts(favoriteProducts);
  }, [favoriteProducts]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <>
      <Header
        shoppingCartProductCounts={shoppingCartProductCounts}
        shoppingCartProducts={shoppingCartProducts}
        favoriteProducts={favoriteProducts}
        onSearch={handleSearch}
        setShoppingCartProductCounts={setShoppingCartProductCounts}
        setShoppingCartProducts={setShoppingCartProducts}
      />
      <Routes>
        <Route 
          path="/" 
          element={
            <Home
              shoppingCartProductCounts={shoppingCartProductCounts}
              setShoppingCartProductCounts={setShoppingCartProductCounts}
              setShoppingCartProducts={setShoppingCartProducts}
              shoppingCartProducts={shoppingCartProducts}
              favoriteProducts={favoriteProducts}
              setFavoriteProducts={setFavoriteProducts}
              setActiveImageForDialog={setActiveImageForDialog}
              setIsProductImageDialogVisible={setIsProductImageDialogVisible}
              isProductImageDialogVisible={isProductImageDialogVisible}
              activeImageForDialog={activeImageForDialog}
              searchQuery={searchQuery}
            />
          } 
        />
        <Route 
          path="/product/:productId" 
          element={
            <ProductDetail
              shoppingCartProductCounts={shoppingCartProductCounts}
              setShoppingCartProductCounts={setShoppingCartProductCounts}
              setShoppingCartProducts={setShoppingCartProducts}
              shoppingCartProducts={shoppingCartProducts}
              favoriteProducts={favoriteProducts}
              setFavoriteProducts={setFavoriteProducts}
              setActiveImageForDialog={setActiveImageForDialog}
              setIsProductImageDialogVisible={setIsProductImageDialogVisible}
            />
          } 
        />
        <Route 
          path="/favorites" 
          element={
            <Favorites
              shoppingCartProductCounts={shoppingCartProductCounts}
              setShoppingCartProductCounts={setShoppingCartProductCounts}
              setShoppingCartProducts={setShoppingCartProducts}
              shoppingCartProducts={shoppingCartProducts}
              favoriteProducts={favoriteProducts}
              setFavoriteProducts={setFavoriteProducts}
              setActiveImageForDialog={setActiveImageForDialog}
              setIsProductImageDialogVisible={setIsProductImageDialogVisible}
            />
          } 
        />
        <Route 
          path="/cart" 
          element={
            <Cart
              shoppingCartProductCounts={shoppingCartProductCounts}
              setShoppingCartProductCounts={setShoppingCartProductCounts}
              setShoppingCartProducts={setShoppingCartProducts}
              shoppingCartProducts={shoppingCartProducts}
            />
          } 
        />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;