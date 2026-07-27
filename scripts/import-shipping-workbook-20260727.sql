-- Import reviewed shipping workbook data without enabling automatic checkout.
-- All country and rate records remain inactive/needs_review until carrier validity
-- dates, explicit country mappings and packaging confirmations are supplied.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

ALTER TABLE public.products ADD COLUMN IF NOT EXISTS weight_kg NUMERIC(10,2);
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS shipping_class VARCHAR(20) NOT NULL DEFAULT 'parcel';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS packed_weight_kg NUMERIC(10,2);
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS package_length_cm NUMERIC(10,2);
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS package_width_cm NUMERIC(10,2);
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS package_height_cm NUMERIC(10,2);
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS package_count INTEGER NOT NULL DEFAULT 1;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS shipping_quote_required BOOLEAN NOT NULL DEFAULT true;

CREATE TABLE IF NOT EXISTS public.shipping_country_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_code VARCHAR(2) NOT NULL UNIQUE,
  country_name VARCHAR(100) NOT NULL,
  zone VARCHAR(100),
  proposed_checkout_mode VARCHAR(30),
  proposed_trade_terms VARCHAR(20),
  allowed_categories TEXT,
  carrier TEXT,
  estimated_days_min INTEGER,
  estimated_days_max INTEGER,
  source_notes TEXT,
  validation_status VARCHAR(30) NOT NULL DEFAULT 'needs_review',
  is_active BOOLEAN NOT NULL DEFAULT false,
  source_file TEXT NOT NULL DEFAULT 'Reach_Projector_运费模板_V1_USD补充.xlsx',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.shipping_rate_staging (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  zone VARCHAR(100),
  method VARCHAR(100),
  trade_terms VARCHAR(20),
  min_weight_kg NUMERIC(10,2),
  max_weight_kg NUMERIC(10,2),
  base_weight_kg NUMERIC(10,2),
  base_fee NUMERIC(12,2),
  increment_weight_kg NUMERIC(10,2),
  increment_fee NUMERIC(12,2),
  minimum_fee NUMERIC(12,2),
  currency VARCHAR(3),
  effective_from DATE,
  effective_to DATE,
  source_notes TEXT,
  validation_status VARCHAR(30) NOT NULL DEFAULT 'needs_review',
  source_file TEXT NOT NULL DEFAULT 'Reach_Projector_运费模板_V1_USD补充.xlsx',
  source_row INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (source_file, source_row)
);

ALTER TABLE public.shipping_country_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipping_rate_staging ENABLE ROW LEVEL SECURITY;

INSERT INTO public.shipping_country_rules (
  country_code, country_name, zone, proposed_checkout_mode, proposed_trade_terms,
  allowed_categories, carrier, estimated_days_min, estimated_days_max, source_notes,
  validation_status, is_active, updated_at
) VALUES (
  'US', '美国', '北美',
  'DDP自动', 'DDP', '投影仪/支架(普货)', 'UPS(深圳/香港直发包税)',
  5.0, 8.0, '小货阶梯价+大货包税；含油含税，免清关操作费150/票；带电+1/KG', 'needs_review', false, now()
) ON CONFLICT (country_code) DO UPDATE SET
  country_name = EXCLUDED.country_name, zone = EXCLUDED.zone,
  proposed_checkout_mode = EXCLUDED.proposed_checkout_mode,
  proposed_trade_terms = EXCLUDED.proposed_trade_terms,
  allowed_categories = EXCLUDED.allowed_categories, carrier = EXCLUDED.carrier,
  estimated_days_min = EXCLUDED.estimated_days_min,
  estimated_days_max = EXCLUDED.estimated_days_max, source_notes = EXCLUDED.source_notes,
  validation_status = EXCLUDED.validation_status, is_active = false, updated_at = now();

INSERT INTO public.shipping_country_rules (
  country_code, country_name, zone, proposed_checkout_mode, proposed_trade_terms,
  allowed_categories, carrier, estimated_days_min, estimated_days_max, source_notes,
  validation_status, is_active, updated_at
) VALUES (
  'CA', '加拿大', '北美',
  'DDP自动', 'DDP', '投影仪/支架(普货)', 'UPS(深圳/香港直发包税)',
  5.0, 8.0, '小货阶梯价+大货包税；含油含税，免清关操作费150/票；带电+1/KG', 'needs_review', false, now()
) ON CONFLICT (country_code) DO UPDATE SET
  country_name = EXCLUDED.country_name, zone = EXCLUDED.zone,
  proposed_checkout_mode = EXCLUDED.proposed_checkout_mode,
  proposed_trade_terms = EXCLUDED.proposed_trade_terms,
  allowed_categories = EXCLUDED.allowed_categories, carrier = EXCLUDED.carrier,
  estimated_days_min = EXCLUDED.estimated_days_min,
  estimated_days_max = EXCLUDED.estimated_days_max, source_notes = EXCLUDED.source_notes,
  validation_status = EXCLUDED.validation_status, is_active = false, updated_at = now();

INSERT INTO public.shipping_country_rules (
  country_code, country_name, zone, proposed_checkout_mode, proposed_trade_terms,
  allowed_categories, carrier, estimated_days_min, estimated_days_max, source_notes,
  validation_status, is_active, updated_at
) VALUES (
  'GB', '英国', '欧洲',
  'DDP自动', 'DDP', '投影仪/支架(普货)', 'UPS(韩国红单包税)',
  7.0, 10.0, '参考文件仅大货渠道(30-499KG,72/KG)；小货渠道待补充；含油含税，操作费150/票', 'needs_review', false, now()
) ON CONFLICT (country_code) DO UPDATE SET
  country_name = EXCLUDED.country_name, zone = EXCLUDED.zone,
  proposed_checkout_mode = EXCLUDED.proposed_checkout_mode,
  proposed_trade_terms = EXCLUDED.proposed_trade_terms,
  allowed_categories = EXCLUDED.allowed_categories, carrier = EXCLUDED.carrier,
  estimated_days_min = EXCLUDED.estimated_days_min,
  estimated_days_max = EXCLUDED.estimated_days_max, source_notes = EXCLUDED.source_notes,
  validation_status = EXCLUDED.validation_status, is_active = false, updated_at = now();

INSERT INTO public.shipping_country_rules (
  country_code, country_name, zone, proposed_checkout_mode, proposed_trade_terms,
  allowed_categories, carrier, estimated_days_min, estimated_days_max, source_notes,
  validation_status, is_active, updated_at
) VALUES (
  'DE', '德国', '欧洲',
  'DDP自动', 'DDP', '投影仪/支架(带电可)', 'ZCT欧洲空派包税(双清包税到门)',
  7.0, 9.0, '法/荷/德同价：首重1KG=300,续0.5KG=50,大货21KG+=85 RMB/KG(45+=85,100+=83,300+=83,500+=83)；含油含税双清包税到门', 'needs_review', false, now()
) ON CONFLICT (country_code) DO UPDATE SET
  country_name = EXCLUDED.country_name, zone = EXCLUDED.zone,
  proposed_checkout_mode = EXCLUDED.proposed_checkout_mode,
  proposed_trade_terms = EXCLUDED.proposed_trade_terms,
  allowed_categories = EXCLUDED.allowed_categories, carrier = EXCLUDED.carrier,
  estimated_days_min = EXCLUDED.estimated_days_min,
  estimated_days_max = EXCLUDED.estimated_days_max, source_notes = EXCLUDED.source_notes,
  validation_status = EXCLUDED.validation_status, is_active = false, updated_at = now();

INSERT INTO public.shipping_country_rules (
  country_code, country_name, zone, proposed_checkout_mode, proposed_trade_terms,
  allowed_categories, carrier, estimated_days_min, estimated_days_max, source_notes,
  validation_status, is_active, updated_at
) VALUES (
  'FR', '法国', '欧洲',
  'DDP自动', 'DDP', '投影仪/支架(带电可)', 'ZCT欧洲空派包税(双清包税到门)',
  7.0, 9.0, '法/荷/德同价：首重1KG=300,续0.5KG=50,大货21KG+=85 RMB/KG(45+=85,100+=83,300+=83,500+=83)；含油含税双清包税到门', 'needs_review', false, now()
) ON CONFLICT (country_code) DO UPDATE SET
  country_name = EXCLUDED.country_name, zone = EXCLUDED.zone,
  proposed_checkout_mode = EXCLUDED.proposed_checkout_mode,
  proposed_trade_terms = EXCLUDED.proposed_trade_terms,
  allowed_categories = EXCLUDED.allowed_categories, carrier = EXCLUDED.carrier,
  estimated_days_min = EXCLUDED.estimated_days_min,
  estimated_days_max = EXCLUDED.estimated_days_max, source_notes = EXCLUDED.source_notes,
  validation_status = EXCLUDED.validation_status, is_active = false, updated_at = now();

INSERT INTO public.shipping_country_rules (
  country_code, country_name, zone, proposed_checkout_mode, proposed_trade_terms,
  allowed_categories, carrier, estimated_days_min, estimated_days_max, source_notes,
  validation_status, is_active, updated_at
) VALUES (
  'IT', '意大利', '欧洲',
  'DDP自动', 'DDP', '投影仪/支架(带电可)', 'ZCT欧洲空派包税(双清包税到门)',
  7.0, 10.0, '意/西同价：首重1KG=315,续0.5KG=50,大货21KG+=86 RMB/KG(45+=86,100+=84,300+=84,500+=84)；含油含税双清包税到门', 'needs_review', false, now()
) ON CONFLICT (country_code) DO UPDATE SET
  country_name = EXCLUDED.country_name, zone = EXCLUDED.zone,
  proposed_checkout_mode = EXCLUDED.proposed_checkout_mode,
  proposed_trade_terms = EXCLUDED.proposed_trade_terms,
  allowed_categories = EXCLUDED.allowed_categories, carrier = EXCLUDED.carrier,
  estimated_days_min = EXCLUDED.estimated_days_min,
  estimated_days_max = EXCLUDED.estimated_days_max, source_notes = EXCLUDED.source_notes,
  validation_status = EXCLUDED.validation_status, is_active = false, updated_at = now();

INSERT INTO public.shipping_country_rules (
  country_code, country_name, zone, proposed_checkout_mode, proposed_trade_terms,
  allowed_categories, carrier, estimated_days_min, estimated_days_max, source_notes,
  validation_status, is_active, updated_at
) VALUES (
  'ES', '西班牙', '欧洲',
  'DDP自动', 'DDP', '投影仪/支架(带电可)', 'ZCT欧洲空派包税(双清包税到门)',
  7.0, 10.0, '意/西同价：首重1KG=315,续0.5KG=50,大货21KG+=86 RMB/KG(45+=86,100+=84,300+=84,500+=84)；含油含税双清包税到门', 'needs_review', false, now()
) ON CONFLICT (country_code) DO UPDATE SET
  country_name = EXCLUDED.country_name, zone = EXCLUDED.zone,
  proposed_checkout_mode = EXCLUDED.proposed_checkout_mode,
  proposed_trade_terms = EXCLUDED.proposed_trade_terms,
  allowed_categories = EXCLUDED.allowed_categories, carrier = EXCLUDED.carrier,
  estimated_days_min = EXCLUDED.estimated_days_min,
  estimated_days_max = EXCLUDED.estimated_days_max, source_notes = EXCLUDED.source_notes,
  validation_status = EXCLUDED.validation_status, is_active = false, updated_at = now();

INSERT INTO public.shipping_country_rules (
  country_code, country_name, zone, proposed_checkout_mode, proposed_trade_terms,
  allowed_categories, carrier, estimated_days_min, estimated_days_max, source_notes,
  validation_status, is_active, updated_at
) VALUES (
  'NL', '荷兰', '欧洲',
  'DDP自动', 'DDP', '投影仪/支架(带电可)', 'ZCT欧洲空派包税(双清包税到门)',
  7.0, 9.0, '法/荷/德同价：首重1KG=300,续0.5KG=50,大货21KG+=85 RMB/KG(45+=85,100+=83,300+=83,500+=83)；含油含税双清包税到门', 'needs_review', false, now()
) ON CONFLICT (country_code) DO UPDATE SET
  country_name = EXCLUDED.country_name, zone = EXCLUDED.zone,
  proposed_checkout_mode = EXCLUDED.proposed_checkout_mode,
  proposed_trade_terms = EXCLUDED.proposed_trade_terms,
  allowed_categories = EXCLUDED.allowed_categories, carrier = EXCLUDED.carrier,
  estimated_days_min = EXCLUDED.estimated_days_min,
  estimated_days_max = EXCLUDED.estimated_days_max, source_notes = EXCLUDED.source_notes,
  validation_status = EXCLUDED.validation_status, is_active = false, updated_at = now();

INSERT INTO public.shipping_country_rules (
  country_code, country_name, zone, proposed_checkout_mode, proposed_trade_terms,
  allowed_categories, carrier, estimated_days_min, estimated_days_max, source_notes,
  validation_status, is_active, updated_at
) VALUES (
  'AU', '澳大利亚', '亚太',
  'DDP自动', 'DDP', '投影仪/支架(带电可)', '商壹ComMail澳洲电商小包(双清包税)',
  7.0, 10.0, 'ECOM-PA：AUD1000以下无税金=实质DDP；限20KG内小包；体积/6000', 'needs_review', false, now()
) ON CONFLICT (country_code) DO UPDATE SET
  country_name = EXCLUDED.country_name, zone = EXCLUDED.zone,
  proposed_checkout_mode = EXCLUDED.proposed_checkout_mode,
  proposed_trade_terms = EXCLUDED.proposed_trade_terms,
  allowed_categories = EXCLUDED.allowed_categories, carrier = EXCLUDED.carrier,
  estimated_days_min = EXCLUDED.estimated_days_min,
  estimated_days_max = EXCLUDED.estimated_days_max, source_notes = EXCLUDED.source_notes,
  validation_status = EXCLUDED.validation_status, is_active = false, updated_at = now();

INSERT INTO public.shipping_country_rules (
  country_code, country_name, zone, proposed_checkout_mode, proposed_trade_terms,
  allowed_categories, carrier, estimated_days_min, estimated_days_max, source_notes,
  validation_status, is_active, updated_at
) VALUES (
  'NZ', '新西兰', '亚太',
  'DAP自动', 'DAP', '投影仪/支架(带电可)', 'DHL香港纯电池专线(含燃油/旺季)',
  2.0, 4.0, 'DHL香港纯电池促销价(含当月燃油+旺季附加费)；DAP：报价不含目的地税金，收件人负责进口清关并缴纳关税；21KG+大货按KG计价；隔天上网', 'needs_review', false, now()
) ON CONFLICT (country_code) DO UPDATE SET
  country_name = EXCLUDED.country_name, zone = EXCLUDED.zone,
  proposed_checkout_mode = EXCLUDED.proposed_checkout_mode,
  proposed_trade_terms = EXCLUDED.proposed_trade_terms,
  allowed_categories = EXCLUDED.allowed_categories, carrier = EXCLUDED.carrier,
  estimated_days_min = EXCLUDED.estimated_days_min,
  estimated_days_max = EXCLUDED.estimated_days_max, source_notes = EXCLUDED.source_notes,
  validation_status = EXCLUDED.validation_status, is_active = false, updated_at = now();

INSERT INTO public.shipping_country_rules (
  country_code, country_name, zone, proposed_checkout_mode, proposed_trade_terms,
  allowed_categories, carrier, estimated_days_min, estimated_days_max, source_notes,
  validation_status, is_active, updated_at
) VALUES (
  'JP', '日本', '亚太',
  'DDP自动', 'DDP', '投影仪/支架(带电可)', 'ZCT日本普货空派包税(FBA)',
  4.0, 7.0, '普货带电价 21KG+=32 RMB/KG(不带电22)；双清包税到门；体积/5000；4-7工作日', 'needs_review', false, now()
) ON CONFLICT (country_code) DO UPDATE SET
  country_name = EXCLUDED.country_name, zone = EXCLUDED.zone,
  proposed_checkout_mode = EXCLUDED.proposed_checkout_mode,
  proposed_trade_terms = EXCLUDED.proposed_trade_terms,
  allowed_categories = EXCLUDED.allowed_categories, carrier = EXCLUDED.carrier,
  estimated_days_min = EXCLUDED.estimated_days_min,
  estimated_days_max = EXCLUDED.estimated_days_max, source_notes = EXCLUDED.source_notes,
  validation_status = EXCLUDED.validation_status, is_active = false, updated_at = now();

INSERT INTO public.shipping_country_rules (
  country_code, country_name, zone, proposed_checkout_mode, proposed_trade_terms,
  allowed_categories, carrier, estimated_days_min, estimated_days_max, source_notes,
  validation_status, is_active, updated_at
) VALUES (
  'KR', '韩国', '亚太',
  'DDP自动', 'DDP', '投影仪/支架(带电可)', '商壹韩国专线 / UPS韩国红单包税',
  2.0, 6.0, 'KR05-AA快船双清包税；一日达(KR01-YA)2-3天；拒收纯电池', 'needs_review', false, now()
) ON CONFLICT (country_code) DO UPDATE SET
  country_name = EXCLUDED.country_name, zone = EXCLUDED.zone,
  proposed_checkout_mode = EXCLUDED.proposed_checkout_mode,
  proposed_trade_terms = EXCLUDED.proposed_trade_terms,
  allowed_categories = EXCLUDED.allowed_categories, carrier = EXCLUDED.carrier,
  estimated_days_min = EXCLUDED.estimated_days_min,
  estimated_days_max = EXCLUDED.estimated_days_max, source_notes = EXCLUDED.source_notes,
  validation_status = EXCLUDED.validation_status, is_active = false, updated_at = now();

INSERT INTO public.shipping_country_rules (
  country_code, country_name, zone, proposed_checkout_mode, proposed_trade_terms,
  allowed_categories, carrier, estimated_days_min, estimated_days_max, source_notes,
  validation_status, is_active, updated_at
) VALUES (
  'SG', '新加坡', '亚太',
  'DDP自动', 'DDP', '投影仪/支架(普货)', '商壹新加坡专线',
  3.0, 5.0, '注：商壹新加坡专线名义DDU(不含税)，双清包税待向货代书面确认；当前按参考文件普货标准价填', 'needs_review', false, now()
) ON CONFLICT (country_code) DO UPDATE SET
  country_name = EXCLUDED.country_name, zone = EXCLUDED.zone,
  proposed_checkout_mode = EXCLUDED.proposed_checkout_mode,
  proposed_trade_terms = EXCLUDED.proposed_trade_terms,
  allowed_categories = EXCLUDED.allowed_categories, carrier = EXCLUDED.carrier,
  estimated_days_min = EXCLUDED.estimated_days_min,
  estimated_days_max = EXCLUDED.estimated_days_max, source_notes = EXCLUDED.source_notes,
  validation_status = EXCLUDED.validation_status, is_active = false, updated_at = now();

INSERT INTO public.shipping_country_rules (
  country_code, country_name, zone, proposed_checkout_mode, proposed_trade_terms,
  allowed_categories, carrier, estimated_days_min, estimated_days_max, source_notes,
  validation_status, is_active, updated_at
) VALUES (
  'MY', '马来西亚', '亚太',
  'DDP自动', 'DDP', '投影仪/支架(普货/带电可)', 'ComOne Express 马来西亚空派专线DDP（含税）',
  3.0, 5.0, '西马/东马按邮编区分：87***-999**为东马，其余为西马；普货默认走西马普货含税MY03-PB/东马普货含税MY07-PB；带电走西马内电含税MY04-DB；香港交货为MY01-HKB/MY02-HKB；商壹新马海运小包仍保留作为海运备选。', 'needs_review', false, now()
) ON CONFLICT (country_code) DO UPDATE SET
  country_name = EXCLUDED.country_name, zone = EXCLUDED.zone,
  proposed_checkout_mode = EXCLUDED.proposed_checkout_mode,
  proposed_trade_terms = EXCLUDED.proposed_trade_terms,
  allowed_categories = EXCLUDED.allowed_categories, carrier = EXCLUDED.carrier,
  estimated_days_min = EXCLUDED.estimated_days_min,
  estimated_days_max = EXCLUDED.estimated_days_max, source_notes = EXCLUDED.source_notes,
  validation_status = EXCLUDED.validation_status, is_active = false, updated_at = now();

INSERT INTO public.shipping_country_rules (
  country_code, country_name, zone, proposed_checkout_mode, proposed_trade_terms,
  allowed_categories, carrier, estimated_days_min, estimated_days_max, source_notes,
  validation_status, is_active, updated_at
) VALUES (
  'TH', '泰国', '亚太',
  'DDP自动', 'DDP', '投影仪/支架(普货/内电)', '商壹泰国陆运专线',
  5.0, 8.0, 'TH01曼谷普货内电；按用户政策视为双清包税，建议向货代确认', 'conflict', false, now()
) ON CONFLICT (country_code) DO UPDATE SET
  country_name = EXCLUDED.country_name, zone = EXCLUDED.zone,
  proposed_checkout_mode = EXCLUDED.proposed_checkout_mode,
  proposed_trade_terms = EXCLUDED.proposed_trade_terms,
  allowed_categories = EXCLUDED.allowed_categories, carrier = EXCLUDED.carrier,
  estimated_days_min = EXCLUDED.estimated_days_min,
  estimated_days_max = EXCLUDED.estimated_days_max, source_notes = EXCLUDED.source_notes,
  validation_status = EXCLUDED.validation_status, is_active = false, updated_at = now();

