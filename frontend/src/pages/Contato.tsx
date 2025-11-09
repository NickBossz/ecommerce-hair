import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone, Mail, Clock, MessageCircle, Instagram, Facebook, Youtube } from "lucide-react";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";

const Contato = () => {
  const navigate = useNavigate();
  const { settings, loading } = useSiteSettings();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 py-12 bg-gradient-to-b from-background to-muted">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto text-center">
              <p className="text-lg text-muted-foreground">Carregando informações de contato...</p>
            </div>
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
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-12 text-center">
              <h1 className="text-4xl font-bold text-foreground mb-4">Entre em Contato</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {settings.site_description || "Estamos aqui para ajudar! Entre em contato conosco através dos canais abaixo ou visite nossa loja física."}
              </p>
            </div>

            <div className="max-w-3xl mx-auto">
              {/* Contact Information */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Informações de Contato</CardTitle>
                    <CardDescription>
                      Encontre-nos através dos canais abaixo
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">Endereço</h3>
                        <p className="text-sm text-muted-foreground">
                          {settings.address_street || "Rua Exemplo, 123"}<br />
                          {settings.address_neighborhood || "Centro"}, {settings.address_city || "São Paulo"} - {settings.address_state || "SP"}<br />
                          CEP: {settings.address_zipcode || "01234-567"}
                        </p>
                        {settings.maps_link && (
                          <a
                            href={settings.maps_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline mt-2 inline-block"
                          >
                            Ver no Google Maps →
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Phone className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">Telefone</h3>
                        <a
                          href={`tel:${settings.contact_phone}`}
                          className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          {settings.contact_phone || "(11) 99999-9999"}
                        </a>
                      </div>
                    </div>

                    {settings.whatsapp && (
                      <div className="flex items-start gap-3">
                        <MessageCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                        <div>
                          <h3 className="font-semibold text-foreground mb-1">WhatsApp</h3>
                          <a
                            href={`https://wa.me/${settings.whatsapp}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-muted-foreground hover:text-primary transition-colors"
                          >
                            Clique aqui para conversar no WhatsApp
                          </a>
                        </div>
                      </div>
                    )}

                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">Email</h3>
                        <a
                          href={`mailto:${settings.contact_email}`}
                          className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          {settings.contact_email || "contato@fabhair.com.br"}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">Horário de Atendimento</h3>
                        <p className="text-sm text-muted-foreground whitespace-pre-line">
                          {settings.business_hours || "Segunda a Sexta: 9h - 18h\nSábado: 9h - 14h\nDomingo: Fechado"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Social Media */}
                <Card>
                  <CardHeader>
                    <CardTitle>Redes Sociais</CardTitle>
                    <CardDescription>
                      Siga-nos para novidades e promoções exclusivas
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-4">
                      {settings.instagram && (
                        <a
                          href={settings.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all hover:scale-105 shadow-soft"
                        >
                          <Instagram className="h-5 w-5" />
                          <span className="text-sm font-medium">Instagram</span>
                        </a>
                      )}
                      {settings.facebook && (
                        <a
                          href={settings.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all hover:scale-105 shadow-soft"
                        >
                          <Facebook className="h-5 w-5" />
                          <span className="text-sm font-medium">Facebook</span>
                        </a>
                      )}
                      {settings.youtube && (
                        <a
                          href={settings.youtube}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all hover:scale-105 shadow-soft"
                        >
                          <Youtube className="h-5 w-5" />
                          <span className="text-sm font-medium">YouTube</span>
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Call to Action */}
                <Card className="bg-primary text-primary-foreground">
                  <CardContent className="pt-6">
                    <h3 className="text-xl font-bold mb-2">Fale Conosco!</h3>
                    <p className="text-sm opacity-90 mb-4">
                      Entre em contato através do WhatsApp para atendimento rápido e personalizado.
                    </p>
                    {settings.whatsapp && (
                      <a
                        href={`https://wa.me/${settings.whatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button
                          size="lg"
                          variant="secondary"
                          className="w-full"
                        >
                          <MessageCircle className="h-5 w-5 mr-2" />
                          Abrir WhatsApp
                        </Button>
                      </a>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contato;
