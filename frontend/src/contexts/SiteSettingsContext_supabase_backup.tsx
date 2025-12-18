import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';

interface SiteSettings {
  site_name?: string;
  site_description?: string;
  contact_email?: string;
  contact_phone?: string;
  whatsapp?: string;
  address_street?: string;
  address_neighborhood?: string;
  address_city?: string;
  address_state?: string;
  address_zipcode?: string;
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  youtube?: string;
  business_hours?: string;
  maps_link?: string;
}

interface SiteSettingsContextType {
  settings: SiteSettings;
  loading: boolean;
  refetch: () => Promise<void>;
}

const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(undefined);

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>({});
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('site_settings')
        .select('key, value');

      if (error) throw error;

      const settingsObj: SiteSettings = {};
      data?.forEach((setting) => {
        // Supabase retorna JSONB já parseado
        settingsObj[setting.key as keyof SiteSettings] = setting.value || '';
      });

      setSettings(settingsObj);
    } catch (error) {
      console.error('Erro ao carregar configurações do site:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SiteSettingsContext.Provider value={{ settings, loading, refetch: fetchSettings }}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  const context = useContext(SiteSettingsContext);
  if (context === undefined) {
    throw new Error('useSiteSettings must be used within a SiteSettingsProvider');
  }
  return context;
}
