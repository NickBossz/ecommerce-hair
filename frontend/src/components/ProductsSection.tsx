import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import api from "@/services/api";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  compare_at_price?: number;
  images: Array<{ image_url: string; is_primary: boolean }>;
  is_featured: boolean;
}

const ProductsSection = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setError(false);
      const response = await api.get('/products/featured?limit=4');
      setProducts(response.data.products || []);
    } catch (error) {
      console.error('Erro ao buscar produtos em destaque:', error);
      setError(true);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const getBadgeText = (product: Product, index: number) => {
    if (product.compare_at_price && product.compare_at_price > product.price) {
      const discount = Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100);
      return `${discount}% OFF`;
    }
    const badges = ["NOVO", "DESTAQUE", "PROMOÇÃO", "OUTLET"];
    return badges[index % badges.length];
  };

  const handleAddToWishlist = (product: Product) => {
    toast.success(`${product.name} adicionado aos favoritos!`);
    // TODO: Implementar lógica real da wishlist
  };

  const getPrimaryImage = (product: Product) => {
    const primaryImage = product.images?.find(img => img.is_primary);
    return primaryImage?.image_url || product.images?.[0]?.image_url || "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=400";
  };

  if (error) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-lg text-red-600 mb-2">Erro ao conectar com o servidor</p>
            <p className="text-muted-foreground mb-4">Não foi possível carregar os produtos em destaque.</p>
            <Button onClick={fetchProducts} variant="outline">
              Tentar Novamente
            </Button>
          </div>
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-lg text-muted-foreground">Carregando produtos...</p>
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null; // Não renderiza a seção se não houver produtos
  }

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Produtos em Destaque
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Descubra nossa seleção especial de laces, wigs e apliques premium
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <Card
              key={product.id}
              className="group overflow-hidden border-border hover:border-primary transition-all duration-300 hover:shadow-pink animate-fade-in cursor-pointer"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => navigate(`/product/${product.slug}`)}
            >
              <CardContent className="p-0 relative overflow-hidden">
                <Badge className="absolute top-4 left-4 z-10 bg-accent text-accent-foreground">
                  {getBadgeText(product, index)}
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4 z-10 bg-background/80 hover:bg-background text-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToWishlist(product);
                  }}
                >
                  <Heart className="h-5 w-5" />
                </Button>
                <div className="aspect-square overflow-hidden bg-muted">
                  <img
                    src={getPrimaryImage(product)}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col items-start p-4 gap-3 bg-gradient-card">
                <h3 className="font-semibold text-foreground line-clamp-2 min-h-[3rem]">
                  {product.name}
                </h3>
                <div className="flex flex-col gap-1 w-full">
                  {product.compare_at_price && (
                    <span className="text-sm text-muted-foreground line-through">
                      R$ {product.compare_at_price.toFixed(2)}
                    </span>
                  )}
                  <div className="flex items-center justify-between w-full">
                    <span className="text-2xl font-bold text-primary">
                      R$ {product.price.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    ou 3x de R$ {(product.price / 3).toFixed(2)}
                  </p>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button
            variant="outline"
            size="lg"
            className="min-w-[200px]"
            onClick={() => navigate('/shop')}
          >
            Ver Todos os Produtos
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
