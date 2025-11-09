import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Truck, Shield, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import api from "@/services/api";

interface ProductImage {
  id: string;
  image_url: string;
  alt_text?: string;
  display_order: number;
  is_primary: boolean;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  short_description?: string;
  price: number;
  compare_at_price?: number;
  stock_quantity: number;
  is_featured: boolean;
  images: ProductImage[];
  category?: {
    id: string;
    name: string;
    slug: string;
  };
}

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(false);
      const response = await api.get(`/products/slug/${slug}`);
      setProduct(response.data.product);

      // Fetch related products
      if (response.data.product?.category?.id) {
        const relatedResponse = await api.get(`/products?category=${response.data.product.category.id}&limit=4`);
        setRelatedProducts(relatedResponse.data.products.filter((p: Product) => p.id !== response.data.product.id));
      }
    } catch (error) {
      console.error('Erro ao buscar produto:', error);
      setError(true);
      setProduct(null);
      toast.error('Não foi possível conectar ao servidor. Verifique sua conexão.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToWishlist = () => {
    if (!product) return;
    // TODO: Implement real wishlist functionality
    toast.success(`${product.name} adicionado aos favoritos!`);
  };

  const getDiscount = () => {
    if (product?.compare_at_price && product.compare_at_price > product.price) {
      return Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100);
    }
    return 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-lg text-muted-foreground">Carregando produto...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            {error ? (
              <>
                <p className="text-lg text-red-600 mb-2">Erro ao conectar com o servidor</p>
                <p className="text-muted-foreground mb-4">Não foi possível carregar o produto. Verifique se o backend está rodando.</p>
                <div className="flex gap-3 justify-center">
                  <Button onClick={fetchProduct}>Tentar Novamente</Button>
                  <Button variant="outline" onClick={() => navigate('/shop')}>Voltar para a loja</Button>
                </div>
              </>
            ) : (
              <>
                <p className="text-lg text-muted-foreground mb-4">Produto não encontrado</p>
                <Button onClick={() => navigate('/shop')}>Voltar para a loja</Button>
              </>
            )}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const primaryImage = product.images.find(img => img.is_primary) || product.images[0];
  const sortedImages = [...product.images].sort((a, b) => a.display_order - b.display_order);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-8 bg-background">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <div className="mb-6 text-sm text-muted-foreground">
            <button onClick={() => navigate('/')} className="hover:text-primary">Home</button>
            <span className="mx-2">/</span>
            <button onClick={() => navigate('/shop')} className="hover:text-primary">Loja</button>
            {product.category && (
              <>
                <span className="mx-2">/</span>
                <button
                  onClick={() => navigate(`/shop?category=${product.category?.slug}`)}
                  className="hover:text-primary"
                >
                  {product.category.name}
                </button>
              </>
            )}
            <span className="mx-2">/</span>
            <span className="text-foreground">{product.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
                <img
                  src={sortedImages[selectedImage]?.image_url || primaryImage?.image_url}
                  alt={sortedImages[selectedImage]?.alt_text || product.name}
                  className="w-full h-full object-cover"
                />
                {getDiscount() > 0 && (
                  <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground">
                    {getDiscount()}% OFF
                  </Badge>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {sortedImages.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {sortedImages.map((image, index) => (
                    <button
                      key={image.id}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                        selectedImage === index ? 'border-primary' : 'border-transparent hover:border-border'
                      }`}
                    >
                      <img
                        src={image.image_url}
                        alt={image.alt_text || `${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">{product.name}</h1>
                {product.short_description && (
                  <p className="text-muted-foreground">{product.short_description}</p>
                )}
              </div>

              {/* Price */}
              <div>
                {product.compare_at_price && (
                  <span className="text-lg text-muted-foreground line-through block">
                    R$ {product.compare_at_price.toFixed(2)}
                  </span>
                )}
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-primary">
                    R$ {product.price.toFixed(2)}
                  </span>
                  {getDiscount() > 0 && (
                    <Badge className="bg-accent text-accent-foreground">
                      {getDiscount()}% OFF
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  ou 3x de R$ {(product.price / 3).toFixed(2)} sem juros
                </p>
              </div>

              {/* Stock Status */}
              <div>
                {product.stock_quantity > 0 ? (
                  <p className="text-sm text-green-600">
                    ✓ Em estoque ({product.stock_quantity} unidades disponíveis)
                  </p>
                ) : (
                  <p className="text-sm text-red-600">✗ Produto esgotado</p>
                )}
              </div>

              {/* Action Buttons */}
              <div>
                <Button
                  size="lg"
                  className="w-full"
                  onClick={handleAddToWishlist}
                  disabled={product.stock_quantity === 0}
                >
                  <Heart className="h-5 w-5 mr-2" />
                  Adicionar aos Favoritos
                </Button>
              </div>

              {/* Benefits */}
              <div className="border-t border-border pt-6 space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Truck className="h-5 w-5 text-primary" />
                  <span className="text-muted-foreground">Frete grátis acima de R$ 199</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Shield className="h-5 w-5 text-primary" />
                  <span className="text-muted-foreground">Compra 100% segura</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <RotateCcw className="h-5 w-5 text-primary" />
                  <span className="text-muted-foreground">7 dias para devolução</span>
                </div>
              </div>
            </div>
          </div>

          {/* Product Description */}
          <div className="mb-12">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-foreground mb-4">Descrição do Produto</h2>
                <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-line">
                  {product.description}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">Produtos Relacionados</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <Card
                    key={relatedProduct.id}
                    className="group overflow-hidden border-border hover:border-primary transition-all duration-300 hover:shadow-pink cursor-pointer"
                    onClick={() => navigate(`/product/${relatedProduct.slug}`)}
                  >
                    <CardContent className="p-0">
                      <div className="aspect-square overflow-hidden bg-muted">
                        <img
                          src={relatedProduct.images[0]?.image_url}
                          alt={relatedProduct.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-foreground line-clamp-2 mb-2">
                          {relatedProduct.name}
                        </h3>
                        <div className="flex flex-col gap-1">
                          {relatedProduct.compare_at_price && (
                            <span className="text-sm text-muted-foreground line-through">
                              R$ {relatedProduct.compare_at_price.toFixed(2)}
                            </span>
                          )}
                          <span className="text-xl font-bold text-primary">
                            R$ {relatedProduct.price.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
