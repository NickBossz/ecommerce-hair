import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Lock, Mail, Phone, Camera } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const Profile = () => {
  const navigate = useNavigate();
  const { user, profile, updateProfile, loading } = useAuth();
  const [updating, setUpdating] = useState(false);

  // Dados pessoais
  const [personalData, setPersonalData] = useState({
    full_name: "",
    phone: "",
  });

  // Dados de segurança
  const [securityData, setSecurityData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Email
  const [emailData, setEmailData] = useState({
    newEmail: "",
    password: "",
  });

  // Redirecionar se não estiver logado
  useEffect(() => {
    if (!loading && !user) {
      toast.error("Você precisa estar logado para acessar esta página");
      navigate("/login");
    }
  }, [user, loading, navigate]);

  // Carregar dados do perfil
  useEffect(() => {
    if (profile) {
      setPersonalData({
        full_name: profile.full_name || "",
        phone: profile.phone || "",
      });
    }
  }, [profile]);

  const handleUpdatePersonalInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const { error } = await updateProfile({
        full_name: personalData.full_name,
        phone: personalData.phone,
      });

      if (error) {
        toast.error("Erro ao atualizar informações: " + error.message);
      } else {
        toast.success("Informações atualizadas com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      toast.error("Erro ao atualizar informações");
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (securityData.newPassword !== securityData.confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }

    if (securityData.newPassword.length < 6) {
      toast.error("A nova senha deve ter no mínimo 6 caracteres");
      return;
    }

    // TODO: Implement password update endpoint in backend
    toast.info("Funcionalidade de alteração de senha será implementada em breve");
    setSecurityData({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!emailData.newEmail) {
      toast.error("Digite o novo email");
      return;
    }

    // TODO: Implement email update endpoint in backend
    toast.info("Funcionalidade de alteração de email será implementada em breve");
    setEmailData({ newEmail: "", password: "" });
  };

  const getInitials = () => {
    if (!profile?.full_name) return "U";
    return profile.full_name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-lg text-muted-foreground">Carregando...</p>
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
            <div className="mb-8 flex items-center gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profile?.avatar_url || ""} />
                <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-foreground mb-1">
                  {profile?.full_name || "Meu Perfil"}
                </h1>
                <p className="text-muted-foreground">{user?.email}</p>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="personal">
                  <User className="h-4 w-4 mr-2" />
                  Informações Pessoais
                </TabsTrigger>
                <TabsTrigger value="security">
                  <Lock className="h-4 w-4 mr-2" />
                  Segurança
                </TabsTrigger>
              </TabsList>

              {/* TAB: Informações Pessoais */}
              <TabsContent value="personal">
                <Card>
                  <CardHeader>
                    <CardTitle>Dados Pessoais</CardTitle>
                    <CardDescription>
                      Atualize suas informações pessoais
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleUpdatePersonalInfo} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="full_name">Nome Completo</Label>
                        <Input
                          id="full_name"
                          type="text"
                          value={personalData.full_name}
                          onChange={(e) =>
                            setPersonalData({ ...personalData, full_name: e.target.value })
                          }
                          placeholder="Seu nome completo"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={user?.email || ""}
                          disabled
                          className="bg-muted"
                        />
                        <p className="text-xs text-muted-foreground">
                          Para alterar o email, use a aba "Segurança"
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Telefone</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={personalData.phone}
                          onChange={(e) =>
                            setPersonalData({ ...personalData, phone: e.target.value })
                          }
                          placeholder="(00) 00000-0000"
                        />
                      </div>

                      <div className="flex gap-3 pt-4">
                        <Button type="submit" disabled={updating}>
                          {updating ? "Salvando..." : "Salvar Alterações"}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => navigate("/")}
                        >
                          Cancelar
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* TAB: Segurança */}
              <TabsContent value="security" className="space-y-6">
                {/* Alterar Senha */}
                <Card>
                  <CardHeader>
                    <CardTitle>Alterar Senha</CardTitle>
                    <CardDescription>
                      Mantenha sua conta segura com uma senha forte
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleUpdatePassword} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="new-password">Nova Senha</Label>
                        <Input
                          id="new-password"
                          type="password"
                          value={securityData.newPassword}
                          onChange={(e) =>
                            setSecurityData({ ...securityData, newPassword: e.target.value })
                          }
                          placeholder="Mínimo 6 caracteres"
                          minLength={6}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                        <Input
                          id="confirm-password"
                          type="password"
                          value={securityData.confirmPassword}
                          onChange={(e) =>
                            setSecurityData({
                              ...securityData,
                              confirmPassword: e.target.value,
                            })
                          }
                          placeholder="Digite a senha novamente"
                          minLength={6}
                        />
                      </div>

                      <Button type="submit" disabled={updating}>
                        {updating ? "Alterando..." : "Alterar Senha"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* Alterar Email */}
                <Card>
                  <CardHeader>
                    <CardTitle>Alterar Email</CardTitle>
                    <CardDescription>
                      Atualize o email associado à sua conta
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleUpdateEmail} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="current-email">Email Atual</Label>
                        <Input
                          id="current-email"
                          type="email"
                          value={user?.email || ""}
                          disabled
                          className="bg-muted"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="new-email">Novo Email</Label>
                        <Input
                          id="new-email"
                          type="email"
                          value={emailData.newEmail}
                          onChange={(e) =>
                            setEmailData({ ...emailData, newEmail: e.target.value })
                          }
                          placeholder="novo@email.com"
                        />
                      </div>

                      <Button type="submit" disabled={updating}>
                        {updating ? "Enviando..." : "Enviar Email de Confirmação"}
                      </Button>

                      <p className="text-xs text-muted-foreground">
                        Você receberá um email de confirmação no novo endereço
                      </p>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
