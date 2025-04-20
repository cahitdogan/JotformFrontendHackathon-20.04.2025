import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router";
import Header from "./sections/Header";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import { Toaster } from "sonner";
import { 
  loadCartProducts, 
  loadCartProductCounts, 
  saveCartProducts, 
  saveCartProductCounts 
} from "./utils/localStorage";

function App() {
  const [isProductImageDialogVisible, setIsProductImageDialogVisible] = useState(false);
  const [activeImageForDialog, setActiveImageForDialog] = useState(null);
  const [shoppingCartProducts, setShoppingCartProducts] = useState(() => loadCartProducts());
  const [shoppingCartProductCounts, setShoppingCartProductCounts] = useState(() => loadCartProductCounts());
  const [searchQuery, setSearchQuery] = useState("");

  // Save cart data to localStorage whenever it changes
  useEffect(() => {
    saveCartProducts(shoppingCartProducts);
  }, [shoppingCartProducts]);

  useEffect(() => {
    saveCartProductCounts(shoppingCartProductCounts);
  }, [shoppingCartProductCounts]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <>
      <Header
        shoppingCartProductCounts={shoppingCartProductCounts}
        shoppingCartProducts={shoppingCartProducts}
        onSearch={handleSearch}
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
              setActiveImageForDialog={setActiveImageForDialog}
              setIsProductImageDialogVisible={setIsProductImageDialogVisible}
            />
          } 
        />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;