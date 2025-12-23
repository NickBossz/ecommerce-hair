import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Pencil, Trash2, Search, Image as ImageIcon, Upload, Star, ArrowUp, ArrowDown, Video, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/services/api';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    short_description: '',
    price: '',
    compare_at_price: '',
    stock_quantity: '',
    category_id: '',
    is_featured: false,
    images: [],
    videos: []
  });
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newVideoTitle, setNewVideoTitle] = useState('');

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/products');

      // Convert _id to id for compatibility
      const productsWithId = (response.data.products || []).map(product => ({
        ...product,
        id: product._id?.toString() || product.id
      }));

      setProducts(productsWithId);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      toast.error('Erro ao carregar produtos');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');

      // Convert _id to id for compatibility
      const categoriesWithId = (response.data || []).map(cat => ({
        ...cat,
        id: cat._id?.toString() || cat.id
      }));

      setCategories(categoriesWithId);
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      toast.error('Erro ao carregar categorias');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        compare_at_price: formData.compare_at_price ? parseFloat(formData.compare_at_price) : null,
        stock_quantity: parseInt(formData.stock_quantity),
        images: formData.images,
        videos: formData.videos
      };

      if (editingProduct) {
        await api.put(`/products/${editingProduct.id}`, payload);
        toast.success('Produto atualizado com sucesso!');
      } else {
        await api.post('/products', payload);
        toast.success('Produto criado com sucesso!');
      }

      setShowForm(false);
      setEditingProduct(null);
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      toast.error(error.response?.data?.error || 'Erro ao salvar produto');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      slug: product.slug,
      description: product.description || '',
      short_description: product.short_description || '',
      price: product.price.toString(),
      compare_at_price: product.compare_at_price?.toString() || '',
      stock_quantity: product.stock_quantity.toString(),
      category_id: product.category_id || '',
      is_featured: product.is_featured,
      images: product.images || [],
      videos: product.videos || []
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;

    try {
      await api.delete(`/products/${id}`);
      toast.success('Produto excluído com sucesso!');
      fetchProducts();
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
      toast.error(error.response?.data?.error || 'Erro ao excluir produto');
    }
  };

  const handleNameChange = (name) => {
    const slug = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    setFormData({ ...formData, name, slug });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      short_description: '',
      price: '',
      compare_at_price: '',
      stock_quantity: '',
      category_id: '',
      is_featured: false,
      images: [],
      videos: []
    });
    setNewImageUrl('');
    setNewVideoUrl('');
    setNewVideoTitle('');
  };

  const handleAddImage = () => {
    if (!newImageUrl.trim()) {
      toast.error('Digite uma URL válida para a imagem');
      return;
    }

    const newImage = {
      image_url: newImageUrl,
      alt_text: formData.name || 'Imagem do produto',
      is_primary: formData.images.length === 0,
      display_order: formData.images.length
    };

    setFormData({
      ...formData,
      images: [...formData.images, newImage]
    });
    setNewImageUrl('');
    toast.success('Imagem adicionada!');
  };

  const handleRemoveImage = (index) => {
    const updatedImages = formData.images.filter((_, i) => i !== index);
    // Reajustar display_order e is_primary
    const reorderedImages = updatedImages.map((img, i) => ({
      ...img,
      display_order: i,
      is_primary: i === 0
    }));
    setFormData({
      ...formData,
      images: reorderedImages
    });
    toast.success('Imagem removida!');
  };

  const handleSetPrimaryImage = (index) => {
    const updatedImages = formData.images.map((img, i) => ({
      ...img,
      is_primary: i === index
    }));
    setFormData({
      ...formData,
      images: updatedImages
    });
    toast.success('Imagem principal definida!');
  };

  const handleMoveImage = (index, direction) => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= formData.images.length) return;

    const updatedImages = [...formData.images];
    [updatedImages[index], updatedImages[newIndex]] = [updatedImages[newIndex], updatedImages[index]];

    // Atualizar display_order
    const reorderedImages = updatedImages.map((img, i) => ({
      ...img,
      display_order: i
    }));

    setFormData({
      ...formData,
      images: reorderedImages
    });
  };

  const handleAddVideo = () => {
    if (!newVideoUrl.trim()) {
      toast.error('Digite uma URL válida para o vídeo');
      return;
    }

    const newVideo = {
      video_url: newVideoUrl,
      title: newVideoTitle || formData.name || 'Vídeo do produto',
      display_order: formData.videos.length
    };

    setFormData({
      ...formData,
      videos: [...formData.videos, newVideo]
    });
    setNewVideoUrl('');
    setNewVideoTitle('');
    toast.success('Vídeo adicionado!');
  };

  const handleRemoveVideo = (index) => {
    const updatedVideos = formData.videos.filter((_, i) => i !== index);
    // Reajustar display_order
    const reorderedVideos = updatedVideos.map((vid, i) => ({
      ...vid,
      display_order: i
    }));
    setFormData({
      ...formData,
      videos: reorderedVideos
    });
    toast.success('Vídeo removido!');
  };

  const handleMoveVideo = (index, direction) => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= formData.videos.length) return;

    const updatedVideos = [...formData.videos];
    [updatedVideos[index], updatedVideos[newIndex]] = [updatedVideos[newIndex], updatedVideos[index]];

    // Atualizar display_order
    const reorderedVideos = updatedVideos.map((vid, i) => ({
      ...vid,
      display_order: i
    }));

    setFormData({
      ...formData,
      videos: reorderedVideos
    });
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Produtos</h1>
          <p className="text-muted-foreground">Gerencie os produtos da loja</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Produto
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingProduct ? 'Editar' : 'Novo'} Produto</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    required
                    placeholder="Ex: Lace Frontal Premium 13x4"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    required
                    placeholder="lace-frontal-premium-13x4"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="short_description">Descrição Curta</Label>
                <Input
                  id="short_description"
                  value={formData.short_description}
                  onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                  placeholder="Breve descrição do produto..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição Completa *</Label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  placeholder="Descrição detalhada do produto..."
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="price">Preço (R$) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    placeholder="299.90"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="compare_at_price">Preço Original (R$)</Label>
                  <Input
                    id="compare_at_price"
                    type="number"
                    step="0.01"
                    value={formData.compare_at_price}
                    onChange={(e) => setFormData({ ...formData, compare_at_price: e.target.value })}
                    placeholder="399.90"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock_quantity">Estoque *</Label>
                  <Input
                    id="stock_quantity"
                    type="number"
                    value={formData.stock_quantity}
                    onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                    required
                    placeholder="10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category_id">Categoria</Label>
                <select
                  id="category_id"
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="">Selecione uma categoria</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Imagens Section */}
              <div className="space-y-3 border-t pt-4">
                <Label className="text-base font-semibold flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  Imagens do Produto
                </Label>

                <div className="flex gap-2">
                  <Input
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="Cole a URL da imagem aqui"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddImage())}
                  />
                  <Button type="button" onClick={handleAddImage} variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {formData.images.length > 0 && (
                  <div className="grid gap-2">
                    {formData.images.map((img, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 border rounded-md bg-muted/30">
                        <img
                          src={img.image_url}
                          alt={img.alt_text}
                          className="w-16 h-16 object-cover rounded flex-shrink-0"
                          onError={(e) => e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"/>'}
                        />
                        <div className="flex-1 min-w-0 overflow-hidden">
                          <p className="text-sm font-medium truncate" title={img.image_url}>{img.image_url}</p>
                          {img.is_primary && (
                            <span className="text-xs text-primary flex items-center gap-1">
                              <Star className="h-3 w-3 fill-current" />
                              Principal
                            </span>
                          )}
                        </div>
                        <div className="flex gap-1">
                          {!img.is_primary && (
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              onClick={() => handleSetPrimaryImage(index)}
                              title="Definir como principal"
                            >
                              <Star className="h-3 w-3" />
                            </Button>
                          )}
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => handleMoveImage(index, 'up')}
                            disabled={index === 0}
                          >
                            <ArrowUp className="h-3 w-3" />
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => handleMoveImage(index, 'down')}
                            disabled={index === formData.images.length - 1}
                          >
                            <ArrowDown className="h-3 w-3" />
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRemoveImage(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Videos Section */}
              <div className="space-y-3 border-t pt-4">
                <Label className="text-base font-semibold flex items-center gap-2">
                  <Video className="h-4 w-4" />
                  Vídeos do Produto
                </Label>

                <div className="space-y-2">
                  <Input
                    value={newVideoUrl}
                    onChange={(e) => setNewVideoUrl(e.target.value)}
                    placeholder="Cole a URL do vídeo (YouTube, Vimeo, etc)"
                    onKeyPress={(e) => e.key === 'Enter' && e.shiftKey && (e.preventDefault(), handleAddVideo())}
                  />
                  <div className="flex gap-2">
                    <Input
                      value={newVideoTitle}
                      onChange={(e) => setNewVideoTitle(e.target.value)}
                      placeholder="Título do vídeo (opcional)"
                    />
                    <Button type="button" onClick={handleAddVideo} variant="outline">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {formData.videos.length > 0 && (
                  <div className="grid gap-2">
                    {formData.videos.map((vid, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 border rounded-md bg-muted/30">
                        <Video className="h-8 w-8 text-muted-foreground flex-shrink-0" />
                        <div className="flex-1 min-w-0 overflow-hidden">
                          <p className="text-sm font-medium truncate" title={vid.title}>{vid.title}</p>
                          <p className="text-xs text-muted-foreground truncate" title={vid.video_url}>{vid.video_url}</p>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => handleMoveVideo(index, 'up')}
                            disabled={index === 0}
                          >
                            <ArrowUp className="h-3 w-3" />
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => handleMoveVideo(index, 'down')}
                            disabled={index === formData.videos.length - 1}
                          >
                            <ArrowDown className="h-3 w-3" />
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRemoveVideo(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_featured"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                  className="h-4 w-4 rounded border-input"
                />
                <Label htmlFor="is_featured">Produto em destaque</Label>
              </div>

              <div className="flex gap-2">
                <Button type="submit">
                  {editingProduct ? 'Atualizar' : 'Criar'} Produto
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setEditingProduct(null);
                    resetForm();
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar produtos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando produtos...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Nenhum produto encontrado</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden flex flex-col">
              <CardHeader className="p-3 flex-shrink-0">
                {product.images?.[0]?.image_url ? (
                  <div className="aspect-square w-full rounded-md overflow-hidden mb-2">
                    <img
                      src={product.images[0].image_url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="aspect-square w-full rounded-md bg-muted flex items-center justify-center mb-2">
                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
                <CardTitle className="text-sm line-clamp-2 break-words">{product.name}</CardTitle>
                <div className="flex items-center gap-1 mt-1 flex-wrap">
                  <span className="text-sm font-bold text-primary whitespace-nowrap">
                    R$ {product.price.toFixed(2)}
                  </span>
                  {product.compare_at_price && (
                    <span className="text-xs text-muted-foreground line-through whitespace-nowrap">
                      R$ {product.compare_at_price.toFixed(2)}
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <div className="space-y-1 mb-2">
                  <p className="text-xs text-muted-foreground">
                    Estoque: <span className="font-medium">{product.stock_quantity}</span>
                  </p>
                  {product.is_featured && (
                    <span className="inline-flex items-center rounded-md bg-primary/10 px-1.5 py-0.5 text-xs font-medium text-primary">
                      Destaque
                    </span>
                  )}
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(product)}
                    className="flex-1 h-7 text-xs"
                  >
                    <Pencil className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(product.id)}
                    className="flex-1 h-7 text-xs"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
