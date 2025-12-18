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
      <div className="relative h-[500px] md:h-[600px]">
        {products.map((product, index) => (
          <div
            key={product.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
            onClick={() => handleProductClick(product.slug)}
          >
            {/* Product Image */}
            <div className="relative w-full h-full cursor-pointer group">
              <img
                src={getPrimaryImage(product)}
                alt={product.name}
                className="w-full h-full object-cover"
              />

              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              {/* Product Info Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 text-white">
                <h2 className="text-3xl md:text-5xl font-bold mb-4 drop-shadow-lg">
                  {product.name}
                </h2>

                <div className="flex items-center gap-4 mb-4">
                  {product.compare_at_price && (
                    <span className="text-lg md:text-xl text-white/80 line-through">
                      R$ {product.compare_at_price.toFixed(2)}
                    </span>
                  )}
                  <span className="text-3xl md:text-4xl font-bold">
                    R$ {product.price.toFixed(2)}
                  </span>
                </div>

                <Button
                  variant="hero"
                  size="lg"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleProductClick(product.slug);
                  }}
                >
                  VER DETALHES
                </Button>
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
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full h-12 w-12 backdrop-blur-sm z-10"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full h-12 w-12 backdrop-blur-sm z-10"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>

          {/* Dots Indicator */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {products.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentSlide
                    ? "bg-white w-8"
                    : "bg-white/50"
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
