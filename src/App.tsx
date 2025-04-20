import React, { useState } from "react";
import { Routes, Route } from "react-router";
import Header from "./sections/Header";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import { Toaster } from "sonner";

function App() {
  const [isProductImageDialogVisible, setIsProductImageDialogVisible] = useState(false);
  const [activeImageForDialog, setActiveImageForDialog] = useState(null);
  const [shoppingCartProducts, setShoppingCartProducts] = useState([]);
  const [shoppingCartProductCounts, setShoppingCartProductCounts] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

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