INSERT INTO public.shipping_country_rules (
  country_code, country_name, zone, proposed_checkout_mode, proposed_trade_terms,
  allowed_categories, carrier, estimated_days_min, estimated_days_max, source_notes,
  validation_status, is_active, updated_at
) VALUES (
  'AE', '阿联酋', '中东',
  'DDP自动', 'DDP', '投影仪/支架(普货/带电)', '商壹阿联酋专线(双清包税)',
  6.0, 10.0, 'AE01-B普货带电迪拜；AE07-B普货特价大货；不接化工/粉末/电池/药品', 'needs_review', false, now()
) ON CONFLICT (country_code) DO UPDATE SET
  country_name = EXCLUDED.country_name, zone = EXCLUDED.zone,
  proposed_checkout_mode = EXCLUDED.proposed_checkout_mode,
  proposed_trade_terms = EXCLUDED.proposed_trade_terms,
  allowed_categories = EXCLUDED.allowed_categories, carrier = EXCLUDED.carrier,
  estimated_days_min = EXCLUDED.estimated_days_min,
  estimated_days_max = EXCLUDED.estimated_days_max, source_notes = EXCLUDED.source_notes,
  validation_status = EXCLUDED.validation_status, is_active = false, updated_at = now();

INSERT INTO public.shipping_country_rules (
  country_code, country_name, zone, proposed_checkout_mode, proposed_trade_terms,
  allowed_categories, carrier, estimated_days_min, estimated_days_max, source_notes,
  validation_status, is_active, updated_at
) VALUES (
  'SA', '沙特阿拉伯', '中东',
  'DAP自动', 'DAP', '投影仪/支架(带电可)', 'DHL香港纯电池专线(含燃油/旺季)',
  2.0, 4.0, 'DHL香港纯电池促销价(含当月燃油+旺季附加费)；DAP：报价不含目的地税金，收件人负责进口清关并缴纳关税；21KG+大货按KG计价；隔天上网', 'needs_review', false, now()
) ON CONFLICT (country_code) DO UPDATE SET
  country_name = EXCLUDED.country_name, zone = EXCLUDED.zone,
  proposed_checkout_mode = EXCLUDED.proposed_checkout_mode,
  proposed_trade_terms = EXCLUDED.proposed_trade_terms,
  allowed_categories = EXCLUDED.allowed_categories, carrier = EXCLUDED.carrier,
  estimated_days_min = EXCLUDED.estimated_days_min,
  estimated_days_max = EXCLUDED.estimated_days_max, source_notes = EXCLUDED.source_notes,
  validation_status = EXCLUDED.validation_status, is_active = false, updated_at = now();

INSERT INTO public.shipping_country_rules (
  country_code, country_name, zone, proposed_checkout_mode, proposed_trade_terms,
  allowed_categories, carrier, estimated_days_min, estimated_days_max, source_notes,
  validation_status, is_active, updated_at
) VALUES (
  'MX', '墨西哥', '美洲',
  'DDP自动', 'DDP', '投影仪/支架(带电可)', 'ZCT墨西哥专线双清包税',
  18.0, 22.0, '10-20KG=134,21KG+=105(31+=104,51+=102,101+=100) RMB/KG；含目的地关税及燃油；18-22工作日', 'needs_review', false, now()
) ON CONFLICT (country_code) DO UPDATE SET
  country_name = EXCLUDED.country_name, zone = EXCLUDED.zone,
  proposed_checkout_mode = EXCLUDED.proposed_checkout_mode,
  proposed_trade_terms = EXCLUDED.proposed_trade_terms,
  allowed_categories = EXCLUDED.allowed_categories, carrier = EXCLUDED.carrier,
  estimated_days_min = EXCLUDED.estimated_days_min,
  estimated_days_max = EXCLUDED.estimated_days_max, source_notes = EXCLUDED.source_notes,
  validation_status = EXCLUDED.validation_status, is_active = false, updated_at = now();

INSERT INTO public.shipping_country_rules (
  country_code, country_name, zone, proposed_checkout_mode, proposed_trade_terms,
  allowed_categories, carrier, estimated_days_min, estimated_days_max, source_notes,
  validation_status, is_active, updated_at
) VALUES (
  'BR', '巴西', '南美',
  'DAP自动', 'DAP', '投影仪/支架(带电可)', 'DHL香港纯电池专线(含燃油/旺季)',
  2.0, 4.0, 'DHL香港纯电池促销价(含当月燃油+旺季附加费)；DAP：报价不含目的地税金，收件人负责进口清关并缴纳关税；21KG+大货按KG计价；隔天上网', 'needs_review', false, now()
) ON CONFLICT (country_code) DO UPDATE SET
  country_name = EXCLUDED.country_name, zone = EXCLUDED.zone,
  proposed_checkout_mode = EXCLUDED.proposed_checkout_mode,
  proposed_trade_terms = EXCLUDED.proposed_trade_terms,
  allowed_categories = EXCLUDED.allowed_categories, carrier = EXCLUDED.carrier,
  estimated_days_min = EXCLUDED.estimated_days_min,
  estimated_days_max = EXCLUDED.estimated_days_max, source_notes = EXCLUDED.source_notes,
  validation_status = EXCLUDED.validation_status, is_active = false, updated_at = now();

INSERT INTO public.shipping_country_rules (
  country_code, country_name, zone, proposed_checkout_mode, proposed_trade_terms,
  allowed_categories, carrier, estimated_days_min, estimated_days_max, source_notes,
  validation_status, is_active, updated_at
) VALUES (
  'ZA', '南非', '非洲',
  '人工报价', 'DDP', '待确认', '待确认',
  NULL, NULL, '参考文件未含该国费率，待补充货代报价', 'needs_review', false, now()
) ON CONFLICT (country_code) DO UPDATE SET
  country_name = EXCLUDED.country_name, zone = EXCLUDED.zone,
  proposed_checkout_mode = EXCLUDED.proposed_checkout_mode,
  proposed_trade_terms = EXCLUDED.proposed_trade_terms,
  allowed_categories = EXCLUDED.allowed_categories, carrier = EXCLUDED.carrier,
  estimated_days_min = EXCLUDED.estimated_days_min,
  estimated_days_max = EXCLUDED.estimated_days_max, source_notes = EXCLUDED.source_notes,
  validation_status = EXCLUDED.validation_status, is_active = false, updated_at = now();

INSERT INTO public.shipping_country_rules (
  country_code, country_name, zone, proposed_checkout_mode, proposed_trade_terms,
  allowed_categories, carrier, estimated_days_min, estimated_days_max, source_notes,
  validation_status, is_active, updated_at
) VALUES (
  'TW', '台湾', '台湾',
  'DDU自动', 'DDU', '投影仪/支架(带电可)', 'ZCT台湾空派(双清不包税)',
  1.0, 2.0, '⚠️台湾为【双清不包税 DDU】，与DDP政策冲突：目的地关税由收件人承担，前台须明确提示，不得承诺包税', 'needs_review', false, now()
) ON CONFLICT (country_code) DO UPDATE SET
  country_name = EXCLUDED.country_name, zone = EXCLUDED.zone,
  proposed_checkout_mode = EXCLUDED.proposed_checkout_mode,
  proposed_trade_terms = EXCLUDED.proposed_trade_terms,
  allowed_categories = EXCLUDED.allowed_categories, carrier = EXCLUDED.carrier,
  estimated_days_min = EXCLUDED.estimated_days_min,
  estimated_days_max = EXCLUDED.estimated_days_max, source_notes = EXCLUDED.source_notes,
  validation_status = EXCLUDED.validation_status, is_active = false, updated_at = now();

INSERT INTO public.shipping_country_rules (
  country_code, country_name, zone, proposed_checkout_mode, proposed_trade_terms,
  allowed_categories, carrier, estimated_days_min, estimated_days_max, source_notes,
  validation_status, is_active, updated_at
) VALUES (
  'RU', '俄罗斯', '俄罗斯',
  'DDP自动', 'DDP', '投影仪/支架(带电可)', 'ZCT俄罗斯陆运专线(双清包税)',
  18.0, 22.0, '陆运纯电池专线 双清包税到门；首重0.5KG=190,续0.5=40,大货21-44=49,45-70=48,71-99=47,100-299=46 RMB/KG；体积/6000', 'needs_review', false, now()
) ON CONFLICT (country_code) DO UPDATE SET
  country_name = EXCLUDED.country_name, zone = EXCLUDED.zone,
  proposed_checkout_mode = EXCLUDED.proposed_checkout_mode,
  proposed_trade_terms = EXCLUDED.proposed_trade_terms,
  allowed_categories = EXCLUDED.allowed_categories, carrier = EXCLUDED.carrier,
  estimated_days_min = EXCLUDED.estimated_days_min,
  estimated_days_max = EXCLUDED.estimated_days_max, source_notes = EXCLUDED.source_notes,
  validation_status = EXCLUDED.validation_status, is_active = false, updated_at = now();

INSERT INTO public.shipping_country_rules (
  country_code, country_name, zone, proposed_checkout_mode, proposed_trade_terms,
  allowed_categories, carrier, estimated_days_min, estimated_days_max, source_notes,
  validation_status, is_active, updated_at
) VALUES (
  'KH', '柬埔寨', '亚太',
  'DDP自动', 'DDP', '投影仪/支架(带电可)/敏感货', '柬埔寨专线(包税)普通快递',
  3.0, 6.0, 'DHL香港纯电池促销价(含当月燃油+旺季附加费)；DAP：报价不含目的地税金，收件人负责进口清关并缴纳关税；21KG+大货按KG计价；隔天上网', 'needs_review', false, now()
) ON CONFLICT (country_code) DO UPDATE SET
  country_name = EXCLUDED.country_name, zone = EXCLUDED.zone,
  proposed_checkout_mode = EXCLUDED.proposed_checkout_mode,
  proposed_trade_terms = EXCLUDED.proposed_trade_terms,
  allowed_categories = EXCLUDED.allowed_categories, carrier = EXCLUDED.carrier,
  estimated_days_min = EXCLUDED.estimated_days_min,
  estimated_days_max = EXCLUDED.estimated_days_max, source_notes = EXCLUDED.source_notes,
  validation_status = EXCLUDED.validation_status, is_active = false, updated_at = now();

INSERT INTO public.shipping_country_rules (
  country_code, country_name, zone, proposed_checkout_mode, proposed_trade_terms,
  allowed_categories, carrier, estimated_days_min, estimated_days_max, source_notes,
  validation_status, is_active, updated_at
) VALUES (
  'ID', '印度尼西亚', '亚太',
  'DDP自动', 'DDP', '内置电池/带磁/化妆品/护肤品/日化/食品/木箱木架', '印尼专线(包税)敏感货快线(YC/F)',
  5.0, 7.0, 'DHL香港纯电池促销价(含当月燃油+旺季附加费)；DAP：报价不含目的地税金，收件人负责进口清关并缴纳关税；21KG+大货按KG计价；隔天上网', 'needs_review', false, now()
) ON CONFLICT (country_code) DO UPDATE SET
  country_name = EXCLUDED.country_name, zone = EXCLUDED.zone,
  proposed_checkout_mode = EXCLUDED.proposed_checkout_mode,
  proposed_trade_terms = EXCLUDED.proposed_trade_terms,
  allowed_categories = EXCLUDED.allowed_categories, carrier = EXCLUDED.carrier,
  estimated_days_min = EXCLUDED.estimated_days_min,
  estimated_days_max = EXCLUDED.estimated_days_max, source_notes = EXCLUDED.source_notes,
  validation_status = EXCLUDED.validation_status, is_active = false, updated_at = now();

INSERT INTO public.shipping_country_rules (
  country_code, country_name, zone, proposed_checkout_mode, proposed_trade_terms,
  allowed_categories, carrier, estimated_days_min, estimated_days_max, source_notes,
  validation_status, is_active, updated_at
) VALUES (
  'VN', '越南', '亚太',
  'DDP自动', 'DDP', '投影仪/支架(普货)', '越南专线(包税)加急快递',
  1.0, 3.0, 'DHL香港纯电池促销价(含当月燃油+旺季附加费)；DAP：报价不含目的地税金，收件人负责进口清关并缴纳关税；21KG+大货按KG计价；隔天上网', 'needs_review', false, now()
) ON CONFLICT (country_code) DO UPDATE SET
  country_name = EXCLUDED.country_name, zone = EXCLUDED.zone,
  proposed_checkout_mode = EXCLUDED.proposed_checkout_mode,
  proposed_trade_terms = EXCLUDED.proposed_trade_terms,
  allowed_categories = EXCLUDED.allowed_categories, carrier = EXCLUDED.carrier,
  estimated_days_min = EXCLUDED.estimated_days_min,
  estimated_days_max = EXCLUDED.estimated_days_max, source_notes = EXCLUDED.source_notes,
  validation_status = EXCLUDED.validation_status, is_active = false, updated_at = now();

INSERT INTO public.shipping_country_rules (
  country_code, country_name, zone, proposed_checkout_mode, proposed_trade_terms,
  allowed_categories, carrier, estimated_days_min, estimated_days_max, source_notes,
  validation_status, is_active, updated_at
) VALUES (
  'PH', '菲律宾', '亚太',
  'DDP自动', 'DDP', '投影仪/支架(带电可)/内电杂货', '菲律宾专线 空运双清包税(USD)',
  2.0, 3.0, 'DHL香港纯电池促销价(含当月燃油+旺季附加费)；DAP：报价不含目的地税金，收件人负责进口清关并缴纳关税；21KG+大货按KG计价；隔天上网', 'needs_review', false, now()
) ON CONFLICT (country_code) DO UPDATE SET
  country_name = EXCLUDED.country_name, zone = EXCLUDED.zone,
  proposed_checkout_mode = EXCLUDED.proposed_checkout_mode,
  proposed_trade_terms = EXCLUDED.proposed_trade_terms,
  allowed_categories = EXCLUDED.allowed_categories, carrier = EXCLUDED.carrier,
  estimated_days_min = EXCLUDED.estimated_days_min,
  estimated_days_max = EXCLUDED.estimated_days_max, source_notes = EXCLUDED.source_notes,
  validation_status = EXCLUDED.validation_status, is_active = false, updated_at = now();

INSERT INTO public.shipping_country_rules (
  country_code, country_name, zone, proposed_checkout_mode, proposed_trade_terms,
  allowed_categories, carrier, estimated_days_min, estimated_days_max, source_notes,
  validation_status, is_active, updated_at
) VALUES (
  'PR', '波多黎各', '美洲',
  'DAP自动', 'DAP', '投影仪/支架(带电可)', 'DHL香港纯电池专线(含燃油/旺季)',
  2.0, 4.0, 'DHL香港纯电池促销价(含当月燃油+旺季附加费)；DAP：报价不含目的地税金，收件人负责进口清关并缴纳关税；21KG+大货按KG计价；隔天上网', 'needs_review', false, now()
) ON CONFLICT (country_code) DO UPDATE SET
  country_name = EXCLUDED.country_name, zone = EXCLUDED.zone,
  proposed_checkout_mode = EXCLUDED.proposed_checkout_mode,
  proposed_trade_terms = EXCLUDED.proposed_trade_terms,
  allowed_categories = EXCLUDED.allowed_categories, carrier = EXCLUDED.carrier,
  estimated_days_min = EXCLUDED.estimated_days_min,
  estimated_days_max = EXCLUDED.estimated_days_max, source_notes = EXCLUDED.source_notes,
  validation_status = EXCLUDED.validation_status, is_active = false, updated_at = now();

INSERT INTO public.shipping_country_rules (
  country_code, country_name, zone, proposed_checkout_mode, proposed_trade_terms,
  allowed_categories, carrier, estimated_days_min, estimated_days_max, source_notes,
  validation_status, is_active, updated_at
) VALUES (
  'IN', '印度', '亚太',
  'DAP自动', 'DAP', '投影仪/支架(带电可)', 'DHL香港纯电池专线(含燃油/旺季)',
  2.0, 4.0, 'DHL香港纯电池促销价(含当月燃油+旺季附加费)；DAP：报价不含目的地税金，收件人负责进口清关并缴纳关税；21KG+大货按KG计价；隔天上网', 'needs_review', false, now()
) ON CONFLICT (country_code) DO UPDATE SET
  country_name = EXCLUDED.country_name, zone = EXCLUDED.zone,
  proposed_checkout_mode = EXCLUDED.proposed_checkout_mode,
  proposed_trade_terms = EXCLUDED.proposed_trade_terms,
  allowed_categories = EXCLUDED.allowed_categories, carrier = EXCLUDED.carrier,
  estimated_days_min = EXCLUDED.estimated_days_min,
  estimated_days_max = EXCLUDED.estimated_days_max, source_notes = EXCLUDED.source_notes,
  validation_status = EXCLUDED.validation_status, is_active = false, updated_at = now();

INSERT INTO public.shipping_country_rules (
  country_code, country_name, zone, proposed_checkout_mode, proposed_trade_terms,
  allowed_categories, carrier, estimated_days_min, estimated_days_max, source_notes,
  validation_status, is_active, updated_at
) VALUES (
  'TR', '土耳其', '中东',
  'DAP自动', 'DAP', '投影仪/支架(带电可)', 'DHL香港纯电池专线(含燃油/旺季)',
  2.0, 4.0, 'DHL香港纯电池促销价(含当月燃油+旺季附加费)；DAP：报价不含目的地税金，收件人自负关税清关；21KG+大货按KG计价；隔天上网', 'needs_review', false, now()
) ON CONFLICT (country_code) DO UPDATE SET
  country_name = EXCLUDED.country_name, zone = EXCLUDED.zone,
  proposed_checkout_mode = EXCLUDED.proposed_checkout_mode,
  proposed_trade_terms = EXCLUDED.proposed_trade_terms,
  allowed_categories = EXCLUDED.allowed_categories, carrier = EXCLUDED.carrier,
  estimated_days_min = EXCLUDED.estimated_days_min,
  estimated_days_max = EXCLUDED.estimated_days_max, source_notes = EXCLUDED.source_notes,
  validation_status = EXCLUDED.validation_status, is_active = false, updated_at = now();

INSERT INTO public.shipping_country_rules (
  country_code, country_name, zone, proposed_checkout_mode, proposed_trade_terms,
  allowed_categories, carrier, estimated_days_min, estimated_days_max, source_notes,
  validation_status, is_active, updated_at
) VALUES (
  'PK', '巴基斯坦', '亚太',
  'DAP自动', 'DAP', '投影仪/支架(带电可)', 'DHL香港纯电池专线(含燃油/旺季)',
  2.0, 4.0, 'DHL香港纯电池促销价；DAP：不含目的地税金；注商壹另有巴基斯坦空运DDP双清包税渠道(PK-P04等)，可改DDP', 'needs_review', false, now()
) ON CONFLICT (country_code) DO UPDATE SET
  country_name = EXCLUDED.country_name, zone = EXCLUDED.zone,
  proposed_checkout_mode = EXCLUDED.proposed_checkout_mode,
  proposed_trade_terms = EXCLUDED.proposed_trade_terms,
  allowed_categories = EXCLUDED.allowed_categories, carrier = EXCLUDED.carrier,
  estimated_days_min = EXCLUDED.estimated_days_min,
  estimated_days_max = EXCLUDED.estimated_days_max, source_notes = EXCLUDED.source_notes,
  validation_status = EXCLUDED.validation_status, is_active = false, updated_at = now();

INSERT INTO public.shipping_country_rules (
  country_code, country_name, zone, proposed_checkout_mode, proposed_trade_terms,
  allowed_categories, carrier, estimated_days_min, estimated_days_max, source_notes,
  validation_status, is_active, updated_at
) VALUES (
  'IL', '以色列', '中东',
  'DAP自动', 'DAP', '投影仪/支架(带电可)', 'DHL香港纯电池专线(含燃油/旺季)',
  2.0, 4.0, 'DHL香港纯电池促销价；DAP：不含目的地税金，收件人自负关税清关；21KG+大货按KG计价', 'needs_review', false, now()
) ON CONFLICT (country_code) DO UPDATE SET
  country_name = EXCLUDED.country_name, zone = EXCLUDED.zone,
  proposed_checkout_mode = EXCLUDED.proposed_checkout_mode,
  proposed_trade_terms = EXCLUDED.proposed_trade_terms,
  allowed_categories = EXCLUDED.allowed_categories, carrier = EXCLUDED.carrier,
  estimated_days_min = EXCLUDED.estimated_days_min,
  estimated_days_max = EXCLUDED.estimated_days_max, source_notes = EXCLUDED.source_notes,
  validation_status = EXCLUDED.validation_status, is_active = false, updated_at = now();

