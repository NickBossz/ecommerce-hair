import { Search, User, Menu, Heart, LogOut, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Logo from "@/components/Logo";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [showMegaMenu, setShowMegaMenu] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const megaMenuCategories = [
    {
      name: "Laces e Frontais",
      slug: "laces-frontais",
      products: [
        { name: "Lace Frontal 13x4", slug: "lace-frontal-13x4" },
        { name: "Lace Frontal 13x6", slug: "lace-frontal-13x6" },
        { name: "Lace 360", slug: "lace-360" },
        { name: "Lace Closure 4x4", slug: "lace-closure-4x4" },
      ]
    },
    {
      name: "Perucas",
      slug: "perucas",
      products: [
        { name: "Peruca Lisa", slug: "peruca-lisa" },
        { name: "Peruca Cacheada", slug: "peruca-cacheada" },
        { name: "Peruca Afro", slug: "peruca-afro" },
        { name: "Peruca Bob", slug: "peruca-bob" },
      ]
    },
    {
      name: "Mega Hair",
      slug: "mega-hair",
      products: [
        { name: "Mega Hair Liso", slug: "mega-hair-liso" },
        { name: "Mega Hair Ondulado", slug: "mega-hair-ondulado" },
        { name: "Mega Hair Cacheado", slug: "mega-hair-cacheado" },
        { name: "Mega Hair Fita Adesiva", slug: "mega-hair-fita" },
      ]
    },
    {
      name: "Acessórios",
      slug: "acessorios",
      products: [
        { name: "Toucas", slug: "toucas" },
        { name: "Cola para Lace", slug: "cola-lace" },
        { name: "Escovas", slug: "escovas" },
        { name: "Presilhas", slug: "presilhas" },
      ]
    },
    {
      name: "Produtos de Cuidado",
      slug: "cuidados",
      products: [
        { name: "Shampoos", slug: "shampoos" },
        { name: "Condicionadores", slug: "condicionadores" },
        { name: "Máscaras", slug: "mascaras" },
        { name: "Óleos", slug: "oleos" },
      ]
    },
  ];

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
                <DropdownMenuItem onClick={() => navigate('/shop?category=laces-frontais')}>
                  Laces e Frontais
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/shop?category=perucas')}>
                  Perucas
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/shop?category=mega-hair')}>
                  Mega Hair
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/shop?category=acessorios')}>
                  Acessórios
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/shop?category=cuidados')}>
                  Produtos de Cuidado
                </DropdownMenuItem>
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
              {showMegaMenu && (
                <div className="absolute left-0 top-full pt-2 z-50">
                  <div className="bg-background border border-border rounded-lg shadow-lg p-6 w-[800px]">
                    <div className="grid grid-cols-3 gap-6">
                      {megaMenuCategories.map((category) => (
                        <div key={category.slug}>
                          <h3
                            className="font-bold text-foreground mb-3 cursor-pointer hover:text-primary"
                            onClick={() => {
                              navigate(`/shop?category=${category.slug}`);
                              setShowMegaMenu(false);
                            }}
                          >
                            {category.name}
                          </h3>
                          <ul className="space-y-2">
                            {category.products.map((product) => (
                              <li key={product.slug}>
                                <button
                                  className="text-sm text-muted-foreground hover:text-primary transition-colors text-left w-full"
                                  onClick={() => {
                                    navigate(`/shop?search=${encodeURIComponent(product.name)}`);
                                    setShowMegaMenu(false);
                                  }}
                                >
                                  {product.name}
                                </button>
                              </li>
                            ))}
                          </ul>
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
