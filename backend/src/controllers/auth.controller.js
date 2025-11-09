import { supabase } from '../config/database.js';

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Dados incompletos',
        message: 'Email e senha são obrigatórios'
      });
    }

    // Autenticar com Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return res.status(401).json({
        error: 'Credenciais inválidas',
        message: 'Email ou senha incorretos'
      });
    }

    // Buscar perfil do usuário
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileError || !profile) {
      return res.status(404).json({
        error: 'Perfil não encontrado',
        message: 'Usuário não possui perfil cadastrado'
      });
    }

    res.json({
      message: 'Login realizado com sucesso',
      user: {
        id: data.user.id,
        email: data.user.email,
        role: profile.role,
        full_name: profile.full_name
      },
      session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_at: data.session.expires_at
      }
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({
      error: 'Erro no servidor',
      message: 'Ocorreu um erro ao fazer login'
    });
  }
};

// Login Admin (verifica se tem role admin)
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Dados incompletos',
        message: 'Email e senha são obrigatórios'
      });
    }

    // Autenticar com Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return res.status(401).json({
        error: 'Credenciais inválidas',
        message: 'Email ou senha incorretos'
      });
    }

    // Buscar perfil do usuário
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileError || !profile) {
      return res.status(404).json({
        error: 'Perfil não encontrado',
        message: 'Usuário não possui perfil cadastrado'
      });
    }

    // Verificar se é admin
    if (!['admin', 'superadmin'].includes(profile.role)) {
      // Fazer logout
      await supabase.auth.signOut();

      return res.status(403).json({
        error: 'Acesso negado',
        message: 'Você não possui permissões de administrador'
      });
    }

    res.json({
      message: 'Login de admin realizado com sucesso',
      user: {
        id: data.user.id,
        email: data.user.email,
        role: profile.role,
        full_name: profile.full_name
      },
      session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_at: data.session.expires_at
      }
    });
  } catch (error) {
    console.error('Erro no login admin:', error);
    res.status(500).json({
      error: 'Erro no servidor',
      message: 'Ocorreu um erro ao fazer login'
    });
  }
};

// Verificar sessão
export const verifySession = async (req, res) => {
  try {
    res.json({
      message: 'Sessão válida',
      user: {
        id: req.user.id,
        email: req.user.email,
        role: req.userProfile?.role,
        full_name: req.userProfile?.full_name
      }
    });
  } catch (error) {
    console.error('Erro ao verificar sessão:', error);
    res.status(500).json({
      error: 'Erro no servidor',
      message: 'Ocorreu um erro ao verificar a sessão'
    });
  }
};

// Logout
export const logout = async (req, res) => {
  try {
    // Supabase Auth faz logout do lado do cliente
    // Aqui apenas confirmamos
    res.json({
      message: 'Logout realizado com sucesso'
    });
  } catch (error) {
    console.error('Erro no logout:', error);
    res.status(500).json({
      error: 'Erro no servidor',
      message: 'Ocorreu um erro ao fazer logout'
    });
  }
};

// Registrar novo usuário
export const register = async (req, res) => {
  try {
    const { email, password, full_name } = req.body;

    if (!email || !password || !full_name) {
      return res.status(400).json({
        error: 'Dados incompletos',
        message: 'Email, senha e nome completo são obrigatórios'
      });
    }

    // Criar usuário no Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name
        }
      }
    });

    if (error) {
      return res.status(400).json({
        error: 'Erro ao criar usuário',
        message: error.message
      });
    }

    // Criar perfil do usuário (role padrão é 'customer')
    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert({
        id: data.user.id,
        email: data.user.email,
        full_name,
        role: 'customer'
      });

    if (profileError) {
      console.error('Erro ao criar perfil:', profileError);
    }

    res.status(201).json({
      message: 'Usuário criado com sucesso',
      user: {
        id: data.user.id,
        email: data.user.email,
        full_name
      }
    });
  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({
      error: 'Erro no servidor',
      message: 'Ocorreu um erro ao registrar usuário'
    });
  }
};
