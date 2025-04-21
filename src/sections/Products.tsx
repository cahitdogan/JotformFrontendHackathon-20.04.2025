import { useEffect, useState, FormEvent } from 'react';
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
import { Input } from '@/components/ui/input';
import { Link } from 'react-router';
import { Skeleton } from "@/components/ui/skeleton";
import HeroSection from './HeroSection';

interface ProductProps {
    order: number;
    name: string;
    images: string;
    description: string;
    price: string;
}

interface ProductsPromps {
    setIsProductImageDialogVisible: any;
    setActiveImageForDialog: any;
    setShoppingCartProducts: any;
    shoppingCartProducts: object[];
    shoppingCartProductCounts: any;
    setShoppingCartProductCounts: any;
    favoriteProducts: ProductProps[];
    setFavoriteProducts: any;
    searchQuery: string;
}

export default function Products({
    setIsProductImageDialogVisible,
    setActiveImageForDialog,
    setShoppingCartProducts,
    shoppingCartProducts,
    shoppingCartProductCounts,
    setShoppingCartProductCounts,
    favoriteProducts,
    setFavoriteProducts,
    searchQuery,
}: ProductsPromps) {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [displayedProducts, setDisplayedProducts] = useState<ProductProps[]>([]);
    const [fullName, setFullName] = useState('');
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(false);
    const [productsLoading, setProductsLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const productsPerPage = 8;
    const formID = '251074186142957';

    // Define shimmer animation styles
    const shimmerStyle = {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        transform: 'translateX(-100%)',
        background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0) 100%)',
        animation: 'shimmer 2s infinite',
    } as React.CSSProperties;

    // Add shimmer keyframes to document if not already present
    useEffect(() => {
        if (!document.querySelector('#shimmer-keyframes')) {
            const style = document.createElement('style');
            style.id = 'shimmer-keyframes';
            style.innerHTML = `
                @keyframes shimmer {
                    0% {
                        transform: translateX(-100%);
                    }
                    100% {
                        transform: translateX(100%);
                    }
                }
                @keyframes pulse {
                    0%, 100% {
                        opacity: 0.6;
                    }
                    50% {
                        opacity: 1;
                    }
                }
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }, []);

    useEffect(() => {
        const getProducts = async () => {
            setProductsLoading(true);
            const apiKey = import.meta.env.VITE_JOTFORM_API_KEY;
            const response = await fetch(`https://api.jotform.com/form/${formID}/payment-info?apiKey={${apiKey}}`);
            if (!response.ok) {
                console.log("productlar çekilemedi.")
            }
            const data = await response.json();
            setProducts(data.content.products);
            setFilteredProducts(data.content.products);
            setProductsLoading(false);
        }

        getProducts();
    }, []);

    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredProducts(products);
            setPage(1);
            return;
        }
        
        const query = searchQuery.toLowerCase();
        const filtered = products.filter((product: ProductProps) => 
            product.name.toLowerCase().includes(query) || 
            product.description.toLowerCase().includes(query)
        );
        
        setFilteredProducts(filtered);
        setPage(1);
    }, [searchQuery, products]);

    // Update displayed products when filtered products or page changes
    useEffect(() => {
        const endIndex = page * productsPerPage;
        setDisplayedProducts(filteredProducts.slice(0, endIndex));
    }, [filteredProducts, page]);

    function loadMoreProducts() {
        setLoadingMore(true);
        setTimeout(() => {
            setPage(prev => prev + 1);
            setLoadingMore(false);
        }, 300); // Simulate network delay
    }

    function openImageDialog(imageUrl:string) {
        setIsProductImageDialogVisible(true);
        setActiveImageForDialog(imageUrl);
    }

    function addProductToCart(product:ProductProps) {
        const productExists = shoppingCartProducts.some((item: any) => item.order === product.order);
        
        if (productExists) {
            setShoppingCartProductCounts((prev:any) => ({
                ...prev,
                [product.order]: (prev[product.order] || 0) + 1
            }));
        } else {
            setShoppingCartProducts([...shoppingCartProducts, product]);
            setShoppingCartProductCounts((prev:any) => ({
                ...prev,
                [product.order]: 1
            }));
        }
        
        toast("Product successfully added to cart.");
    }

    function removeProductFromCart(product:ProductProps) {
        if (shoppingCartProductCounts[product.order] > 1) {
            setShoppingCartProductCounts((prev:any) => ({
                ...prev,
                [product.order]: prev[product.order] - 1
            }));
        } else {
            // Remove product completely when count reaches 0
            setShoppingCartProducts(shoppingCartProducts.filter((item: any) => item.order !== product.order));
            setShoppingCartProductCounts((prev:any) => {
                const newCounts = { ...prev };
                delete newCounts[product.order];
                return newCounts;
            });
        }
        
        toast("Product removed from cart.");
    }

    function toggleFavorite(product: ProductProps) {
        const isProductFavorite = favoriteProducts.some((item: any) => item.order === product.order);
        
        if (isProductFavorite) {
            setFavoriteProducts(favoriteProducts.filter((item: any) => item.order !== product.order));
            toast("Product removed from favorites.");
        } else {
            setFavoriteProducts([...favoriteProducts, product]);
            toast("Product added to favorites.");
        }
    }

    function isProductFavorite(productOrder: number) {
        return favoriteProducts.some((item: any) => item.order === productOrder);
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const apiKey = import.meta.env.VITE_JOTFORM_API_KEY;
            
            const questionsResponse = await fetch(`https://api.jotform.com/form/${formID}/questions?apiKey=${apiKey}`);
            if (!questionsResponse.ok) {
                throw new Error('Failed to fetch form questions');
            }
            
            const questionsData = await questionsResponse.json();
            const questions = questionsData.content;
            
            let nameQuestionId = '';
            let addressQuestionId = '';
            let productsQuestionId = '';
            

            Object.keys(questions).forEach(qid => {
                const question = questions[qid];
                if (question.name === 'fullName' || question.text.includes('Full Name')) {
                    nameQuestionId = qid;
                } else if (question.name === 'address' || question.text.includes('Address')) {
                    addressQuestionId = qid;
                } else if (question.type === 'control_cart' || question.text.includes('Products')) {
                    productsQuestionId = qid;
                }
            });

            // Prepare form data
            const formData = new FormData();
            formData.append(`submission[${nameQuestionId}]`, fullName);
            formData.append(`submission[${addressQuestionId}]`, address);
            

            if (productsQuestionId && shoppingCartProducts.length > 0) {
                const cartProducts = shoppingCartProducts.map((product: any) => ({
                    name: product.name,
                    quantity: shoppingCartProductCounts[product.order],
                    price: product.price.replace(/[^0-9.]/g, '')
                }));
                
                formData.append(`submission[${productsQuestionId}]`, JSON.stringify(cartProducts));
            }
            

            const submitResponse = await fetch(`https://api.jotform.com/form/${formID}/submissions?apiKey=${apiKey}`, {
                method: 'POST',
                body: formData,
            });
            
            if (!submitResponse.ok) {
                throw new Error('Form submission failed');
            }
            
            toast('Order submitted successfully!');
            // Reset form
            setFullName('');
            setAddress('');
            setShoppingCartProducts([]);
            setShoppingCartProductCounts({});
            
        } catch (error) {
            console.error('Submission error:', error);
            toast('Failed to submit the form. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Skeleton component for loading state
    const ProductSkeleton = () => (
        <Card className='w-72 gap-5 relative overflow-hidden'>
            {/* Fullscreen button skeleton */}
            <div className='absolute right-3 top-8 rounded-full w-10 h-10 z-10 bg-white/80 flex items-center justify-center'>
                <Skeleton className='w-5 h-5 rounded-full' />
            </div>
            
            {/* Image skeleton with shimmer effect */}
            <div className="relative">
                <Skeleton className='h-60 w-full mb-4 relative overflow-hidden' />
                <div style={shimmerStyle} />
            </div>
            
            <CardHeader className='h-16 px-4 pb-0'>
                <Skeleton className='h-6 w-3/4 mb-2' />
                <Skeleton className='h-4 w-11/12' />
            </CardHeader>
            
            <CardContent className="px-4 py-2">
                <Skeleton className='h-7 w-24 font-bold' />
            </CardContent>
            
            <CardFooter className='flex justify-around gap-2 px-4 py-4'>
                <div className="relative w-1/2">
                    <Skeleton className='h-10 w-full rounded-md' />
                    <div style={shimmerStyle} />
                </div>
                <div className="relative w-1/2">
                    <Skeleton className='h-10 w-full rounded-md' />
                    <div style={shimmerStyle} />
                </div>
            </CardFooter>
        </Card>
    );

    return (
        <>
        <HeroSection />
        <section className='mt-24 flex flex-col gap-7 items-center md:flex-row md:flex-wrap md:justify-center'>
            {productsLoading ? (
                // Display enhanced skeleton UI during loading
                Array(productsPerPage).fill(0).map((_, index) => (
                    <ProductSkeleton key={`skeleton-${index}`} />
                ))
            ) : displayedProducts.length === 0 ? (
                <div className="text-center w-full py-10">
                    <h2 className="text-xl font-semibold">No products found</h2>
                    <p className="text-gray-500">Try another search term</p>
                </div>
            ) : (
                displayedProducts.map((product: ProductProps, index: number) => {
                    const imageUrls = JSON.parse(product.images);
                    const firstImage = imageUrls[0];
                    const isFavorite = isProductFavorite(product.order);

                    return (
                        <Card 
                            key={product.order} 
                            className='w-72 gap-5 relative'
                            style={{
                                animation: 'fadeIn 0.5s ease forwards',
                                animationDelay: `${index * 0.05}s`,
                                opacity: 0
                            }}
                        >
                            <Button 
                                onClick={ () => openImageDialog(firstImage) }
                                className='absolute right-3 top-8 rounded-full w-10 h-10 hover:w-12 hover:h-12 z-10'>
                                <Fullscreen />
                            </Button>
                            <Link to={`/product/${product.order}`} className="cursor-pointer block flex flex-col gap-4">
                                <img
                                    className='h-60 object-cover block w-full mb-4'
                                    src={firstImage}
                                    srcSet={`${firstImage}?width=300 300w, ${firstImage}?width=600 600w`}
                                    sizes="(max-width: 768px) 100vw, 300px"
                                    loading="lazy"
                                    decoding="async"
                                    fetchPriority="low"
                                    alt={product.description}
                                />
                                <CardHeader className='h-16'>
                                    <CardTitle>{product.name}</CardTitle>
                                    <CardDescription>{product.description}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className='font-bold text-xl'>${product.price}</p>
                                </CardContent>
                            </Link>
                            <CardFooter className='flex justify-around gap-2'>
                                {
                                    !shoppingCartProductCounts[product.order]
                                    ?
                                    <Button className='w-1/2' onClick={()=>addProductToCart(product)}>Add to Cart</Button>
                                    : (
                                    <div className='flex gap-1'>
                                        <Button className='w-1/6 cursor-none'>
                                            {shoppingCartProductCounts[product.order]}
                                        </Button>
                                        <Button variant={'outline'} className='w-1/6' onClick={()=>addProductToCart(product)}>
                                            +
                                        </Button>
                                        <Button variant={'outline'} className='w-1/6' onClick={()=>removeProductFromCart(product)}>
                                            -
                                        </Button>
                                    </div>
                                    )
                                }
                                
                                <Button 
                                    className='w-1/2' 
                                    variant={isFavorite ? "default" : "outline"}
                                    onClick={() => toggleFavorite(product)}
                                >
                                    <Heart className={isFavorite ? "fill-white" : ""} />
                                </Button>
                            </CardFooter>
                        </Card>
                    );
                })
            )}
        </section>
        
        {/* Load More Button with enhanced loading state */}
        {displayedProducts.length > 0 && displayedProducts.length < filteredProducts.length && (
            <div className="flex justify-center my-8">
                <Button 
                    onClick={loadMoreProducts} 
                    disabled={loadingMore}
                    variant="outline"
                    className="px-8 relative overflow-hidden"
                >
                    {loadingMore ? (
                        <>
                            <span className="opacity-0">Load More Products</span>
                            <div className="absolute inset-0 flex items-center justify-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                        </>
                    ) : 'Load More Products'}
                </Button>
            </div>
        )}
        
        {productsLoading ? (
            // Enhanced skeleton for order summary during loading
            <>
                <div className='bg-gray-400 h-px my-10'></div>
                <div className='mb-10 px-2 flex flex-col items-center gap-4'>
                    <div className="relative">
                        <Skeleton className="h-8 w-40 mb-2" />
                        <div style={shimmerStyle} />
                    </div>
                    
                    <div className="flex flex-col items-center gap-2 w-80 max-w-96">
                        <div className="w-full">
                            <div className="relative self-start">
                                <Skeleton className="h-5 w-24 mb-1" />
                                <div style={shimmerStyle} />
                            </div>
                            <div className="relative">
                                <Skeleton className="h-10 w-full rounded-md" />
                                <div style={shimmerStyle} />
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex flex-col items-center gap-2 w-80 max-w-96">
                        <div className="w-full">
                            <div className="relative self-start">
                                <Skeleton className="h-5 w-16 mb-1" />
                                <div style={shimmerStyle} />
                            </div>
                            <div className="relative">
                                <Skeleton className="h-10 w-full rounded-md" />
                                <div style={shimmerStyle} />
                            </div>
                        </div>
                    </div>
                    
                    <div className="relative mt-2">
                        <Skeleton className="h-10 w-28 rounded-md" />
                        <div style={shimmerStyle} />
                    </div>
                </div>
            </>
        ) : (
            <>
            <div className='bg-gray-400 h-px my-10'></div>
            <form onSubmit={handleSubmit} className='mb-10 px-2 flex flex-col items-center gap-2'>
                <p className="font-bold text-xl">Total Cost: $
                    {shoppingCartProducts.reduce((total: number, product: any) => {
                        const price = parseFloat(product.price.replace(/[^0-9.]/g, ''));
                        return total + (price * shoppingCartProductCounts[product.order]);
                    }, 0).toFixed(2)}
                </p>
                <label>
                    Full Name
                    <Input 
                        className='w-80 max-w-96' 
                        type="text" 
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                    />
                </label>
                <label>
                    Address
                    <Input 
                        className='w-80 max-w-96' 
                        type="text" 
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                </label>
                <Button type='submit' disabled={loading}>
                    {loading ? (
                        <>
                            <span className="opacity-0">Submit</span>
                            <div className="absolute inset-0 flex items-center justify-center gap-1">
                                <div className="h-1.5 w-1.5 rounded-full bg-white animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                <div className="h-1.5 w-1.5 rounded-full bg-white animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                <div className="h-1.5 w-1.5 rounded-full bg-white animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                        </>
                    ) : 'Submit'}
                </Button>
            </form>
            </>
        )}
        </>
    );
}