INSERT INTO public.shipping_country_rules (
  country_code, country_name, zone, proposed_checkout_mode, proposed_trade_terms,
  allowed_categories, carrier, estimated_days_min, estimated_days_max, source_notes,
  validation_status, is_active, updated_at
) VALUES (
  'CY', '塞浦路斯', '欧洲',
  'DAP自动', 'DAP', '投影仪/支架(带电可)', 'DHL香港纯电池专线(含燃油/旺季)',
  2.0, 4.0, 'DHL香港纯电池促销价；DAP：不含目的地税金，收件人自负关税清关；21KG+大货按KG计价', 'needs_review', false, now()
) ON CONFLICT (country_code) DO UPDATE SET
  country_name = EXCLUDED.country_name, zone = EXCLUDED.zone,
  proposed_checkout_mode = EXCLUDED.proposed_checkout_mode,
  proposed_trade_terms = EXCLUDED.proposed_trade_terms,
  allowed_categories = EXCLUDED.allowed_categories, carrier = EXCLUDED.carrier,
  estimated_days_min = EXCLUDED.estimated_days_min,
  estimated_days_max = EXCLUDED.estimated_days_max, source_notes = EXCLUDED.source_notes,
  validation_status = EXCLUDED.validation_status, is_active = false, updated_at = now();

INSERT INTO public.shipping_country_rules (
  country_code, country_name, zone, proposed_checkout_mode, proposed_trade_terms,
  allowed_categories, carrier, estimated_days_min, estimated_days_max, source_notes,
  validation_status, is_active, updated_at
) VALUES (
  'GR', '希腊', '欧洲',
  'DAP自动', 'DDP', '投影仪/支架(带电可)', 'DHL香港纯电池专线(含燃油/旺季)',
  2.0, 4.0, 'DHL香港纯电池促销价；DAP：不含目的地税金，收件人自负关税清关；21KG+大货按KG计价', 'conflict', false, now()
) ON CONFLICT (country_code) DO UPDATE SET
  country_name = EXCLUDED.country_name, zone = EXCLUDED.zone,
  proposed_checkout_mode = EXCLUDED.proposed_checkout_mode,
  proposed_trade_terms = EXCLUDED.proposed_trade_terms,
  allowed_categories = EXCLUDED.allowed_categories, carrier = EXCLUDED.carrier,
  estimated_days_min = EXCLUDED.estimated_days_min,
  estimated_days_max = EXCLUDED.estimated_days_max, source_notes = EXCLUDED.source_notes,
  validation_status = EXCLUDED.validation_status, is_active = false, updated_at = now();

INSERT INTO public.shipping_country_rules (
  country_code, country_name, zone, proposed_checkout_mode, proposed_trade_terms,
  allowed_categories, carrier, estimated_days_min, estimated_days_max, source_notes,
  validation_status, is_active, updated_at
) VALUES (
  'HR', '克罗地亚', '欧洲',
  'DAP自动', 'DDP', '投影仪/支架(带电可)', 'DHL香港纯电池专线(含燃油/旺季)',
  2.0, 4.0, 'DHL香港纯电池促销价；DAP：不含目的地税金，收件人自负关税清关；21KG+大货按KG计价', 'conflict', false, now()
) ON CONFLICT (country_code) DO UPDATE SET
  country_name = EXCLUDED.country_name, zone = EXCLUDED.zone,
  proposed_checkout_mode = EXCLUDED.proposed_checkout_mode,
  proposed_trade_terms = EXCLUDED.proposed_trade_terms,
  allowed_categories = EXCLUDED.allowed_categories, carrier = EXCLUDED.carrier,
  estimated_days_min = EXCLUDED.estimated_days_min,
  estimated_days_max = EXCLUDED.estimated_days_max, source_notes = EXCLUDED.source_notes,
  validation_status = EXCLUDED.validation_status, is_active = false, updated_at = now();

INSERT INTO public.shipping_country_rules (
  country_code, country_name, zone, proposed_checkout_mode, proposed_trade_terms,
  allowed_categories, carrier, estimated_days_min, estimated_days_max, source_notes,
  validation_status, is_active, updated_at
) VALUES (
  'LV', '拉脱维亚', '欧洲',
  'DDP自动', 'DDP', '投影仪/支架(带电可)', '欧洲专线包税(USD,双清包税到门)',
  7.0, 9.0, 'DHL香港纯电池促销价；DAP：不含目的地税金，收件人自负关税清关；21KG+大货按KG计价', 'needs_review', false, now()
) ON CONFLICT (country_code) DO UPDATE SET
  country_name = EXCLUDED.country_name, zone = EXCLUDED.zone,
  proposed_checkout_mode = EXCLUDED.proposed_checkout_mode,
  proposed_trade_terms = EXCLUDED.proposed_trade_terms,
  allowed_categories = EXCLUDED.allowed_categories, carrier = EXCLUDED.carrier,
  estimated_days_min = EXCLUDED.estimated_days_min,
  estimated_days_max = EXCLUDED.estimated_days_max, source_notes = EXCLUDED.source_notes,
  validation_status = EXCLUDED.validation_status, is_active = false, updated_at = now();

INSERT INTO public.shipping_country_rules (
  country_code, country_name, zone, proposed_checkout_mode, proposed_trade_terms,
  allowed_categories, carrier, estimated_days_min, estimated_days_max, source_notes,
  validation_status, is_active, updated_at
) VALUES (
  'MT', '马耳他', '欧洲',
  'DAP自动', 'DAP', '投影仪/支架(带电可)', 'DHL香港纯电池专线(含燃油/旺季)',
  2.0, 4.0, 'DHL香港纯电池促销价；DAP：不含目的地税金，收件人自负关税清关；21KG+大货按KG计价', 'needs_review', false, now()
) ON CONFLICT (country_code) DO UPDATE SET
  country_name = EXCLUDED.country_name, zone = EXCLUDED.zone,
  proposed_checkout_mode = EXCLUDED.proposed_checkout_mode,
  proposed_trade_terms = EXCLUDED.proposed_trade_terms,
  allowed_categories = EXCLUDED.allowed_categories, carrier = EXCLUDED.carrier,
  estimated_days_min = EXCLUDED.estimated_days_min,
  estimated_days_max = EXCLUDED.estimated_days_max, source_notes = EXCLUDED.source_notes,
  validation_status = EXCLUDED.validation_status, is_active = false, updated_at = now();

INSERT INTO public.shipping_country_rules (
  country_code, country_name, zone, proposed_checkout_mode, proposed_trade_terms,
  allowed_categories, carrier, estimated_days_min, estimated_days_max, source_notes,
  validation_status, is_active, updated_at
) VALUES (
  'RO', '罗马尼亚', '欧洲',
  'DAP自动', 'DAP', '投影仪/支架(带电可)', 'DHL香港纯电池专线(含燃油/旺季)',
  2.0, 4.0, 'DHL香港纯电池促销价；DAP：不含目的地税金，收件人自负关税清关；21KG+大货按KG计价', 'needs_review', false, now()
) ON CONFLICT (country_code) DO UPDATE SET
  country_name = EXCLUDED.country_name, zone = EXCLUDED.zone,
  proposed_checkout_mode = EXCLUDED.proposed_checkout_mode,
  proposed_trade_terms = EXCLUDED.proposed_trade_terms,
  allowed_categories = EXCLUDED.allowed_categories, carrier = EXCLUDED.carrier,
  estimated_days_min = EXCLUDED.estimated_days_min,
  estimated_days_max = EXCLUDED.estimated_days_max, source_notes = EXCLUDED.source_notes,
  validation_status = EXCLUDED.validation_status, is_active = false, updated_at = now();

INSERT INTO public.shipping_country_rules (
  country_code, country_name, zone, proposed_checkout_mode, proposed_trade_terms,
  allowed_categories, carrier, estimated_days_min, estimated_days_max, source_notes,
  validation_status, is_active, updated_at
) VALUES (
  'EE', '爱沙尼亚', '欧洲',
  'DDP自动', 'DDP', '投影仪/支架(带电可)', '欧洲专线包税(USD,双清包税到门)',
  7.0, 9.0, 'DHL香港纯电池促销价；DAP：不含目的地税金，收件人自负关税清关；21KG+大货按KG计价', 'needs_review', false, now()
) ON CONFLICT (country_code) DO UPDATE SET
  country_name = EXCLUDED.country_name, zone = EXCLUDED.zone,
  proposed_checkout_mode = EXCLUDED.proposed_checkout_mode,
  proposed_trade_terms = EXCLUDED.proposed_trade_terms,
  allowed_categories = EXCLUDED.allowed_categories, carrier = EXCLUDED.carrier,
  estimated_days_min = EXCLUDED.estimated_days_min,
  estimated_days_max = EXCLUDED.estimated_days_max, source_notes = EXCLUDED.source_notes,
  validation_status = EXCLUDED.validation_status, is_active = false, updated_at = now();

INSERT INTO public.shipping_country_rules (
  country_code, country_name, zone, proposed_checkout_mode, proposed_trade_terms,
  allowed_categories, carrier, estimated_days_min, estimated_days_max, source_notes,
  validation_status, is_active, updated_at
) VALUES (
  'FI', '芬兰', '欧洲',
  'DDP自动', 'DDP', '投影仪/支架(带电可)', '欧洲专线包税(USD,双清包税到门)',
  7.0, 9.0, 'DHL香港纯电池促销价；DAP：不含目的地税金，收件人自负关税清关；21KG+大货按KG计价', 'needs_review', false, now()
) ON CONFLICT (country_code) DO UPDATE SET
  country_name = EXCLUDED.country_name, zone = EXCLUDED.zone,
  proposed_checkout_mode = EXCLUDED.proposed_checkout_mode,
  proposed_trade_terms = EXCLUDED.proposed_trade_terms,
  allowed_categories = EXCLUDED.allowed_categories, carrier = EXCLUDED.carrier,
  estimated_days_min = EXCLUDED.estimated_days_min,
  estimated_days_max = EXCLUDED.estimated_days_max, source_notes = EXCLUDED.source_notes,
  validation_status = EXCLUDED.validation_status, is_active = false, updated_at = now();

INSERT INTO public.shipping_country_rules (
  country_code, country_name, zone, proposed_checkout_mode, proposed_trade_terms,
  allowed_categories, carrier, estimated_days_min, estimated_days_max, source_notes,
  validation_status, is_active, updated_at
) VALUES (
  'NO', '挪威', '欧洲',
  'DAP自动', 'DAP', '投影仪/支架(带电可)', 'DHL香港纯电池专线(含燃油/旺季)',
  2.0, 4.0, 'DHL香港纯电池促销价；DAP：不含目的地税金，收件人自负关税清关；21KG+大货按KG计价', 'needs_review', false, now()
) ON CONFLICT (country_code) DO UPDATE SET
  country_name = EXCLUDED.country_name, zone = EXCLUDED.zone,
  proposed_checkout_mode = EXCLUDED.proposed_checkout_mode,
  proposed_trade_terms = EXCLUDED.proposed_trade_terms,
  allowed_categories = EXCLUDED.allowed_categories, carrier = EXCLUDED.carrier,
  estimated_days_min = EXCLUDED.estimated_days_min,
  estimated_days_max = EXCLUDED.estimated_days_max, source_notes = EXCLUDED.source_notes,
  validation_status = EXCLUDED.validation_status, is_active = false, updated_at = now();

INSERT INTO public.shipping_country_rules (
  country_code, country_name, zone, proposed_checkout_mode, proposed_trade_terms,
  allowed_categories, carrier, estimated_days_min, estimated_days_max, source_notes,
  validation_status, is_active, updated_at
) VALUES (
  'PT', '葡萄牙', '欧洲',
  'DDP自动', 'DDP', '投影仪/支架(带电可)', '欧洲专线包税(USD,双清包税到门)',
  7.0, 9.0, 'DHL香港纯电池促销价；DAP：不含目的地税金，收件人自负关税清关；21KG+大货按KG计价', 'needs_review', false, now()
) ON CONFLICT (country_code) DO UPDATE SET
  country_name = EXCLUDED.country_name, zone = EXCLUDED.zone,
  proposed_checkout_mode = EXCLUDED.proposed_checkout_mode,
  proposed_trade_terms = EXCLUDED.proposed_trade_terms,
  allowed_categories = EXCLUDED.allowed_categories, carrier = EXCLUDED.carrier,
  estimated_days_min = EXCLUDED.estimated_days_min,
  estimated_days_max = EXCLUDED.estimated_days_max, source_notes = EXCLUDED.source_notes,
  validation_status = EXCLUDED.validation_status, is_active = false, updated_at = now();

INSERT INTO public.shipping_country_rules (
  country_code, country_name, zone, proposed_checkout_mode, proposed_trade_terms,
  allowed_categories, carrier, estimated_days_min, estimated_days_max, source_notes,
  validation_status, is_active, updated_at
) VALUES (
  'LU', '卢森堡', '欧洲',
  'DDP自动', 'DDP', '投影仪/支架(带电可)', '欧洲专线包税(USD,双清包税到门)',
  7.0, 9.0, 'DHL香港纯电池促销价；DAP：不含目的地税金，收件人自负关税清关；21KG+大货按KG计价', 'needs_review', false, now()
) ON CONFLICT (country_code) DO UPDATE SET
  country_name = EXCLUDED.country_name, zone = EXCLUDED.zone,
  proposed_checkout_mode = EXCLUDED.proposed_checkout_mode,
  proposed_trade_terms = EXCLUDED.proposed_trade_terms,
  allowed_categories = EXCLUDED.allowed_categories, carrier = EXCLUDED.carrier,
  estimated_days_min = EXCLUDED.estimated_days_min,
  estimated_days_max = EXCLUDED.estimated_days_max, source_notes = EXCLUDED.source_notes,
  validation_status = EXCLUDED.validation_status, is_active = false, updated_at = now();

INSERT INTO public.shipping_country_rules (
  country_code, country_name, zone, proposed_checkout_mode, proposed_trade_terms,
  allowed_categories, carrier, estimated_days_min, estimated_days_max, source_notes,
  validation_status, is_active, updated_at
) VALUES (
  'BO', '玻利维亚', '南美',
  'DAP自动', 'DAP', '投影仪/支架(带电可)', 'DHL香港纯电池专线(含燃油/旺季)',
  2.0, 4.0, 'DHL香港纯电池促销价；DAP：不含目的地税金，收件人自负关税清关；21KG+大货按KG计价', 'needs_review', false, now()
) ON CONFLICT (country_code) DO UPDATE SET
  country_name = EXCLUDED.country_name, zone = EXCLUDED.zone,
  proposed_checkout_mode = EXCLUDED.proposed_checkout_mode,
  proposed_trade_terms = EXCLUDED.proposed_trade_terms,
  allowed_categories = EXCLUDED.allowed_categories, carrier = EXCLUDED.carrier,
  estimated_days_min = EXCLUDED.estimated_days_min,
  estimated_days_max = EXCLUDED.estimated_days_max, source_notes = EXCLUDED.source_notes,
  validation_status = EXCLUDED.validation_status, is_active = false, updated_at = now();

INSERT INTO public.shipping_country_rules (
  country_code, country_name, zone, proposed_checkout_mode, proposed_trade_terms,
  allowed_categories, carrier, estimated_days_min, estimated_days_max, source_notes,
  validation_status, is_active, updated_at
) VALUES (
  'CL', '智利', '南美',
  'DAP自动', 'DAP', '投影仪/支架(带电可)', 'DHL香港纯电池专线(含燃油/旺季)',
  2.0, 4.0, 'DHL香港纯电池促销价；DAP：不含目的地税金，收件人自负关税清关；21KG+大货按KG计价', 'needs_review', false, now()
) ON CONFLICT (country_code) DO UPDATE SET
  country_name = EXCLUDED.country_name, zone = EXCLUDED.zone,
  proposed_checkout_mode = EXCLUDED.proposed_checkout_mode,
  proposed_trade_terms = EXCLUDED.proposed_trade_terms,
  allowed_categories = EXCLUDED.allowed_categories, carrier = EXCLUDED.carrier,
  estimated_days_min = EXCLUDED.estimated_days_min,
  estimated_days_max = EXCLUDED.estimated_days_max, source_notes = EXCLUDED.source_notes,
  validation_status = EXCLUDED.validation_status, is_active = false, updated_at = now();

INSERT INTO public.shipping_country_rules (
  country_code, country_name, zone, proposed_checkout_mode, proposed_trade_terms,
  allowed_categories, carrier, estimated_days_min, estimated_days_max, source_notes,
  validation_status, is_active, updated_at
) VALUES (
  'CO', '哥伦比亚', '南美',
  'DAP自动', 'DAP', '投影仪/支架(带电可)', 'DHL香港纯电池专线(含燃油/旺季)',
  2.0, 4.0, 'DHL香港纯电池促销价；DAP：不含目的地税金，收件人自负关税清关；21KG+大货按KG计价', 'needs_review', false, now()
) ON CONFLICT (country_code) DO UPDATE SET
  country_name = EXCLUDED.country_name, zone = EXCLUDED.zone,
  proposed_checkout_mode = EXCLUDED.proposed_checkout_mode,
  proposed_trade_terms = EXCLUDED.proposed_trade_terms,
  allowed_categories = EXCLUDED.allowed_categories, carrier = EXCLUDED.carrier,
  estimated_days_min = EXCLUDED.estimated_days_min,
  estimated_days_max = EXCLUDED.estimated_days_max, source_notes = EXCLUDED.source_notes,
  validation_status = EXCLUDED.validation_status, is_active = false, updated_at = now();

INSERT INTO public.shipping_country_rules (
  country_code, country_name, zone, proposed_checkout_mode, proposed_trade_terms,
  allowed_categories, carrier, estimated_days_min, estimated_days_max, source_notes,
  validation_status, is_active, updated_at
) VALUES (
  'CR', '哥斯达黎加', '美洲',
  'DAP自动', 'DAP', '投影仪/支架(带电可)', 'DHL香港纯电池专线(含燃油/旺季)',
  2.0, 4.0, 'DHL香港纯电池促销价；DAP：不含目的地税金，收件人自负关税清关；21KG+大货按KG计价', 'needs_review', false, now()
) ON CONFLICT (country_code) DO UPDATE SET
  country_name = EXCLUDED.country_name, zone = EXCLUDED.zone,
  proposed_checkout_mode = EXCLUDED.proposed_checkout_mode,
  proposed_trade_terms = EXCLUDED.proposed_trade_terms,
  allowed_categories = EXCLUDED.allowed_categories, carrier = EXCLUDED.carrier,
  estimated_days_min = EXCLUDED.estimated_days_min,
  estimated_days_max = EXCLUDED.estimated_days_max, source_notes = EXCLUDED.source_notes,
  validation_status = EXCLUDED.validation_status, is_active = false, updated_at = now();

INSERT INTO public.shipping_country_rules (
  country_code, country_name, zone, proposed_checkout_mode, proposed_trade_terms,
  allowed_categories, carrier, estimated_days_min, estimated_days_max, source_notes,
  validation_status, is_active, updated_at
) VALUES (
  'PE', '秘鲁', '南美',
  'DAP自动', 'DAP', '投影仪/支架(带电可)', 'DHL香港纯电池专线(含燃油/旺季)',
  2.0, 4.0, 'DHL香港纯电池促销价；DAP：不含目的地税金，收件人自负关税清关；21KG+大货按KG计价', 'needs_review', false, now()
) ON CONFLICT (country_code) DO UPDATE SET
  country_name = EXCLUDED.country_name, zone = EXCLUDED.zone,
  proposed_checkout_mode = EXCLUDED.proposed_checkout_mode,
  proposed_trade_terms = EXCLUDED.proposed_trade_terms,
  allowed_categories = EXCLUDED.allowed_categories, carrier = EXCLUDED.carrier,
  estimated_days_min = EXCLUDED.estimated_days_min,
  estimated_days_max = EXCLUDED.estimated_days_max, source_notes = EXCLUDED.source_notes,
  validation_status = EXCLUDED.validation_status, is_active = false, updated_at = now();

INSERT INTO public.shipping_country_rules (
  country_code, country_name, zone, proposed_checkout_mode, proposed_trade_terms,
  allowed_categories, carrier, estimated_days_min, estimated_days_max, source_notes,
  validation_status, is_active, updated_at
) VALUES (
  'VE', '委内瑞拉', '南美',
  'DAP自动', 'DAP', '投影仪/支架(带电可)', 'DHL香港纯电池专线(含燃油/旺季)',
  2.0, 4.0, 'DHL香港纯电池促销价；DAP：不含目的地税金，收件人自负关税清关；21KG+大货按KG计价', 'needs_review', false, now()
) ON CONFLICT (country_code) DO UPDATE SET
  country_name = EXCLUDED.country_name, zone = EXCLUDED.zone,
  proposed_checkout_mode = EXCLUDED.proposed_checkout_mode,
  proposed_trade_terms = EXCLUDED.proposed_trade_terms,
  allowed_categories = EXCLUDED.allowed_categories, carrier = EXCLUDED.carrier,
  estimated_days_min = EXCLUDED.estimated_days_min,
  estimated_days_max = EXCLUDED.estimated_days_max, source_notes = EXCLUDED.source_notes,
  validation_status = EXCLUDED.validation_status, is_active = false, updated_at = now();

