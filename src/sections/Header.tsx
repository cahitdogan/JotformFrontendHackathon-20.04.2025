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

export default function Header() {
    const [isShoppingCartOpen, setIsShoppingCartOpen] = useState(false);

    return (
        <header className='flex items-center justify-between p-2'>
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
                    
                </DropdownMenuContent>
            </DropdownMenu>
        </header>
    )
}
