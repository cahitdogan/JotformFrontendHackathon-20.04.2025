import React, { useEffect, useState } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Fullscreen } from 'lucide-react';
import { toast } from 'sonner';

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
}

export default function Products({
    setIsProductImageDialogVisible,
    setActiveImageForDialog,
    setShoppingCartProducts,
    shoppingCartProducts,
    shoppingCartProductCounts,
    setShoppingCartProductCounts,
}: ProductsPromps) {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const getProducts = async () => {
            const apiKey = import.meta.env.VITE_JOTFORM_API_KEY;
            const response = await fetch(`https://api.jotform.com/form/251074186142957/payment-info?apiKey={${apiKey}}`);
            if (!response.ok) {
                console.log("productlar çekilemedi.")
            }
            const data = await response.json();
            setProducts(data.content.products);
        }

        getProducts();
    }, []);


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

    return (
        <section className='flex flex-col gap-7 items-center md:flex-row md:flex-wrap md:justify-center'>
            {
                products.map((product: ProductProps) => {
                    const imageUrls = JSON.parse(product.images);
                    const firstImage = imageUrls[0];

                    return (
                        <Card key={product.order} className='w-72 gap-5 relative '>
                            <Button 
                                onClick={ () => openImageDialog(firstImage) }
                                className='absolute right-3 top-8 rounded-full w-10 h-10 hover:w-12 hover:h-12'>
                                <Fullscreen />
                            </Button>
                            <img
                                className='h-60 object-cover'
                                src={firstImage}
                                alt={product.description}
                            />
                            <CardHeader className='h-16'>
                                <CardTitle>{product.name}</CardTitle>
                                <CardDescription>{product.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className='font-bold text-xl'>{product.price}</p>
                            </CardContent>
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
                                
                                <Button className='w-1/2' variant={"outline"}>Favorite</Button>
                            </CardFooter>
                        </Card>
                    );
                })
            }
        </section>
    );
}