INSERT INTO public.shipping_country_rules (
  country_code, country_name, zone, proposed_checkout_mode, proposed_trade_terms,
  allowed_categories, carrier, estimated_days_min, estimated_days_max, source_notes,
  validation_status, is_active, updated_at
) VALUES (
  'EC', '厄瓜多尔', '南美',
  'DAP自动', 'DAP', '投影仪/支架(带电可)', 'DHL香港纯电池专线(含燃油/旺季)',
  2.0, 4.0, 'DHL香港纯电池促销价；DAP：不含目的地税金，收件人自负关税清关；21KG+大货按KG计价', 'needs_review', false, now()
) ON CONFLICT (country_code) DO UPDATE SET
  country_name = EXCLUDED.country_name, zone = EXCLUDED.zone,
  proposed_checkout_mode = EXCLUDED.proposed_checkout_mode,
  proposed_trade_terms = EXCLUDED.proposed_trade_terms,
  allowed_categories = EXCLUDED.allowed_categories, carrier = EXCLUDED.carrier,
  estimated_days_min = EXCLUDED.estimated_days_min,
  estimated_days_max = EXCLUDED.estimated_days_max, source_notes = EXCLUDED.source_notes,
  validation_status = EXCLUDED.validation_status, is_active = false, updated_at = now();

INSERT INTO public.shipping_country_rules (
  country_code, country_name, zone, proposed_checkout_mode, proposed_trade_terms,
  allowed_categories, carrier, estimated_days_min, estimated_days_max, source_notes,
  validation_status, is_active, updated_at
) VALUES (
  'GT', '危地马拉', '美洲',
  'DAP自动', 'DAP', '投影仪/支架(带电可)', 'DHL香港纯电池专线(含燃油/旺季)',
  2.0, 4.0, 'DHL香港纯电池促销价；DAP：不含目的地税金，收件人自负关税清关；21KG+大货按KG计价', 'needs_review', false, now()
) ON CONFLICT (country_code) DO UPDATE SET
  country_name = EXCLUDED.country_name, zone = EXCLUDED.zone,
  proposed_checkout_mode = EXCLUDED.proposed_checkout_mode,
  proposed_trade_terms = EXCLUDED.proposed_trade_terms,
  allowed_categories = EXCLUDED.allowed_categories, carrier = EXCLUDED.carrier,
  estimated_days_min = EXCLUDED.estimated_days_min,
  estimated_days_max = EXCLUDED.estimated_days_max, source_notes = EXCLUDED.source_notes,
  validation_status = EXCLUDED.validation_status, is_active = false, updated_at = now();

INSERT INTO public.shipping_country_rules (
  country_code, country_name, zone, proposed_checkout_mode, proposed_trade_terms,
  allowed_categories, carrier, estimated_days_min, estimated_days_max, source_notes,
  validation_status, is_active, updated_at
) VALUES (
  'MA', '摩洛哥', '非洲',
  'DAP自动', 'DAP', '投影仪/支架(带电可)', 'DHL香港纯电池专线(含燃油/旺季)',
  2.0, 4.0, 'DHL香港纯电池促销价；DAP：不含目的地税金，收件人自负关税清关；21KG+大货按KG计价', 'needs_review', false, now()
) ON CONFLICT (country_code) DO UPDATE SET
  country_name = EXCLUDED.country_name, zone = EXCLUDED.zone,
  proposed_checkout_mode = EXCLUDED.proposed_checkout_mode,
  proposed_trade_terms = EXCLUDED.proposed_trade_terms,
  allowed_categories = EXCLUDED.allowed_categories, carrier = EXCLUDED.carrier,
  estimated_days_min = EXCLUDED.estimated_days_min,
  estimated_days_max = EXCLUDED.estimated_days_max, source_notes = EXCLUDED.source_notes,
  validation_status = EXCLUDED.validation_status, is_active = false, updated_at = now();

INSERT INTO public.shipping_country_rules (
  country_code, country_name, zone, proposed_checkout_mode, proposed_trade_terms,
  allowed_categories, carrier, estimated_days_min, estimated_days_max, source_notes,
  validation_status, is_active, updated_at
) VALUES (
  'AR', '阿根廷', '南美',
  'DAP自动', 'DAP', '投影仪/支架(带电可)', 'DHL香港纯电池专线(含燃油/旺季)',
  2.0, 4.0, 'DHL香港纯电池促销价；DAP：不含目的地税金，收件人自负关税清关；21KG+大货按KG计价', 'needs_review', false, now()
) ON CONFLICT (country_code) DO UPDATE SET
  country_name = EXCLUDED.country_name, zone = EXCLUDED.zone,
  proposed_checkout_mode = EXCLUDED.proposed_checkout_mode,
  proposed_trade_terms = EXCLUDED.proposed_trade_terms,
  allowed_categories = EXCLUDED.allowed_categories, carrier = EXCLUDED.carrier,
  estimated_days_min = EXCLUDED.estimated_days_min,
  estimated_days_max = EXCLUDED.estimated_days_max, source_notes = EXCLUDED.source_notes,
  validation_status = EXCLUDED.validation_status, is_active = false, updated_at = now();

INSERT INTO public.shipping_country_rules (
  country_code, country_name, zone, proposed_checkout_mode, proposed_trade_terms,
  allowed_categories, carrier, estimated_days_min, estimated_days_max, source_notes,
  validation_status, is_active, updated_at
) VALUES (
  'KW', '科威特', '中东',
  'DAP自动', 'DAP', '投影仪/支架(带电可)', 'DHL香港纯电池专线(含燃油/旺季)',
  2.0, 4.0, 'DHL香港纯电池促销价；DAP：不含目的地税金，收件人自负关税清关；21KG+大货按KG计价', 'needs_review', false, now()
) ON CONFLICT (country_code) DO UPDATE SET
  country_name = EXCLUDED.country_name, zone = EXCLUDED.zone,
  proposed_checkout_mode = EXCLUDED.proposed_checkout_mode,
  proposed_trade_terms = EXCLUDED.proposed_trade_terms,
  allowed_categories = EXCLUDED.allowed_categories, carrier = EXCLUDED.carrier,
  estimated_days_min = EXCLUDED.estimated_days_min,
  estimated_days_max = EXCLUDED.estimated_days_max, source_notes = EXCLUDED.source_notes,
  validation_status = EXCLUDED.validation_status, is_active = false, updated_at = now();

INSERT INTO public.shipping_country_rules (
  country_code, country_name, zone, proposed_checkout_mode, proposed_trade_terms,
  allowed_categories, carrier, estimated_days_min, estimated_days_max, source_notes,
  validation_status, is_active, updated_at
) VALUES (
  'AL', '阿尔巴尼亚', '欧洲',
  'DAP自动', 'DAP', '投影仪/支架(带电可)', 'DHL香港纯电池专线(含燃油/旺季)',
  2.0, 4.0, 'DHL香港纯电池促销价；DAP：不含目的地税金，收件人自负关税清关；21KG+大货按KG计价', 'needs_review', false, now()
) ON CONFLICT (country_code) DO UPDATE SET
  country_name = EXCLUDED.country_name, zone = EXCLUDED.zone,
  proposed_checkout_mode = EXCLUDED.proposed_checkout_mode,
  proposed_trade_terms = EXCLUDED.proposed_trade_terms,
  allowed_categories = EXCLUDED.allowed_categories, carrier = EXCLUDED.carrier,
  estimated_days_min = EXCLUDED.estimated_days_min,
  estimated_days_max = EXCLUDED.estimated_days_max, source_notes = EXCLUDED.source_notes,
  validation_status = EXCLUDED.validation_status, is_active = false, updated_at = now();

INSERT INTO public.shipping_country_rules (
  country_code, country_name, zone, proposed_checkout_mode, proposed_trade_terms,
  allowed_categories, carrier, estimated_days_min, estimated_days_max, source_notes,
  validation_status, is_active, updated_at
) VALUES (
  'MD', '摩尔多瓦', '欧洲',
  'DAP自动', 'DAP', '投影仪/支架(带电可)', 'DHL香港纯电池专线(含燃油/旺季)',
  2.0, 4.0, 'DHL香港纯电池促销价；DAP：不含目的地税金，收件人自负关税清关；21KG+大货按KG计价', 'needs_review', false, now()
) ON CONFLICT (country_code) DO UPDATE SET
  country_name = EXCLUDED.country_name, zone = EXCLUDED.zone,
  proposed_checkout_mode = EXCLUDED.proposed_checkout_mode,
  proposed_trade_terms = EXCLUDED.proposed_trade_terms,
  allowed_categories = EXCLUDED.allowed_categories, carrier = EXCLUDED.carrier,
  estimated_days_min = EXCLUDED.estimated_days_min,
  estimated_days_max = EXCLUDED.estimated_days_max, source_notes = EXCLUDED.source_notes,
  validation_status = EXCLUDED.validation_status, is_active = false, updated_at = now();

INSERT INTO public.shipping_country_rules (
  country_code, country_name, zone, proposed_checkout_mode, proposed_trade_terms,
  allowed_categories, carrier, estimated_days_min, estimated_days_max, source_notes,
  validation_status, is_active, updated_at
) VALUES (
  'RS', '塞尔维亚', '欧洲',
  'DAP自动', 'DAP', '投影仪/支架(带电可)', 'DHL香港纯电池专线(含燃油/旺季)',
  2.0, 4.0, 'DHL香港纯电池促销价；DAP：不含目的地税金，收件人自负关税清关；21KG+大货按KG计价', 'needs_review', false, now()
) ON CONFLICT (country_code) DO UPDATE SET
  country_name = EXCLUDED.country_name, zone = EXCLUDED.zone,
  proposed_checkout_mode = EXCLUDED.proposed_checkout_mode,
  proposed_trade_terms = EXCLUDED.proposed_trade_terms,
  allowed_categories = EXCLUDED.allowed_categories, carrier = EXCLUDED.carrier,
  estimated_days_min = EXCLUDED.estimated_days_min,
  estimated_days_max = EXCLUDED.estimated_days_max, source_notes = EXCLUDED.source_notes,
  validation_status = EXCLUDED.validation_status, is_active = false, updated_at = now();

INSERT INTO public.shipping_country_rules (
  country_code, country_name, zone, proposed_checkout_mode, proposed_trade_terms,
  allowed_categories, carrier, estimated_days_min, estimated_days_max, source_notes,
  validation_status, is_active, updated_at
) VALUES (
  'PA', '巴拿马', NULL,
  'DAP自动', 'DAP', '投影仪/支架(带电可)', 'DHL香港纯电池专线(含燃油/旺季)',
  2.0, 4.0, 'DHL香港纯电池促销价；DAP：不含目的地税金，收件人自负关税清关；21KG+大货按KG计价', 'needs_review', false, now()
) ON CONFLICT (country_code) DO UPDATE SET
  country_name = EXCLUDED.country_name, zone = EXCLUDED.zone,
  proposed_checkout_mode = EXCLUDED.proposed_checkout_mode,
  proposed_trade_terms = EXCLUDED.proposed_trade_terms,
  allowed_categories = EXCLUDED.allowed_categories, carrier = EXCLUDED.carrier,
  estimated_days_min = EXCLUDED.estimated_days_min,
  estimated_days_max = EXCLUDED.estimated_days_max, source_notes = EXCLUDED.source_notes,
  validation_status = EXCLUDED.validation_status, is_active = false, updated_at = now();

INSERT INTO public.shipping_country_rules (
  country_code, country_name, zone, proposed_checkout_mode, proposed_trade_terms,
  allowed_categories, carrier, estimated_days_min, estimated_days_max, source_notes,
  validation_status, is_active, updated_at
) VALUES (
  'NG', '尼日利亚', '非洲',
  'DAP自动', 'DAP', '投影仪/支架(带电可)', 'DHL香港纯电池专线(含燃油/旺季)',
  2.0, 4.0, 'DHL香港纯电池促销价；DAP：不含目的地税金，收件人自负关税清关；21KG+大货按KG计价', 'needs_review', false, now()
) ON CONFLICT (country_code) DO UPDATE SET
  country_name = EXCLUDED.country_name, zone = EXCLUDED.zone,
  proposed_checkout_mode = EXCLUDED.proposed_checkout_mode,
  proposed_trade_terms = EXCLUDED.proposed_trade_terms,
  allowed_categories = EXCLUDED.allowed_categories, carrier = EXCLUDED.carrier,
  estimated_days_min = EXCLUDED.estimated_days_min,
  estimated_days_max = EXCLUDED.estimated_days_max, source_notes = EXCLUDED.source_notes,
  validation_status = EXCLUDED.validation_status, is_active = false, updated_at = now();

INSERT INTO public.shipping_country_rules (
  country_code, country_name, zone, proposed_checkout_mode, proposed_trade_terms,
  allowed_categories, carrier, estimated_days_min, estimated_days_max, source_notes,
  validation_status, is_active, updated_at
) VALUES (
  'KE', '肯尼亚', '非洲',
  'DAP自动', 'DAP', '投影仪/支架(带电可)', 'DHL香港纯电池专线(含燃油/旺季)',
  2.0, 4.0, 'DHL香港纯电池促销价；DAP：不含目的地税金，收件人自负关税清关；21KG+大货按KG计价', 'needs_review', false, now()
) ON CONFLICT (country_code) DO UPDATE SET
  country_name = EXCLUDED.country_name, zone = EXCLUDED.zone,
  proposed_checkout_mode = EXCLUDED.proposed_checkout_mode,
  proposed_trade_terms = EXCLUDED.proposed_trade_terms,
  allowed_categories = EXCLUDED.allowed_categories, carrier = EXCLUDED.carrier,
  estimated_days_min = EXCLUDED.estimated_days_min,
  estimated_days_max = EXCLUDED.estimated_days_max, source_notes = EXCLUDED.source_notes,
  validation_status = EXCLUDED.validation_status, is_active = false, updated_at = now();

INSERT INTO public.shipping_country_rules (
  country_code, country_name, zone, proposed_checkout_mode, proposed_trade_terms,
  allowed_categories, carrier, estimated_days_min, estimated_days_max, source_notes,
  validation_status, is_active, updated_at
) VALUES (
  'CI', '科特迪瓦', '非洲',
  'DAP自动', 'DAP', '投影仪/支架(带电可)', 'DHL香港纯电池专线(含燃油/旺季)',
  2.0, 4.0, 'DHL香港纯电池促销价；DAP：不含目的地税金，收件人自负关税清关；21KG+大货按KG计价', 'needs_review', false, now()
) ON CONFLICT (country_code) DO UPDATE SET
  country_name = EXCLUDED.country_name, zone = EXCLUDED.zone,
  proposed_checkout_mode = EXCLUDED.proposed_checkout_mode,
  proposed_trade_terms = EXCLUDED.proposed_trade_terms,
  allowed_categories = EXCLUDED.allowed_categories, carrier = EXCLUDED.carrier,
  estimated_days_min = EXCLUDED.estimated_days_min,
  estimated_days_max = EXCLUDED.estimated_days_max, source_notes = EXCLUDED.source_notes,
  validation_status = EXCLUDED.validation_status, is_active = false, updated_at = now();

INSERT INTO public.shipping_country_rules (
  country_code, country_name, zone, proposed_checkout_mode, proposed_trade_terms,
  allowed_categories, carrier, estimated_days_min, estimated_days_max, source_notes,
  validation_status, is_active, updated_at
) VALUES (
  'IS', '冰岛', '欧洲',
  'DAP自动', 'DAP', '投影仪/支架(带电可)', 'DHL香港纯电池专线(含燃油/旺季)',
  2.0, 4.0, 'DHL香港纯电池促销价；DAP：不含目的地税金，收件人自负关税清关；21KG+大货按KG计价', 'needs_review', false, now()
) ON CONFLICT (country_code) DO UPDATE SET
  country_name = EXCLUDED.country_name, zone = EXCLUDED.zone,
  proposed_checkout_mode = EXCLUDED.proposed_checkout_mode,
  proposed_trade_terms = EXCLUDED.proposed_trade_terms,
  allowed_categories = EXCLUDED.allowed_categories, carrier = EXCLUDED.carrier,
  estimated_days_min = EXCLUDED.estimated_days_min,
  estimated_days_max = EXCLUDED.estimated_days_max, source_notes = EXCLUDED.source_notes,
  validation_status = EXCLUDED.validation_status, is_active = false, updated_at = now();

INSERT INTO public.shipping_country_rules (
  country_code, country_name, zone, proposed_checkout_mode, proposed_trade_terms,
  allowed_categories, carrier, estimated_days_min, estimated_days_max, source_notes,
  validation_status, is_active, updated_at
) VALUES (
  'OM', '阿曼', '中东',
  'DAP自动', 'DAP', '投影仪/支架(带电可)', 'DHL香港纯电池专线(含燃油/旺季)',
  2.0, 4.0, 'DHL香港纯电池促销价；DAP：不含目的地税金，收件人自负关税清关；21KG+大货按KG计价', 'needs_review', false, now()
) ON CONFLICT (country_code) DO UPDATE SET
  country_name = EXCLUDED.country_name, zone = EXCLUDED.zone,
  proposed_checkout_mode = EXCLUDED.proposed_checkout_mode,
  proposed_trade_terms = EXCLUDED.proposed_trade_terms,
  allowed_categories = EXCLUDED.allowed_categories, carrier = EXCLUDED.carrier,
  estimated_days_min = EXCLUDED.estimated_days_min,
  estimated_days_max = EXCLUDED.estimated_days_max, source_notes = EXCLUDED.source_notes,
  validation_status = EXCLUDED.validation_status, is_active = false, updated_at = now();

INSERT INTO public.shipping_country_rules (
  country_code, country_name, zone, proposed_checkout_mode, proposed_trade_terms,
  allowed_categories, carrier, estimated_days_min, estimated_days_max, source_notes,
  validation_status, is_active, updated_at
) VALUES (
  'SN', '塞内加尔', '非洲',
  'DAP自动', 'DAP', '投影仪/支架(带电可)', 'DHL香港纯电池专线(含燃油/旺季)',
  2.0, 4.0, 'DHL香港纯电池促销价；DAP：不含目的地税金，收件人自负关税清关；21KG+大货按KG计价', 'needs_review', false, now()
) ON CONFLICT (country_code) DO UPDATE SET
  country_name = EXCLUDED.country_name, zone = EXCLUDED.zone,
  proposed_checkout_mode = EXCLUDED.proposed_checkout_mode,
  proposed_trade_terms = EXCLUDED.proposed_trade_terms,
  allowed_categories = EXCLUDED.allowed_categories, carrier = EXCLUDED.carrier,
  estimated_days_min = EXCLUDED.estimated_days_min,
  estimated_days_max = EXCLUDED.estimated_days_max, source_notes = EXCLUDED.source_notes,
  validation_status = EXCLUDED.validation_status, is_active = false, updated_at = now();

INSERT INTO public.shipping_country_rules (
  country_code, country_name, zone, proposed_checkout_mode, proposed_trade_terms,
  allowed_categories, carrier, estimated_days_min, estimated_days_max, source_notes,
  validation_status, is_active, updated_at
) VALUES (
  'UG', '乌干达', '非洲',
  'DAP自动', 'DAP', '投影仪/支架(带电可)', 'DHL香港纯电池专线(含燃油/旺季)',
  2.0, 4.0, 'DHL香港纯电池促销价；DAP：不含目的地税金，收件人自负关税清关；21KG+大货按KG计价', 'needs_review', false, now()
) ON CONFLICT (country_code) DO UPDATE SET
  country_name = EXCLUDED.country_name, zone = EXCLUDED.zone,
  proposed_checkout_mode = EXCLUDED.proposed_checkout_mode,
  proposed_trade_terms = EXCLUDED.proposed_trade_terms,
  allowed_categories = EXCLUDED.allowed_categories, carrier = EXCLUDED.carrier,
  estimated_days_min = EXCLUDED.estimated_days_min,
  estimated_days_max = EXCLUDED.estimated_days_max, source_notes = EXCLUDED.source_notes,
  validation_status = EXCLUDED.validation_status, is_active = false, updated_at = now();

INSERT INTO public.shipping_country_rules (
  country_code, country_name, zone, proposed_checkout_mode, proposed_trade_terms,
  allowed_categories, carrier, estimated_days_min, estimated_days_max, source_notes,
  validation_status, is_active, updated_at
) VALUES (
  'UY', '乌拉圭', '南美',
  'DAP自动', 'DAP', '投影仪/支架(带电可)', 'DHL香港纯电池专线(含燃油/旺季)',
  2.0, 4.0, 'DHL香港纯电池促销价；DAP：不含目的地税金，收件人自负关税清关；21KG+大货按KG计价', 'needs_review', false, now()
) ON CONFLICT (country_code) DO UPDATE SET
  country_name = EXCLUDED.country_name, zone = EXCLUDED.zone,
  proposed_checkout_mode = EXCLUDED.proposed_checkout_mode,
  proposed_trade_terms = EXCLUDED.proposed_trade_terms,
  allowed_categories = EXCLUDED.allowed_categories, carrier = EXCLUDED.carrier,
  estimated_days_min = EXCLUDED.estimated_days_min,
  estimated_days_max = EXCLUDED.estimated_days_max, source_notes = EXCLUDED.source_notes,
  validation_status = EXCLUDED.validation_status, is_active = false, updated_at = now();

