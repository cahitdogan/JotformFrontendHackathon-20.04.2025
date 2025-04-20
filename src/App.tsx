import React, { useState } from "react"
import Header from "./sections/Header";
import Products from "./sections/Products";
import ProductImageDialog from "./sections/ProductImageDialog";

function App() {
  const [isProductImageDialogVisible, setIsProductImageDialogVisible] = useState(false);
  const [activeImageForDialog, setActiveImageForDialog] = useState(null);

  return (
    <>
      <Header/>
      <main>
        <Products
          setActiveImageForDialog={setActiveImageForDialog}
          setIsProductImageDialogVisible={setIsProductImageDialogVisible}
        />
        <ProductImageDialog 
          activeImageForDialog={activeImageForDialog}
          isVisible={isProductImageDialogVisible}
          setIsProductImageDialogVisible={setIsProductImageDialogVisible}
        />
      </main>
    </>
  )
}

export default App;