import { Truck, Shield } from "lucide-react";

const BenefitsSection = () => {
  const benefits = [
    {
      icon: Truck,
      title: "ENVIAMOS SUAS COMPRAS",
      description: "Entrega em todo o Brasil",
    },
    {
      icon: Shield,
      title: "COMPRE COM SEGURANÇA",
      description: "Seus dados sempre protegidos",
    },
  ];

  return (
    <section className="py-12 bg-gradient-card">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={index}
                className="flex flex-col items-center text-center p-6 rounded-xl bg-card shadow-soft hover:shadow-pink transition-all duration-300 hover:scale-105 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="bg-gradient-primary p-4 rounded-full mb-4">
                  <Icon className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">
                  {benefit.title}
                </h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