INSERT INTO public.shipping_country_rules (
  country_code, country_name, zone, proposed_checkout_mode, proposed_trade_terms,
  allowed_categories, carrier, estimated_days_min, estimated_days_max, source_notes,
  validation_status, is_active, updated_at
) VALUES (
  'LB', '黎巴嫩', '中东',
  'DAP自动', 'DAP', '投影仪/支架(带电可)', 'DHL香港纯电池专线(含燃油/旺季)',
  2.0, 4.0, 'DHL香港纯电池促销价；DAP：不含目的地税金，收件人自负关税清关；21KG+大货按KG计价', 'needs_review', false, now()
) ON CONFLICT (country_code) DO UPDATE SET
  country_name = EXCLUDED.country_name, zone = EXCLUDED.zone,
  proposed_checkout_mode = EXCLUDED.proposed_checkout_mode,
  proposed_trade_terms = EXCLUDED.proposed_trade_terms,
  allowed_categories = EXCLUDED.allowed_categories, carrier = EXCLUDED.carrier,
  estimated_days_min = EXCLUDED.estimated_days_min,
  estimated_days_max = EXCLUDED.estimated_days_max, source_notes = EXCLUDED.source_notes,
  validation_status = EXCLUDED.validation_status, is_active = false, updated_at = now();

INSERT INTO public.shipping_country_rules (
  country_code, country_name, zone, proposed_checkout_mode, proposed_trade_terms,
  allowed_categories, carrier, estimated_days_min, estimated_days_max, source_notes,
  validation_status, is_active, updated_at
) VALUES (
  'PY', '巴拉圭', '南美',
  'DAP自动', 'DAP', '投影仪/支架(带电可)', 'DHL香港纯电池专线(含燃油/旺季)',
  2.0, 4.0, 'DHL香港纯电池促销价；DAP：不含目的地税金，收件人自负关税清关；21KG+大货按KG计价', 'needs_review', false, now()
) ON CONFLICT (country_code) DO UPDATE SET
  country_name = EXCLUDED.country_name, zone = EXCLUDED.zone,
  proposed_checkout_mode = EXCLUDED.proposed_checkout_mode,
  proposed_trade_terms = EXCLUDED.proposed_trade_terms,
  allowed_categories = EXCLUDED.allowed_categories, carrier = EXCLUDED.carrier,
  estimated_days_min = EXCLUDED.estimated_days_min,
  estimated_days_max = EXCLUDED.estimated_days_max, source_notes = EXCLUDED.source_notes,
  validation_status = EXCLUDED.validation_status, is_active = false, updated_at = now();

INSERT INTO public.shipping_country_rules (
  country_code, country_name, zone, proposed_checkout_mode, proposed_trade_terms,
  allowed_categories, carrier, estimated_days_min, estimated_days_max, source_notes,
  validation_status, is_active, updated_at
) VALUES (
  'JM', '牙买加', '美洲',
  'DAP自动', 'DAP', '投影仪/支架(带电可)', 'DHL香港纯电池专线(含燃油/旺季)',
  2.0, 4.0, 'DHL香港纯电池促销价；DAP：不含目的地税金，收件人自负关税清关；21KG+大货按KG计价', 'needs_review', false, now()
) ON CONFLICT (country_code) DO UPDATE SET
  country_name = EXCLUDED.country_name, zone = EXCLUDED.zone,
  proposed_checkout_mode = EXCLUDED.proposed_checkout_mode,
  proposed_trade_terms = EXCLUDED.proposed_trade_terms,
  allowed_categories = EXCLUDED.allowed_categories, carrier = EXCLUDED.carrier,
  estimated_days_min = EXCLUDED.estimated_days_min,
  estimated_days_max = EXCLUDED.estimated_days_max, source_notes = EXCLUDED.source_notes,
  validation_status = EXCLUDED.validation_status, is_active = false, updated_at = now();

INSERT INTO public.shipping_country_rules (
  country_code, country_name, zone, proposed_checkout_mode, proposed_trade_terms,
  allowed_categories, carrier, estimated_days_min, estimated_days_max, source_notes,
  validation_status, is_active, updated_at
) VALUES (
  'PL', '波兰', '欧洲',
  'DDP自动', 'DDP', '投影仪/支架(带电可)', '欧洲专线包税(USD,双清包税到门)',
  7.0, 9.0, NULL, 'needs_review', false, now()
) ON CONFLICT (country_code) DO UPDATE SET
  country_name = EXCLUDED.country_name, zone = EXCLUDED.zone,
  proposed_checkout_mode = EXCLUDED.proposed_checkout_mode,
  proposed_trade_terms = EXCLUDED.proposed_trade_terms,
  allowed_categories = EXCLUDED.allowed_categories, carrier = EXCLUDED.carrier,
  estimated_days_min = EXCLUDED.estimated_days_min,
  estimated_days_max = EXCLUDED.estimated_days_max, source_notes = EXCLUDED.source_notes,
  validation_status = EXCLUDED.validation_status, is_active = false, updated_at = now();

INSERT INTO public.shipping_country_rules (
  country_code, country_name, zone, proposed_checkout_mode, proposed_trade_terms,
  allowed_categories, carrier, estimated_days_min, estimated_days_max, source_notes,
  validation_status, is_active, updated_at
) VALUES (
  'CZ', '捷克', '欧洲',
  'DDP自动', 'DDP', '投影仪/支架(带电可)', '欧洲专线包税(USD,双清包税到门)',
  7.0, 9.0, NULL, 'needs_review', false, now()
) ON CONFLICT (country_code) DO UPDATE SET
  country_name = EXCLUDED.country_name, zone = EXCLUDED.zone,
  proposed_checkout_mode = EXCLUDED.proposed_checkout_mode,
  proposed_trade_terms = EXCLUDED.proposed_trade_terms,
  allowed_categories = EXCLUDED.allowed_categories, carrier = EXCLUDED.carrier,
  estimated_days_min = EXCLUDED.estimated_days_min,
  estimated_days_max = EXCLUDED.estimated_days_max, source_notes = EXCLUDED.source_notes,
  validation_status = EXCLUDED.validation_status, is_active = false, updated_at = now();

INSERT INTO public.shipping_country_rules (
  country_code, country_name, zone, proposed_checkout_mode, proposed_trade_terms,
  allowed_categories, carrier, estimated_days_min, estimated_days_max, source_notes,
  validation_status, is_active, updated_at
) VALUES (
  'BG', '保加利亚', '欧洲',
  'DDP自动', 'DDP', '投影仪/支架(带电可)', '欧洲专线包税(USD,双清包税到门)',
  7.0, 9.0, NULL, 'needs_review', false, now()
) ON CONFLICT (country_code) DO UPDATE SET
  country_name = EXCLUDED.country_name, zone = EXCLUDED.zone,
  proposed_checkout_mode = EXCLUDED.proposed_checkout_mode,
  proposed_trade_terms = EXCLUDED.proposed_trade_terms,
  allowed_categories = EXCLUDED.allowed_categories, carrier = EXCLUDED.carrier,
  estimated_days_min = EXCLUDED.estimated_days_min,
  estimated_days_max = EXCLUDED.estimated_days_max, source_notes = EXCLUDED.source_notes,
  validation_status = EXCLUDED.validation_status, is_active = false, updated_at = now();

INSERT INTO public.shipping_country_rules (
  country_code, country_name, zone, proposed_checkout_mode, proposed_trade_terms,
  allowed_categories, carrier, estimated_days_min, estimated_days_max, source_notes,
  validation_status, is_active, updated_at
) VALUES (
  'DK', '丹麦', '欧洲',
  'DDP自动', 'DDP', '投影仪/支架(带电可)', '欧洲专线包税(USD,双清包税到门)',
  7.0, 9.0, NULL, 'needs_review', false, now()
) ON CONFLICT (country_code) DO UPDATE SET
  country_name = EXCLUDED.country_name, zone = EXCLUDED.zone,
  proposed_checkout_mode = EXCLUDED.proposed_checkout_mode,
  proposed_trade_terms = EXCLUDED.proposed_trade_terms,
  allowed_categories = EXCLUDED.allowed_categories, carrier = EXCLUDED.carrier,
  estimated_days_min = EXCLUDED.estimated_days_min,
  estimated_days_max = EXCLUDED.estimated_days_max, source_notes = EXCLUDED.source_notes,
  validation_status = EXCLUDED.validation_status, is_active = false, updated_at = now();

INSERT INTO public.shipping_country_rules (
  country_code, country_name, zone, proposed_checkout_mode, proposed_trade_terms,
  allowed_categories, carrier, estimated_days_min, estimated_days_max, source_notes,
  validation_status, is_active, updated_at
) VALUES (
  'BE', '比利时', '欧洲',
  'DDP自动', 'DDP', '投影仪/支架(带电可)', '欧洲专线包税(USD,双清包税到门)',
  7.0, 9.0, NULL, 'needs_review', false, now()
) ON CONFLICT (country_code) DO UPDATE SET
  country_name = EXCLUDED.country_name, zone = EXCLUDED.zone,
  proposed_checkout_mode = EXCLUDED.proposed_checkout_mode,
  proposed_trade_terms = EXCLUDED.proposed_trade_terms,
  allowed_categories = EXCLUDED.allowed_categories, carrier = EXCLUDED.carrier,
  estimated_days_min = EXCLUDED.estimated_days_min,
  estimated_days_max = EXCLUDED.estimated_days_max, source_notes = EXCLUDED.source_notes,
  validation_status = EXCLUDED.validation_status, is_active = false, updated_at = now();

INSERT INTO public.shipping_country_rules (
  country_code, country_name, zone, proposed_checkout_mode, proposed_trade_terms,
  allowed_categories, carrier, estimated_days_min, estimated_days_max, source_notes,
  validation_status, is_active, updated_at
) VALUES (
  'IE', '爱尔兰', '欧洲',
  'DDP自动', 'DDP', '投影仪/支架(带电可)', '欧洲专线包税(USD,双清包税到门)',
  7.0, 9.0, NULL, 'needs_review', false, now()
) ON CONFLICT (country_code) DO UPDATE SET
  country_name = EXCLUDED.country_name, zone = EXCLUDED.zone,
  proposed_checkout_mode = EXCLUDED.proposed_checkout_mode,
  proposed_trade_terms = EXCLUDED.proposed_trade_terms,
  allowed_categories = EXCLUDED.allowed_categories, carrier = EXCLUDED.carrier,
  estimated_days_min = EXCLUDED.estimated_days_min,
  estimated_days_max = EXCLUDED.estimated_days_max, source_notes = EXCLUDED.source_notes,
  validation_status = EXCLUDED.validation_status, is_active = false, updated_at = now();

INSERT INTO public.shipping_country_rules (
  country_code, country_name, zone, proposed_checkout_mode, proposed_trade_terms,
  allowed_categories, carrier, estimated_days_min, estimated_days_max, source_notes,
  validation_status, is_active, updated_at
) VALUES (
  'AT', '奥地利', '欧洲',
  'DDP自动', 'DDP', '投影仪/支架(带电可)', '欧洲专线包税(USD,双清包税到门)',
  7.0, 9.0, NULL, 'needs_review', false, now()
) ON CONFLICT (country_code) DO UPDATE SET
  country_name = EXCLUDED.country_name, zone = EXCLUDED.zone,
  proposed_checkout_mode = EXCLUDED.proposed_checkout_mode,
  proposed_trade_terms = EXCLUDED.proposed_trade_terms,
  allowed_categories = EXCLUDED.allowed_categories, carrier = EXCLUDED.carrier,
  estimated_days_min = EXCLUDED.estimated_days_min,
  estimated_days_max = EXCLUDED.estimated_days_max, source_notes = EXCLUDED.source_notes,
  validation_status = EXCLUDED.validation_status, is_active = false, updated_at = now();

INSERT INTO public.shipping_country_rules (
  country_code, country_name, zone, proposed_checkout_mode, proposed_trade_terms,
  allowed_categories, carrier, estimated_days_min, estimated_days_max, source_notes,
  validation_status, is_active, updated_at
) VALUES (
  'HU', '匈牙利', '欧洲',
  'DDP自动', 'DDP', '投影仪/支架(带电可)', '欧洲专线包税(USD,双清包税到门)',
  7.0, 9.0, NULL, 'needs_review', false, now()
) ON CONFLICT (country_code) DO UPDATE SET
  country_name = EXCLUDED.country_name, zone = EXCLUDED.zone,
  proposed_checkout_mode = EXCLUDED.proposed_checkout_mode,
  proposed_trade_terms = EXCLUDED.proposed_trade_terms,
  allowed_categories = EXCLUDED.allowed_categories, carrier = EXCLUDED.carrier,
  estimated_days_min = EXCLUDED.estimated_days_min,
  estimated_days_max = EXCLUDED.estimated_days_max, source_notes = EXCLUDED.source_notes,
  validation_status = EXCLUDED.validation_status, is_active = false, updated_at = now();

INSERT INTO public.shipping_country_rules (
  country_code, country_name, zone, proposed_checkout_mode, proposed_trade_terms,
  allowed_categories, carrier, estimated_days_min, estimated_days_max, source_notes,
  validation_status, is_active, updated_at
) VALUES (
  'SK', '斯洛伐克', '欧洲',
  'DDP自动', 'DDP', '投影仪/支架(带电可)', '欧洲专线包税(USD,双清包税到门)',
  7.0, 9.0, NULL, 'needs_review', false, now()
) ON CONFLICT (country_code) DO UPDATE SET
  country_name = EXCLUDED.country_name, zone = EXCLUDED.zone,
  proposed_checkout_mode = EXCLUDED.proposed_checkout_mode,
  proposed_trade_terms = EXCLUDED.proposed_trade_terms,
  allowed_categories = EXCLUDED.allowed_categories, carrier = EXCLUDED.carrier,
  estimated_days_min = EXCLUDED.estimated_days_min,
  estimated_days_max = EXCLUDED.estimated_days_max, source_notes = EXCLUDED.source_notes,
  validation_status = EXCLUDED.validation_status, is_active = false, updated_at = now();

INSERT INTO public.shipping_country_rules (
  country_code, country_name, zone, proposed_checkout_mode, proposed_trade_terms,
  allowed_categories, carrier, estimated_days_min, estimated_days_max, source_notes,
  validation_status, is_active, updated_at
) VALUES (
  'SI', '斯洛文尼亚', '欧洲',
  'DDP自动', 'DDP', '投影仪/支架(带电可)', '欧洲专线包税(USD,双清包税到门)',
  7.0, 9.0, NULL, 'needs_review', false, now()
) ON CONFLICT (country_code) DO UPDATE SET
  country_name = EXCLUDED.country_name, zone = EXCLUDED.zone,
  proposed_checkout_mode = EXCLUDED.proposed_checkout_mode,
  proposed_trade_terms = EXCLUDED.proposed_trade_terms,
  allowed_categories = EXCLUDED.allowed_categories, carrier = EXCLUDED.carrier,
  estimated_days_min = EXCLUDED.estimated_days_min,
  estimated_days_max = EXCLUDED.estimated_days_max, source_notes = EXCLUDED.source_notes,
  validation_status = EXCLUDED.validation_status, is_active = false, updated_at = now();

INSERT INTO public.shipping_country_rules (
  country_code, country_name, zone, proposed_checkout_mode, proposed_trade_terms,
  allowed_categories, carrier, estimated_days_min, estimated_days_max, source_notes,
  validation_status, is_active, updated_at
) VALUES (
  'LT', '立陶宛', '欧洲',
  'DDP自动', 'DDP', '投影仪/支架(带电可)', '欧洲专线包税(USD,双清包税到门)',
  7.0, 9.0, NULL, 'needs_review', false, now()
) ON CONFLICT (country_code) DO UPDATE SET
  country_name = EXCLUDED.country_name, zone = EXCLUDED.zone,
  proposed_checkout_mode = EXCLUDED.proposed_checkout_mode,
  proposed_trade_terms = EXCLUDED.proposed_trade_terms,
  allowed_categories = EXCLUDED.allowed_categories, carrier = EXCLUDED.carrier,
  estimated_days_min = EXCLUDED.estimated_days_min,
  estimated_days_max = EXCLUDED.estimated_days_max, source_notes = EXCLUDED.source_notes,
  validation_status = EXCLUDED.validation_status, is_active = false, updated_at = now();

INSERT INTO public.shipping_country_rules (
  country_code, country_name, zone, proposed_checkout_mode, proposed_trade_terms,
  allowed_categories, carrier, estimated_days_min, estimated_days_max, source_notes,
  validation_status, is_active, updated_at
) VALUES (
  'SE', '瑞典', '欧洲',
  'DDP自动', 'DDP', '投影仪/支架(带电可)', '欧洲专线包税(USD,双清包税到门)',
  7.0, 9.0, NULL, 'needs_review', false, now()
) ON CONFLICT (country_code) DO UPDATE SET
  country_name = EXCLUDED.country_name, zone = EXCLUDED.zone,
  proposed_checkout_mode = EXCLUDED.proposed_checkout_mode,
  proposed_trade_terms = EXCLUDED.proposed_trade_terms,
  allowed_categories = EXCLUDED.allowed_categories, carrier = EXCLUDED.carrier,
  estimated_days_min = EXCLUDED.estimated_days_min,
  estimated_days_max = EXCLUDED.estimated_days_max, source_notes = EXCLUDED.source_notes,
  validation_status = EXCLUDED.validation_status, is_active = false, updated_at = now();

