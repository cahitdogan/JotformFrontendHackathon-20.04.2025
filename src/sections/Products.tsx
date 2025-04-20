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

interface ProductProps {
    order: number;
    name: string;
    images: string;
    description: string;
    price: string;
}

export default function Products() {
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

    return (
        <section className='flex flex-col gap-7 items-center md:flex-row md:flex-wrap md:justify-center'>
            {
                products.map((product: ProductProps) => {
                    const imageUrls = JSON.parse(product.images);
                    const firstImage = imageUrls[0];

                    return (
                        <Card key={product.order} className='w-72 gap-5 relative '>
                            <Button className='absolute right-3 top-8 rounded-full w-10 h-10 hover:w-12 hover:h-12'>
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
                                <Button className='w-1/2'>Add to Card</Button>
                                <Button className='w-1/2' variant={"outline"}>Favorite</Button>
                            </CardFooter>
                        </Card>
                    );
                })
            }
        </section>
    );
}
