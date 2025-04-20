import React, { useEffect, useState } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

interface ProductProps {
    order: number;
    name: string;
    images: string;
    description: string;
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
                        <Card key={product.order} className='h-min w-72'>
                            <img
                                className='h-60 object-cover'
                                src={firstImage}
                                alt={product.description}
                            />
                            <CardHeader>
                                <CardTitle>{product.name}</CardTitle>
                                <CardDescription>Card Description</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p>Card Content</p>
                            </CardContent>
                            <CardFooter>
                                <p>Card Footer</p>
                            </CardFooter>
                        </Card>
                    );
                })
            }
        </section>
    );
}
