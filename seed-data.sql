-- =====================================================
-- DADOS DE EXEMPLO - E-COMMERCE FABHAIR
-- =====================================================

-- Verificar se já existem categorias
DO $$
BEGIN
  -- Inserir categorias apenas se não existirem
  IF NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'shampoos') THEN
    INSERT INTO categories (name, slug, description, display_order, is_active) VALUES
    ('Shampoos', 'shampoos', 'Shampoos profissionais para todos os tipos de cabelo', 1, true),
    ('Condicionadores', 'condicionadores', 'Condicionadores hidratantes e nutritivos', 2, true),
    ('Máscaras', 'mascaras', 'Tratamentos intensivos para reconstrução capilar', 3, true),
    ('Finalizadores', 'finalizadores', 'Produtos para finalização e definição de cachos', 4, true);
  END IF;
END $$;

-- Obter IDs das categorias
WITH category_ids AS (
  SELECT
    id,
    slug
  FROM categories
)

-- Inserir produtos de exemplo
INSERT INTO products (name, slug, description, short_description, price, compare_at_price, stock_quantity, category_id, is_featured, is_active)
SELECT
  'Shampoo Hidratante Profissional',
  'shampoo-hidratante-profissional',
  'Shampoo desenvolvido especialmente para cabelos secos e danificados. Fórmula enriquecida com óleo de argan e queratina que promove hidratação profunda, restauração dos fios e brilho intenso. Ideal para uso diário.',
  'Hidratação profunda com óleo de argan',
  89.90,
  119.90,
  50,
  (SELECT id FROM category_ids WHERE slug = 'shampoos'),
  true,
  true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'shampoo-hidratante-profissional')

UNION ALL SELECT
  'Shampoo Anti-Resíduos',
  'shampoo-anti-residuos',
  'Shampoo de limpeza profunda que remove resíduos de produtos, poluição e oleosidade. Prepara os fios para receber tratamentos. Contém extrato de limão siciliano e menta.',
  'Limpeza profunda e refrescante',
  79.90,
  99.90,
  35,
  (SELECT id FROM category_ids WHERE slug = 'shampoos'),
  true,
  true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'shampoo-anti-residuos')

UNION ALL SELECT
  'Shampoo Matizador Platinum',
  'shampoo-matizador-platinum',
  'Shampoo matizador violeta que neutraliza tons amarelados em cabelos loiros, grisalhos e platinados. Resultado de loiro perfeito e vibrante.',
  'Neutraliza tons amarelados',
  99.90,
  129.90,
  28,
  (SELECT id FROM category_ids WHERE slug = 'shampoos'),
  true,
  true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'shampoo-matizador-platinum')

UNION ALL SELECT
  'Condicionador Nutritivo Intense',
  'condicionador-nutritivo-intense',
  'Condicionador de nutrição intensa para cabelos muito secos. Fórmula rica em manteiga de karité, óleo de coco e vitamina E. Desembaraça, nutre e sela as cutículas.',
  'Nutrição intensa com manteiga de karité',
  95.90,
  125.90,
  42,
  (SELECT id FROM category_ids WHERE slug = 'condicionadores'),
  true,
  true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'condicionador-nutritivo-intense')

UNION ALL SELECT
  'Condicionador Reconstrutor',
  'condicionador-reconstrutor',
  'Condicionador reconstrutor com proteínas e aminoácidos que fortalecem a fibra capilar. Recupera cabelos quimicamente tratados e danificados.',
  'Reconstrução profunda dos fios',
  98.90,
  null,
  30,
  (SELECT id FROM category_ids WHERE slug = 'condicionadores'),
  false,
  true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'condicionador-reconstrutor')

UNION ALL SELECT
  'Máscara de Hidratação Premium',
  'mascara-hidratacao-premium',
  'Máscara de tratamento intensivo com ação prolongada. Tecnologia Time Release que hidrata por até 72 horas. Contém blend de 7 óleos nobres.',
  'Hidratação por até 72 horas',
  129.90,
  159.90,
  25,
  (SELECT id FROM category_ids WHERE slug = 'mascaras'),
  true,
  true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'mascara-hidratacao-premium')

