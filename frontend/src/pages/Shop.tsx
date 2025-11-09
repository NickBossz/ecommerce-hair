import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Filter, ArrowUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import api from "@/services/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  compare_at_price?: number;
  images: Array<{ image_url: string; is_primary: boolean }>;
  is_featured: boolean;
  category?: { id: string; name: string; slug: string };
  category_id?: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  product_count?: number;
}

const Shop = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [sortBy, setSortBy] = useState<string>("");
  const [showFilters, setShowFilters] = useState(true);

  const searchQuery = searchParams.get('search') || '';
  const categoryQuery = searchParams.get('category') || '';

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [searchQuery, categoryQuery]);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data.categories || []);
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    setError(false);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (categoryQuery) params.append('category', categoryQuery);
      const queryString = params.toString() ? `?${params.toString()}` : '';
      const response = await api.get(`/products${queryString}`);
      setProducts(response.data.products || []);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      setError(true);
      setProducts([]);
      toast.error('Não foi possível conectar ao servidor. Verifique sua conexão.');
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = (productsList: Product[]) => {
    let filtered = productsList;

    if (categoryQuery) {
      filtered = filtered.filter(p => p.category?.slug === categoryQuery);
    }

    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategories.length > 0) {
      filtered = filtered.filter(p => p.category_id && selectedCategories.includes(p.category_id));
    }

    filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    return filtered;
  };

  const sortProducts = (productsList: Product[]) => {
    if (!sortBy) return productsList;

    const sorted = [...productsList];

    if (sortBy === "price_asc") {
      return sorted.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price_desc") {
      return sorted.sort((a, b) => b.price - a.price);
    }

    return sorted;
  };

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(c => c !== categoryId)
        : [...prev, categoryId]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 1000]);
    setSortBy("");
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
  };

  const getPrimaryImage = (product: Product) => {
    const primaryImage = product.images?.find(img => img.is_primary);
    return primaryImage?.image_url || product.images?.[0]?.image_url || "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=400";
  };

  const getCategoryName = (slug: string) => {
    const categories: Record<string, string> = {
      'laces-frontais': 'Laces e Frontais',
      'perucas': 'Perucas',
      'mega-hair': 'Mega Hair',
      'acessorios': 'Acessórios',
      'cuidados': 'Produtos de Cuidado',
    };
    return categories[slug] || slug;
  };

  const getPageTitle = () => {
    if (searchQuery) return `Resultados para "${searchQuery}"`;
    if (categoryQuery) return getCategoryName(categoryQuery);
    return 'Todos os Produtos';
  };

  const filteredProducts = sortProducts(filterProducts(products));

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-12 bg-background">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-2">
                  {getPageTitle()}
                </h1>
                <p className="text-muted-foreground">
                  {loading ? 'Carregando...' : `${filteredProducts.length} ${filteredProducts.length === 1 ? 'produto encontrado' : 'produtos encontrados'}`}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="lg:hidden"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </Button>
            </div>

            {/* Sort Select */}
            <div className="flex items-center gap-2">
              <Label className="text-sm font-medium whitespace-nowrap">Ordenar por:</Label>
              <Select value={sortBy || "none"} onValueChange={setSortBy}>
                <SelectTrigger className="w-[220px]">
                  <SelectValue placeholder="Padrão" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Padrão</SelectItem>
                  <SelectItem value="price_asc">Menor Preço</SelectItem>
                  <SelectItem value="price_desc">Maior Preço</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-8">
            {/* Filters Sidebar */}
            <aside className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-64 flex-shrink-0`}>
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-foreground">Filtros</h2>
                    {(selectedCategories.length > 0 || priceRange[0] !== 0 || priceRange[1] !== 1000 || sortBy) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="text-xs"
                      >
                        Limpar
                      </Button>
                    )}
                  </div>

                  {/* Category Filter */}
                  <div className="mb-6">
                    <h3 className="font-semibold text-foreground mb-3">Categoria</h3>
                    <Select
                      value={selectedCategories[0] || "all"}
                      onValueChange={(value) => {
                        if (value === "all") {
                          setSelectedCategories([]);
                        } else {
                          setSelectedCategories([value]);
                        }
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Todas as categorias" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas as categorias</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                            {category.product_count !== undefined && ` (${category.product_count})`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Price Filter */}
                  <div>
                    <h3 className="font-semibold text-foreground mb-3">Preço</h3>
                    <div className="space-y-4">
                      <Slider
                        value={priceRange}
                        onValueChange={(value) => setPriceRange(value as [number, number])}
                        max={1000}
                        step={10}
                        className="w-full"
                      />
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>R$ {priceRange[0]}</span>
                        <span>R$ {priceRange[1]}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              {error ? (
                <div className="text-center py-12">
                  <p className="text-lg text-red-600 mb-4">Erro ao conectar com o servidor</p>
                  <p className="text-muted-foreground mb-6">Não foi possível carregar os produtos. Verifique se o backend está rodando.</p>
                  <Button onClick={fetchProducts}>
                    Tentar Novamente
                  </Button>
                </div>
              ) : loading ? (
                <div className="text-center py-12">
                  <p className="text-lg text-muted-foreground">Carregando produtos...</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-lg text-muted-foreground">Nenhum produto encontrado.</p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={clearFilters}
                  >
                    Limpar Filtros
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {filteredProducts.map((product, index) => (
                <Card
                  key={product.id}
                  className="group overflow-hidden border-border hover:border-primary transition-all duration-300 hover:shadow-pink cursor-pointer"
                  onClick={() => navigate(`/product/${product.slug}`)}
                >
                  <CardContent className="p-0 relative overflow-hidden">
                    {(product.compare_at_price || index < 4) && (
                      <Badge className="absolute top-2 left-2 z-10 bg-accent text-accent-foreground text-xs">
                        {getBadgeText(product, index)}
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 z-10 bg-background/80 hover:bg-background text-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToWishlist(product);
                      }}
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                    <div className="aspect-square overflow-hidden bg-muted">
                      <img
                        src={getPrimaryImage(product)}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col items-start p-3 gap-2 bg-gradient-card">
                    <h3 className="font-semibold text-sm text-foreground line-clamp-2 min-h-[2.5rem]">
                      {product.name}
                    </h3>
                    <div className="flex flex-col gap-1 w-full">
                      {product.compare_at_price && (
                        <span className="text-xs text-muted-foreground line-through">
                          R$ {product.compare_at_price.toFixed(2)}
                        </span>
                      )}
                      <div className="flex items-center justify-between w-full">
                        <span className="text-lg font-bold text-primary">
                          R$ {product.price.toFixed(2)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        3x de R$ {(product.price / 3).toFixed(2)}
                      </p>
                    </div>
                  </CardFooter>
                  </Card>
                ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Shop;
