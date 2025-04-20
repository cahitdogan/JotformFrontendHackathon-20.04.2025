import React, { useState } from 'react';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from '../components/ui/input';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';

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
}

export default function Header({shoppingCartProducts, shoppingCartProductCounts}: HeaderProps) {
    const [isShoppingCartOpen, setIsShoppingCartOpen] = useState(false);

    return (
        <header className='flex items-center justify-between py-3 px-10 mb-10'>
            <h1 className='text-2xl font-bold'>Shop Brand</h1>
            <NavigationMenu>
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <NavigationMenuTrigger>Item One</NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <NavigationMenuLink>Link</NavigationMenuLink>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
            <Input type='search' className='max-w-96' />
            
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <Button onClick={() => setIsShoppingCartOpen(!isShoppingCartOpen)}>
                        <ShoppingCart strokeWidth={3} />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='w-96 md:w-72'>
                    <DropdownMenuLabel>Shopping Cart</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {
                        shoppingCartProducts.length === 0 ? (
                            <DropdownMenuItem disabled>
                                There are no products in the cart.
                            </DropdownMenuItem>
                        ) : (
                            shoppingCartProducts.map((product:ProductProps) => {
                                return (
                                    <DropdownMenuItem className='flex justify-between' key={product.order}>
                                        <span className='flex gap-2'>
                                            <span className='font-bold'>{shoppingCartProductCounts[product.order]}</span>
                                            {product.name}
                                        </span>
                                        <span className='font-bold'>{product.price}</span>
                                    </DropdownMenuItem>
                                );
                            })
                        )
                    }
                </DropdownMenuContent>
            </DropdownMenu>
        </header>
    )
}