UNION ALL SELECT
  'Máscara Reparadora Ultra',
  'mascara-reparadora-ultra',
  'Máscara de reconstrução profunda para cabelos extremamente danificados. Fórmula com queratina hidrolisada e colágeno. Resultados visíveis desde a primeira aplicação.',
  'Reconstrução instantânea',
  149.90,
  189.90,
  20,
  (SELECT id FROM category_ids WHERE slug = 'mascaras'),
  true,
  true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'mascara-reparadora-ultra')

UNION ALL SELECT
  'Máscara Detox Capilar',
  'mascara-detox-capilar',
  'Máscara desintoxicante com argila verde e carvão ativado. Remove impurezas, controla oleosidade e revitaliza o couro cabeludo.',
  'Desintoxicação profunda',
  118.90,
  null,
  18,
  (SELECT id FROM category_ids WHERE slug = 'mascaras'),
  false,
  true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'mascara-detox-capilar')

UNION ALL SELECT
  'Creme de Pentear Cachos Perfeitos',
  'creme-pentear-cachos-perfeitos',
  'Creme de pentear leave-in para definição de cachos. Tecnologia anti-frizz, controle de volume e brilho intenso. Não pesa os fios.',
  'Definição de cachos sem pesar',
  85.90,
  109.90,
  55,
  (SELECT id FROM category_ids WHERE slug = 'finalizadores'),
  true,
  true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'creme-pentear-cachos-perfeitos')

UNION ALL SELECT
  'Óleo Finalizador Sublime',
  'oleo-finalizador-sublime',
  'Óleo finalizador multifuncional com 12 benefícios. Controla frizz, sela pontas duplas, adiciona brilho e protege contra calor. Fragrância exclusiva.',
  '12 benefícios em 1 produto',
  95.90,
  null,
  40,
  (SELECT id FROM category_ids WHERE slug = 'finalizadores'),
  false,
  true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'oleo-finalizador-sublime')

UNION ALL SELECT
  'Spray Texturizador Volume',
  'spray-texturizador-volume',
  'Spray texturizador que proporciona volume, corpo e textura. Fixação leve e natural. Proteção térmica integrada.',
  'Volume e textura natural',
  78.90,
  98.90,
  33,
  (SELECT id FROM category_ids WHERE slug = 'finalizadores'),
  false,
  true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'spray-texturizador-volume')

UNION ALL SELECT
  'Mousse Modelador Cachos',
  'mousse-modelador-cachos',
  'Mousse para definição e modelagem de cachos. Fixação forte, controle de frizz e efeito memória. Não deixa resíduos.',
  'Fixação forte e controle total',
  88.90,
  null,
  28,
  (SELECT id FROM category_ids WHERE slug = 'finalizadores'),
  false,
  true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'mousse-modelador-cachos');

-- Inserir imagens para os produtos
INSERT INTO product_images (product_id, image_url, alt_text, is_primary, display_order)
SELECT
  p.id,
  'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&h=800&fit=crop',
  p.name,
  true,
  0
FROM products p
WHERE p.slug IN (
  'shampoo-hidratante-profissional',
  'shampoo-anti-residuos',
  'shampoo-matizador-platinum',
  'condicionador-nutritivo-intense',
  'condicionador-reconstrutor',
  'mascara-hidratacao-premium',
  'mascara-reparadora-ultra',
  'mascara-detox-capilar',
  'creme-pentear-cachos-perfeitos',
  'oleo-finalizador-sublime',
  'spray-texturizador-volume',
  'mousse-modelador-cachos'
)
AND NOT EXISTS (
  SELECT 1 FROM product_images pi WHERE pi.product_id = p.id
);

-- Mensagem de sucesso
DO $$
DECLARE
  product_count INTEGER;
  category_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO product_count FROM products;
  SELECT COUNT(*) INTO category_count FROM categories;

  RAISE NOTICE '✅ Seed concluído!';
  RAISE NOTICE '📦 Total de produtos: %', product_count;
  RAISE NOTICE '📁 Total de categorias: %', category_count;
END $$;
