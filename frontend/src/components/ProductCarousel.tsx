import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
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

const ProductCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products?limit=8');
      const allProducts = response.data.products || [];

      // Randomizar e pegar 4 produtos
      const shuffled = allProducts.sort(() => Math.random() - 0.5);
      setProducts(shuffled.slice(0, 4));
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (products.length > 0) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % products.length);
      }, 4000);
      return () => clearInterval(timer);
    }
  }, [products.length]);

  const nextProduct = () => {
    setCurrentIndex((prev) => (prev + 1) % products.length);
  };

  const prevProduct = () => {
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
  };

  const getPrimaryImage = (product: Product) => {
    const primaryImage = product.images?.find(img => img.is_primary);
    return primaryImage?.image_url || product.images?.[0]?.image_url || "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=800";
  };

  const handleProductClick = (slug: string) => {
    navigate(`/product/${slug}`);
  };

  if (loading) {
    return (
      <section className="py-12 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-lg text-muted-foreground">Carregando produtos...</p>
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Produtos em Destaque
          </h2>
          <p className="text-muted-foreground">
            Confira nossa seleção especial
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden rounded-2xl shadow-lg bg-card">
            <div className="relative h-[500px] md:h-[600px]">
              {products.map((product, index) => (
                <div
                  key={product.id}
                  className={`absolute inset-0 transition-opacity duration-700 ${
                    index === currentIndex ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <div
                    onClick={() => handleProductClick(product.slug)}
                    className="h-full cursor-pointer group"
                  >
                    {/* Product Image */}
                    <div className="relative h-[70%] overflow-hidden">
                      <img
                        src={getPrimaryImage(product)}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-60" />
                    </div>

                    {/* Product Info */}
                    <div className="h-[30%] p-6 flex flex-col justify-center items-center text-center bg-gradient-to-b from-card to-secondary">
                      <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-3 line-clamp-2">
                        {product.name}
                      </h3>

                      <div className="flex items-center gap-3 mb-4">
                        {product.compare_at_price && (
                          <span className="text-lg text-muted-foreground line-through">
                            R$ {product.compare_at_price.toFixed(2)}
                          </span>
                        )}
                        <span className="text-3xl md:text-4xl font-bold text-primary">
                          R$ {product.price.toFixed(2)}
                        </span>
                      </div>

                      <Button
                        size="lg"
                        className="min-w-[200px]"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleProductClick(product.slug);
                        }}
                      >
                        <ShoppingCart className="h-5 w-5 mr-2" />
                        Ver Produto
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          {products.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={prevProduct}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/90 hover:bg-background text-foreground rounded-full h-12 w-12 shadow-lg z-10"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={nextProduct}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/90 hover:bg-background text-foreground rounded-full h-12 w-12 shadow-lg z-10"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>

              {/* Dots Indicator */}
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex gap-2">
                {products.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === currentIndex
                        ? "bg-primary w-8"
                        : "bg-muted-foreground/50"
                    }`}
                    aria-label={`Ver produto ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductCarousel;