INSERT INTO public.shipping_country_rules (
  country_code, country_name, zone, proposed_checkout_mode, proposed_trade_terms,
  allowed_categories, carrier, estimated_days_min, estimated_days_max, source_notes,
  validation_status, is_active, updated_at
) VALUES (
  'MM', '缅甸', '亚太',
  'DDP自动', 'DDP', '布料/服装辅料/化妆品/药品', '缅甸专线(包税)空运小包',
  7.0, 10.0, '深圳→仰光;一票一件;单件超21KG免首重;单件≤40KG;尺寸≤120×80×80CM;三类货物(化妆品/电子产品)价格单询;材积=长×宽×高/6000取大', 'needs_review', false, now()
) ON CONFLICT (country_code) DO UPDATE SET
  country_name = EXCLUDED.country_name, zone = EXCLUDED.zone,
  proposed_checkout_mode = EXCLUDED.proposed_checkout_mode,
  proposed_trade_terms = EXCLUDED.proposed_trade_terms,
  allowed_categories = EXCLUDED.allowed_categories, carrier = EXCLUDED.carrier,
  estimated_days_min = EXCLUDED.estimated_days_min,
  estimated_days_max = EXCLUDED.estimated_days_max, source_notes = EXCLUDED.source_notes,
  validation_status = EXCLUDED.validation_status, is_active = false, updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '北美', '国际快递(小货)', 'DDP',
  0.5, 20.0, 0.5,
  42.77, 0.5, 2.97,
  0.0, 'USD', NULL, NULL,
  '美国小货 深圳UPS5000红单包税；首重0.5KG+续重0.5KG(阶梯均价，完整表见7月1号快递到门包税价格.xls/香港深圳UPS小货包税)', 'needs_review', 2, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '北美', '国际快递(大货)', 'DDP',
  25.0, 300.0, 1.0,
  0.0, 1.0, 9.29,
  22.29, 'USD', NULL, NULL,
  '美国大货 深圳UPS直发包税红单 25-47KG=9.21.5,48-100=61.5,101-300=62.5 USD/KG；含油含税免清关操作费150/票；带电+1/KG', 'needs_review', 3, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '北美', '国际快递(小货)', 'DDP',
  0.5, 20.0, 0.5,
  49.62, 0.5, 4.41,
  0.0, 'USD', NULL, NULL,
  '加拿大小货 深圳UPS5000红单包税；首重0.5KG+续重0.5KG(阶梯均价，完整表见7月1号.../香港深圳UPS小货包税)', 'needs_review', 4, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '北美', '国际快递(大货)', 'DDP',
  25.0, 300.0, 1.0,
  0.0, 1.0, 10.18,
  22.29, 'USD', NULL, NULL,
  '加拿大大货 深圳UPS直发包税红单 25-47KG=10.1.5,48-100=67.5,101-300=68.5 USD/KG；含油含税免清关操作费150/票', 'needs_review', 5, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '欧洲', '国际快递(大货)', 'DDP',
  30.0, 499.0, 1.0,
  0.0, 1.0, 10.7,
  22.29, 'USD', NULL, NULL,
  '英国大货 韩国UPS红单5000直发包税 30-499KG=10.7 USD/KG；含旺季附加费及燃油；操作费150USD/票；小货渠道待补充(见7月1号.../韩国UPS红单包税)', 'needs_review', 6, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '亚太', '空运(快船)', 'DDP',
  1.0, 300.0, 1.0,
  11.89, 1.0, 4.75,
  0.0, 'USD', NULL, NULL,
  '韩国 KR05-AA快船(双清包税) 首重1KG=11.89,续1KG=4.75,15KG+=2.67.5,21+=18,51+=15,100+=12,201+=10.5,300+=9.5,501+=8.5,1000+=7.5；拒收纯电池；5-6工作日', 'needs_review', 7, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '亚太', '空运(一日达)', 'DDP',
  1.0, 300.0, 1.0,
  15.6, 1.0, 8.62,
  0.0, 'USD', NULL, NULL,
  '韩国 KR01-YA一日达普货 首重1KG=15.6,续1KG=8.62,21KG+=6.84；带电带磁KR02-YB首重110续61；2-3工作日', 'needs_review', 8, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '亚太', '电商小包', 'DDP',
  0.5, 20.0, 0.5,
  17.83, 0.5, 7.43,
  0.0, 'USD', NULL, NULL,
  '澳大利亚 ComMail ECOM-PA(双清包税,AUD1000以下无税) 首重0.5KG=17.83,续0.5KG=7.43；限20KG内；体积/6000；7-10工作日。空运/海派为DDU另算', 'needs_review', 9, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '亚太', '空运专线', 'DDP',
  0.5, 1000.0, 0.5,
  6.39, 0.5, 1.71,
  0.0, 'USD', NULL, NULL,
  '新加坡 SG03-P普货标准 首重0.5=43,续0.5=11.5,11KG+=2.67.5,45+=18,100+=17.5,500+=17.5,1000+=17.5；注：商壹新加坡专线名义DDU(不含税)，双清包税待确认', 'needs_review', 10, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '亚太', '海运小包(含)', 'DDP',
  1.0, 300.0, 1.0,
  4.46, 1.0, 1.19,
  0.0, 'USD', NULL, NULL,
  '马来西亚 新马海运小包西马(含=含税/DDP) 首重1KG=4.46,续1KG=1.19,10.1-300KG=1.04.5；10-15工作日；单件≤30KG', 'needs_review', 11, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '亚太', '陆运专线', 'DDP',
  1.0, 1000.0, 1.0,
  6.54, 1.0, 2.97,
  0.0, 'USD', NULL, NULL,
  '泰国 TH01曼谷普货内电 首重1=44,续1=20,11KG+=2.23.5,21+=12.5,45+=12,100+=11,500+=10.5,1000+=10.5；5-7天；按政策视为双清包税待确认', 'needs_review', 12, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '中东', '空运专线(小货)', 'DDP',
  1.0, 20.0, 1.0,
  9.66, 1.0, 5.94,
  0.0, 'USD', NULL, NULL,
  '阿联酋 AE01-B普货带电迪拜 首1KG=9.66,续1KG=5.94,21-100KG=5.79,101-300=38,301-500=38,501+=37；双清包税；6-8工作日', 'needs_review', 13, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '中东', '空运专线(大货)', 'DDP',
  21.0, 1000.0, 1.0,
  0.0, 1.0, 3.34,
  0.0, 'USD', NULL, NULL,
  '阿联酋 AE07-B普货特价迪拜 21-100KG=3.27.5,101-300=22,301-500=22,501KG+=3.27 USD/KG；双清包税；8-10工作日', 'needs_review', 14, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '欧洲', '国际快递(小货-法/荷/德)', 'DDP',
  1.0, 20.0, 1.0,
  44.58, 0.5, 7.43,
  0.0, 'USD', NULL, NULL,
  'ZCT欧洲空派包税 法国荷兰德国 首重1KG=44.58,续0.5KG=7.43；双清包税到门；7-9工作日', 'needs_review', 15, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '欧洲', '国际快递(大货-法/荷/德)', 'DDP',
  21.0, 499.0, 1.0,
  0.0, 1.0, 12.63,
  0.0, 'USD', NULL, NULL,
  'ZCT欧洲空派包税 法国荷兰德国 大货均价 21KG+=13.08,45+=85,100+=83,300+=83,500+=83 USD/KG', 'needs_review', 16, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '欧洲', '国际快递(小货-意/西)', 'DDP',
  1.0, 20.0, 1.0,
  46.81, 0.5, 7.43,
  0.0, 'USD', NULL, NULL,
  'ZCT欧洲空派包税 意大利西班牙 首重1KG=46.81,续0.5KG=7.43；双清包税到门', 'needs_review', 17, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '欧洲', '国际快递(大货-意/西)', 'DDP',
  21.0, 499.0, 1.0,
  0.0, 1.0, 12.78,
  0.0, 'USD', NULL, NULL,
  'ZCT欧洲空派包税 意大利西班牙 大货均价 21KG+=13.22,45+=86,100+=84,300+=84,500+=84 USD/KG', 'needs_review', 18, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '日本', '空派包税(FBA带电)', 'DDP',
  21.0, 499.0, 1.0,
  0.0, 1.0, 4.75,
  0.0, 'USD', NULL, NULL,
  'ZCT日本普货空派包税(FBA) 普货带电价 21KG+=4.75 USD/KG(不带电22)；双清包税到门；体积/5000；4-7工作日', 'needs_review', 19, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '墨西哥', '专线双清包税(10-20KG)', 'DDP',
  10.0, 20.0, 1.0,
  0.0, 1.0, 19.91,
  0.0, 'USD', NULL, NULL,
  'ZCT墨西哥专线双清包税 10-20KG=19.91 USD/KG；含目的地关税及燃油', 'needs_review', 20, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '墨西哥', '专线双清包税(21KG+)', 'DDP',
  21.0, 499.0, 1.0,
  0.0, 1.0, 15.6,
  0.0, 'USD', NULL, NULL,
  'ZCT墨西哥专线双清包税 21KG+=15.6(31+=104,51+=102,101+=100) USD/KG；18-22工作日', 'needs_review', 21, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '俄罗斯', '陆运专线(小货)', 'DDP',
  0.5, 20.0, 0.5,
  28.23, 0.5, 5.94,
  0.0, 'USD', NULL, NULL,
  'ZCT俄罗斯陆运纯电池专线 双清包税到门 首重0.5KG=28.23,续0.5=40；18-22工作日', 'needs_review', 22, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '俄罗斯', '陆运专线(大货)', 'DDP',
  21.0, 299.0, 1.0,
  0.0, 1.0, 7.13,
  0.0, 'USD', NULL, NULL,
  'ZCT俄罗斯陆运 大货均价 21-44=49,45-70=48,71-99=47,100-299=46 USD/KG', 'needs_review', 23, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '台湾', '空派(小货-不包税)', 'DDP',
  1.0, 20.0, 1.0,
  14.12, 0.5, 4.16,
  0.0, 'USD', NULL, NULL,
  'ZCT台湾空派纯电池价【双清不包税】首重1KG=14.12,续0.5=28；1工作日；目的地关税由收件人付', 'needs_review', 24, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '台湾', '空派(大货-不包税)', 'DDP',
  15.0, 499.0, 1.0,
  0.0, 1.0, 4.46,
  0.0, 'USD', NULL, NULL,
  'ZCT台湾空派 大货均价 15KG+=4.46,100+=29,300+=29,1000+=29 USD/KG；不包税(DDU)', 'needs_review', 25, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '亚太', 'DHL香港纯电池专线(大货)', 'DAP',
  21.0, 19999.0, 1.0,
  0.0, 1.0, 5.9,
  0.0, 'USD', NULL, NULL,
  'DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD: 21-31KG $5.9/KG；32-70KG $5.9/KG；71-100KG $5.9/KG；101-299KG $5.9/KG；300-+KG $5.9/KG。原RMB: 21-31KG ¥39.7279662/KG；32-70KG ¥39.7279662/KG；71-100KG ¥39.7279662/KG；101-299KG ¥39.7279662/KG；300-+KG ¥39.7279662/KG。隔天上网，含燃油+旺季附加费', 'needs_review', 26, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '亚太', 'DHL香港纯电池专线(大货)', 'DAP',
  21.0, 19999.0, 1.0,
  0.0, 1.0, 5.9,
  0.0, 'USD', NULL, NULL,
  'DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD: 21-31KG $5.9/KG；32-70KG $5.9/KG；71-100KG $5.9/KG；101-299KG $5.9/KG；300-+KG $5.9/KG。原RMB: 21-31KG ¥39.7279662/KG；32-70KG ¥39.7279662/KG；71-100KG ¥39.7279662/KG；101-299KG ¥39.7279662/KG；300-+KG ¥39.7279662/KG。隔天上网，含燃油+旺季附加费', 'needs_review', 27, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '亚太', 'DHL香港纯电池专线(大货)', 'DAP',
  21.0, 19999.0, 1.0,
  0.0, 1.0, 5.9,
  0.0, 'USD', NULL, NULL,
  'DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD: 21-31KG $5.9/KG；32-70KG $5.9/KG；71-100KG $5.9/KG；101-299KG $5.9/KG；300-+KG $5.9/KG。原RMB: 21-31KG ¥39.7279662/KG；32-70KG ¥39.7279662/KG；71-100KG ¥39.7279662/KG；101-299KG ¥39.7279662/KG；300-+KG ¥39.7279662/KG。隔天上网，含燃油+旺季附加费', 'needs_review', 28, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '亚太', 'DHL香港纯电池专线(大货)', 'DAP',
  21.0, 19999.0, 1.0,
  0.0, 1.0, 5.9,
  0.0, 'USD', NULL, NULL,
  'DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD: 21-31KG $5.9/KG；32-70KG $5.9/KG；71-100KG $5.9/KG；101-299KG $5.9/KG；300-+KG $5.9/KG。原RMB: 21-31KG ¥39.7279662/KG；32-70KG ¥39.7279662/KG；71-100KG ¥39.7279662/KG；101-299KG ¥39.7279662/KG；300-+KG ¥39.7279662/KG。隔天上网，含燃油+旺季附加费', 'needs_review', 29, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '中东', 'DHL香港纯电池专线(大货)', 'DAP',
  21.0, 19999.0, 1.0,
  0.0, 1.0, 14.27,
  0.0, 'USD', NULL, NULL,
  'DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 14.27/11.92/11.92/11.92/11.92；原RMB/KG: 101.65/80.19/80.19/80.19/80.19；隔天上网，含燃油+旺季附加费', 'needs_review', 30, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '亚太', 'DHL香港纯电池专线(大货)', 'DAP',
  21.0, 19999.0, 1.0,
  0.0, 1.0, 11.25,
  0.0, 'USD', NULL, NULL,
  'DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 11.25/11.25/13.94/13.94/13.94；原RMB/KG: 75.68/75.68/93.76/93.76/93.76；隔天上网，含燃油+旺季附加费', 'needs_review', 31, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '中东', 'DHL香港纯电池专线(大货)', 'DAP',
  21.0, 19999.0, 1.0,
  0.0, 1.0, 8.23,
  0.0, 'USD', NULL, NULL,
  'DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 8.23/8.23/8.23/8.23/8.23；原RMB/KG: 55.34/55.34/55.34/55.34/55.34；隔天上网，含燃油+旺季附加费', 'needs_review', 32, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '欧洲', 'DHL香港纯电池专线(大货)', 'DAP',
  21.0, 19999.0, 1.0,
  0.0, 1.0, 6.19,
  0.0, 'USD', NULL, NULL,
  'DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 6.19/6.58/6.68/6.68/6.68；原RMB/KG: 41.68/44.73/48.69/48.69/50.61；隔天上网，含燃油+旺季附加费', 'needs_review', 33, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '欧洲', 'DHL香港纯电池专线(大货)', 'DAP',
  21.0, 19999.0, 1.0,
  0.0, 1.0, 6.14,
  0.0, 'USD', NULL, NULL,
  'DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 6.14/6.58/6.68/6.68/6.68；原RMB/KG: 41.29/44.24/44.98/46.46/48.48；隔天上网，含燃油+旺季附加费', 'needs_review', 34, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '欧洲', 'DHL香港纯电池专线(大货)', 'DAP',
  21.0, 19999.0, 1.0,
  0.0, 1.0, 6.14,
  0.0, 'USD', NULL, NULL,
  'DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 6.14/6.58/6.68/6.68/6.68；原RMB/KG: 41.29/44.24/44.98/46.46/48.48；隔天上网，含燃油+旺季附加费', 'needs_review', 35, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '欧洲', 'DHL香港纯电池专线(大货)', 'DAP',
  21.0, 19999.0, 1.0,
  0.0, 1.0, 6.14,
  0.0, 'USD', NULL, NULL,
  'DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 6.14/6.58/6.68/6.68/6.68；原RMB/KG: 41.29/44.24/44.98/46.46/48.48；隔天上网，含燃油+旺季附加费', 'needs_review', 36, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '欧洲', 'DHL香港纯电池专线(大货)', 'DAP',
  21.0, 19999.0, 1.0,
  0.0, 1.0, 6.14,
  0.0, 'USD', NULL, NULL,
  'DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 6.14/6.58/6.68/6.68/6.68；原RMB/KG: 41.29/44.24/44.98/46.46/48.48；隔天上网，含燃油+旺季附加费', 'needs_review', 37, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '欧洲', 'DHL香港纯电池专线(大货)', 'DAP',
  21.0, 19999.0, 1.0,
  0.0, 1.0, 6.14,
  0.0, 'USD', NULL, NULL,
  'DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 6.14/6.58/6.68/6.68/6.68；原RMB/KG: 41.29/44.24/44.98/46.46/48.48；隔天上网，含燃油+旺季附加费', 'needs_review', 38, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '欧洲', 'DHL香港纯电池专线(大货)', 'DAP',
  21.0, 19999.0, 1.0,
  0.0, 1.0, 6.14,
  0.0, 'USD', NULL, NULL,
  'DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 6.14/6.58/6.68/6.68/6.68；原RMB/KG: 41.29/44.24/44.98/46.46/48.48；隔天上网，含燃油+旺季附加费', 'needs_review', 39, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '欧洲', 'DHL香港纯电池专线(大货)', 'DAP',
  21.0, 19999.0, 1.0,
  0.0, 1.0, 6.14,
  0.0, 'USD', NULL, NULL,
  'DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 6.14/6.58/6.68/6.68/6.68；原RMB/KG: 41.29/44.24/44.98/46.46/48.48；隔天上网，含燃油+旺季附加费', 'needs_review', 40, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '欧洲', 'DHL香港纯电池专线(大货)', 'DAP',
  21.0, 19999.0, 1.0,
  0.0, 1.0, 6.14,
  0.0, 'USD', NULL, NULL,
  'DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 6.14/6.58/6.68/6.68/6.68；原RMB/KG: 41.29/44.24/44.98/46.46/48.48；隔天上网，含燃油+旺季附加费', 'needs_review', 41, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '欧洲', 'DHL香港纯电池专线(大货)', 'DAP',
  21.0, 19999.0, 1.0,
  0.0, 1.0, 6.14,
  0.0, 'USD', NULL, NULL,
  'DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 6.14/6.58/6.68/6.68/6.68；原RMB/KG: 41.29/44.24/44.98/46.46/48.48；隔天上网，含燃油+旺季附加费', 'needs_review', 42, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '欧洲', 'DHL香港纯电池专线(大货)', 'DAP',
  21.0, 19999.0, 1.0,
  0.0, 1.0, 6.14,
  0.0, 'USD', NULL, NULL,
  'DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 6.14/6.58/6.68/6.68/6.68；原RMB/KG: 41.29/44.24/44.98/46.46/48.48；隔天上网，含燃油+旺季附加费', 'needs_review', 43, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '南美', 'DHL香港纯电池专线(大货)', 'DAP',
  21.0, 19999.0, 1.0,
  0.0, 1.0, 18.57,
  0.0, 'USD', NULL, NULL,
  'DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 18.57/12.75/12.75/12.75/12.75；原RMB/KG: 125/85.84/85.84/85.84/85.84；隔天上网，含燃油+旺季附加费', 'needs_review', 44, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '南美', 'DHL香港纯电池专线(大货)', 'DAP',
  21.0, 19999.0, 1.0,
  0.0, 1.0, 18.57,
  0.0, 'USD', NULL, NULL,
  'DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 18.57/12.75/12.75/12.75/12.75；原RMB/KG: 125/85.84/85.84/85.84/85.84；隔天上网，含燃油+旺季附加费', 'needs_review', 45, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '南美', 'DHL香港纯电池专线(大货)', 'DAP',
  21.0, 19999.0, 1.0,
  0.0, 1.0, 18.57,
  0.0, 'USD', NULL, NULL,
  'DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 18.57/12.75/12.75/12.75/12.75；原RMB/KG: 125/85.84/85.84/85.84/85.84；隔天上网，含燃油+旺季附加费', 'needs_review', 46, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '美洲', 'DHL香港纯电池专线(大货)', 'DAP',
  21.0, 19999.0, 1.0,
  0.0, 1.0, 18.57,
  0.0, 'USD', NULL, NULL,
  'DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 18.57/12.75/12.75/12.75/12.75；原RMB/KG: 125/85.84/85.84/85.84/85.84；隔天上网，含燃油+旺季附加费', 'needs_review', 47, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '南美', 'DHL香港纯电池专线(大货)', 'DAP',
  21.0, 19999.0, 1.0,
  0.0, 1.0, 18.57,
  0.0, 'USD', NULL, NULL,
  'DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 18.57/12.75/12.75/12.75/12.75；原RMB/KG: 125/85.84/85.84/85.84/85.84；隔天上网，含燃油+旺季附加费', 'needs_review', 48, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '南美', 'DHL香港纯电池专线(大货)', 'DAP',
  21.0, 19999.0, 1.0,
  0.0, 1.0, 18.57,
  0.0, 'USD', NULL, NULL,
  'DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 18.57/12.75/12.75/12.75/12.75；原RMB/KG: 125/85.84/85.84/85.84/85.84；隔天上网，含燃油+旺季附加费', 'needs_review', 49, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '南美', 'DHL香港纯电池专线(大货)', 'DAP',
  21.0, 19999.0, 1.0,
  0.0, 1.0, 18.57,
  0.0, 'USD', NULL, NULL,
  'DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 18.57/12.75/12.75/12.75/12.75；原RMB/KG: 125/85.84/85.84/85.84/85.84；隔天上网，含燃油+旺季附加费', 'needs_review', 50, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '美洲', 'DHL香港纯电池专线(大货)', 'DAP',
  21.0, 19999.0, 1.0,
  0.0, 1.0, 18.57,
  0.0, 'USD', NULL, NULL,
  'DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 18.57/12.75/12.75/12.75/12.75；原RMB/KG: 125/85.84/85.84/85.84/85.84；隔天上网，含燃油+旺季附加费', 'needs_review', 51, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '非洲', 'DHL香港纯电池专线(大货)', 'DAP',
  21.0, 19999.0, 1.0,
  0.0, 1.0, 18.57,
  0.0, 'USD', NULL, NULL,
  'DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 18.57/12.75/12.75/12.75/12.75；原RMB/KG: 125/85.84/85.84/85.84/85.84；隔天上网，含燃油+旺季附加费', 'needs_review', 52, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '南美', 'DHL香港纯电池专线(大货)', 'DAP',
  21.0, 19999.0, 1.0,
  0.0, 1.0, 18.57,
  0.0, 'USD', NULL, NULL,
  'DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 18.57/12.75/12.75/12.75/12.75；原RMB/KG: 125/85.84/85.84/85.84/85.84；隔天上网，含燃油+旺季附加费', 'needs_review', 53, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '中东', 'DHL香港纯电池专线(大货)', 'DAP',
  21.0, 19999.0, 1.0,
  0.0, 1.0, 18.57,
  0.0, 'USD', NULL, NULL,
  'DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 18.57/12.75/12.75/12.75/12.75；原RMB/KG: 125/85.84/85.84/85.84/85.84；隔天上网，含燃油+旺季附加费', 'needs_review', 54, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '欧洲', 'DHL香港纯电池专线(大货)', 'DAP',
  21.0, 19999.0, 1.0,
  0.0, 1.0, 18.57,
  0.0, 'USD', NULL, NULL,
  'DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 18.57/12.75/12.75/12.75/12.75；原RMB/KG: 125/85.84/85.84/85.84/85.84；隔天上网，含燃油+旺季附加费', 'needs_review', 55, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '欧洲', 'DHL香港纯电池专线(大货)', 'DAP',
  21.0, 19999.0, 1.0,
  0.0, 1.0, 18.57,
  0.0, 'USD', NULL, NULL,
  'DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 18.57/12.75/12.75/12.75/12.75；原RMB/KG: 125/85.84/85.84/85.84/85.84；隔天上网，含燃油+旺季附加费', 'needs_review', 56, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '欧洲', 'DHL香港纯电池专线(大货)', 'DAP',
  21.0, 19999.0, 1.0,
  0.0, 1.0, 18.57,
  0.0, 'USD', NULL, NULL,
  'DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 18.57/12.75/12.75/12.75/12.75；原RMB/KG: 125/85.84/85.84/85.84/85.84；隔天上网，含燃油+旺季附加费', 'needs_review', 57, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '美洲', 'DHL香港纯电池专线(大货)', 'DAP',
  21.0, 19999.0, 1.0,
  0.0, 1.0, 18.57,
  0.0, 'USD', NULL, NULL,
  'DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 18.57/12.75/12.75/12.75/12.75；原RMB/KG: 125/85.84/85.84/85.84/85.84；隔天上网，含燃油+旺季附加费', 'needs_review', 58, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '非洲', 'DHL香港纯电池专线(大货)', 'DAP',
  21.0, 19999.0, 1.0,
  0.0, 1.0, 18.57,
  0.0, 'USD', NULL, NULL,
  'DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 18.57/12.75/12.75/12.75/12.75；原RMB/KG: 125/85.84/85.84/85.84/85.84；隔天上网，含燃油+旺季附加费', 'needs_review', 59, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '非洲', 'DHL香港纯电池专线(大货)', 'DAP',
  21.0, 19999.0, 1.0,
  0.0, 1.0, 18.57,
  0.0, 'USD', NULL, NULL,
  'DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 18.57/12.75/12.75/12.75/12.75；原RMB/KG: 125/85.84/85.84/85.84/85.84；隔天上网，含燃油+旺季附加费', 'needs_review', 60, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '非洲', 'DHL香港纯电池专线(大货)', 'DAP',
  21.0, 19999.0, 1.0,
  0.0, 1.0, 18.57,
  0.0, 'USD', NULL, NULL,
  'DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 18.57/12.75/12.75/12.75/12.75；原RMB/KG: 125/85.84/85.84/85.84/85.84；隔天上网，含燃油+旺季附加费', 'needs_review', 61, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '非洲', 'DHL香港纯电池专线(大货)', 'DAP',
  21.0, 19999.0, 1.0,
  0.0, 1.0, 18.57,
  0.0, 'USD', NULL, NULL,
  'DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 18.57/12.75/12.75/12.75/12.75；原RMB/KG: 125/85.84/85.84/85.84/85.84；隔天上网，含燃油+旺季附加费', 'needs_review', 62, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '欧洲', 'DHL香港纯电池专线(大货)', 'DAP',
  21.0, 19999.0, 1.0,
  0.0, 1.0, 18.57,
  0.0, 'USD', NULL, NULL,
  'DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 18.57/12.75/12.75/12.75/12.75；原RMB/KG: 125/85.84/85.84/85.84/85.84；隔天上网，含燃油+旺季附加费', 'needs_review', 63, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '中东', 'DHL香港纯电池专线(大货)', 'DAP',
  21.0, 19999.0, 1.0,
  0.0, 1.0, 18.57,
  0.0, 'USD', NULL, NULL,
  'DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 18.57/12.75/12.75/12.75/12.75；原RMB/KG: 125/85.84/85.84/85.84/85.84；隔天上网，含燃油+旺季附加费', 'needs_review', 64, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '非洲', 'DHL香港纯电池专线(大货)', 'DAP',
  21.0, 19999.0, 1.0,
  0.0, 1.0, 18.57,
  0.0, 'USD', NULL, NULL,
  'DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 18.57/12.75/12.75/12.75/12.75；原RMB/KG: 125/85.84/85.84/85.84/85.84；隔天上网，含燃油+旺季附加费', 'needs_review', 65, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '南美', 'DHL香港纯电池专线(大货)', 'DAP',
  21.0, 19999.0, 1.0,
  0.0, 1.0, 18.57,
  0.0, 'USD', NULL, NULL,
  'DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 18.57/12.75/12.75/12.75/12.75；原RMB/KG: 125/85.84/85.84/85.84/85.84；隔天上网，含燃油+旺季附加费', 'needs_review', 66, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '中东', 'DHL香港纯电池专线(大货)', 'DAP',
  21.0, 19999.0, 1.0,
  0.0, 1.0, 18.57,
  0.0, 'USD', NULL, NULL,
  'DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 18.57/12.75/12.75/12.75/12.75；原RMB/KG: 125/85.84/85.84/85.84/85.84；隔天上网，含燃油+旺季附加费', 'needs_review', 67, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '南美', 'DHL香港纯电池专线(大货)', 'DAP',
  21.0, 19999.0, 1.0,
  0.0, 1.0, 18.57,
  0.0, 'USD', NULL, NULL,
  'DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 18.57/12.75/12.75/12.75/12.75；原RMB/KG: 125/85.84/85.84/85.84/85.84；隔天上网，含燃油+旺季附加费', 'needs_review', 68, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '美洲', 'DHL香港纯电池专线(大货)', 'DAP',
  21.0, 19999.0, 1.0,
  0.0, 1.0, 18.57,
  0.0, 'USD', NULL, NULL,
  'DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 18.57/12.75/12.75/12.75/12.75；原RMB/KG: 125/85.84/85.84/85.84/85.84；隔天上网，含燃油+旺季附加费', 'needs_review', 69, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '欧洲', '欧洲专线包税(USD)', 'DDP',
  1.0, 500.0, 1.0,
  36.36, 0.5, 18.18,
  0.0, 'USD', NULL, NULL,
  '欧洲专线包税(USD) 英国 双清包税DDP：首重1KG=$36.36，续0.5KG=$18.18；大货USD/KG分档 21KG+$8.39/51KG+$8.11/101KG+$7.83/201KG+$7.55/301KG+$7.27/401KG+$6.99/501KG+$6.71；7-9工作日', 'needs_review', 70, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '欧洲', '欧洲专线包税(USD)', 'DDP',
  1.0, 500.0, 1.0,
  41.96, 0.5, 20.98,
  0.0, 'USD', NULL, NULL,
  '欧洲专线包税(USD) 法国 双清包税DDP：首重1KG=$41.96，续0.5KG=$20.98；大货USD/KG分档 21KG+$9.51/51KG+$9.23/101KG+$8.95/201KG+$8.67/301KG+$8.39/401KG+$8.11/501KG+$7.83；7-9工作日', 'needs_review', 71, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '欧洲', '欧洲专线包税(USD)', 'DDP',
  1.0, 500.0, 1.0,
  41.96, 0.5, 20.98,
  0.0, 'USD', NULL, NULL,
  '欧洲专线包税(USD) 荷兰 双清包税DDP：首重1KG=$41.96，续0.5KG=$20.98；大货USD/KG分档 21KG+$9.51/51KG+$9.23/101KG+$8.95/201KG+$8.67/301KG+$8.39/401KG+$8.11/501KG+$7.83；7-9工作日', 'needs_review', 72, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '欧洲', '欧洲专线包税(USD)', 'DDP',
  1.0, 500.0, 1.0,
  41.96, 0.5, 20.98,
  0.0, 'USD', NULL, NULL,
  '欧洲专线包税(USD) 德国 双清包税DDP：首重1KG=$41.96，续0.5KG=$20.98；大货USD/KG分档 21KG+$9.51/51KG+$9.23/101KG+$8.95/201KG+$8.67/301KG+$8.39/401KG+$8.11/501KG+$7.83；7-9工作日', 'needs_review', 73, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '欧洲', '欧洲专线包税(USD)', 'DDP',
  1.0, 500.0, 1.0,
  44.06, 0.5, 22.1,
  0.0, 'USD', NULL, NULL,
  '欧洲专线包税(USD) 意大利 双清包税DDP：首重1KG=$44.06，续0.5KG=$22.10；大货USD/KG分档 21KG+$10.07/51KG+$9.79/101KG+$9.51/201KG+$9.23/301KG+$8.95/401KG+$8.67/501KG+$8.39；7-9工作日', 'needs_review', 74, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '欧洲', '欧洲专线包税(USD)', 'DDP',
  1.0, 500.0, 1.0,
  44.06, 0.5, 22.1,
  0.0, 'USD', NULL, NULL,
  '欧洲专线包税(USD) 西班牙 双清包税DDP：首重1KG=$44.06，续0.5KG=$22.10；大货USD/KG分档 21KG+$10.07/51KG+$9.79/101KG+$9.51/201KG+$9.23/301KG+$8.95/401KG+$8.67/501KG+$8.39；7-9工作日；小货3KG起步', 'needs_review', 75, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '欧洲', '欧洲专线包税(USD)', 'DDP',
  1.0, 500.0, 1.0,
  45.45, 0.5, 22.8,
  0.0, 'USD', NULL, NULL,
  '欧洲专线包税(USD) 波兰 双清包税DDP：首重1KG=$45.45，续0.5KG=$22.80；大货USD/KG分档 21KG+$10.49/51KG+$10.21/101KG+$9.93/201KG+$9.65/301KG+$9.37/401KG+$9.09/501KG+$8.81；7-9工作日', 'needs_review', 76, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '欧洲', '欧洲专线包税(USD)', 'DDP',
  1.0, 500.0, 1.0,
  45.45, 0.5, 22.8,
  0.0, 'USD', NULL, NULL,
  '欧洲专线包税(USD) 捷克 双清包税DDP：首重1KG=$45.45，续0.5KG=$22.80；大货USD/KG分档 21KG+$10.49/51KG+$10.21/101KG+$9.93/201KG+$9.65/301KG+$9.37/401KG+$9.09/501KG+$8.81；7-9工作日', 'needs_review', 77, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '欧洲', '欧洲专线包税(USD)', 'DDP',
  1.0, 500.0, 1.0,
  46.85, 0.5, 23.5,
  0.0, 'USD', NULL, NULL,
  '欧洲专线包税(USD) 保加利亚 双清包税DDP：首重1KG=$46.85，续0.5KG=$23.50；大货USD/KG分档 21KG+$10.91/51KG+$10.63/101KG+$10.35/201KG+$10.07/301KG+$9.79/401KG+$9.51/501KG+$9.23；7-9工作日', 'needs_review', 78, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '欧洲', '欧洲专线包税(USD)', 'DDP',
  1.0, 500.0, 1.0,
  46.85, 0.5, 23.5,
  0.0, 'USD', NULL, NULL,
  '欧洲专线包税(USD) 丹麦 双清包税DDP：首重1KG=$46.85，续0.5KG=$23.50；大货USD/KG分档 21KG+$10.91/51KG+$10.63/101KG+$10.35/201KG+$10.07/301KG+$9.79/401KG+$9.51/501KG+$9.23；7-9工作日', 'needs_review', 79, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '欧洲', '欧洲专线包税(USD)', 'DDP',
  1.0, 500.0, 1.0,
  46.85, 0.5, 23.5,
  0.0, 'USD', NULL, NULL,
  '欧洲专线包税(USD) 比利时 双清包税DDP：首重1KG=$46.85，续0.5KG=$23.50；大货USD/KG分档 21KG+$10.91/51KG+$10.63/101KG+$10.35/201KG+$10.07/301KG+$9.79/401KG+$9.51/501KG+$9.23；7-9工作日', 'needs_review', 80, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '欧洲', '欧洲专线包税(USD)', 'DDP',
  1.0, 500.0, 1.0,
  46.85, 0.5, 23.5,
  0.0, 'USD', NULL, NULL,
  '欧洲专线包税(USD) 爱尔兰 双清包税DDP：首重1KG=$46.85，续0.5KG=$23.50；大货USD/KG分档 21KG+$10.91/51KG+$10.63/101KG+$10.35/201KG+$10.07/301KG+$9.79/401KG+$9.51/501KG+$9.23；7-9工作日', 'needs_review', 81, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '欧洲', '欧洲专线包税(USD)', 'DDP',
  1.0, 500.0, 1.0,
  46.85, 0.5, 23.5,
  0.0, 'USD', NULL, NULL,
  '欧洲专线包税(USD) 奥地利 双清包税DDP：首重1KG=$46.85，续0.5KG=$23.50；大货USD/KG分档 21KG+$10.91/51KG+$10.63/101KG+$10.35/201KG+$10.07/301KG+$9.79/401KG+$9.51/501KG+$9.23；7-9工作日', 'needs_review', 82, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '欧洲', '欧洲专线包税(USD)', 'DDP',
  1.0, 500.0, 1.0,
  46.85, 0.5, 23.5,
  0.0, 'USD', NULL, NULL,
  '欧洲专线包税(USD) 匈牙利 双清包税DDP：首重1KG=$46.85，续0.5KG=$23.50；大货USD/KG分档 21KG+$10.91/51KG+$10.63/101KG+$10.35/201KG+$10.07/301KG+$9.79/401KG+$9.51/501KG+$9.23；7-9工作日', 'needs_review', 83, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '欧洲', '欧洲专线包税(USD)', 'DDP',
  1.0, 500.0, 1.0,
  46.85, 0.5, 23.5,
  0.0, 'USD', NULL, NULL,
  '欧洲专线包税(USD) 葡萄牙 双清包税DDP：首重1KG=$46.85，续0.5KG=$23.50；大货USD/KG分档 21KG+$10.91/51KG+$10.63/101KG+$10.35/201KG+$10.07/301KG+$9.79/401KG+$9.51/501KG+$9.23；7-9工作日', 'needs_review', 84, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '欧洲', '欧洲专线包税(USD)', 'DDP',
  1.0, 500.0, 1.0,
  46.85, 0.5, 23.5,
  0.0, 'USD', NULL, NULL,
  '欧洲专线包税(USD) 斯洛伐克 双清包税DDP：首重1KG=$46.85，续0.5KG=$23.50；大货USD/KG分档 21KG+$10.91/51KG+$10.63/101KG+$10.35/201KG+$10.07/301KG+$9.79/401KG+$9.51/501KG+$9.23；7-9工作日', 'needs_review', 85, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '欧洲', '欧洲专线包税(USD)', 'DDP',
  1.0, 500.0, 1.0,
  46.85, 0.5, 23.5,
  0.0, 'USD', NULL, NULL,
  '欧洲专线包税(USD) 斯洛文尼亚 双清包税DDP：首重1KG=$46.85，续0.5KG=$23.50；大货USD/KG分档 21KG+$10.91/51KG+$10.63/101KG+$10.35/201KG+$10.07/301KG+$9.79/401KG+$9.51/501KG+$9.23；7-9工作日', 'needs_review', 86, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '欧洲', '欧洲专线包税(USD)', 'DDP',
  1.0, 500.0, 1.0,
  76.92, 0.5, 38.46,
  0.0, 'USD', NULL, NULL,
  '欧洲专线包税(USD) 罗马尼亚 双清包税DDP：首重1KG=$76.92，续0.5KG=$38.46；大货USD/KG分档 21KG+$13.29/51KG+$12.87/101KG+$12.59/201KG+$12.31/301KG+$12.03/401KG+$11.75/501KG+$11.47；7-9工作日；最低3KG计费', 'needs_review', 87, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '欧洲', '欧洲专线包税(USD)', 'DDP',
  1.0, 500.0, 1.0,
  46.85, 0.5, 23.5,
  0.0, 'USD', NULL, NULL,
  '欧洲专线包税(USD) 爱沙尼亚 双清包税DDP：首重1KG=$46.85，续0.5KG=$23.50；大货USD/KG分档 21KG+$10.91/51KG+$10.63/101KG+$10.35/201KG+$10.07/301KG+$9.79/401KG+$9.51/501KG+$9.23；7-9工作日', 'needs_review', 88, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '欧洲', '欧洲专线包税(USD)', 'DDP',
  1.0, 500.0, 1.0,
  46.85, 0.5, 23.5,
  0.0, 'USD', NULL, NULL,
  '欧洲专线包税(USD) 拉脱维亚 双清包税DDP：首重1KG=$46.85，续0.5KG=$23.50；大货USD/KG分档 21KG+$10.91/51KG+$10.63/101KG+$10.35/201KG+$10.07/301KG+$9.79/401KG+$9.51/501KG+$9.23；7-9工作日', 'needs_review', 89, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '欧洲', '欧洲专线包税(USD)', 'DDP',
  1.0, 500.0, 1.0,
  46.85, 0.5, 23.5,
  0.0, 'USD', NULL, NULL,
  '欧洲专线包税(USD) 芬兰 双清包税DDP：首重1KG=$46.85，续0.5KG=$23.50；大货USD/KG分档 21KG+$10.91/51KG+$10.63/101KG+$10.35/201KG+$10.07/301KG+$9.79/401KG+$9.51/501KG+$9.23；7-9工作日', 'needs_review', 90, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '欧洲', '欧洲专线包税(USD)', 'DDP',
  1.0, 500.0, 1.0,
  46.85, 0.5, 23.5,
  0.0, 'USD', NULL, NULL,
  '欧洲专线包税(USD) 卢森堡 双清包税DDP：首重1KG=$46.85，续0.5KG=$23.50；大货USD/KG分档 21KG+$10.91/51KG+$10.63/101KG+$10.35/201KG+$10.07/301KG+$9.79/401KG+$9.51/501KG+$9.23；7-9工作日', 'needs_review', 91, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '欧洲', '欧洲专线包税(USD)', 'DDP',
  1.0, 500.0, 1.0,
  46.85, 0.5, 23.5,
  0.0, 'USD', NULL, NULL,
  '欧洲专线包税(USD) 立陶宛 双清包税DDP：首重1KG=$46.85，续0.5KG=$23.50；大货USD/KG分档 21KG+$10.91/51KG+$10.63/101KG+$10.35/201KG+$10.07/301KG+$9.79/401KG+$9.51/501KG+$9.23；7-9工作日', 'needs_review', 92, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '欧洲', '欧洲专线包税(USD)', 'DDP',
  1.0, 500.0, 1.0,
  46.85, 0.5, 23.5,
  0.0, 'USD', NULL, NULL,
  '欧洲专线包税(USD) 瑞典 双清包税DDP：首重1KG=$46.85，续0.5KG=$23.50；大货USD/KG分档 21KG+$10.91/51KG+$10.63/101KG+$10.35/201KG+$10.07/301KG+$9.79/401KG+$9.51/501KG+$9.23；7-9工作日', 'needs_review', 93, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '欧洲', '欧洲专线包税(USD)', 'DDP',
  1.0, 500.0, 1.0,
  46.85, 0.5, 23.5,
  0.0, 'USD', NULL, NULL,
  '欧洲专线包税(USD) 爱沙尼亚 双清包税DDP：首重1KG=$46.85，续0.5KG=$23.50；大货USD/KG分档 21KG+$10.91/51KG+$10.63/101KG+$10.35/201KG+$10.07/301KG+$9.79/401KG+$9.51/501KG+$9.23；7-9工作日', 'needs_review', 94, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '欧洲', '欧洲专线包税(USD)', 'DDP',
  1.0, 500.0, 1.0,
  46.85, 0.5, 23.5,
  0.0, 'USD', NULL, NULL,
  '欧洲专线包税(USD) 拉脱维亚 双清包税DDP：首重1KG=$46.85，续0.5KG=$23.50；大货USD/KG分档 21KG+$10.91/51KG+$10.63/101KG+$10.35/201KG+$10.07/301KG+$9.79/401KG+$9.51/501KG+$9.23；7-9工作日', 'needs_review', 95, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '欧洲', '欧洲专线包税(USD)', 'DDP',
  1.0, 500.0, 1.0,
  46.85, 0.5, 23.5,
  0.0, 'USD', NULL, NULL,
  '欧洲专线包税(USD) 芬兰 双清包税DDP：首重1KG=$46.85，续0.5KG=$23.50；大货USD/KG分档 21KG+$10.91/51KG+$10.63/101KG+$10.35/201KG+$10.07/301KG+$9.79/401KG+$9.51/501KG+$9.23；7-9工作日', 'needs_review', 96, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '欧洲', '欧洲专线包税(USD)', 'DDP',
  1.0, 500.0, 1.0,
  46.85, 0.5, 23.5,
  0.0, 'USD', NULL, NULL,
  '欧洲专线包税(USD) 卢森堡 双清包税DDP：首重1KG=$46.85，续0.5KG=$23.50；大货USD/KG分档 21KG+$10.91/51KG+$10.63/101KG+$10.35/201KG+$10.07/301KG+$9.79/401KG+$9.51/501KG+$9.23；7-9工作日', 'needs_review', 97, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '欧洲', '欧洲专线包税(USD)', 'DDP',
  1.0, 500.0, 1.0,
  46.85, 0.5, 23.5,
  0.0, 'USD', NULL, NULL,
  '欧洲专线包税(USD) 立陶宛 双清包税DDP：首重1KG=$46.85，续0.5KG=$23.50；大货USD/KG分档 21KG+$10.91/51KG+$10.63/101KG+$10.35/201KG+$10.07/301KG+$9.79/401KG+$9.51/501KG+$9.23；7-9工作日', 'needs_review', 98, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '欧洲', '欧洲专线包税(USD)', 'DDP',
  1.0, 500.0, 1.0,
  46.85, 0.5, 23.5,
  0.0, 'USD', NULL, NULL,
  '欧洲专线包税(USD) 瑞典 双清包税DDP：首重1KG=$46.85，续0.5KG=$23.50；大货USD/KG分档 21KG+$10.91/51KG+$10.63/101KG+$10.35/201KG+$10.07/301KG+$9.79/401KG+$9.51/501KG+$9.23；7-9工作日', 'needs_review', 99, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '亚太', 'ComOne-西马普货经济(MY01-TB)', 'DDP',
  0.5, 100.0, 0.5,
  2.67, 0.5, 2.67,
  0.0, 'USD', NULL, NULL,
  'ComOne Express 马来西亚空派专线DDP（含税）ComOne-西马普货经济(MY01-TB)：首0.5KG=USD2.67，续0.5KG=USD2.67；大货分档 3-10KG=2.53.5/10-20KG=2.53.5；经济渠道：限商业单一品类，尺寸≤120*80*80CM，不接受托盘木箱超大件；统配航班；除6000；4-5工作天', 'needs_review', 100, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '亚太', 'ComOne-西马普货含税(MY03-PB)', 'DDP',
  0.5, 100.0, 0.5,
  6.09, 0.5, 1.63,
  0.0, 'USD', NULL, NULL,
  'ComOne Express 马来西亚空派专线DDP（含税）ComOne-西马普货含税(MY03-PB)：首0.5KG=USD6.09，续0.5KG=USD1.63；大货分档 3-10KG=2.82.5/10-20KG=2.82.0/20-30KG=2.82.0/30-50KG=2.67.5/50-100KG=2.67.5；普货含税；木箱木架+1.5/KG；除6000；2-4工作天', 'needs_review', 101, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '亚太', 'ComOne-西马内电含税(MY04-DB)', 'DDP',
  0.5, 100.0, 0.5,
  6.69, 0.5, 2.01,
  0.0, 'USD', NULL, NULL,
  'ComOne Express 马来西亚空派专线DDP（含税）ComOne-西马内电含税(MY04-DB)：首0.5KG=USD6.69，续0.5KG=USD2.01；大货分档 3-10KG=3.86.5/10-20KG=3.86.0/20-30KG=3.86.0/30-50KG=3.71.5/50-100KG=3.71.5；内电含税；香港直飞；除6000；3-5工作天', 'needs_review', 102, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '亚太', 'ComOne-西马敏感含税(MY05-MB)', 'DDP',
  0.5, 100.0, 0.5,
  7.43, 0.5, 2.15,
  0.0, 'USD', NULL, NULL,
  'ComOne Express 马来西亚空派专线DDP（含税）ComOne-西马敏感含税(MY05-MB)：首0.5KG=USD7.43，续0.5KG=USD2.15；大货分档 3-10KG=4.16.0/10-20KG=4.01.5/20-30KG=4.01.5/30-50KG=4.01.0/50-100KG=4.01.0；敏感货含税；除6000；3-5工作天', 'needs_review', 103, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '亚太', 'ComOne-东马普货含税(MY07-PB)', 'DDP',
  0.5, 100.0, 0.5,
  7.88, 0.5, 3.05,
  0.0, 'USD', NULL, NULL,
  'ComOne Express 马来西亚空派专线DDP（含税）ComOne-东马普货含税(MY07-PB)：首0.5KG=USD7.88，续0.5KG=USD3.05；大货分档 3-10KG=5.5.5/10-20KG=5.5.5/20-30KG=5.35.5/30-50KG=5.35.0/50-100KG=5.2.5；东马普货含税；木箱木架+3/KG；除6000；4-6工作天', 'needs_review', 104, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '亚太', 'ComOne-东马敏感含税(MY08-MB)', 'DDP',
  0.5, 100.0, 0.5,
  8.47, 0.5, 3.19,
  0.0, 'USD', NULL, NULL,
  'ComOne Express 马来西亚空派专线DDP（含税）ComOne-东马敏感含税(MY08-MB)：首0.5KG=USD8.47，续0.5KG=USD3.19；大货分档 3-10KG=5.79.0/10-20KG=5.79.0/20-30KG=5.65.0/30-50KG=5.5.5/50-100KG=5.5.0；东马敏感货含税；除6000；4-6工作天', 'needs_review', 105, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '亚太', 'ComOne-西马香港交货(MY01-HKB)', 'DDP',
  0.5, 100.0, 0.5,
  18.57, 0.5, 3.19,
  0.0, 'USD', NULL, NULL,
  'ComOne Express 马来西亚空派专线DDP（含税）ComOne-西马香港交货(MY01-HKB)：首0.5KG=USD18.57，续0.5KG=USD3.19；大货分档 3-10KG=4.75.0/10-20KG=4.46.5/20-30KG=4.46.5/30-50KG=4.16.5/50-100KG=4.16.5；香港直飞；除6000；3-5工作天', 'needs_review', 106, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '亚太', 'ComOne-东马香港交货(MY02-HKB)', 'DDP',
  0.5, 100.0, 0.5,
  23.77, 0.5, 4.61,
  0.0, 'USD', NULL, NULL,
  'ComOne Express 马来西亚空派专线DDP（含税）ComOne-东马香港交货(MY02-HKB)：首0.5KG=USD23.77，续0.5KG=USD4.61；大货分档 3-10KG=7.73.0/10-20KG=7.58.5/20-30KG=7.13.0/30-50KG=6.84.0/50-100KG=6.39.0；东马香港交货；木箱木架+3/KG；除6000；5-7工作天', 'needs_review', 107, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '亚太', '菲律宾专线 空运双清包税(Y1)', 'DDP',
  1.0, 500.0, 1.0,
  6.39, 0.5, 6.39,
  0.0, 'USD', NULL, NULL,
  '菲律宾专线 空运双清包税(马尼拉,内电/杂货,Y1)：按KG计价,最低消费1KG,0.5KG进位;材积=长×宽×高/6000,材积与实重取大;单价分档 1-10KG=6.39/11-50KG=6.39/51-100KG=6.24/101-300KG=6.09/301-499KG=5.94/500KG+=5.79 (USD/KG);派送费 21KG以下4.46/票,21-50KG按0.3/KG,51-200KG按0.22/KG,201KG+按0.15/KG,吨货单询;货交仓前需提前提供箱单资料;可走带牌/内电/化妆品/食品/软糖/药贴,电子烟酒类单询;2-3工作天', 'needs_review', 108, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '亚太', '越南专线(包税)加急快递-河内/胡志明/平阳/同奈-普货', 'DDP',
  1.0, 1001.0, 1.0,
  9.66, 0.5, 2.23,
  0.0, 'USD', NULL, NULL,
  '越南专线(包税)加急快递 【河内/胡志明/平阳/同奈】【普货】：首1KG+续0.5KG为前端价, 1-10KG=9.66 / 11-100KG=4.16 / 101-500KG=3.86 / 501-1000KG=3.57 / 1001KG+=3.27 (USD/KG); 材积=长×宽×高/6000, 材积与实重取大; 工作日1-2; 不接受带电/带磁/液体/粉末/食品/药品/医疗用品', 'needs_review', 109, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '亚太', '越南专线(包税)加急快递-河内/胡志明/平阳/同奈-品牌高价值', 'DDP',
  1.0, 1001.0, 1.0,
  11.14, 0.5, 2.67,
  0.0, 'USD', NULL, NULL,
  '越南专线(包税)加急快递 【河内/胡志明/平阳/同奈】【品牌/高价值,价格上调】：首1KG+续0.5KG为前端价, 1-10KG=11.14 / 11-100KG=4.75 / 101-500KG=4.46 / 501-1000KG=4.16 / 1000KG+=3.86 (USD/KG); 材积=长×宽×高/6000, 材积与实重取大; 工作日1-2; 不接受带电/带磁/液体/粉末/食品/药品/医疗用品', 'needs_review', 110, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '亚太', '越南专线(包税)加急快递-北部其它城市/南部其它城市-普货', 'DDP',
  1.0, 1001.0, 1.0,
  11.14, 0.5, 2.67,
  0.0, 'USD', NULL, NULL,
  '越南专线(包税)加急快递 【北部其它城市/南部其它城市】【普货】：首1KG+续0.5KG为前端价, 1-10KG=11.14 / 11-100KG=4.75 / 101-500KG=4.46 / 501-1000KG=4.16 / 1001KG+=3.86 (USD/KG); 材积=长×宽×高/6000, 材积与实重取大; 工作日2-3; 不接受带电/带磁/液体/粉末/食品/药品/医疗用品', 'needs_review', 111, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '亚太', '越南专线(包税)加急快递-北部其它城市/南部其它城市-品牌高价值', 'DDP',
  1.0, 1001.0, 1.0,
  12.63, 0.5, 3.27,
  0.0, 'USD', NULL, NULL,
  '越南专线(包税)加急快递 【北部其它城市/南部其它城市】【品牌/高价值,价格上调】：首1KG+续0.5KG为前端价, 1-10KG=12.63 / 11-100KG=5.65 / 101-500KG=5.2 / 501-1000KG=4.9 / 1001KG+=4.46 (USD/KG); 材积=长×宽×高/6000, 材积与实重取大; 工作日2-3; 不接受带电/带磁/液体/粉末/食品/药品/医疗用品', 'needs_review', 112, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '亚太', '越南专线(包税)加急快递-中部其它城市-普货', 'DDP',
  1.0, 1001.0, 1.0,
  12.63, 0.5, 3.27,
  0.0, 'USD', NULL, NULL,
  '越南专线(包税)加急快递 【中部其它城市】【普货】：首1KG+续0.5KG为前端价, 1-10KG=12.63 / 11-100KG=5.65 / 101-500KG=5.2 / 501-1000KG=4.9 / 1001KG+=4.46 (USD/KG); 材积=长×宽×高/6000, 材积与实重取大; 工作日2-3; 不接受带电/带磁/液体/粉末/食品/药品/医疗用品', 'needs_review', 113, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '亚太', '越南专线(包税)加急快递-中部其它城市-品牌高价值', 'DDP',
  1.0, 1001.0, 1.0,
  14.12, 0.5, 3.71,
  0.0, 'USD', NULL, NULL,
  '越南专线(包税)加急快递 【中部其它城市】【品牌/高价值,价格上调】：首1KG+续0.5KG为前端价, 1-10KG=14.12 / 11-100KG=6.24 / 101-500KG=5.94 / 501-1000KG=5.65 / 1001KG+=5.2 (USD/KG); 材积=长×宽×高/6000, 材积与实重取大; 工作日2-3; 不接受带电/带磁/液体/粉末/食品/药品/医疗用品', 'needs_review', 114, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '亚太', '柬埔寨专线(包税)普通快递-广州/深圳→金边-普货', 'DDP',
  1.0, 1001.0, 1.0,
  7.43, 1.0, 4.61,
  0.0, 'USD', NULL, NULL,
  '柬埔寨专线(包税)普通快递 【广州/深圳→金边】【普货】：首1KG+续1KG为前端价, 1-10KG=7.43 / 11-100KG=4.46 / 101-500KG=3.86 / 501-1000KG=3.71 / 1001KG+=3.57 (USD/KG); 材积=长×宽×高/6000, 材积与实重取大; 工作日3-4', 'needs_review', 115, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '亚太', '柬埔寨专线(包税)普通快递-广州/深圳→金边-敏感货', 'DDP',
  1.0, 1001.0, 1.0,
  8.62, 1.0, 5.65,
  0.0, 'USD', NULL, NULL,
  '柬埔寨专线(包税)普通快递 【广州/深圳→金边】【敏感货】：首1KG+续1KG为前端价, 1-10KG=8.62 / 11-100KG=5.5 / 101-500KG=4.9 / 501-1000KG=4.75 / 1001KG+=4.61 (USD/KG); 材积=长×宽×高/6000, 材积与实重取大; 工作日3-4', 'needs_review', 116, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '亚太', '柬埔寨专线(包税)普通快递-柬埔寨其它城市-普货', 'DDP',
  1.0, 1001.0, 1.0,
  9.66, 1.0, 4.9,
  0.0, 'USD', NULL, NULL,
  '柬埔寨专线(包税)普通快递 【柬埔寨其它城市】【普货】：首1KG+续1KG为前端价, 1-10KG=9.66 / 11-100KG=4.9 / 101-500KG=4.31 / 501-1000KG=4.16 / 1001KG+=4.01 (USD/KG); 材积=长×宽×高/6000, 材积与实重取大; 工作日4-6', 'needs_review', 117, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '亚太', '柬埔寨专线(包税)普通快递-柬埔寨其它城市-敏感货', 'DDP',
  1.0, 1001.0, 1.0,
  10.85, 1.0, 6.09,
  0.0, 'USD', NULL, NULL,
  '柬埔寨专线(包税)普通快递 【柬埔寨其它城市】【敏感货】：首1KG+续1KG为前端价, 1-10KG=10.85 / 11-100KG=5.94 / 101-500KG=5.35 / 501-1000KG=5.2 / 1001KG+=5.05 (USD/KG); 材积=长×宽×高/6000, 材积与实重取大; 工作日4-6', 'needs_review', 118, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '亚太', '缅甸专线(包税)空运小包-深圳→仰光-一类货物(布料/服装辅料等)', 'DDP',
  1.0, 1001.0, 1.0,
  17.83, 1.0, 7.88,
  0.0, 'USD', NULL, NULL,
  '缅甸专线(包税)空运小包 深圳→仰光 【一类货物(布料/服装辅料等)】：首1KG+续1KG为前端价, 1-20KG=17.83 / 21-100KG=7.58 / 101-500KG=6.84 / 501-1000KG=6.54 / 1001KG+=6.24 (USD/KG); 材积=长×宽×高/6000, 材积与实重取大; 工作日7-10天; 一票一件, 单件超21KG免首重, 单件≤40KG, 尺寸≤120×80×80CM; 三类货物(化妆品/电子产品)价格单询', 'needs_review', 119, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '亚太', '缅甸专线(包税)空运小包-深圳→仰光-二类货物(化妆品/药品等)', 'DDP',
  1.0, 1001.0, 1.0,
  23.77, 1.0, 13.82,
  0.0, 'USD', NULL, NULL,
  '缅甸专线(包税)空运小包 深圳→仰光 【二类货物(化妆品/药品等)】：首1KG+续1KG为前端价, 1-20KG=23.77 / 21-100KG=13.52 / 101-500KG=12.78 / 501-1000KG=12.48 / 1001KG+=12.18 (USD/KG); 材积=长×宽×高/6000, 材积与实重取大; 工作日7-10天; 一票一件, 单件超21KG免首重, 单件≤40KG, 尺寸≤120×80×80CM; 三类货物(化妆品/电子产品)价格单询', 'needs_review', 120, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

