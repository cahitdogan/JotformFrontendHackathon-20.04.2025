import { useState } from 'react';
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetFooter,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from '../components/ui/input';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Search, Heart, PlusCircle, MinusCircle, Trash2 } from 'lucide-react';
import { Link } from 'react-router';
import { toast } from 'sonner';

interface ProductProps {
    order: number;
    name: string;
    images: string;
    description: string;
    price: string;
}

interface HeaderProps {
    shoppingCartProducts: ProductProps[];
    shoppingCartProductCounts: any;
    favoriteProducts: ProductProps[];
    onSearch?: (query: string) => void;
    setShoppingCartProductCounts: React.Dispatch<React.SetStateAction<any>>;
    setShoppingCartProducts: React.Dispatch<React.SetStateAction<ProductProps[]>>;
}

export default function Header({
    shoppingCartProducts, 
    shoppingCartProductCounts, 
    favoriteProducts, 
    onSearch,
    setShoppingCartProductCounts,
    setShoppingCartProducts
}: HeaderProps) {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (onSearch) {
            onSearch(searchQuery);
        }
    };

    const calculateTotal = () => {
        return shoppingCartProducts
            .reduce((total: number, product: any) => {
                const price = parseFloat(product.price.replace(/[^0-9.]/g, ''));
                return total + (price * shoppingCartProductCounts[product.order]);
            }, 0).toFixed(2);
    };
    
    const handleIncreaseQuantity = (productOrder: number) => {
        setShoppingCartProductCounts((prev: any) => ({
          ...prev,
          [productOrder]: (prev[productOrder] || 0) + 1,
        }));
        toast.success("Quantity increased");
    };
    
    const handleDecreaseQuantity = (productOrder: number) => {
        if (shoppingCartProductCounts[productOrder] > 1) {
          setShoppingCartProductCounts((prev: any) => ({
            ...prev,
            [productOrder]: prev[productOrder] - 1,
          }));
          toast.success("Quantity decreased");
        } else {
          handleRemoveFromCart(productOrder);
        }
    };
    
    const handleRemoveFromCart = (productOrder: number) => {
        setShoppingCartProducts((prev) =>
          prev.filter((product) => product.order !== productOrder)
        );
        
        setShoppingCartProductCounts((prev: any) => {
          const newCounts = { ...prev };
          delete newCounts[productOrder];
          return newCounts;
        });
        
        toast.success("Product removed from cart");
    };

    return (
        <header className='flex gap-3 items-center justify-between py-3 px-3 md:px-10 mb-10 fixed top-0 left-0 right-0 z-50 bg-white shadow-sm'>
            <h1 className='text-2xl font-bold'>Jot-Commerce</h1>
            
            <form onSubmit={handleSearchSubmit} className='flex max-w-[50rem] w-full'>
                <Input 
                    type='search' 
                    className='rounded-r-none'
                    placeholder='Search products...'
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
                <Button 
                    type="submit" 
                    className='rounded-l-none'
                >
                    <Search className="h-4 w-4" />
                </Button>
            </form>

            <div className="flex gap-2">
                <Link to="/favorites">
                    <Button className='relative'>
                        <Heart strokeWidth={3} />
                        {favoriteProducts.length > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                                {favoriteProducts.length}
                            </span>
                        )}
                    </Button>
                </Link>
                
                <Sheet>
                    <SheetTrigger asChild>
                        <Button className='relative'>
                            <ShoppingCart strokeWidth={3} />
                            {shoppingCartProducts.length > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                                    {shoppingCartProducts.reduce((total, product) => total + shoppingCartProductCounts[product.order], 0)}
                                </span>
                            )}
                        </Button>
                    </SheetTrigger>
                    <SheetContent className="w-[300px] sm:w-[400px]">
                        <SheetHeader>
                            <SheetTitle className="flex justify-between mt-3">
                                <span>Shopping Cart</span>
                                <span className="font-black">
                                    ${calculateTotal()}
                                </span>
                            </SheetTitle>
                        </SheetHeader>
                        <div className="py-4 overflow-y-auto max-h-[calc(100vh-200px)]">
                            {shoppingCartProducts.length === 0 ? (
                                <div className="text-center py-6 text-gray-500">
                                    Your cart is empty
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {shoppingCartProducts.map((product) => (
                                        <div key={product.order} className="flex flex-col py-2 border-b">
                                            <div className="flex items-center gap-2">
                                                <div className="w-10 h-10 rounded-md overflow-hidden">
                                                    <img 
                                                        src={JSON.parse(product.images)[0]} 
                                                        alt={product.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="font-medium truncate w-40">{product.name}</div>
                                                    <div className="text-sm text-gray-500">
                                                        ${product.price}
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleRemoveFromCart(product.order)}
                                                    className="h-8 w-8"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            <div className="flex items-center mt-2">
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={() => handleDecreaseQuantity(product.order)}
                                                        className="h-8 w-8"
                                                    >
                                                        <MinusCircle className="h-4 w-4" />
                                                    </Button>
                                                    <span className="text-center w-8">
                                                        {shoppingCartProductCounts[product.order]}
                                                    </span>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={() => handleIncreaseQuantity(product.order)}
                                                        className="h-8 w-8"
                                                    >
                                                        <PlusCircle className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <SheetFooter>
                            <Button className="w-full" asChild>
                                <Link to="/cart">View Cart</Link>
                            </Button>
                        </SheetFooter>
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    )
}
