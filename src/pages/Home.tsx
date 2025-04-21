import Products from '../sections/Products';
import ProductImageDialog from '../sections/ProductImageDialog';

interface HomeProps {
  shoppingCartProductCounts: any;
  setShoppingCartProductCounts: any;
  setShoppingCartProducts: any;
  shoppingCartProducts: object[];
  favoriteProducts: any[];
  setFavoriteProducts: any;
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
  favoriteProducts,
  setFavoriteProducts,
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
        favoriteProducts={favoriteProducts}
        setFavoriteProducts={setFavoriteProducts}
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