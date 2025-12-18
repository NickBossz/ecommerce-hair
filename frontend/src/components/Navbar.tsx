import { Search, User, Menu, Heart, LogOut, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Logo from "@/components/Logo";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/services/api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

const Navbar = () => {
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data || []);
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50 shadow-soft">
      {/* Main Navbar */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Logo size="md" />
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-4">
            <div className="relative">
              <Input
                type="search"
                placeholder="O que você está buscando?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-4 pr-12 h-12 rounded-full border-2 border-border focus:border-primary"
              />
              <Button
                type="submit"
                size="icon"
                variant="ghost"
                className="absolute right-1 top-1 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 h-10 w-10"
              >
                <Search className="h-5 w-5" />
              </Button>
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="hidden md:flex gap-2">
                    <User className="h-5 w-5" />
                    <div className="flex flex-col text-xs text-left">
                      <span className="text-primary font-semibold">
                        Olá, {profile?.full_name?.split(' ')[0] || 'Usuário'}
                      </span>
                      <span className="text-muted-foreground">Minha conta</span>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/perfil')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Meu Perfil</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/wishlist')}>
                    <Heart className="mr-2 h-4 w-4" />
                    <span>Lista de Desejos</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} className="text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden md:flex"
                  onClick={() => navigate('/login')}
                >
                  <User className="h-5 w-5" />
                </Button>
                <button
                  onClick={() => navigate('/login')}
                  className="hidden md:flex flex-col text-xs cursor-pointer"
                >
                  <span className="text-primary font-semibold">Olá! Faça login</span>
                  <span className="text-muted-foreground">ou cadastre-se</span>
                </button>
              </>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => navigate('/wishlist')}
            >
              <Heart className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Categories Menu */}
        <nav className="mt-4 border-t border-border pt-4">
          <div className="flex items-center gap-2 overflow-x-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="default" size="sm" className="flex-shrink-0">
                  <Menu className="h-4 w-4 mr-2" />
                  CATEGORIAS
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel>Navegue por Categoria</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/shop')}>
                  Todas as Categorias
                </DropdownMenuItem>
                {categories.map((category) => (
                  <DropdownMenuItem
                    key={category.id}
                    onClick={() => navigate(`/shop?category=${category.slug}`)}
                  >
                    {category.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="ghost"
              size="sm"
              className="flex-shrink-0"
              onClick={() => navigate('/')}
            >
              INÍCIO
            </Button>
            <div
              className="relative"
              onMouseEnter={() => setShowMegaMenu(true)}
              onMouseLeave={() => setShowMegaMenu(false)}
            >
              <Button
                variant="ghost"
                size="sm"
                className="flex-shrink-0"
                onClick={() => navigate('/shop')}
              >
                PRODUTOS
              </Button>

              {/* Mega Menu */}
              {showMegaMenu && categories.length > 0 && (
                <div className="absolute left-0 top-full pt-2 z-50">
                  <div className="bg-background border border-border rounded-lg shadow-lg p-6 w-[600px]">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {categories.map((category) => (
                        <div
                          key={category.id}
                          className="p-3 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer"
                          onClick={() => {
                            navigate(`/shop?category=${category.slug}`);
                            setShowMegaMenu(false);
                          }}
                        >
                          <h3 className="font-bold text-foreground mb-1">
                            {category.name}
                          </h3>
                          {category.description && (
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {category.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 pt-6 border-t border-border">
                      <Button
                        className="w-full"
                        onClick={() => {
                          navigate('/shop');
                          setShowMegaMenu(false);
                        }}
                      >
                        Ver Todos os Produtos
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="flex-shrink-0"
              onClick={() => navigate('/contato')}
            >
              CONTATO
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
