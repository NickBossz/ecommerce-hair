import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import api from "@/services/api";

interface Category {
  id: string;
  name: string;
  slug: string;
  image_url?: string;
  description?: string;
}

interface Slide {
  id: string;
  image: string;
  title: string;
  description: string;
  categorySlug: string;
}

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      const categories: Category[] = response.data.categories || [];

      // Criar slides a partir das categorias
      const categorySlides = categories.slice(0, 5).map((category) => ({
        id: category.id,
        image: category.image_url || "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=800",
        title: category.name.toUpperCase(),
        description: category.description || `Confira nossa coleção exclusiva de ${category.name.toLowerCase()} com os melhores produtos para realçar sua beleza!`,
        categorySlug: category.slug,
      }));

      setSlides(categorySlides);
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      // Fallback para slides padrão
      setSlides([
        {
          id: "1",
          image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800",
          title: "PRODUTOS EXCLUSIVOS",
          description: "Descubra nossa seleção especial de produtos com qualidade garantida e os melhores preços!",
          categorySlug: "todos",
        },
        {
          id: "2",
          image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800",
          title: "NOVIDADES",
          description: "Confira os lançamentos mais recentes e fique por dentro das tendências!",
          categorySlug: "novidades",
        },
        {
          id: "3",
          image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800",
          title: "OFERTAS ESPECIAIS",
          description: "Aproveite nossas promoções e garanta produtos incríveis com descontos exclusivos!",
          categorySlug: "ofertas",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slides.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleSlideClick = (categorySlug: string) => {
    navigate(`/shop?category=${categorySlug}`);
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
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="grid md:grid-cols-2 h-full">
              {/* Text Content */}
              <div className="flex flex-col justify-center px-6 md:px-12 lg:px-20 py-8 animate-fade-in">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-4 leading-tight">
                  {slide.title}
                </h1>
                <p className="text-base md:text-lg text-primary-foreground/80 mb-8 max-w-xl leading-relaxed">
                  {slide.description}
                </p>
                <div>
                  <Button
                    variant="hero"
                    size="xl"
                    onClick={() => handleSlideClick(slide.categorySlug)}
                  >
                    VER PRODUTOS
                  </Button>
                </div>
              </div>

              {/* Image */}
              <div className="relative hidden md:block">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="absolute inset-0 w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-l from-transparent to-primary/20" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      {slides.length > 1 && (
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
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentSlide
                    ? "bg-primary-foreground w-8"
                    : "bg-primary-foreground/50"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default HeroCarousel;
