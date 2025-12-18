import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import api from "@/services/api";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  compare_at_price?: number;
  images: Array<{ image_url: string; is_primary: boolean }>;
}

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products?limit=12');
      const allProducts: Product[] = response.data.products || [];

      // Randomizar e pegar 5 produtos para o carrossel
      const shuffled = allProducts.sort(() => Math.random() - 0.5);
      setProducts(shuffled.slice(0, 5));
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const getPrimaryImage = (product: Product) => {
    const primaryImage = product.images?.find(img => img.is_primary);
    return primaryImage?.image_url || product.images?.[0]?.image_url || "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=800";
  };

  useEffect(() => {
    if (products.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % products.length);
      }, 4000);
      return () => clearInterval(timer);
    }
  }, [products.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % products.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + products.length) % products.length);
  };

  const handleProductClick = (slug: string) => {
    navigate(`/product/${slug}`);
  };

  if (loading) {
    return (
      <div className="relative w-full overflow-hidden bg-gradient-hero">
        <div className="relative h-[400px] md:h-[600px] flex items-center justify-center">
          <p className="text-primary-foreground text-lg">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden bg-gradient-hero">
      <div className="relative h-[400px] md:h-[600px]">
        {products.map((product, index) => (
          <div
            key={product.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="grid md:grid-cols-2 h-full">
              {/* Text Content */}
              <div className="flex flex-col justify-center px-6 md:px-12 lg:px-20 py-8 animate-fade-in">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-4 leading-tight">
                  {product.name}
                </h1>

                <div className="mb-6">
                  {product.compare_at_price && (
                    <p className="text-lg text-primary-foreground/70 line-through mb-2">
                      De: R$ {product.compare_at_price.toFixed(2)}
                    </p>
                  )}
                  <p className="text-4xl md:text-5xl font-bold text-primary-foreground">
                    R$ {product.price.toFixed(2)}
                  </p>
                  <p className="text-sm text-primary-foreground/80 mt-2">
                    ou 3x de R$ {(product.price / 3).toFixed(2)}
                  </p>
                </div>

                <div>
                  <Button
                    variant="hero"
                    size="xl"
                    onClick={() => handleProductClick(product.slug)}
                  >
                    VER DETALHES
                  </Button>
                </div>
              </div>

              {/* Image */}
              <div className="relative hidden md:block">
                <img
                  src={getPrimaryImage(product)}
                  alt={product.name}
                  className="absolute inset-0 w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-l from-transparent to-primary/20" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      {products.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background text-foreground rounded-full h-12 w-12"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background text-foreground rounded-full h-12 w-12"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>

          {/* Dots Indicator */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {products.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentSlide
                    ? "bg-primary-foreground w-8"
                    : "bg-primary-foreground/50"
                }`}
                aria-label={`Ver produto ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default HeroCarousel;
