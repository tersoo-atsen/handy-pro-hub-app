-- Seed data for Handy Pro development

-- Categories
INSERT INTO public.categories (name, slug, description) VALUES
  ('Plumbing', 'plumbing', 'Pipe repairs, installations, and water system maintenance'),
  ('Electrical', 'electrical', 'Wiring, installations, and electrical repairs'),
  ('Carpentry', 'carpentry', 'Furniture making, repairs, and woodwork'),
  ('Painting', 'painting', 'Interior and exterior painting services'),
  ('Cleaning', 'cleaning', 'Home and office cleaning services'),
  ('AC & Refrigeration', 'ac-refrigeration', 'Air conditioning and refrigerator repair'),
  ('Tiling', 'tiling', 'Floor and wall tiling services'),
  ('Welding', 'welding', 'Metal fabrication and welding services'),
  ('Generator Repair', 'generator-repair', 'Generator servicing and repair'),
  ('Landscaping', 'landscaping', 'Garden design, lawn care, and outdoor maintenance');

-- Skills for Plumbing
INSERT INTO public.skills (category_id, name, slug)
SELECT id, skill_name, skill_slug
FROM public.categories,
  (VALUES
    ('Pipe Repair', 'pipe-repair'),
    ('Drain Cleaning', 'drain-cleaning'),
    ('Water Heater Installation', 'water-heater-installation'),
    ('Toilet Repair', 'toilet-repair'),
    ('Leak Detection', 'leak-detection')
  ) AS skills(skill_name, skill_slug)
WHERE categories.slug = 'plumbing';

-- Skills for Electrical
INSERT INTO public.skills (category_id, name, slug)
SELECT id, skill_name, skill_slug
FROM public.categories,
  (VALUES
    ('Wiring', 'wiring'),
    ('Circuit Breaker Repair', 'circuit-breaker-repair'),
    ('Lighting Installation', 'lighting-installation'),
    ('Socket & Switch Repair', 'socket-switch-repair'),
    ('Electrical Inspection', 'electrical-inspection')
  ) AS skills(skill_name, skill_slug)
WHERE categories.slug = 'electrical';

-- Skills for Carpentry
INSERT INTO public.skills (category_id, name, slug)
SELECT id, skill_name, skill_slug
FROM public.categories,
  (VALUES
    ('Furniture Making', 'furniture-making'),
    ('Door Installation', 'door-installation'),
    ('Cabinet Making', 'cabinet-making'),
    ('Wood Finishing', 'wood-finishing'),
    ('Roof Repair', 'roof-repair')
  ) AS skills(skill_name, skill_slug)
WHERE categories.slug = 'carpentry';

-- Skills for Painting
INSERT INTO public.skills (category_id, name, slug)
SELECT id, skill_name, skill_slug
FROM public.categories,
  (VALUES
    ('Interior Painting', 'interior-painting'),
    ('Exterior Painting', 'exterior-painting'),
    ('Wallpaper Installation', 'wallpaper-installation'),
    ('Texture Coating', 'texture-coating')
  ) AS skills(skill_name, skill_slug)
WHERE categories.slug = 'painting';

-- Skills for Cleaning
INSERT INTO public.skills (category_id, name, slug)
SELECT id, skill_name, skill_slug
FROM public.categories,
  (VALUES
    ('Deep Cleaning', 'deep-cleaning'),
    ('Fumigation', 'fumigation'),
    ('Upholstery Cleaning', 'upholstery-cleaning'),
    ('Post-Construction Cleaning', 'post-construction-cleaning')
  ) AS skills(skill_name, skill_slug)
WHERE categories.slug = 'cleaning';

-- Skills for AC & Refrigeration
INSERT INTO public.skills (category_id, name, slug)
SELECT id, skill_name, skill_slug
FROM public.categories,
  (VALUES
    ('AC Installation', 'ac-installation'),
    ('AC Servicing', 'ac-servicing'),
    ('Refrigerator Repair', 'refrigerator-repair'),
    ('Gas Charging', 'gas-charging')
  ) AS skills(skill_name, skill_slug)
WHERE categories.slug = 'ac-refrigeration';

-- Skills for Tiling
INSERT INTO public.skills (category_id, name, slug)
SELECT id, skill_name, skill_slug
FROM public.categories,
  (VALUES
    ('Floor Tiling', 'floor-tiling'),
    ('Wall Tiling', 'wall-tiling'),
    ('Bathroom Tiling', 'bathroom-tiling'),
    ('Tile Repair', 'tile-repair')
  ) AS skills(skill_name, skill_slug)
WHERE categories.slug = 'tiling';

-- Skills for Welding
INSERT INTO public.skills (category_id, name, slug)
SELECT id, skill_name, skill_slug
FROM public.categories,
  (VALUES
    ('Gate Fabrication', 'gate-fabrication'),
    ('Burglar Proof', 'burglar-proof'),
    ('Metal Furniture', 'metal-furniture'),
    ('Structural Welding', 'structural-welding')
  ) AS skills(skill_name, skill_slug)
WHERE categories.slug = 'welding';

-- Skills for Generator Repair
INSERT INTO public.skills (category_id, name, slug)
SELECT id, skill_name, skill_slug
FROM public.categories,
  (VALUES
    ('Generator Servicing', 'generator-servicing'),
    ('Generator Installation', 'generator-installation'),
    ('ATS Installation', 'ats-installation'),
    ('Engine Overhaul', 'engine-overhaul')
  ) AS skills(skill_name, skill_slug)
WHERE categories.slug = 'generator-repair';

-- Skills for Landscaping
INSERT INTO public.skills (category_id, name, slug)
SELECT id, skill_name, skill_slug
FROM public.categories,
  (VALUES
    ('Lawn Maintenance', 'lawn-maintenance'),
    ('Garden Design', 'garden-design'),
    ('Tree Trimming', 'tree-trimming'),
    ('Interlocking Installation', 'interlocking-installation')
  ) AS skills(skill_name, skill_slug)
WHERE categories.slug = 'landscaping';
