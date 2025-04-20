import React, { useState } from "react"
import Header from "./sections/Header";
import Products from "./sections/Products";
import ProductImageDialog from "./sections/ProductImageDialog";
import { Toaster } from "sonner";

function App() {
  const [isProductImageDialogVisible, setIsProductImageDialogVisible] = useState(false);
  const [activeImageForDialog, setActiveImageForDialog] = useState(null);
  const [shoppingCartProducts, setShoppingCartProducts] = useState([]);
  const [shoppingCartProductCounts, setShoppingCartProductCounts] = useState({});

  return (
    <>
      <Header
        shoppingCartProductCounts={shoppingCartProductCounts}
        shoppingCartProducts={shoppingCartProducts}
      />
      <main>
        <Products
          shoppingCartProductCounts={shoppingCartProductCounts}
          setShoppingCartProductCounts={setShoppingCartProductCounts}
          setShoppingCartProducts={setShoppingCartProducts}
          shoppingCartProducts={shoppingCartProducts}
          setActiveImageForDialog={setActiveImageForDialog}
          setIsProductImageDialogVisible={setIsProductImageDialogVisible}
        />
        <ProductImageDialog 
          activeImageForDialog={activeImageForDialog}
          isVisible={isProductImageDialogVisible}
          setIsProductImageDialogVisible={setIsProductImageDialogVisible}
        />
      </main>
      <Toaster />
    </>
  )
}

export default App;