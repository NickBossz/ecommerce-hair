import { supabase } from '../config/database.js';

// Listar produtos com filtros e paginação
export const listProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      category,
      min_price,
      max_price,
      sort = 'created_at',
      order = 'desc',
      search,
      featured,
      in_stock
    } = req.query;

    const offset = (page - 1) * limit;

    // Construir query
    let query = supabase
      .from('products')
      .select(`
        *,
        category:categories(id, name, slug),
        images:product_images(*)
      `, { count: 'exact' })
      .eq('is_active', true);

    // Filtros
    if (category) {
      // Se category é um número, busca por ID, senão busca por slug
      if (!isNaN(category)) {
        query = query.eq('category_id', category);
      } else {
        // Buscar categoria por slug primeiro
        const { data: categoryData } = await supabase
          .from('categories')
          .select('id')
          .eq('slug', category)
          .single();

        if (categoryData) {
          query = query.eq('category_id', categoryData.id);
        }
      }
    }

    if (min_price) {
      query = query.gte('price', min_price);
    }

    if (max_price) {
      query = query.lte('price', max_price);
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    if (featured === 'true') {
      query = query.eq('is_featured', true);
    }

    if (in_stock === 'true') {
      query = query.gt('stock_quantity', 0);
    }

    // Ordenação
    const sortField = sort === 'price_asc' ? 'price' :
                      sort === 'price_desc' ? 'price' :
                      sort === 'name_asc' ? 'name' :
                      sort === 'name_desc' ? 'name' : 'created_at';

    const sortOrder = sort.includes('asc') ? true : false;

    query = query.order(sortField, { ascending: sortOrder });

    // Paginação
    query = query.range(offset, offset + limit - 1);

    const { data: products, error, count } = await query;

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
    console.error('Erro ao listar produtos:', error);
    res.status(500).json({
      error: 'Erro ao listar produtos',
      message: error.message
    });
  }
};

// Obter produto por slug
export const getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    console.log('Buscando produto por slug:', slug);

    const { data: product, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(id, name, slug),
        images:product_images(*)
      `)
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    console.log('Resultado da busca:', { product, error });

    if (error || !product) {
      console.error('Produto não encontrado:', { slug, error });
      return res.status(404).json({
        error: 'Produto não encontrado',
        slug,
        debug: error?.message
      });
    }

    res.json({ product });
  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    res.status(500).json({
      error: 'Erro ao buscar produto',
      message: error.message
    });
  }
};

// Produtos em destaque
export const getFeaturedProducts = async (req, res) => {
  try {
    const { limit = 8 } = req.query;

    const { data: products, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(id, name, slug),
        images:product_images(*)
      `)
      .eq('is_active', true)
      .eq('is_featured', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    res.json({ products });
  } catch (error) {
    console.error('Erro ao buscar produtos em destaque:', error);
    res.status(500).json({
      error: 'Erro ao buscar produtos',
      message: error.message
    });
  }
};

// Criar produto (Admin)
export const createProduct = async (req, res) => {
  try {
    const productData = {
      ...req.body,
      created_by: req.user.id
    };

    const { data: product, error } = await supabase
      .from('products')
      .insert([productData])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      message: 'Produto criado com sucesso',
      product
    });
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    res.status(500).json({
      error: 'Erro ao criar produto',
      message: error.message
    });
  }
};

// Atualizar produto (Admin)
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: product, error } = await supabase
      .from('products')
      .update(req.body)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json({
      message: 'Produto atualizado com sucesso',
      product
    });
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    res.status(500).json({
      error: 'Erro ao atualizar produto',
      message: error.message
    });
  }
};

// Deletar produto (Admin)
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({ message: 'Produto deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar produto:', error);
    res.status(500).json({
      error: 'Erro ao deletar produto',
      message: error.message
    });
  }
};
