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
  searchQuery: string;
}

export default function Home({
  shoppingCartProductCounts,
  setShoppingCartProductCounts,
  setShoppingCartProducts,
  shoppingCartProducts,
  setActiveImageForDialog,
  setIsProductImageDialogVisible,
  isProductImageDialogVisible,
  activeImageForDialog,
  searchQuery
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
        searchQuery={searchQuery}
      />
      <ProductImageDialog 
        activeImageForDialog={activeImageForDialog}
        isVisible={isProductImageDialogVisible}
        setIsProductImageDialogVisible={setIsProductImageDialogVisible}
      />
    </main>
  );
} 