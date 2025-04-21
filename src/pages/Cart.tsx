import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { MinusCircle, PlusCircle, Trash2 } from "lucide-react";

interface ProductProps {
  order: number;
  name: string;
  images: string;
  description: string;
  price: string;
}

interface CartProps {
  shoppingCartProducts: ProductProps[];
  shoppingCartProductCounts: any;
  setShoppingCartProductCounts: React.Dispatch<React.SetStateAction<any>>;
  setShoppingCartProducts: React.Dispatch<React.SetStateAction<ProductProps[]>>;
}

export default function Cart({
  shoppingCartProducts,
  shoppingCartProductCounts,
  setShoppingCartProductCounts,
  setShoppingCartProducts,
}: CartProps) {
  const handleIncreaseQuantity = (productOrder: number) => {
    setShoppingCartProductCounts((prev: any) => ({
      ...prev,
      [productOrder]: (prev[productOrder] || 0) + 1,
    }));
  };

  const handleDecreaseQuantity = (productOrder: number) => {
    if (shoppingCartProductCounts[productOrder] > 1) {
      setShoppingCartProductCounts((prev: any) => ({
        ...prev,
        [productOrder]: prev[productOrder] - 1,
      }));
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

  const calculateTotal = () => {
    return shoppingCartProducts
      .reduce((total: number, product: ProductProps) => {
        const price = parseFloat(product.price.replace(/[^0-9.]/g, ""));
        return total + price * shoppingCartProductCounts[product.order];
      }, 0)
      .toFixed(2);
  };

  return (
    <div className="container mx-auto pt-24 pb-10">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
      
      {shoppingCartProducts.length === 0 ? (
        <div className="text-center py-10">
          <h2 className="text-xl font-medium mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Add some products to your cart to see them here.</p>
          <Button asChild>
            <a href="/">Continue Shopping</a>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {shoppingCartProducts.map((product) => (
              <Card key={product.order}>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                      <img
                        src={JSON.parse(product.images)[0]}
                        alt={product.name}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>
                    <div className="flex flex-col flex-1 justify-between">
                      <div>
                        <h3 className="text-lg font-medium">{product.name}</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          ${product.price}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDecreaseQuantity(product.order)}
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
                          >
                            <PlusCircle className="h-4 w-4" />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveFromCart(product.order)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${calculateTotal()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-2">
                <div className="flex justify-between font-semibold text-lg w-full">
                  <span>Total</span>
                  <span>${calculateTotal()}</span>
                </div>
                <Button className="w-full">Proceed to Checkout</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
} 