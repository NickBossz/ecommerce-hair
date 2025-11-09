import { supabase } from '../config/database.js';

// Listar todas as categorias
export const listCategories = async (req, res) => {
  try {
    const { data: categories, error } = await supabase
      .from('categories')
      .select(`
        *,
        subcategories:categories!parent_id(*)
      `)
      .eq('is_active', true)
      .is('parent_id', null)
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Erro Supabase ao listar categorias:', error);
      throw error;
    }

    // Se não houver categorias, retornar array vazio
    if (!categories || categories.length === 0) {
      return res.json({ categories: [] });
    }

    // Adicionar contagem de produtos
    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const { count } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true })
          .eq('category_id', category.id)
          .eq('is_active', true);

        return {
          ...category,
          product_count: count || 0
        };
      })
    );

    res.json({ categories: categoriesWithCount });
  } catch (error) {
    console.error('Erro ao listar categorias:', error);
    res.status(500).json({
      error: 'Erro ao listar categorias',
      message: error.message,
      details: error.details || error.hint || 'Verifique se as tabelas foram criadas no Supabase'
    });
  }
};

// Obter categoria por slug
export const getCategoryBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const { data: category, error } = await supabase
      .from('categories')
      .select(`
        *,
        subcategories:categories!parent_id(*)
      `)
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (error || !category) {
      return res.status(404).json({
        error: 'Categoria não encontrada'
      });
    }

    res.json({ category });
  } catch (error) {
    console.error('Erro ao buscar categoria:', error);
    res.status(500).json({
      error: 'Erro ao buscar categoria',
      message: error.message
    });
  }
};

// Produtos da categoria
export const getCategoryProducts = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const { data: products, error, count } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(id, name, slug),
        images:product_images(*)
      `, { count: 'exact' })
      .eq('category_id', id)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    res.json({
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Erro ao buscar produtos da categoria:', error);
    res.status(500).json({
      error: 'Erro ao buscar produtos',
      message: error.message
    });
  }
};

// Criar categoria (Admin)
export const createCategory = async (req, res) => {
  try {
    const { data: category, error } = await supabase
      .from('categories')
      .insert([req.body])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      message: 'Categoria criada com sucesso',
      category
    });
  } catch (error) {
    console.error('Erro ao criar categoria:', error);
    res.status(500).json({
      error: 'Erro ao criar categoria',
      message: error.message
    });
  }
};

// Atualizar categoria (Admin)
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: category, error } = await supabase
      .from('categories')
      .update(req.body)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json({
      message: 'Categoria atualizada com sucesso',
      category
    });
  } catch (error) {
    console.error('Erro ao atualizar categoria:', error);
    res.status(500).json({
      error: 'Erro ao atualizar categoria',
      message: error.message
    });
  }
};

// Deletar categoria (Admin)
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({ message: 'Categoria deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar categoria:', error);
    res.status(500).json({
      error: 'Erro ao deletar categoria',
      message: error.message
    });
  }
};
