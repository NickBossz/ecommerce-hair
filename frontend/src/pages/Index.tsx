import Navbar from "@/components/Navbar";
import HeroCarousel from "@/components/HeroCarousel";
import BenefitsSection from "@/components/BenefitsSection";
import ProductsSection from "@/components/ProductsSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroCarousel />
        <ProductsSection />
        <BenefitsSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
