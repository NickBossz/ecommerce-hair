import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Trash2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface WishlistItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  image_url: string;
  in_stock: boolean;
  stock_quantity: number;
}

const Wishlist = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loadingWishlist, setLoadingWishlist] = useState(true);

  // Redirecionar se não estiver logado
  useEffect(() => {
    if (!loading && !user) {
      toast.error("Você precisa estar logado para acessar sua wishlist");
      navigate("/login");
    }
  }, [user, loading, navigate]);

  // Carregar wishlist
  useEffect(() => {
    if (user) {
      loadWishlist();
    }
  }, [user]);

  const loadWishlist = async () => {
    setLoadingWishlist(true);
    try {
      // TODO: Implement real API call to fetch wishlist
      // For now, using data from localStorage
      const stored = localStorage.getItem("wishlist");
      if (stored) {
        setWishlistItems(JSON.parse(stored));
      } else {
        setWishlistItems([]);
      }
    } catch (error) {
      console.error("Erro ao carregar wishlist:", error);
      toast.error("Erro ao carregar lista de desejos");
      setWishlistItems([]);
    } finally {
      setLoadingWishlist(false);
    }
  };

  const saveWishlistToStorage = (items: WishlistItem[]) => {
    try {
      localStorage.setItem("wishlist", JSON.stringify(items));
      setWishlistItems(items);
    } catch (error) {
      console.error("Erro ao salvar wishlist:", error);
    }
  };

  const removeFromWishlist = (itemId: string) => {
    const item = wishlistItems.find((i) => i.id === itemId);
    const updatedItems = wishlistItems.filter((item) => item.id !== itemId);
    saveWishlistToStorage(updatedItems);
    if (item) {
      toast.success(`${item.name} removido da wishlist`);
    }
  };

  const clearWishlist = () => {
    saveWishlistToStorage([]);
    toast.success("Wishlist limpa com sucesso");
  };

  if (loading || loadingWishlist) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-lg text-muted-foreground">Carregando wishlist...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 py-12 bg-background">
          <div className="container mx-auto px-4">
            <Card className="max-w-md mx-auto">
              <CardContent className="p-12 text-center">
                <div className="mb-6 flex justify-center">
                  <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
                    <Heart className="h-12 w-12 text-muted-foreground" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Sua wishlist está vazia
                </h2>
                <p className="text-muted-foreground mb-6">
                  Adicione produtos favoritos para acompanhar mais tarde
                </p>
                <Button size="lg" onClick={() => navigate("/shop")} className="w-full">
                  Explorar produtos
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-12 bg-gradient-to-b from-background to-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-1">
                  Minha Wishlist
                </h1>
                <p className="text-muted-foreground">
                  {wishlistItems.length} {wishlistItems.length === 1 ? "produto" : "produtos"} na sua lista de desejos
                </p>
              </div>
              <Button variant="outline" onClick={() => navigate("/perfil")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar ao Perfil
              </Button>
            </div>

            {/* Wishlist Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {wishlistItems.map((item) => (
                <Card key={item.id} className="overflow-hidden group">
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-full object-cover cursor-pointer transition-transform duration-300 group-hover:scale-110"
                      onClick={() => navigate(`/product/${item.slug}`)}
                    />
                    {!item.in_stock && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="bg-destructive text-destructive-foreground px-4 py-2 rounded-lg font-semibold">
                          Fora de Estoque
                        </span>
                      </div>
                    )}
                    <button
                      className="absolute top-3 right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors"
                      onClick={() => removeFromWishlist(item.id)}
                      title="Remover da wishlist"
                    >
                      <Heart className="h-5 w-5 fill-red-500 text-red-500" />
                    </button>
                  </div>
                  <CardContent className="p-4">
                    <h3
                      className="font-semibold text-foreground mb-2 line-clamp-2 cursor-pointer hover:text-primary"
                      onClick={() => navigate(`/product/${item.slug}`)}
                    >
                      {item.name}
                    </h3>
                    <p className="text-2xl font-bold text-primary mb-4">
                      R$ {item.price.toFixed(2)}
                    </p>
                    <Button
                      variant="outline"
                      className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => removeFromWishlist(item.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remover da Wishlist
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Actions */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {wishlistItems.filter((item) => item.in_stock).length} produtos disponíveis
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={clearWishlist}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Limpar Wishlist
                    </Button>
                    <Button onClick={() => navigate("/shop")}>
                      Continuar Comprando
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Wishlist;
