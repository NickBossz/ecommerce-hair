import { supabase } from '../config/database.js';

// Middleware para verificar autenticação
export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Token não fornecido',
        message: 'Você precisa estar autenticado para acessar este recurso'
      });
    }

    const token = authHeader.replace('Bearer ', '');

    // Verificar token com Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({
        error: 'Token inválido',
        message: 'Sua sessão expirou ou o token é inválido'
      });
    }

    // Buscar perfil do usuário
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    req.user = user;
    req.userProfile = profile;
    next();
  } catch (error) {
    console.error('Erro no middleware de autenticação:', error);
    res.status(500).json({
      error: 'Erro de autenticação',
      message: 'Ocorreu um erro ao verificar sua autenticação'
    });
  }
};

// Middleware para verificar se usuário é admin
export const requireAdmin = async (req, res, next) => {
  try {
    if (!req.userProfile) {
      return res.status(401).json({
        error: 'Não autenticado',
        message: 'Você precisa estar autenticado'
      });
    }

    const role = req.userProfile.role;

    if (!role || !['admin', 'superadmin'].includes(role)) {
      return res.status(403).json({
        error: 'Acesso negado',
        message: 'Você não tem permissões de administrador'
      });
    }

    next();
  } catch (error) {
    console.error('Erro no middleware de admin:', error);
    res.status(500).json({
      error: 'Erro de autorização',
      message: 'Ocorreu um erro ao verificar suas permissões'
    });
  }
};

// Middleware opcional - não retorna erro se não autenticado
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user } } = await supabase.auth.getUser(token);

      if (user) {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        req.user = user;
        req.userProfile = profile;
      }
    }

    next();
  } catch (error) {
    // Continua mesmo se houver erro
    next();
  }
};
