import React from 'react';
import Products from '../sections/Products';
import ProductImageDialog from '../sections/ProductImageDialog';

interface HomeProps {
  shoppingCartProductCounts: any;
  setShoppingCartProductCounts: any;
  setShoppingCartProducts: any;
  shoppingCartProducts: object[];
  setActiveImageForDialog: any;
  setIsProductImageDialogVisible: any;
  isProductImageDialogVisible: boolean;
  activeImageForDialog: string | null;
}

export default function Home({
  shoppingCartProductCounts,
  setShoppingCartProductCounts,
  setShoppingCartProducts,
  shoppingCartProducts,
  setActiveImageForDialog,
  setIsProductImageDialogVisible,
  isProductImageDialogVisible,
  activeImageForDialog
}: HomeProps) {
  return (
    <main className="max-w-[1300px] m-auto">
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
  );
} 