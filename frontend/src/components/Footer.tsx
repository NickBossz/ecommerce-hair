import { Facebook, Instagram, Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import Logo from "@/components/Logo";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";

const Footer = () => {
  const { settings } = useSiteSettings();

  return (
    <footer className="bg-gradient-to-b from-background to-secondary border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Logo e Descrição */}
          <div className="space-y-4">
            <Logo size="md" />
            <p className="text-muted-foreground text-sm">
              {settings.site_description || "Especialistas em laces, wigs e apliques de alta qualidade. Realce sua beleza e autoestima com nossos produtos premium."}
            </p>
          </div>

          {/* Atendimento */}
          <div>
            <h4 className="text-lg font-bold text-foreground mb-4">Atendimento</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href={`tel:${settings.contact_phone}`} className="flex items-center text-muted-foreground hover:text-primary transition-colors">
                  <Phone className="h-4 w-4 mr-2" />
                  {settings.contact_phone || "(11) 9999-9999"}
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${settings.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-muted-foreground hover:text-primary transition-colors"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  WhatsApp
                </a>
              </li>
              <li>
                <a href={`mailto:${settings.contact_email}`} className="flex items-center text-muted-foreground hover:text-primary transition-colors">
                  <Mail className="h-4 w-4 mr-2" />
                  {settings.contact_email || "contato@fabhair.com.br"}
                </a>
              </li>
              <li>
                <a
                  href={settings.maps_link || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-muted-foreground hover:text-primary transition-colors"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  {settings.address_street ? `${settings.address_street}, ${settings.address_neighborhood}` : "Nossa loja física"}
                </a>
              </li>
            </ul>
          </div>

          {/* Links Úteis */}
          <div>
            <h4 className="text-lg font-bold text-foreground mb-4">Links Úteis</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Quem Somos
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Como Comprar
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Política de Troca
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Frete e Entrega
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Perguntas Frequentes
                </a>
              </li>
            </ul>
          </div>

          {/* Redes Sociais */}
          <div>
            <h4 className="text-lg font-bold text-foreground mb-4">Redes Sociais</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Siga-nos para novidades e promoções exclusivas
            </p>
            <div className="flex gap-3">
              {settings.instagram && (
                <a
                  href={settings.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-primary text-primary-foreground p-3 rounded-full hover:bg-primary/90 transition-all hover:scale-110 shadow-soft"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
              )}
              {settings.facebook && (
                <a
                  href={settings.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-primary text-primary-foreground p-3 rounded-full hover:bg-primary/90 transition-all hover:scale-110 shadow-soft"
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Pagamento e Segurança */}
        <div className="border-t border-border pt-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center md:text-left">
            <div>
              <h5 className="font-semibold text-foreground mb-3">Formas de Pagamento</h5>
              <p className="text-sm text-muted-foreground">
                Cartão de Crédito, Pix, Boleto Bancário
              </p>
            </div>
            <div>
              <h5 className="font-semibold text-foreground mb-3">Compra Segura</h5>
              <p className="text-sm text-muted-foreground">
                Site protegido com certificado SSL
              </p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-border pt-6 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {settings.site_name || "FabHair"}. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