INSERT INTO public.shipping_rate_staging (
  zone, method, trade_terms, min_weight_kg, max_weight_kg, base_weight_kg,
  base_fee, increment_weight_kg, increment_fee, minimum_fee, currency,
  effective_from, effective_to, source_notes, validation_status, source_row, updated_at
) VALUES (
  '亚太', '印尼专线(包税)敏感货快线(YC/F)', 'DDP',
  11.0, 1001.0, 11.0,
  14.71, 0.5, 14.71,
  0.0, 'USD', NULL, NULL,
  '印尼专线(包税)敏感货快线(YC/F)：适用内置电池/带磁/化妆品/护肤品/日化/食品/木箱木架货物; 按KG计价, 11KG起, 单价分档 11-100KG=14.71/101-500KG=14.41/501-1000KG=14.12/1001KG+=13.97 (USD/KG); 材积=长×宽×高/6000, 材积与实重取大; 工作日5-7天; 附加费: 单件>149KG 超重费104.01/票, 宽或高>1.5m 超宽超高操作费297.18/票, 长度≤2.5m', 'needs_review', 121, now()
) ON CONFLICT (source_file, source_row) DO UPDATE SET
  zone = EXCLUDED.zone, method = EXCLUDED.method, trade_terms = EXCLUDED.trade_terms,
  min_weight_kg = EXCLUDED.min_weight_kg, max_weight_kg = EXCLUDED.max_weight_kg,
  base_weight_kg = EXCLUDED.base_weight_kg, base_fee = EXCLUDED.base_fee,
  increment_weight_kg = EXCLUDED.increment_weight_kg, increment_fee = EXCLUDED.increment_fee,
  minimum_fee = EXCLUDED.minimum_fee, currency = EXCLUDED.currency,
  source_notes = EXCLUDED.source_notes, validation_status = 'needs_review', updated_at = now();

