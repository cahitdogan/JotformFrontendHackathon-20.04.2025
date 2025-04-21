
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Fullscreen, Heart } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router';

interface ProductProps {
    order: number;
    name: string;
    images: string;
    description: string;
    price: string;
}

interface FavoritesProps {
    favoriteProducts: ProductProps[];
    setFavoriteProducts: React.Dispatch<React.SetStateAction<ProductProps[]>>;
    shoppingCartProducts: ProductProps[];
    setShoppingCartProducts: React.Dispatch<React.SetStateAction<ProductProps[]>>;
    shoppingCartProductCounts: Record<string, number>;
    setShoppingCartProductCounts: React.Dispatch<React.SetStateAction<Record<string, number>>>;
    setIsProductImageDialogVisible: React.Dispatch<React.SetStateAction<boolean>>;
    setActiveImageForDialog: React.Dispatch<React.SetStateAction<any>>;
}

export default function Favorites({
    favoriteProducts,
    setFavoriteProducts,
    shoppingCartProducts,
    setShoppingCartProducts,
    shoppingCartProductCounts,
    setShoppingCartProductCounts,
    setIsProductImageDialogVisible,
    setActiveImageForDialog
}: FavoritesProps) {
    function openImageDialog(imageUrl: string) {
        setIsProductImageDialogVisible(true);
        setActiveImageForDialog(imageUrl);
    }

    function removeFromFavorites(product: ProductProps) {
        setFavoriteProducts(favoriteProducts.filter((item: any) => item.order !== product.order));
        toast("Product removed from favorites.");
    }

    function addProductToCart(product: ProductProps) {
        const productExists = shoppingCartProducts.some((item: any) => item.order === product.order);
        
        if (productExists) {
            setShoppingCartProductCounts((prev: any) => ({
                ...prev,
                [product.order]: (prev[product.order] || 0) + 1
            }));
        } else {
            setShoppingCartProducts([...shoppingCartProducts, product]);
            setShoppingCartProductCounts((prev: any) => ({
                ...prev,
                [product.order]: 1
            }));
        }
        
        toast("Product successfully added to cart.");
    }

    function removeProductFromCart(product: ProductProps) {
        if (shoppingCartProductCounts[product.order] > 1) {
            setShoppingCartProductCounts((prev: any) => ({
                ...prev,
                [product.order]: prev[product.order] - 1
            }));
        } else {
            // Remove product completely when count reaches 0
            setShoppingCartProducts(shoppingCartProducts.filter((item: any) => item.order !== product.order));
            setShoppingCartProductCounts((prev: any) => {
                const newCounts = { ...prev };
                delete newCounts[product.order];
                return newCounts;
            });
        }
        
        toast("Product removed from cart.");
    }

    return (
        <>
            <div className="container mx-auto mt-24 px-4">
                <h1 className="text-3xl font-bold mb-6">My Favorites</h1>
                
                {favoriteProducts.length === 0 ? (
                    <div className="text-center py-12">
                        <h2 className="text-xl font-semibold mb-2">No favorite products yet</h2>
                        <p className="text-gray-500 mb-6">Add products to your favorites to see them here</p>
                        <Link to="/">
                            <Button>Browse Products</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {favoriteProducts.map((product: ProductProps) => {
                            const imageUrls = JSON.parse(product.images);
                            const firstImage = imageUrls[0];

                            return (
                                <Card key={product.order} className="w-full">
                                    <Button 
                                        onClick={() => openImageDialog(firstImage)}
                                        className="absolute right-3 top-3 rounded-full w-10 h-10 z-10">
                                        <Fullscreen />
                                    </Button>
                                    <Link to={`/product/${product.order}`} className="cursor-pointer block">
                                        <img
                                            className="h-60 object-cover w-full"
                                            src={firstImage}
                                            srcSet={`${firstImage}?width=300 300w, ${firstImage}?width=600 600w`}
                                            sizes="(max-width: 768px) 100vw, 300px"
                                            loading="lazy"
                                            alt={product.description}
                                        />
                                        <CardHeader>
                                            <CardTitle>{product.name}</CardTitle>
                                            <CardDescription>{product.description}</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="font-bold text-xl">${product.price}</p>
                                        </CardContent>
                                    </Link>
                                    <CardFooter className="flex justify-between gap-2">
                                        {!shoppingCartProductCounts[product.order] ? (
                                            <Button className="flex-1" onClick={() => addProductToCart(product)}>
                                                Add to Cart
                                            </Button>
                                        ) : (
                                            <div className="flex gap-1 flex-1">
                                                <Button className="w-1/6 cursor-none">
                                                    {shoppingCartProductCounts[product.order]}
                                                </Button>
                                                <Button variant="outline" className="w-1/6" onClick={() => addProductToCart(product)}>
                                                    +
                                                </Button>
                                                <Button variant="outline" className="w-1/6" onClick={() => removeProductFromCart(product)}>
                                                    -
                                                </Button>
                                            </div>
                                        )}
                                        <Button
                                            variant="destructive"
                                            className="flex-1"
                                            onClick={() => removeFromFavorites(product)}
                                        >
                                            <Heart className="fill-white mr-2" /> Remove
                                        </Button>
                                    </CardFooter>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        </>
    );
} 