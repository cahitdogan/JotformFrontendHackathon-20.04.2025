import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { Fullscreen, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

interface ProductProps {
  order: number;
  name: string;
  images: string;
  description: string;
  price: string;
}

interface ProductDetailProps {
  setShoppingCartProducts: any;
  shoppingCartProducts: object[];
  shoppingCartProductCounts: any;
  setShoppingCartProductCounts: any;
  setIsProductImageDialogVisible: any;
  setActiveImageForDialog: any;
}

export default function ProductDetail({
  setShoppingCartProducts,
  shoppingCartProducts,
  shoppingCartProductCounts,
  setShoppingCartProductCounts,
  setIsProductImageDialogVisible,
  setActiveImageForDialog,
}: ProductDetailProps) {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductProps | null>(null);
  const [loading, setLoading] = useState(true);
  const formID = '251074186142957';

  useEffect(() => {
    const getProduct = async () => {
      setLoading(true);
      try {
        const apiKey = import.meta.env.VITE_JOTFORM_API_KEY;
        const response = await fetch(`https://api.jotform.com/form/${formID}/payment-info?apiKey={${apiKey}}`);
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        const foundProduct = data.content.products.find((p: ProductProps) => p.order.toString() === productId);
        
        if (foundProduct) {
          setProduct(foundProduct);
        } else {
          toast.error("Product not found");
          navigate("/");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Error loading product details");
      } finally {
        setLoading(false);
      }
    };

    getProduct();
  }, [productId, navigate]);

  function openImageDialog(imageUrl: string) {
    setIsProductImageDialogVisible(true);
    setActiveImageForDialog(imageUrl);
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
      setShoppingCartProducts(shoppingCartProducts.filter((item: any) => item.order !== product.order));
      setShoppingCartProductCounts((prev: any) => {
        const newCounts = { ...prev };
        delete newCounts[product.order];
        return newCounts;
      });
    }
    
    toast("Product removed from cart.");
  }

  if (loading) {
    return <div className="flex justify-center items-center h-screen mt-16">Loading...</div>;
  }

  if (!product) {
    return <div className="flex justify-center items-center h-screen mt-16">Product not found</div>;
  }

  const imageUrls = JSON.parse(product.images);

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <Button variant="outline" className="mb-6" onClick={() => navigate(-1)}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div className="relative">
          <div className="relative">
            <img
              src={imageUrls[0]}
              alt={product.name}
              className="w-full h-auto rounded-lg object-cover max-h-[500px]"
            />
            <Button 
              onClick={() => openImageDialog(imageUrls[0])}
              className="absolute right-3 top-3 rounded-full w-10 h-10"
            >
              <Fullscreen />
            </Button>
          </div>
          
          {imageUrls.length > 1 && (
            <div className="grid grid-cols-4 gap-2 mt-4">
              {imageUrls.map((url: string, index: number) => (
                <div key={index} className="relative cursor-pointer">
                  <img
                    src={url}
                    alt={`${product.name} view ${index + 1}`}
                    className="w-full h-20 object-cover rounded"
                    onClick={() => openImageDialog(url)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-xl font-semibold mb-4">{product.price}</p>
          <div className="my-6">
            <h2 className="text-xl font-medium mb-2">Description</h2>
            <p className="text-gray-700">{product.description}</p>
          </div>
          
          <div className="mt-8">
            {!shoppingCartProductCounts[product.order] ? (
              <Button className="w-full" onClick={() => addProductToCart(product)}>
                Add to Cart
              </Button>
            ) : (
              <div className="flex gap-4 items-center">
                <span className="font-medium">Quantity: {shoppingCartProductCounts[product.order]}</span>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => addProductToCart(product)}>
                    +
                  </Button>
                  <Button variant="outline" onClick={() => removeProductFromCart(product)}>
                    -
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 