UPDATE public.products SET
  weight_kg = 14.5,
  packed_weight_kg = 15.0,
  package_length_cm = 71.0,
  package_width_cm = 47.0,
  package_height_cm = 28.0,
  package_count = 1,
  shipping_class = 'parcel',
  shipping_quote_required = true,
  updated_at = now()
WHERE slug = 'awol-aetherion-max-ust-projector';

UPDATE public.products SET
  weight_kg = 9.0,
  packed_weight_kg = 9.3,
  package_length_cm = 35.3,
  package_width_cm = 27.1,
  package_height_cm = 44.9,
  package_count = 1,
  shipping_class = 'parcel',
  shipping_quote_required = true,
  updated_at = now()
WHERE slug = 'awol-plus-2-projector';

UPDATE public.products SET
  weight_kg = 15.0,
  packed_weight_kg = 15.4,
  package_length_cm = 58.0,
  package_width_cm = 48.0,
  package_height_cm = 40.0,
  package_count = 1,
  shipping_class = 'parcel',
  shipping_quote_required = true,
  updated_at = now()
WHERE slug = 'hisense-c5-master-4k-projector';

UPDATE public.products SET
  weight_kg = 16.0,
  packed_weight_kg = 16.29,
  package_length_cm = 58.0,
  package_width_cm = 48.0,
  package_height_cm = 40.0,
  package_count = 1,
  shipping_class = 'parcel',
  shipping_quote_required = true,
  updated_at = now()
WHERE slug = 'hisense-xr10-4k-triple-laser-projector';

UPDATE public.products SET
  weight_kg = 12.5,
  packed_weight_kg = 13.0,
  package_length_cm = 33.0,
  package_width_cm = 68.0,
  package_height_cm = 42.0,
  package_count = 1,
  shipping_class = 'parcel',
  shipping_quote_required = true,
  updated_at = now()
WHERE slug = 'hisense-px4-pro-rgb-laser-projector';

UPDATE public.products SET
  weight_kg = 10.0,
  packed_weight_kg = 10.3,
  package_length_cm = 46.0,
  package_width_cm = 33.0,
  package_height_cm = 47.0,
  package_count = 1,
  shipping_class = 'parcel',
  shipping_quote_required = true,
  updated_at = now()
WHERE slug = 'jmgo-n5s-ultra-max-laser-projector';

UPDATE public.products SET
  weight_kg = 17.0,
  packed_weight_kg = 17.6,
  package_length_cm = 58.0,
  package_width_cm = 48.0,
  package_height_cm = 44.0,
  package_count = 1,
  shipping_class = 'parcel',
  shipping_quote_required = true,
  updated_at = now()
WHERE slug = 'xgimi-x50-ultra-max-4k-laser-projector';

UPDATE public.products SET
  weight_kg = 13.0,
  packed_weight_kg = 13.2,
  package_length_cm = 55.0,
  package_width_cm = 38.0,
  package_height_cm = 55.0,
  package_count = 1,
  shipping_class = 'parcel',
  shipping_quote_required = true,
  updated_at = now()
WHERE slug = 'xgimi-x50-ultra-4k-rgb-laser-projector';

UPDATE public.products SET
  weight_kg = 1.3,
  packed_weight_kg = 1.5,
  package_length_cm = 30.0,
  package_width_cm = 28.0,
  package_height_cm = 8.0,
  package_count = 1,
  shipping_class = 'parcel',
  shipping_quote_required = true,
  updated_at = now()
WHERE slug = 'c1ne-ph89-projector-ceiling-mount';

UPDATE public.products SET
  weight_kg = 1.8,
  packed_weight_kg = 2.0,
  package_length_cm = 50.0,
  package_width_cm = 48.0,
  package_height_cm = 5.0,
  package_count = 1,
  shipping_class = 'parcel',
  shipping_quote_required = true,
  updated_at = now()
WHERE slug = 'jingmi-bg9r-freestanding-projector-stand';

UPDATE public.products SET
  weight_kg = 1.3,
  packed_weight_kg = 1.5,
  package_length_cm = 30.0,
  package_width_cm = 28.0,
  package_height_cm = 8.0,
  package_count = 1,
  shipping_class = 'parcel',
  shipping_quote_required = true,
  updated_at = now()
WHERE slug = 'vidda-asc6-projector-ceiling-mount';

UPDATE public.products SET
  weight_kg = 74.0,
  packed_weight_kg = 76.0,
  package_length_cm = 228.0,
  package_width_cm = 53.0,
  package_height_cm = 54.0,
  package_count = 1,
  shipping_class = 'freight',
  shipping_quote_required = true,
  updated_at = now()
WHERE slug = 'neotunt-s8-2-2m-concealed-laser-tv-cabinet';

UPDATE public.products SET
  weight_kg = 82.0,
  packed_weight_kg = 84.0,
  package_length_cm = 248.0,
  package_width_cm = 53.0,
  package_height_cm = 54.0,
  package_count = 1,
  shipping_class = 'freight',
  shipping_quote_required = true,
  updated_at = now()
WHERE slug = 'neotunt-s8-2-4m-concealed-laser-tv-cabinet';

UPDATE public.products SET
  weight_kg = 94.0,
  packed_weight_kg = 96.0,
  package_length_cm = 288.0,
  package_width_cm = 53.0,
  package_height_cm = 54.0,
  package_count = 1,
  shipping_class = 'freight',
  shipping_quote_required = true,
  updated_at = now()
WHERE slug = 'neotunt-s8-2-8m-concealed-laser-tv-cabinet';

UPDATE public.products SET
  weight_kg = 106.0,
  packed_weight_kg = 108.0,
  package_length_cm = 328.0,
  package_width_cm = 53.0,
  package_height_cm = 54.0,
  package_count = 1,
  shipping_class = 'freight',
  shipping_quote_required = true,
  updated_at = now()
WHERE slug = 'neotunt-s8-3-2m-concealed-laser-tv-cabinet';

SELECT
  (SELECT count(*) FROM public.shipping_country_rules WHERE source_file = 'Reach_Projector_运费模板_V1_USD补充.xlsx') AS country_rows,
  (SELECT count(*) FROM public.shipping_rate_staging WHERE source_file = 'Reach_Projector_运费模板_V1_USD补充.xlsx') AS rate_rows,
  (SELECT count(*) FROM public.products WHERE packed_weight_kg IS NOT NULL) AS products_with_packaging;