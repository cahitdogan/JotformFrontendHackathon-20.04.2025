import React, { useEffect, useState, FormEvent } from 'react';
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
import { Input } from '@/components/ui/input';
import { Link } from 'react-router';

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
    searchQuery: string;
}

export default function Products({
    setIsProductImageDialogVisible,
    setActiveImageForDialog,
    setShoppingCartProducts,
    shoppingCartProducts,
    shoppingCartProductCounts,
    setShoppingCartProductCounts,
    searchQuery,
}: ProductsPromps) {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [fullName, setFullName] = useState('');
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(false);
    const formID = '251074186142957';

    useEffect(() => {
        const getProducts = async () => {
            const apiKey = import.meta.env.VITE_JOTFORM_API_KEY;
            const response = await fetch(`https://api.jotform.com/form/${formID}/payment-info?apiKey={${apiKey}}`);
            if (!response.ok) {
                console.log("productlar çekilemedi.")
            }
            const data = await response.json();
            setProducts(data.content.products);
            setFilteredProducts(data.content.products);
        }

        getProducts();
    }, []);

    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredProducts(products);
            return;
        }
        
        const query = searchQuery.toLowerCase();
        const filtered = products.filter((product: ProductProps) => 
            product.name.toLowerCase().includes(query) || 
            product.description.toLowerCase().includes(query)
        );
        
        setFilteredProducts(filtered);
    }, [searchQuery, products]);

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

    return (
        <>
        <section className='mt-24 flex flex-col gap-7 items-center md:flex-row md:flex-wrap md:justify-center'>
            {filteredProducts.length === 0 ? (
                <div className="text-center w-full py-10">
                    <h2 className="text-xl font-semibold">No products found</h2>
                    <p className="text-gray-500">Try another search term</p>
                </div>
            ) : (
                filteredProducts.map((product: ProductProps) => {
                    const imageUrls = JSON.parse(product.images);
                    const firstImage = imageUrls[0];

                    return (
                        <Card key={product.order} className='w-72 gap-5 relative'>
                            <Button 
                                onClick={ () => openImageDialog(firstImage) }
                                className='absolute right-3 top-8 rounded-full w-10 h-10 hover:w-12 hover:h-12 z-10'>
                                <Fullscreen />
                            </Button>
                            <Link to={`/product/${product.order}`} className="cursor-pointer block flex flex-col gap-4">
                                <img
                                    className='h-60 object-cover block w-full mb-4'
                                    src={firstImage}
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
                                
                                <Button className='w-1/2' variant={"outline"}>Favorite</Button>
                            </CardFooter>
                        </Card>
                    );
                })
            )}
        </section>
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
                {loading ? 'Submitting...' : 'Submit'}
            </Button>
        </form>
        </>
    );
}
