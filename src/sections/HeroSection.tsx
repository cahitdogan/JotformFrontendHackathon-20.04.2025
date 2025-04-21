import { useState, useEffect } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';

interface ProductProps {
  order: number;
  name: string;
  images: string;
  description: string;
  price: string;
}

export default function HeroSection() {
  const [api, setApi] = useState<any>(null);
  const [current, setCurrent] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState<ProductProps[]>([]);
  const [loading, setLoading] = useState(true);
  const formID = '251074186142957';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const apiKey = import.meta.env.VITE_JOTFORM_API_KEY;
        const response = await fetch(`https://api.jotform.com/form/${formID}/payment-info?apiKey={${apiKey}}`);
        
        if (!response.ok) {
          console.error("Failed to fetch products");
          return;
        }
        
        const data = await response.json();
        // Get 3 products for the hero carousel
        const products = data.content.products.slice(0, 3);
        setFeaturedProducts(products);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (!api) return;

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  // Art-themed content for each slide
  const artContent = [
    {
      title: "Classic Masterpieces",
      description: "Discover timeless artworks from the world's greatest painters",
      badge: "FEATURED",
      buttonText: "Explore Collection",
      buttonLink: "#products"
    },
    {
      title: "Modern Art Exhibition",
      description: "Contemporary art that challenges perceptions and inspires creativity",
      badge: "NEW ARRIVALS",
      buttonText: "View Gallery",
      buttonLink: "#products"
    },
    {
      title: "Limited Edition Prints",
      description: "Exclusive reproductions of famous paintings in museum quality",
      badge: "LIMITED STOCK",
      buttonText: "Shop Now",
      buttonLink: "#products"
    }
  ];

  return (
    <section className="relative overflow-hidden mb-16 rounded-xl mt-24">
      {loading ? (
        <div className="w-full h-[500px] flex items-center justify-center bg-gray-100">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-gray-500">Loading gallery...</p>
          </div>
        </div>
      ) : (
        <Carousel 
          setApi={setApi}
          className="w-full"
          opts={{
            loop: true,
            dragFree: true
          }}
        >
          <CarouselContent>
            {featuredProducts.map((product, index) => {
              const imageUrls = JSON.parse(product.images);
              const heroImage = imageUrls[0]; // Use the first image from each product
              const content = artContent[index];
              
              return (
                <CarouselItem key={product.order}>
                  <div className="relative h-[500px] md:h-[600px] w-full overflow-hidden">
                    {/* Background Image with Overlay */}
                    <div 
                      className="absolute inset-0 bg-cover bg-center" 
                      style={{ 
                        backgroundImage: `url(${heroImage})`,
                      }}
                    >
                      <div className="absolute inset-0 bg-black/40" />
                    </div>
                    
                    {/* Content */}
                    <div className="relative h-full flex flex-col justify-center px-6 md:px-20 max-w-7xl mx-auto z-10">
                      <div className="max-w-2xl text-white">
                        <Badge className="mb-4 bg-primary hover:bg-primary/90">{content.badge}</Badge>
                        <h1 className="text-4xl md:text-6xl font-bold mb-4">{content.title}</h1>
                        <p className="text-lg md:text-xl mb-8 opacity-90">{content.description}</p>
                        <Button asChild size="lg" className="group">
                          <Link to={`/product/${product.order}`}>
                            {content.buttonText}
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          
          <div className="absolute z-10 bottom-8 left-0 right-0">
            <div className="flex justify-center gap-2">
              {featuredProducts.map((_, index) => (
                <button
                  key={index}
                  onClick={() => api?.scrollTo(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    current === index ? "bg-white scale-125" : "bg-white/50"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
          
          <CarouselPrevious className="left-4 bg-white/20 hover:bg-white/30 border-none text-white" />
          <CarouselNext className="right-4 bg-white/20 hover:bg-white/30 border-none text-white" />
        </Carousel>
      )}
    </section>
  );
} 