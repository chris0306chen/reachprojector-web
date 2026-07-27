-- Activate the reviewed, safe subset of Reach Projector shipping workbook V2.
-- Business decision: Mexico checkout exposes DDP only.
-- Excluded rows remain manual/disabled until the workbook is corrected.

BEGIN;

DELETE FROM public.shipping_templates
WHERE notes LIKE 'Source: Reach_Projector_运费模板_V2_USD.xlsx;%';

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'US 国际快递(小货) (DDP)', '北美', 'US', 'parcel', '国际快递(小货)', 'DDP', 'USD',
  0.5, 20, 0.5, 42.77,
  0.5, 2.97, 0, 6000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 2. 美国小货 深圳UPS5000红单包税；首重0.5KG+续重0.5KG(阶梯均价，完整表见7月1号快递到门包税价格.xls/香港深圳UPS小货包税)；支持带内置电池', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'US 国际快递(大货) (DDP)', '北美', 'US', 'parcel', '国际快递(大货)', 'DDP', 'USD',
  25, 300, 1, 0,
  1, 9.29, 22.29, 6000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 3. 美国大货 深圳UPS直发包税红单 25-47KG=9.21.5,48-100=61.5,101-300=62.5 USD/KG；含油含税免清关操作费150/票；带电+1/KG', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'CA 国际快递(小货) (DDP)', '北美', 'CA', 'parcel', '国际快递(小货)', 'DDP', 'USD',
  0.5, 20, 0.5, 49.62,
  0.5, 4.41, 0, 6000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 4. 加拿大小货 深圳UPS5000红单包税；首重0.5KG+续重0.5KG(阶梯均价，完整表见7月1号.../香港深圳UPS小货包税)；支持带内置电池', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'CA 国际快递(大货) (DDP)', '北美', 'CA', 'parcel', '国际快递(大货)', 'DDP', 'USD',
  25, 300, 1, 0,
  1, 10.18, 22.29, 6000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 5. 加拿大大货 深圳UPS直发包税红单 25-47KG=10.1.5,48-100=67.5,101-300=68.5 USD/KG；含油含税免清关操作费150/票；支持带内置电池', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'KR 空运(快船) (DDP)', '亚太', 'KR', 'parcel', '空运(快船)', 'DDP', 'USD',
  1, 300, 1, 11.89,
  1, 4.75, 0, 6000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 7. 韩国 KR05-AA快船(双清包税) 首重1KG=11.89,续1KG=4.75,15KG+=2.67.5,21+=18,51+=15,100+=12,201+=10.5,300+=9.5,501+=8.5,1000+=7.5；拒收纯电池；5-6工作日', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'KR 空运(一日达) (DDP)', '亚太', 'KR', 'parcel', '空运(一日达)', 'DDP', 'USD',
  1, 300, 1, 15.6,
  1, 8.62, 0, 6000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 8. 韩国 KR01-YA一日达普货 首重1KG=15.6,续1KG=8.62,21KG+=6.84；带电带磁KR02-YB首重110续61；2-3工作日', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'AU 电商小包 (DDP)', '亚太', 'AU', 'parcel', '电商小包', 'DDP', 'USD',
  0.5, 20, 0.5, 17.83,
  0.5, 7.43, 0, 6000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 9. 澳大利亚 ComMail ECOM-PA(双清包税,AUD1000以下无税) 首重0.5KG=17.83,续0.5KG=7.43；限20KG内；体积/6000；7-10工作日。空运/海派为DDU另算；支持带内置电池', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'SG 空运专线 (DDP)', '亚太', 'SG', 'parcel', '空运专线', 'DDP', 'USD',
  0.5, 1000, 0.5, 6.39,
  0.5, 1.71, 0, 6000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 10. 新加坡 SG03-P普货标准 首重0.5=43,续0.5=11.5,11KG+=2.67.5,45+=18,100+=17.5,500+=17.5,1000+=17.5；注：商壹新加坡专线双清包税(含税)，双清包税已确认；支持带内置电池', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'MY 海运小包(含) (DDP)', '亚太', 'MY', 'parcel', '海运小包(含)', 'DDP', 'USD',
  1, 300, 1, 4.46,
  1, 1.19, 0, 6000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 11. 马来西亚 新马海运小包西马(含=含税/DDP) 首重1KG=4.46,续1KG=1.19,10.1-300KG=1.04.5；10-15工作日；单件≤30KG；支持带内置电池', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'TH 陆运专线 (DDP)', '亚太', 'TH', 'parcel', '陆运专线', 'DDP', 'USD',
  1, 1000, 1, 6.54,
  1, 2.97, 0, 6000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 12. 泰国 TH01曼谷普货内电 首重1=44,续1=20,11KG+=2.23.5,21+=12.5,45+=12,100+=11,500+=10.5,1000+=10.5；5-7天；按政策视为双清包税已确认；支持带内置电池', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'AE 空运专线(小货) (DDP)', '中东', 'AE', 'parcel', '空运专线(小货)', 'DDP', 'USD',
  1, 20, 1, 9.66,
  1, 5.94, 0, 6000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 13. 阿联酋 AE01-B普货带电迪拜 首1KG=9.66,续1KG=5.94,21-100KG=5.79,101-300=38,301-500=38,501+=37；双清包税；6-8工作日', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'AE 空运专线(大货) (DDP)', '中东', 'AE', 'parcel', '空运专线(大货)', 'DDP', 'USD',
  21, 1000, 1, 0,
  1, 3.34, 0, 6000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 14. 阿联酋 AE07-B普货特价迪拜 21-100KG=3.27.5,101-300=22,301-500=22,501KG+=3.27 USD/KG；双清包税；8-10工作日；支持带内置电池', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'DE 国际快递(小货-法/荷/德) (DDP)', '欧洲', 'DE', 'parcel', '国际快递(小货-法/荷/德)', 'DDP', 'USD',
  1, 20, 1, 44.58,
  0.5, 7.43, 0, 6000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 15. ZCT欧洲空派包税 法国荷兰德国 首重1KG=44.58,续0.5KG=7.43；双清包税到门；7-9工作日；支持带内置电池', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'FR 国际快递(小货-法/荷/德) (DDP)', '欧洲', 'FR', 'parcel', '国际快递(小货-法/荷/德)', 'DDP', 'USD',
  1, 20, 1, 44.58,
  0.5, 7.43, 0, 6000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 15. ZCT欧洲空派包税 法国荷兰德国 首重1KG=44.58,续0.5KG=7.43；双清包税到门；7-9工作日；支持带内置电池', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'NL 国际快递(小货-法/荷/德) (DDP)', '欧洲', 'NL', 'parcel', '国际快递(小货-法/荷/德)', 'DDP', 'USD',
  1, 20, 1, 44.58,
  0.5, 7.43, 0, 6000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 15. ZCT欧洲空派包税 法国荷兰德国 首重1KG=44.58,续0.5KG=7.43；双清包税到门；7-9工作日；支持带内置电池', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'DE 国际快递(大货-法/荷/德) (DDP)', '欧洲', 'DE', 'parcel', '国际快递(大货-法/荷/德)', 'DDP', 'USD',
  21, 499, 1, 0,
  1, 12.63, 0, 6000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 16. ZCT欧洲空派包税 法国荷兰德国 大货均价 21KG+=13.08,45+=85,100+=83,300+=83,500+=83 USD/KG；支持带内置电池', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'FR 国际快递(大货-法/荷/德) (DDP)', '欧洲', 'FR', 'parcel', '国际快递(大货-法/荷/德)', 'DDP', 'USD',
  21, 499, 1, 0,
  1, 12.63, 0, 6000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 16. ZCT欧洲空派包税 法国荷兰德国 大货均价 21KG+=13.08,45+=85,100+=83,300+=83,500+=83 USD/KG；支持带内置电池', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'NL 国际快递(大货-法/荷/德) (DDP)', '欧洲', 'NL', 'parcel', '国际快递(大货-法/荷/德)', 'DDP', 'USD',
  21, 499, 1, 0,
  1, 12.63, 0, 6000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 16. ZCT欧洲空派包税 法国荷兰德国 大货均价 21KG+=13.08,45+=85,100+=83,300+=83,500+=83 USD/KG；支持带内置电池', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'IT 国际快递(小货-意/西) (DDP)', '欧洲', 'IT', 'parcel', '国际快递(小货-意/西)', 'DDP', 'USD',
  1, 20, 1, 46.81,
  0.5, 7.43, 0, 6000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 17. ZCT欧洲空派包税 意大利西班牙 首重1KG=46.81,续0.5KG=7.43；双清包税到门；支持带内置电池', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'ES 国际快递(小货-意/西) (DDP)', '欧洲', 'ES', 'parcel', '国际快递(小货-意/西)', 'DDP', 'USD',
  1, 20, 1, 46.81,
  0.5, 7.43, 0, 6000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 17. ZCT欧洲空派包税 意大利西班牙 首重1KG=46.81,续0.5KG=7.43；双清包税到门；支持带内置电池', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'IT 国际快递(大货-意/西) (DDP)', '欧洲', 'IT', 'parcel', '国际快递(大货-意/西)', 'DDP', 'USD',
  21, 499, 1, 0,
  1, 12.78, 0, 6000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 18. ZCT欧洲空派包税 意大利西班牙 大货均价 21KG+=13.22,45+=86,100+=84,300+=84,500+=84 USD/KG；支持带内置电池', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'ES 国际快递(大货-意/西) (DDP)', '欧洲', 'ES', 'parcel', '国际快递(大货-意/西)', 'DDP', 'USD',
  21, 499, 1, 0,
  1, 12.78, 0, 6000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 18. ZCT欧洲空派包税 意大利西班牙 大货均价 21KG+=13.22,45+=86,100+=84,300+=84,500+=84 USD/KG；支持带内置电池', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'JP 空派包税(FBA带电) (DDP)', '日本', 'JP', 'parcel', '空派包税(FBA带电)', 'DDP', 'USD',
  21, 499, 1, 0,
  1, 4.75, 0, 5000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 19. ZCT日本普货空派包税(FBA) 普货带电价 21KG+=4.75 USD/KG(不带电22)；双清包税到门；体积/5000；4-7工作日', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'MX 专线双清包税(10-20KG) (DDP)', '墨西哥', 'MX', 'parcel', '专线双清包税(10-20KG)', 'DDP', 'USD',
  10, 20, 1, 0,
  1, 19.91, 0, 6000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 20. ZCT墨西哥专线双清包税 10-20KG=19.91 USD/KG；含目的地关税及燃油；支持带内置电池', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'MX 专线双清包税(21KG+) (DDP)', '墨西哥', 'MX', 'parcel', '专线双清包税(21KG+)', 'DDP', 'USD',
  21, 499, 1, 0,
  1, 15.6, 0, 6000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 21. ZCT墨西哥专线双清包税 21KG+=15.6(31+=104,51+=102,101+=100) USD/KG；18-22工作日；支持带内置电池', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'RU 陆运专线(小货) (DDP)', '俄罗斯', 'RU', 'parcel', '陆运专线(小货)', 'DDP', 'USD',
  0.5, 20, 0.5, 28.23,
  0.5, 5.94, 0, 6000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 22. ZCT俄罗斯陆运纯电池专线 双清包税到门 首重0.5KG=28.23,续0.5=40；18-22工作日', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'RU 陆运专线(大货) (DDP)', '俄罗斯', 'RU', 'parcel', '陆运专线(大货)', 'DDP', 'USD',
  21, 299, 1, 0,
  1, 7.13, 0, 6000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 23. ZCT俄罗斯陆运 大货均价 21-44=49,45-70=48,71-99=47,100-299=46 USD/KG；支持带内置电池', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'NZ DHL香港纯电池专线(大货) (DAP)', '亚太', 'NZ', 'parcel', 'DHL香港纯电池专线(大货)', 'DAP', 'USD',
  21, 19999, 1, 0,
  1, 5.9, 0, 5000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 26. DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD: 21-31KG $5.9/KG；32-70KG $5.9/KG；71-100KG $5.9/KG；101-299KG $5.9/KG；300-+KG $5.9/KG。原RMB: 21-31KG ¥39.7279662/KG；32-70KG ¥39.7279662/KG；71-100KG ¥39.7279662/KG；101-299KG ¥39.7279662/KG；300-+KG ¥39.7279662/KG。隔天上网，含燃油+旺季附加费', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'IN DHL香港纯电池专线(大货) (DAP)', '亚太', 'IN', 'parcel', 'DHL香港纯电池专线(大货)', 'DAP', 'USD',
  21, 19999, 1, 0,
  1, 5.9, 0, 5000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 26. DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD: 21-31KG $5.9/KG；32-70KG $5.9/KG；71-100KG $5.9/KG；101-299KG $5.9/KG；300-+KG $5.9/KG。原RMB: 21-31KG ¥39.7279662/KG；32-70KG ¥39.7279662/KG；71-100KG ¥39.7279662/KG；101-299KG ¥39.7279662/KG；300-+KG ¥39.7279662/KG。隔天上网，含燃油+旺季附加费', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'PK DHL香港纯电池专线(大货) (DAP)', '亚太', 'PK', 'parcel', 'DHL香港纯电池专线(大货)', 'DAP', 'USD',
  21, 19999, 1, 0,
  1, 5.9, 0, 5000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 26. DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD: 21-31KG $5.9/KG；32-70KG $5.9/KG；71-100KG $5.9/KG；101-299KG $5.9/KG；300-+KG $5.9/KG。原RMB: 21-31KG ¥39.7279662/KG；32-70KG ¥39.7279662/KG；71-100KG ¥39.7279662/KG；101-299KG ¥39.7279662/KG；300-+KG ¥39.7279662/KG。隔天上网，含燃油+旺季附加费', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'NZ DHL香港纯电池专线(大货) (DAP)', '亚太', 'NZ', 'parcel', 'DHL香港纯电池专线(大货)', 'DAP', 'USD',
  21, 19999, 1, 0,
  1, 5.9, 0, 5000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 27. DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD: 21-31KG $5.9/KG；32-70KG $5.9/KG；71-100KG $5.9/KG；101-299KG $5.9/KG；300-+KG $5.9/KG。原RMB: 21-31KG ¥39.7279662/KG；32-70KG ¥39.7279662/KG；71-100KG ¥39.7279662/KG；101-299KG ¥39.7279662/KG；300-+KG ¥39.7279662/KG。隔天上网，含燃油+旺季附加费', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'IN DHL香港纯电池专线(大货) (DAP)', '亚太', 'IN', 'parcel', 'DHL香港纯电池专线(大货)', 'DAP', 'USD',
  21, 19999, 1, 0,
  1, 5.9, 0, 5000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 27. DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD: 21-31KG $5.9/KG；32-70KG $5.9/KG；71-100KG $5.9/KG；101-299KG $5.9/KG；300-+KG $5.9/KG。原RMB: 21-31KG ¥39.7279662/KG；32-70KG ¥39.7279662/KG；71-100KG ¥39.7279662/KG；101-299KG ¥39.7279662/KG；300-+KG ¥39.7279662/KG。隔天上网，含燃油+旺季附加费', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'PK DHL香港纯电池专线(大货) (DAP)', '亚太', 'PK', 'parcel', 'DHL香港纯电池专线(大货)', 'DAP', 'USD',
  21, 19999, 1, 0,
  1, 5.9, 0, 5000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 27. DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD: 21-31KG $5.9/KG；32-70KG $5.9/KG；71-100KG $5.9/KG；101-299KG $5.9/KG；300-+KG $5.9/KG。原RMB: 21-31KG ¥39.7279662/KG；32-70KG ¥39.7279662/KG；71-100KG ¥39.7279662/KG；101-299KG ¥39.7279662/KG；300-+KG ¥39.7279662/KG。隔天上网，含燃油+旺季附加费', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'NZ DHL香港纯电池专线(大货) (DAP)', '亚太', 'NZ', 'parcel', 'DHL香港纯电池专线(大货)', 'DAP', 'USD',
  21, 19999, 1, 0,
  1, 5.9, 0, 5000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 28. DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD: 21-31KG $5.9/KG；32-70KG $5.9/KG；71-100KG $5.9/KG；101-299KG $5.9/KG；300-+KG $5.9/KG。原RMB: 21-31KG ¥39.7279662/KG；32-70KG ¥39.7279662/KG；71-100KG ¥39.7279662/KG；101-299KG ¥39.7279662/KG；300-+KG ¥39.7279662/KG。隔天上网，含燃油+旺季附加费', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'IN DHL香港纯电池专线(大货) (DAP)', '亚太', 'IN', 'parcel', 'DHL香港纯电池专线(大货)', 'DAP', 'USD',
  21, 19999, 1, 0,
  1, 5.9, 0, 5000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 28. DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD: 21-31KG $5.9/KG；32-70KG $5.9/KG；71-100KG $5.9/KG；101-299KG $5.9/KG；300-+KG $5.9/KG。原RMB: 21-31KG ¥39.7279662/KG；32-70KG ¥39.7279662/KG；71-100KG ¥39.7279662/KG；101-299KG ¥39.7279662/KG；300-+KG ¥39.7279662/KG。隔天上网，含燃油+旺季附加费', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'PK DHL香港纯电池专线(大货) (DAP)', '亚太', 'PK', 'parcel', 'DHL香港纯电池专线(大货)', 'DAP', 'USD',
  21, 19999, 1, 0,
  1, 5.9, 0, 5000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 28. DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD: 21-31KG $5.9/KG；32-70KG $5.9/KG；71-100KG $5.9/KG；101-299KG $5.9/KG；300-+KG $5.9/KG。原RMB: 21-31KG ¥39.7279662/KG；32-70KG ¥39.7279662/KG；71-100KG ¥39.7279662/KG；101-299KG ¥39.7279662/KG；300-+KG ¥39.7279662/KG。隔天上网，含燃油+旺季附加费', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'NZ DHL香港纯电池专线(大货) (DAP)', '亚太', 'NZ', 'parcel', 'DHL香港纯电池专线(大货)', 'DAP', 'USD',
  21, 19999, 1, 0,
  1, 5.9, 0, 5000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 29. DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD: 21-31KG $5.9/KG；32-70KG $5.9/KG；71-100KG $5.9/KG；101-299KG $5.9/KG；300-+KG $5.9/KG。原RMB: 21-31KG ¥39.7279662/KG；32-70KG ¥39.7279662/KG；71-100KG ¥39.7279662/KG；101-299KG ¥39.7279662/KG；300-+KG ¥39.7279662/KG。隔天上网，含燃油+旺季附加费', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'IN DHL香港纯电池专线(大货) (DAP)', '亚太', 'IN', 'parcel', 'DHL香港纯电池专线(大货)', 'DAP', 'USD',
  21, 19999, 1, 0,
  1, 5.9, 0, 5000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 29. DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD: 21-31KG $5.9/KG；32-70KG $5.9/KG；71-100KG $5.9/KG；101-299KG $5.9/KG；300-+KG $5.9/KG。原RMB: 21-31KG ¥39.7279662/KG；32-70KG ¥39.7279662/KG；71-100KG ¥39.7279662/KG；101-299KG ¥39.7279662/KG；300-+KG ¥39.7279662/KG。隔天上网，含燃油+旺季附加费', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'PK DHL香港纯电池专线(大货) (DAP)', '亚太', 'PK', 'parcel', 'DHL香港纯电池专线(大货)', 'DAP', 'USD',
  21, 19999, 1, 0,
  1, 5.9, 0, 5000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 29. DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD: 21-31KG $5.9/KG；32-70KG $5.9/KG；71-100KG $5.9/KG；101-299KG $5.9/KG；300-+KG $5.9/KG。原RMB: 21-31KG ¥39.7279662/KG；32-70KG ¥39.7279662/KG；71-100KG ¥39.7279662/KG；101-299KG ¥39.7279662/KG；300-+KG ¥39.7279662/KG。隔天上网，含燃油+旺季附加费', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'NZ DHL香港纯电池专线(大货) (DAP)', '亚太', 'NZ', 'parcel', 'DHL香港纯电池专线(大货)', 'DAP', 'USD',
  21, 19999, 1, 0,
  1, 11.25, 0, 5000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 30. DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 11.25/11.25/13.94/13.94/13.94；原RMB/KG: 75.68/75.68/93.76/93.76/93.76；隔天上网，含燃油+旺季附加费', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'IN DHL香港纯电池专线(大货) (DAP)', '亚太', 'IN', 'parcel', 'DHL香港纯电池专线(大货)', 'DAP', 'USD',
  21, 19999, 1, 0,
  1, 11.25, 0, 5000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 30. DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 11.25/11.25/13.94/13.94/13.94；原RMB/KG: 75.68/75.68/93.76/93.76/93.76；隔天上网，含燃油+旺季附加费', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'PK DHL香港纯电池专线(大货) (DAP)', '亚太', 'PK', 'parcel', 'DHL香港纯电池专线(大货)', 'DAP', 'USD',
  21, 19999, 1, 0,
  1, 11.25, 0, 5000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 30. DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 11.25/11.25/13.94/13.94/13.94；原RMB/KG: 75.68/75.68/93.76/93.76/93.76；隔天上网，含燃油+旺季附加费', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'BR DHL香港纯电池专线(大货) (DAP)', '南美', 'BR', 'parcel', 'DHL香港纯电池专线(大货)', 'DAP', 'USD',
  21, 19999, 1, 0,
  1, 18.57, 0, 5000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 31. DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 18.57/12.75/12.75/12.75/12.75；原RMB/KG: 125/85.84/85.84/85.84/85.84；隔天上网，含燃油+旺季附加费', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'BO DHL香港纯电池专线(大货) (DAP)', '南美', 'BO', 'parcel', 'DHL香港纯电池专线(大货)', 'DAP', 'USD',
  21, 19999, 1, 0,
  1, 18.57, 0, 5000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 31. DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 18.57/12.75/12.75/12.75/12.75；原RMB/KG: 125/85.84/85.84/85.84/85.84；隔天上网，含燃油+旺季附加费', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'CL DHL香港纯电池专线(大货) (DAP)', '南美', 'CL', 'parcel', 'DHL香港纯电池专线(大货)', 'DAP', 'USD',
  21, 19999, 1, 0,
  1, 18.57, 0, 5000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 31. DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 18.57/12.75/12.75/12.75/12.75；原RMB/KG: 125/85.84/85.84/85.84/85.84；隔天上网，含燃油+旺季附加费', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'CO DHL香港纯电池专线(大货) (DAP)', '南美', 'CO', 'parcel', 'DHL香港纯电池专线(大货)', 'DAP', 'USD',
  21, 19999, 1, 0,
  1, 18.57, 0, 5000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 31. DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 18.57/12.75/12.75/12.75/12.75；原RMB/KG: 125/85.84/85.84/85.84/85.84；隔天上网，含燃油+旺季附加费', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'PE DHL香港纯电池专线(大货) (DAP)', '南美', 'PE', 'parcel', 'DHL香港纯电池专线(大货)', 'DAP', 'USD',
  21, 19999, 1, 0,
  1, 18.57, 0, 5000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 31. DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 18.57/12.75/12.75/12.75/12.75；原RMB/KG: 125/85.84/85.84/85.84/85.84；隔天上网，含燃油+旺季附加费', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'VE DHL香港纯电池专线(大货) (DAP)', '南美', 'VE', 'parcel', 'DHL香港纯电池专线(大货)', 'DAP', 'USD',
  21, 19999, 1, 0,
  1, 18.57, 0, 5000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 31. DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 18.57/12.75/12.75/12.75/12.75；原RMB/KG: 125/85.84/85.84/85.84/85.84；隔天上网，含燃油+旺季附加费', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'EC DHL香港纯电池专线(大货) (DAP)', '南美', 'EC', 'parcel', 'DHL香港纯电池专线(大货)', 'DAP', 'USD',
  21, 19999, 1, 0,
  1, 18.57, 0, 5000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 31. DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 18.57/12.75/12.75/12.75/12.75；原RMB/KG: 125/85.84/85.84/85.84/85.84；隔天上网，含燃油+旺季附加费', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'AR DHL香港纯电池专线(大货) (DAP)', '南美', 'AR', 'parcel', 'DHL香港纯电池专线(大货)', 'DAP', 'USD',
  21, 19999, 1, 0,
  1, 18.57, 0, 5000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 31. DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 18.57/12.75/12.75/12.75/12.75；原RMB/KG: 125/85.84/85.84/85.84/85.84；隔天上网，含燃油+旺季附加费', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'UY DHL香港纯电池专线(大货) (DAP)', '南美', 'UY', 'parcel', 'DHL香港纯电池专线(大货)', 'DAP', 'USD',
  21, 19999, 1, 0,
  1, 18.57, 0, 5000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 31. DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 18.57/12.75/12.75/12.75/12.75；原RMB/KG: 125/85.84/85.84/85.84/85.84；隔天上网，含燃油+旺季附加费', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'PY DHL香港纯电池专线(大货) (DAP)', '南美', 'PY', 'parcel', 'DHL香港纯电池专线(大货)', 'DAP', 'USD',
  21, 19999, 1, 0,
  1, 18.57, 0, 5000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 31. DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 18.57/12.75/12.75/12.75/12.75；原RMB/KG: 125/85.84/85.84/85.84/85.84；隔天上网，含燃油+旺季附加费', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'BR DHL香港纯电池专线(大货) (DAP)', '南美', 'BR', 'parcel', 'DHL香港纯电池专线(大货)', 'DAP', 'USD',
  21, 19999, 1, 0,
  1, 18.57, 0, 5000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 32. DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 18.57/12.75/12.75/12.75/12.75；原RMB/KG: 125/85.84/85.84/85.84/85.84；隔天上网，含燃油+旺季附加费', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'BO DHL香港纯电池专线(大货) (DAP)', '南美', 'BO', 'parcel', 'DHL香港纯电池专线(大货)', 'DAP', 'USD',
  21, 19999, 1, 0,
  1, 18.57, 0, 5000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 32. DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 18.57/12.75/12.75/12.75/12.75；原RMB/KG: 125/85.84/85.84/85.84/85.84；隔天上网，含燃油+旺季附加费', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'CL DHL香港纯电池专线(大货) (DAP)', '南美', 'CL', 'parcel', 'DHL香港纯电池专线(大货)', 'DAP', 'USD',
  21, 19999, 1, 0,
  1, 18.57, 0, 5000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 32. DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 18.57/12.75/12.75/12.75/12.75；原RMB/KG: 125/85.84/85.84/85.84/85.84；隔天上网，含燃油+旺季附加费', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'CO DHL香港纯电池专线(大货) (DAP)', '南美', 'CO', 'parcel', 'DHL香港纯电池专线(大货)', 'DAP', 'USD',
  21, 19999, 1, 0,
  1, 18.57, 0, 5000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 32. DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 18.57/12.75/12.75/12.75/12.75；原RMB/KG: 125/85.84/85.84/85.84/85.84；隔天上网，含燃油+旺季附加费', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'PE DHL香港纯电池专线(大货) (DAP)', '南美', 'PE', 'parcel', 'DHL香港纯电池专线(大货)', 'DAP', 'USD',
  21, 19999, 1, 0,
  1, 18.57, 0, 5000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 32. DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 18.57/12.75/12.75/12.75/12.75；原RMB/KG: 125/85.84/85.84/85.84/85.84；隔天上网，含燃油+旺季附加费', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'VE DHL香港纯电池专线(大货) (DAP)', '南美', 'VE', 'parcel', 'DHL香港纯电池专线(大货)', 'DAP', 'USD',
  21, 19999, 1, 0,
  1, 18.57, 0, 5000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 32. DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 18.57/12.75/12.75/12.75/12.75；原RMB/KG: 125/85.84/85.84/85.84/85.84；隔天上网，含燃油+旺季附加费', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'EC DHL香港纯电池专线(大货) (DAP)', '南美', 'EC', 'parcel', 'DHL香港纯电池专线(大货)', 'DAP', 'USD',
  21, 19999, 1, 0,
  1, 18.57, 0, 5000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 32. DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 18.57/12.75/12.75/12.75/12.75；原RMB/KG: 125/85.84/85.84/85.84/85.84；隔天上网，含燃油+旺季附加费', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'AR DHL香港纯电池专线(大货) (DAP)', '南美', 'AR', 'parcel', 'DHL香港纯电池专线(大货)', 'DAP', 'USD',
  21, 19999, 1, 0,
  1, 18.57, 0, 5000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 32. DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 18.57/12.75/12.75/12.75/12.75；原RMB/KG: 125/85.84/85.84/85.84/85.84；隔天上网，含燃油+旺季附加费', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'UY DHL香港纯电池专线(大货) (DAP)', '南美', 'UY', 'parcel', 'DHL香港纯电池专线(大货)', 'DAP', 'USD',
  21, 19999, 1, 0,
  1, 18.57, 0, 5000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 32. DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 18.57/12.75/12.75/12.75/12.75；原RMB/KG: 125/85.84/85.84/85.84/85.84；隔天上网，含燃油+旺季附加费', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'PY DHL香港纯电池专线(大货) (DAP)', '南美', 'PY', 'parcel', 'DHL香港纯电池专线(大货)', 'DAP', 'USD',
  21, 19999, 1, 0,
  1, 18.57, 0, 5000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 32. DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 18.57/12.75/12.75/12.75/12.75；原RMB/KG: 125/85.84/85.84/85.84/85.84；隔天上网，含燃油+旺季附加费', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'BR DHL香港纯电池专线(大货) (DAP)', '南美', 'BR', 'parcel', 'DHL香港纯电池专线(大货)', 'DAP', 'USD',
  21, 19999, 1, 0,
  1, 18.57, 0, 5000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 33. DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 18.57/12.75/12.75/12.75/12.75；原RMB/KG: 125/85.84/85.84/85.84/85.84；隔天上网，含燃油+旺季附加费', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'BO DHL香港纯电池专线(大货) (DAP)', '南美', 'BO', 'parcel', 'DHL香港纯电池专线(大货)', 'DAP', 'USD',
  21, 19999, 1, 0,
  1, 18.57, 0, 5000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 33. DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 18.57/12.75/12.75/12.75/12.75；原RMB/KG: 125/85.84/85.84/85.84/85.84；隔天上网，含燃油+旺季附加费', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'CL DHL香港纯电池专线(大货) (DAP)', '南美', 'CL', 'parcel', 'DHL香港纯电池专线(大货)', 'DAP', 'USD',
  21, 19999, 1, 0,
  1, 18.57, 0, 5000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 33. DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 18.57/12.75/12.75/12.75/12.75；原RMB/KG: 125/85.84/85.84/85.84/85.84；隔天上网，含燃油+旺季附加费', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'CO DHL香港纯电池专线(大货) (DAP)', '南美', 'CO', 'parcel', 'DHL香港纯电池专线(大货)', 'DAP', 'USD',
  21, 19999, 1, 0,
  1, 18.57, 0, 5000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 33. DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 18.57/12.75/12.75/12.75/12.75；原RMB/KG: 125/85.84/85.84/85.84/85.84；隔天上网，含燃油+旺季附加费', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'PE DHL香港纯电池专线(大货) (DAP)', '南美', 'PE', 'parcel', 'DHL香港纯电池专线(大货)', 'DAP', 'USD',
  21, 19999, 1, 0,
  1, 18.57, 0, 5000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 33. DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 18.57/12.75/12.75/12.75/12.75；原RMB/KG: 125/85.84/85.84/85.84/85.84；隔天上网，含燃油+旺季附加费', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'VE DHL香港纯电池专线(大货) (DAP)', '南美', 'VE', 'parcel', 'DHL香港纯电池专线(大货)', 'DAP', 'USD',
  21, 19999, 1, 0,
  1, 18.57, 0, 5000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 33. DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 18.57/12.75/12.75/12.75/12.75；原RMB/KG: 125/85.84/85.84/85.84/85.84；隔天上网，含燃油+旺季附加费', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'EC DHL香港纯电池专线(大货) (DAP)', '南美', 'EC', 'parcel', 'DHL香港纯电池专线(大货)', 'DAP', 'USD',
  21, 19999, 1, 0,
  1, 18.57, 0, 5000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 33. DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 18.57/12.75/12.75/12.75/12.75；原RMB/KG: 125/85.84/85.84/85.84/85.84；隔天上网，含燃油+旺季附加费', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'AR DHL香港纯电池专线(大货) (DAP)', '南美', 'AR', 'parcel', 'DHL香港纯电池专线(大货)', 'DAP', 'USD',
  21, 19999, 1, 0,
  1, 18.57, 0, 5000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 33. DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 18.57/12.75/12.75/12.75/12.75；原RMB/KG: 125/85.84/85.84/85.84/85.84；隔天上网，含燃油+旺季附加费', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'UY DHL香港纯电池专线(大货) (DAP)', '南美', 'UY', 'parcel', 'DHL香港纯电池专线(大货)', 'DAP', 'USD',
  21, 19999, 1, 0,
  1, 18.57, 0, 5000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 33. DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 18.57/12.75/12.75/12.75/12.75；原RMB/KG: 125/85.84/85.84/85.84/85.84；隔天上网，含燃油+旺季附加费', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'PY DHL香港纯电池专线(大货) (DAP)', '南美', 'PY', 'parcel', 'DHL香港纯电池专线(大货)', 'DAP', 'USD',
  21, 19999, 1, 0,
  1, 18.57, 0, 5000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 33. DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 18.57/12.75/12.75/12.75/12.75；原RMB/KG: 125/85.84/85.84/85.84/85.84；隔天上网，含燃油+旺季附加费', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'BR DHL香港纯电池专线(大货) (DAP)', '南美', 'BR', 'parcel', 'DHL香港纯电池专线(大货)', 'DAP', 'USD',
  21, 19999, 1, 0,
  1, 18.57, 0, 5000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 35. DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 18.57/12.75/12.75/12.75/12.75；原RMB/KG: 125/85.84/85.84/85.84/85.84；隔天上网，含燃油+旺季附加费', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'BO DHL香港纯电池专线(大货) (DAP)', '南美', 'BO', 'parcel', 'DHL香港纯电池专线(大货)', 'DAP', 'USD',
  21, 19999, 1, 0,
  1, 18.57, 0, 5000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 35. DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 18.57/12.75/12.75/12.75/12.75；原RMB/KG: 125/85.84/85.84/85.84/85.84；隔天上网，含燃油+旺季附加费', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'CL DHL香港纯电池专线(大货) (DAP)', '南美', 'CL', 'parcel', 'DHL香港纯电池专线(大货)', 'DAP', 'USD',
  21, 19999, 1, 0,
  1, 18.57, 0, 5000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 35. DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 18.57/12.75/12.75/12.75/12.75；原RMB/KG: 125/85.84/85.84/85.84/85.84；隔天上网，含燃油+旺季附加费', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'CO DHL香港纯电池专线(大货) (DAP)', '南美', 'CO', 'parcel', 'DHL香港纯电池专线(大货)', 'DAP', 'USD',
  21, 19999, 1, 0,
  1, 18.57, 0, 5000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 35. DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 18.57/12.75/12.75/12.75/12.75；原RMB/KG: 125/85.84/85.84/85.84/85.84；隔天上网，含燃油+旺季附加费', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'PE DHL香港纯电池专线(大货) (DAP)', '南美', 'PE', 'parcel', 'DHL香港纯电池专线(大货)', 'DAP', 'USD',
  21, 19999, 1, 0,
  1, 18.57, 0, 5000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 35. DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 18.57/12.75/12.75/12.75/12.75；原RMB/KG: 125/85.84/85.84/85.84/85.84；隔天上网，含燃油+旺季附加费', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'VE DHL香港纯电池专线(大货) (DAP)', '南美', 'VE', 'parcel', 'DHL香港纯电池专线(大货)', 'DAP', 'USD',
  21, 19999, 1, 0,
  1, 18.57, 0, 5000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 35. DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 18.57/12.75/12.75/12.75/12.75；原RMB/KG: 125/85.84/85.84/85.84/85.84；隔天上网，含燃油+旺季附加费', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'EC DHL香港纯电池专线(大货) (DAP)', '南美', 'EC', 'parcel', 'DHL香港纯电池专线(大货)', 'DAP', 'USD',
  21, 19999, 1, 0,
  1, 18.57, 0, 5000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 35. DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 18.57/12.75/12.75/12.75/12.75；原RMB/KG: 125/85.84/85.84/85.84/85.84；隔天上网，含燃油+旺季附加费', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'AR DHL香港纯电池专线(大货) (DAP)', '南美', 'AR', 'parcel', 'DHL香港纯电池专线(大货)', 'DAP', 'USD',
  21, 19999, 1, 0,
  1, 18.57, 0, 5000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 35. DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 18.57/12.75/12.75/12.75/12.75；原RMB/KG: 125/85.84/85.84/85.84/85.84；隔天上网，含燃油+旺季附加费', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'UY DHL香港纯电池专线(大货) (DAP)', '南美', 'UY', 'parcel', 'DHL香港纯电池专线(大货)', 'DAP', 'USD',
  21, 19999, 1, 0,
  1, 18.57, 0, 5000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 35. DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 18.57/12.75/12.75/12.75/12.75；原RMB/KG: 125/85.84/85.84/85.84/85.84；隔天上网，含燃油+旺季附加费', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'PY DHL香港纯电池专线(大货) (DAP)', '南美', 'PY', 'parcel', 'DHL香港纯电池专线(大货)', 'DAP', 'USD',
  21, 19999, 1, 0,
  1, 18.57, 0, 5000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 35. DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 18.57/12.75/12.75/12.75/12.75；原RMB/KG: 125/85.84/85.84/85.84/85.84；隔天上网，含燃油+旺季附加费', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'BR DHL香港纯电池专线(大货) (DAP)', '南美', 'BR', 'parcel', 'DHL香港纯电池专线(大货)', 'DAP', 'USD',
  21, 19999, 1, 0,
  1, 18.57, 0, 5000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 36. DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 18.57/12.75/12.75/12.75/12.75；原RMB/KG: 125/85.84/85.84/85.84/85.84；隔天上网，含燃油+旺季附加费', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'BO DHL香港纯电池专线(大货) (DAP)', '南美', 'BO', 'parcel', 'DHL香港纯电池专线(大货)', 'DAP', 'USD',
  21, 19999, 1, 0,
  1, 18.57, 0, 5000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 36. DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 18.57/12.75/12.75/12.75/12.75；原RMB/KG: 125/85.84/85.84/85.84/85.84；隔天上网，含燃油+旺季附加费', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'CL DHL香港纯电池专线(大货) (DAP)', '南美', 'CL', 'parcel', 'DHL香港纯电池专线(大货)', 'DAP', 'USD',
  21, 19999, 1, 0,
  1, 18.57, 0, 5000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 36. DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 18.57/12.75/12.75/12.75/12.75；原RMB/KG: 125/85.84/85.84/85.84/85.84；隔天上网，含燃油+旺季附加费', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'CO DHL香港纯电池专线(大货) (DAP)', '南美', 'CO', 'parcel', 'DHL香港纯电池专线(大货)', 'DAP', 'USD',
  21, 19999, 1, 0,
  1, 18.57, 0, 5000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 36. DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 18.57/12.75/12.75/12.75/12.75；原RMB/KG: 125/85.84/85.84/85.84/85.84；隔天上网，含燃油+旺季附加费', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'PE DHL香港纯电池专线(大货) (DAP)', '南美', 'PE', 'parcel', 'DHL香港纯电池专线(大货)', 'DAP', 'USD',
  21, 19999, 1, 0,
  1, 18.57, 0, 5000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 36. DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 18.57/12.75/12.75/12.75/12.75；原RMB/KG: 125/85.84/85.84/85.84/85.84；隔天上网，含燃油+旺季附加费', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'VE DHL香港纯电池专线(大货) (DAP)', '南美', 'VE', 'parcel', 'DHL香港纯电池专线(大货)', 'DAP', 'USD',
  21, 19999, 1, 0,
  1, 18.57, 0, 5000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 36. DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 18.57/12.75/12.75/12.75/12.75；原RMB/KG: 125/85.84/85.84/85.84/85.84；隔天上网，含燃油+旺季附加费', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'EC DHL香港纯电池专线(大货) (DAP)', '南美', 'EC', 'parcel', 'DHL香港纯电池专线(大货)', 'DAP', 'USD',
  21, 19999, 1, 0,
  1, 18.57, 0, 5000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 36. DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 18.57/12.75/12.75/12.75/12.75；原RMB/KG: 125/85.84/85.84/85.84/85.84；隔天上网，含燃油+旺季附加费', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'AR DHL香港纯电池专线(大货) (DAP)', '南美', 'AR', 'parcel', 'DHL香港纯电池专线(大货)', 'DAP', 'USD',
  21, 19999, 1, 0,
  1, 18.57, 0, 5000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 36. DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 18.57/12.75/12.75/12.75/12.75；原RMB/KG: 125/85.84/85.84/85.84/85.84；隔天上网，含燃油+旺季附加费', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'UY DHL香港纯电池专线(大货) (DAP)', '南美', 'UY', 'parcel', 'DHL香港纯电池专线(大货)', 'DAP', 'USD',
  21, 19999, 1, 0,
  1, 18.57, 0, 5000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 36. DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 18.57/12.75/12.75/12.75/12.75；原RMB/KG: 125/85.84/85.84/85.84/85.84；隔天上网，含燃油+旺季附加费', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'PY DHL香港纯电池专线(大货) (DAP)', '南美', 'PY', 'parcel', 'DHL香港纯电池专线(大货)', 'DAP', 'USD',
  21, 19999, 1, 0,
  1, 18.57, 0, 5000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 36. DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 18.57/12.75/12.75/12.75/12.75；原RMB/KG: 125/85.84/85.84/85.84/85.84；隔天上网，含燃油+旺季附加费', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'BR DHL香港纯电池专线(大货) (DAP)', '南美', 'BR', 'parcel', 'DHL香港纯电池专线(大货)', 'DAP', 'USD',
  21, 19999, 1, 0,
  1, 18.57, 0, 5000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 37. DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 18.57/12.75/12.75/12.75/12.75；原RMB/KG: 125/85.84/85.84/85.84/85.84；隔天上网，含燃油+旺季附加费', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'BO DHL香港纯电池专线(大货) (DAP)', '南美', 'BO', 'parcel', 'DHL香港纯电池专线(大货)', 'DAP', 'USD',
  21, 19999, 1, 0,
  1, 18.57, 0, 5000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 37. DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 18.57/12.75/12.75/12.75/12.75；原RMB/KG: 125/85.84/85.84/85.84/85.84；隔天上网，含燃油+旺季附加费', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'CL DHL香港纯电池专线(大货) (DAP)', '南美', 'CL', 'parcel', 'DHL香港纯电池专线(大货)', 'DAP', 'USD',
  21, 19999, 1, 0,
  1, 18.57, 0, 5000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 37. DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 18.57/12.75/12.75/12.75/12.75；原RMB/KG: 125/85.84/85.84/85.84/85.84；隔天上网，含燃油+旺季附加费', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'CO DHL香港纯电池专线(大货) (DAP)', '南美', 'CO', 'parcel', 'DHL香港纯电池专线(大货)', 'DAP', 'USD',
  21, 19999, 1, 0,
  1, 18.57, 0, 5000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 37. DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 18.57/12.75/12.75/12.75/12.75；原RMB/KG: 125/85.84/85.84/85.84/85.84；隔天上网，含燃油+旺季附加费', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'PE DHL香港纯电池专线(大货) (DAP)', '南美', 'PE', 'parcel', 'DHL香港纯电池专线(大货)', 'DAP', 'USD',
  21, 19999, 1, 0,
  1, 18.57, 0, 5000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 37. DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 18.57/12.75/12.75/12.75/12.75；原RMB/KG: 125/85.84/85.84/85.84/85.84；隔天上网，含燃油+旺季附加费', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'VE DHL香港纯电池专线(大货) (DAP)', '南美', 'VE', 'parcel', 'DHL香港纯电池专线(大货)', 'DAP', 'USD',
  21, 19999, 1, 0,
  1, 18.57, 0, 5000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 37. DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 18.57/12.75/12.75/12.75/12.75；原RMB/KG: 125/85.84/85.84/85.84/85.84；隔天上网，含燃油+旺季附加费', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'EC DHL香港纯电池专线(大货) (DAP)', '南美', 'EC', 'parcel', 'DHL香港纯电池专线(大货)', 'DAP', 'USD',
  21, 19999, 1, 0,
  1, 18.57, 0, 5000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 37. DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 18.57/12.75/12.75/12.75/12.75；原RMB/KG: 125/85.84/85.84/85.84/85.84；隔天上网，含燃油+旺季附加费', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'AR DHL香港纯电池专线(大货) (DAP)', '南美', 'AR', 'parcel', 'DHL香港纯电池专线(大货)', 'DAP', 'USD',
  21, 19999, 1, 0,
  1, 18.57, 0, 5000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 37. DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 18.57/12.75/12.75/12.75/12.75；原RMB/KG: 125/85.84/85.84/85.84/85.84；隔天上网，含燃油+旺季附加费', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'UY DHL香港纯电池专线(大货) (DAP)', '南美', 'UY', 'parcel', 'DHL香港纯电池专线(大货)', 'DAP', 'USD',
  21, 19999, 1, 0,
  1, 18.57, 0, 5000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 37. DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 18.57/12.75/12.75/12.75/12.75；原RMB/KG: 125/85.84/85.84/85.84/85.84；隔天上网，含燃油+旺季附加费', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'PY DHL香港纯电池专线(大货) (DAP)', '南美', 'PY', 'parcel', 'DHL香港纯电池专线(大货)', 'DAP', 'USD',
  21, 19999, 1, 0,
  1, 18.57, 0, 5000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 37. DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 18.57/12.75/12.75/12.75/12.75；原RMB/KG: 125/85.84/85.84/85.84/85.84；隔天上网，含燃油+旺季附加费', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'BR DHL香港纯电池专线(大货) (DAP)', '南美', 'BR', 'parcel', 'DHL香港纯电池专线(大货)', 'DAP', 'USD',
  21, 19999, 1, 0,
  1, 18.57, 0, 5000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 40. DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 18.57/12.75/12.75/12.75/12.75；原RMB/KG: 125/85.84/85.84/85.84/85.84；隔天上网，含燃油+旺季附加费', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'BO DHL香港纯电池专线(大货) (DAP)', '南美', 'BO', 'parcel', 'DHL香港纯电池专线(大货)', 'DAP', 'USD',
  21, 19999, 1, 0,
  1, 18.57, 0, 5000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 40. DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 18.57/12.75/12.75/12.75/12.75；原RMB/KG: 125/85.84/85.84/85.84/85.84；隔天上网，含燃油+旺季附加费', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'CL DHL香港纯电池专线(大货) (DAP)', '南美', 'CL', 'parcel', 'DHL香港纯电池专线(大货)', 'DAP', 'USD',
  21, 19999, 1, 0,
  1, 18.57, 0, 5000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 40. DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 18.57/12.75/12.75/12.75/12.75；原RMB/KG: 125/85.84/85.84/85.84/85.84；隔天上网，含燃油+旺季附加费', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'CO DHL香港纯电池专线(大货) (DAP)', '南美', 'CO', 'parcel', 'DHL香港纯电池专线(大货)', 'DAP', 'USD',
  21, 19999, 1, 0,
  1, 18.57, 0, 5000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 40. DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 18.57/12.75/12.75/12.75/12.75；原RMB/KG: 125/85.84/85.84/85.84/85.84；隔天上网，含燃油+旺季附加费', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'PE DHL香港纯电池专线(大货) (DAP)', '南美', 'PE', 'parcel', 'DHL香港纯电池专线(大货)', 'DAP', 'USD',
  21, 19999, 1, 0,
  1, 18.57, 0, 5000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 40. DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 18.57/12.75/12.75/12.75/12.75；原RMB/KG: 125/85.84/85.84/85.84/85.84；隔天上网，含燃油+旺季附加费', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'VE DHL香港纯电池专线(大货) (DAP)', '南美', 'VE', 'parcel', 'DHL香港纯电池专线(大货)', 'DAP', 'USD',
  21, 19999, 1, 0,
  1, 18.57, 0, 5000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 40. DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 18.57/12.75/12.75/12.75/12.75；原RMB/KG: 125/85.84/85.84/85.84/85.84；隔天上网，含燃油+旺季附加费', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'EC DHL香港纯电池专线(大货) (DAP)', '南美', 'EC', 'parcel', 'DHL香港纯电池专线(大货)', 'DAP', 'USD',
  21, 19999, 1, 0,
  1, 18.57, 0, 5000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 40. DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 18.57/12.75/12.75/12.75/12.75；原RMB/KG: 125/85.84/85.84/85.84/85.84；隔天上网，含燃油+旺季附加费', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'AR DHL香港纯电池专线(大货) (DAP)', '南美', 'AR', 'parcel', 'DHL香港纯电池专线(大货)', 'DAP', 'USD',
  21, 19999, 1, 0,
  1, 18.57, 0, 5000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 40. DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 18.57/12.75/12.75/12.75/12.75；原RMB/KG: 125/85.84/85.84/85.84/85.84；隔天上网，含燃油+旺季附加费', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'UY DHL香港纯电池专线(大货) (DAP)', '南美', 'UY', 'parcel', 'DHL香港纯电池专线(大货)', 'DAP', 'USD',
  21, 19999, 1, 0,
  1, 18.57, 0, 5000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 40. DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 18.57/12.75/12.75/12.75/12.75；原RMB/KG: 125/85.84/85.84/85.84/85.84；隔天上网，含燃油+旺季附加费', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'PY DHL香港纯电池专线(大货) (DAP)', '南美', 'PY', 'parcel', 'DHL香港纯电池专线(大货)', 'DAP', 'USD',
  21, 19999, 1, 0,
  1, 18.57, 0, 5000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 40. DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 18.57/12.75/12.75/12.75/12.75；原RMB/KG: 125/85.84/85.84/85.84/85.84；隔天上网，含燃油+旺季附加费', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'BR DHL香港纯电池专线(大货) (DAP)', '南美', 'BR', 'parcel', 'DHL香港纯电池专线(大货)', 'DAP', 'USD',
  21, 19999, 1, 0,
  1, 18.57, 0, 5000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 47. DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 18.57/12.75/12.75/12.75/12.75；原RMB/KG: 125/85.84/85.84/85.84/85.84；隔天上网，含燃油+旺季附加费', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'BO DHL香港纯电池专线(大货) (DAP)', '南美', 'BO', 'parcel', 'DHL香港纯电池专线(大货)', 'DAP', 'USD',
  21, 19999, 1, 0,
  1, 18.57, 0, 5000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 47. DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 18.57/12.75/12.75/12.75/12.75；原RMB/KG: 125/85.84/85.84/85.84/85.84；隔天上网，含燃油+旺季附加费', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'CL DHL香港纯电池专线(大货) (DAP)', '南美', 'CL', 'parcel', 'DHL香港纯电池专线(大货)', 'DAP', 'USD',
  21, 19999, 1, 0,
  1, 18.57, 0, 5000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 47. DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 18.57/12.75/12.75/12.75/12.75；原RMB/KG: 125/85.84/85.84/85.84/85.84；隔天上网，含燃油+旺季附加费', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'CO DHL香港纯电池专线(大货) (DAP)', '南美', 'CO', 'parcel', 'DHL香港纯电池专线(大货)', 'DAP', 'USD',
  21, 19999, 1, 0,
  1, 18.57, 0, 5000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 47. DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 18.57/12.75/12.75/12.75/12.75；原RMB/KG: 125/85.84/85.84/85.84/85.84；隔天上网，含燃油+旺季附加费', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'PE DHL香港纯电池专线(大货) (DAP)', '南美', 'PE', 'parcel', 'DHL香港纯电池专线(大货)', 'DAP', 'USD',
  21, 19999, 1, 0,
  1, 18.57, 0, 5000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 47. DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 18.57/12.75/12.75/12.75/12.75；原RMB/KG: 125/85.84/85.84/85.84/85.84；隔天上网，含燃油+旺季附加费', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'VE DHL香港纯电池专线(大货) (DAP)', '南美', 'VE', 'parcel', 'DHL香港纯电池专线(大货)', 'DAP', 'USD',
  21, 19999, 1, 0,
  1, 18.57, 0, 5000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 47. DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 18.57/12.75/12.75/12.75/12.75；原RMB/KG: 125/85.84/85.84/85.84/85.84；隔天上网，含燃油+旺季附加费', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'EC DHL香港纯电池专线(大货) (DAP)', '南美', 'EC', 'parcel', 'DHL香港纯电池专线(大货)', 'DAP', 'USD',
  21, 19999, 1, 0,
  1, 18.57, 0, 5000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 47. DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 18.57/12.75/12.75/12.75/12.75；原RMB/KG: 125/85.84/85.84/85.84/85.84；隔天上网，含燃油+旺季附加费', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'AR DHL香港纯电池专线(大货) (DAP)', '南美', 'AR', 'parcel', 'DHL香港纯电池专线(大货)', 'DAP', 'USD',
  21, 19999, 1, 0,
  1, 18.57, 0, 5000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 47. DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 18.57/12.75/12.75/12.75/12.75；原RMB/KG: 125/85.84/85.84/85.84/85.84；隔天上网，含燃油+旺季附加费', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'UY DHL香港纯电池专线(大货) (DAP)', '南美', 'UY', 'parcel', 'DHL香港纯电池专线(大货)', 'DAP', 'USD',
  21, 19999, 1, 0,
  1, 18.57, 0, 5000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 47. DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 18.57/12.75/12.75/12.75/12.75；原RMB/KG: 125/85.84/85.84/85.84/85.84；隔天上网，含燃油+旺季附加费', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'PY DHL香港纯电池专线(大货) (DAP)', '南美', 'PY', 'parcel', 'DHL香港纯电池专线(大货)', 'DAP', 'USD',
  21, 19999, 1, 0,
  1, 18.57, 0, 5000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 47. DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 18.57/12.75/12.75/12.75/12.75；原RMB/KG: 125/85.84/85.84/85.84/85.84；隔天上网，含燃油+旺季附加费', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'BR DHL香港纯电池专线(大货) (DAP)', '南美', 'BR', 'parcel', 'DHL香港纯电池专线(大货)', 'DAP', 'USD',
  21, 19999, 1, 0,
  1, 18.57, 0, 5000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 48. DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 18.57/12.75/12.75/12.75/12.75；原RMB/KG: 125/85.84/85.84/85.84/85.84；隔天上网，含燃油+旺季附加费', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'BO DHL香港纯电池专线(大货) (DAP)', '南美', 'BO', 'parcel', 'DHL香港纯电池专线(大货)', 'DAP', 'USD',
  21, 19999, 1, 0,
  1, 18.57, 0, 5000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 48. DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 18.57/12.75/12.75/12.75/12.75；原RMB/KG: 125/85.84/85.84/85.84/85.84；隔天上网，含燃油+旺季附加费', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'CL DHL香港纯电池专线(大货) (DAP)', '南美', 'CL', 'parcel', 'DHL香港纯电池专线(大货)', 'DAP', 'USD',
  21, 19999, 1, 0,
  1, 18.57, 0, 5000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 48. DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 18.57/12.75/12.75/12.75/12.75；原RMB/KG: 125/85.84/85.84/85.84/85.84；隔天上网，含燃油+旺季附加费', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'CO DHL香港纯电池专线(大货) (DAP)', '南美', 'CO', 'parcel', 'DHL香港纯电池专线(大货)', 'DAP', 'USD',
  21, 19999, 1, 0,
  1, 18.57, 0, 5000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 48. DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 18.57/12.75/12.75/12.75/12.75；原RMB/KG: 125/85.84/85.84/85.84/85.84；隔天上网，含燃油+旺季附加费', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'PE DHL香港纯电池专线(大货) (DAP)', '南美', 'PE', 'parcel', 'DHL香港纯电池专线(大货)', 'DAP', 'USD',
  21, 19999, 1, 0,
  1, 18.57, 0, 5000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 48. DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 18.57/12.75/12.75/12.75/12.75；原RMB/KG: 125/85.84/85.84/85.84/85.84；隔天上网，含燃油+旺季附加费', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'VE DHL香港纯电池专线(大货) (DAP)', '南美', 'VE', 'parcel', 'DHL香港纯电池专线(大货)', 'DAP', 'USD',
  21, 19999, 1, 0,
  1, 18.57, 0, 5000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 48. DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 18.57/12.75/12.75/12.75/12.75；原RMB/KG: 125/85.84/85.84/85.84/85.84；隔天上网，含燃油+旺季附加费', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'EC DHL香港纯电池专线(大货) (DAP)', '南美', 'EC', 'parcel', 'DHL香港纯电池专线(大货)', 'DAP', 'USD',
  21, 19999, 1, 0,
  1, 18.57, 0, 5000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 48. DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 18.57/12.75/12.75/12.75/12.75；原RMB/KG: 125/85.84/85.84/85.84/85.84；隔天上网，含燃油+旺季附加费', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'AR DHL香港纯电池专线(大货) (DAP)', '南美', 'AR', 'parcel', 'DHL香港纯电池专线(大货)', 'DAP', 'USD',
  21, 19999, 1, 0,
  1, 18.57, 0, 5000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 48. DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 18.57/12.75/12.75/12.75/12.75；原RMB/KG: 125/85.84/85.84/85.84/85.84；隔天上网，含燃油+旺季附加费', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'UY DHL香港纯电池专线(大货) (DAP)', '南美', 'UY', 'parcel', 'DHL香港纯电池专线(大货)', 'DAP', 'USD',
  21, 19999, 1, 0,
  1, 18.57, 0, 5000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 48. DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 18.57/12.75/12.75/12.75/12.75；原RMB/KG: 125/85.84/85.84/85.84/85.84；隔天上网，含燃油+旺季附加费', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'PY DHL香港纯电池专线(大货) (DAP)', '南美', 'PY', 'parcel', 'DHL香港纯电池专线(大货)', 'DAP', 'USD',
  21, 19999, 1, 0,
  1, 18.57, 0, 5000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 48. DHL香港纯电池专线(大货,21KG+) DAP；RMB→USD@6.73；不含目的地税金，收件人自负关税清关。USD/KG分档: 21-31KG/32-70KG/71-100KG/101-299KG/300KG+ = 18.57/12.75/12.75/12.75/12.75；原RMB/KG: 125/85.84/85.84/85.84/85.84；隔天上网，含燃油+旺季附加费', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'GB 欧洲专线包税(USD) (DDP)', '欧洲', 'GB', 'parcel', '欧洲专线包税(USD)', 'DDP', 'USD',
  1, 500, 1, 36.36,
  0.5, 18.18, 0, 6000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 50. 欧洲专线包税(USD) 英国 双清包税DDP：首重1KG=$36.36，续0.5KG=$18.18；大货USD/KG分档 21KG+$8.39/51KG+$8.11/101KG+$7.83/201KG+$7.55/301KG+$7.27/401KG+$6.99/501KG+$6.71；7-9工作日；支持带内置电池', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'FR 欧洲专线包税(USD) (DDP)', '欧洲', 'FR', 'parcel', '欧洲专线包税(USD)', 'DDP', 'USD',
  1, 500, 1, 41.96,
  0.5, 20.98, 0, 6000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 51. 欧洲专线包税(USD) 法国 双清包税DDP：首重1KG=$41.96，续0.5KG=$20.98；大货USD/KG分档 21KG+$9.51/51KG+$9.23/101KG+$8.95/201KG+$8.67/301KG+$8.39/401KG+$8.11/501KG+$7.83；7-9工作日；支持带内置电池', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'NL 欧洲专线包税(USD) (DDP)', '欧洲', 'NL', 'parcel', '欧洲专线包税(USD)', 'DDP', 'USD',
  1, 500, 1, 41.96,
  0.5, 20.98, 0, 6000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 52. 欧洲专线包税(USD) 荷兰 双清包税DDP：首重1KG=$41.96，续0.5KG=$20.98；大货USD/KG分档 21KG+$9.51/51KG+$9.23/101KG+$8.95/201KG+$8.67/301KG+$8.39/401KG+$8.11/501KG+$7.83；7-9工作日；支持带内置电池', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'DE 欧洲专线包税(USD) (DDP)', '欧洲', 'DE', 'parcel', '欧洲专线包税(USD)', 'DDP', 'USD',
  1, 500, 1, 41.96,
  0.5, 20.98, 0, 6000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 53. 欧洲专线包税(USD) 德国 双清包税DDP：首重1KG=$41.96，续0.5KG=$20.98；大货USD/KG分档 21KG+$9.51/51KG+$9.23/101KG+$8.95/201KG+$8.67/301KG+$8.39/401KG+$8.11/501KG+$7.83；7-9工作日；支持带内置电池', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'IT 欧洲专线包税(USD) (DDP)', '欧洲', 'IT', 'parcel', '欧洲专线包税(USD)', 'DDP', 'USD',
  1, 500, 1, 44.06,
  0.5, 22.1, 0, 6000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 54. 欧洲专线包税(USD) 意大利 双清包税DDP：首重1KG=$44.06，续0.5KG=$22.10；大货USD/KG分档 21KG+$10.07/51KG+$9.79/101KG+$9.51/201KG+$9.23/301KG+$8.95/401KG+$8.67/501KG+$8.39；7-9工作日；支持带内置电池', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'ES 欧洲专线包税(USD) (DDP)', '欧洲', 'ES', 'parcel', '欧洲专线包税(USD)', 'DDP', 'USD',
  1, 500, 1, 44.06,
  0.5, 22.1, 0, 6000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 55. 欧洲专线包税(USD) 西班牙 双清包税DDP：首重1KG=$44.06，续0.5KG=$22.10；大货USD/KG分档 21KG+$10.07/51KG+$9.79/101KG+$9.51/201KG+$9.23/301KG+$8.95/401KG+$8.67/501KG+$8.39；7-9工作日；小货3KG起步；支持带内置电池', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'PL 欧洲专线包税(USD) (DDP)', '欧洲', 'PL', 'parcel', '欧洲专线包税(USD)', 'DDP', 'USD',
  1, 500, 1, 45.45,
  0.5, 22.8, 0, 6000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 56. 欧洲专线包税(USD) 波兰 双清包税DDP：首重1KG=$45.45，续0.5KG=$22.80；大货USD/KG分档 21KG+$10.49/51KG+$10.21/101KG+$9.93/201KG+$9.65/301KG+$9.37/401KG+$9.09/501KG+$8.81；7-9工作日；支持带内置电池', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'CZ 欧洲专线包税(USD) (DDP)', '欧洲', 'CZ', 'parcel', '欧洲专线包税(USD)', 'DDP', 'USD',
  1, 500, 1, 45.45,
  0.5, 22.8, 0, 6000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 57. 欧洲专线包税(USD) 捷克 双清包税DDP：首重1KG=$45.45，续0.5KG=$22.80；大货USD/KG分档 21KG+$10.49/51KG+$10.21/101KG+$9.93/201KG+$9.65/301KG+$9.37/401KG+$9.09/501KG+$8.81；7-9工作日；支持带内置电池', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'BG 欧洲专线包税(USD) (DDP)', '欧洲', 'BG', 'parcel', '欧洲专线包税(USD)', 'DDP', 'USD',
  1, 500, 1, 46.85,
  0.5, 23.5, 0, 6000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 58. 欧洲专线包税(USD) 保加利亚 双清包税DDP：首重1KG=$46.85，续0.5KG=$23.50；大货USD/KG分档 21KG+$10.91/51KG+$10.63/101KG+$10.35/201KG+$10.07/301KG+$9.79/401KG+$9.51/501KG+$9.23；7-9工作日；支持带内置电池', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'DK 欧洲专线包税(USD) (DDP)', '欧洲', 'DK', 'parcel', '欧洲专线包税(USD)', 'DDP', 'USD',
  1, 500, 1, 46.85,
  0.5, 23.5, 0, 6000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 59. 欧洲专线包税(USD) 丹麦 双清包税DDP：首重1KG=$46.85，续0.5KG=$23.50；大货USD/KG分档 21KG+$10.91/51KG+$10.63/101KG+$10.35/201KG+$10.07/301KG+$9.79/401KG+$9.51/501KG+$9.23；7-9工作日；支持带内置电池', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'BE 欧洲专线包税(USD) (DDP)', '欧洲', 'BE', 'parcel', '欧洲专线包税(USD)', 'DDP', 'USD',
  1, 500, 1, 46.85,
  0.5, 23.5, 0, 6000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 60. 欧洲专线包税(USD) 比利时 双清包税DDP：首重1KG=$46.85，续0.5KG=$23.50；大货USD/KG分档 21KG+$10.91/51KG+$10.63/101KG+$10.35/201KG+$10.07/301KG+$9.79/401KG+$9.51/501KG+$9.23；7-9工作日；支持带内置电池', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'IE 欧洲专线包税(USD) (DDP)', '欧洲', 'IE', 'parcel', '欧洲专线包税(USD)', 'DDP', 'USD',
  1, 500, 1, 46.85,
  0.5, 23.5, 0, 6000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 61. 欧洲专线包税(USD) 爱尔兰 双清包税DDP：首重1KG=$46.85，续0.5KG=$23.50；大货USD/KG分档 21KG+$10.91/51KG+$10.63/101KG+$10.35/201KG+$10.07/301KG+$9.79/401KG+$9.51/501KG+$9.23；7-9工作日；支持带内置电池', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'AT 欧洲专线包税(USD) (DDP)', '欧洲', 'AT', 'parcel', '欧洲专线包税(USD)', 'DDP', 'USD',
  1, 500, 1, 46.85,
  0.5, 23.5, 0, 6000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 62. 欧洲专线包税(USD) 奥地利 双清包税DDP：首重1KG=$46.85，续0.5KG=$23.50；大货USD/KG分档 21KG+$10.91/51KG+$10.63/101KG+$10.35/201KG+$10.07/301KG+$9.79/401KG+$9.51/501KG+$9.23；7-9工作日；支持带内置电池', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'HU 欧洲专线包税(USD) (DDP)', '欧洲', 'HU', 'parcel', '欧洲专线包税(USD)', 'DDP', 'USD',
  1, 500, 1, 46.85,
  0.5, 23.5, 0, 6000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 63. 欧洲专线包税(USD) 匈牙利 双清包税DDP：首重1KG=$46.85，续0.5KG=$23.50；大货USD/KG分档 21KG+$10.91/51KG+$10.63/101KG+$10.35/201KG+$10.07/301KG+$9.79/401KG+$9.51/501KG+$9.23；7-9工作日；支持带内置电池', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'PT 欧洲专线包税(USD) (DDP)', '欧洲', 'PT', 'parcel', '欧洲专线包税(USD)', 'DDP', 'USD',
  1, 500, 1, 46.85,
  0.5, 23.5, 0, 6000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 64. 欧洲专线包税(USD) 葡萄牙 双清包税DDP：首重1KG=$46.85，续0.5KG=$23.50；大货USD/KG分档 21KG+$10.91/51KG+$10.63/101KG+$10.35/201KG+$10.07/301KG+$9.79/401KG+$9.51/501KG+$9.23；7-9工作日；支持带内置电池', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'SK 欧洲专线包税(USD) (DDP)', '欧洲', 'SK', 'parcel', '欧洲专线包税(USD)', 'DDP', 'USD',
  1, 500, 1, 46.85,
  0.5, 23.5, 0, 6000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 65. 欧洲专线包税(USD) 斯洛伐克 双清包税DDP：首重1KG=$46.85，续0.5KG=$23.50；大货USD/KG分档 21KG+$10.91/51KG+$10.63/101KG+$10.35/201KG+$10.07/301KG+$9.79/401KG+$9.51/501KG+$9.23；7-9工作日；支持带内置电池', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'SI 欧洲专线包税(USD) (DDP)', '欧洲', 'SI', 'parcel', '欧洲专线包税(USD)', 'DDP', 'USD',
  1, 500, 1, 46.85,
  0.5, 23.5, 0, 6000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 66. 欧洲专线包税(USD) 斯洛文尼亚 双清包税DDP：首重1KG=$46.85，续0.5KG=$23.50；大货USD/KG分档 21KG+$10.91/51KG+$10.63/101KG+$10.35/201KG+$10.07/301KG+$9.79/401KG+$9.51/501KG+$9.23；7-9工作日；支持带内置电池', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'MY ComOne-西马普货经济(MY01-TB) (DDP)', '亚太', 'MY', 'parcel', 'ComOne-西马普货经济(MY01-TB)', 'DDP', 'USD',
  0.5, 100, 0.5, 2.67,
  0.5, 2.67, 0, 6000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 74. ComOne Express 马来西亚空派专线DDP（含税）ComOne-西马普货经济(MY01-TB)：首0.5KG=USD2.67，续0.5KG=USD2.67；大货分档 3-10KG=2.53.5/10-20KG=2.53.5；经济渠道：限商业单一品类，尺寸≤120*80*80CM，不接受托盘木箱超大件；统配航班；除6000；4-5工作天；支持带内置电池', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'MY ComOne-西马普货含税(MY03-PB) (DDP)', '亚太', 'MY', 'parcel', 'ComOne-西马普货含税(MY03-PB)', 'DDP', 'USD',
  0.5, 100, 0.5, 6.09,
  0.5, 1.63, 0, 6000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 75. ComOne Express 马来西亚空派专线DDP（含税）ComOne-西马普货含税(MY03-PB)：首0.5KG=USD6.09，续0.5KG=USD1.63；大货分档 3-10KG=2.82.5/10-20KG=2.82.0/20-30KG=2.82.0/30-50KG=2.67.5/50-100KG=2.67.5；普货含税；木箱木架+1.5/KG；除6000；2-4工作天；支持带内置电池', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'MY ComOne-西马内电含税(MY04-DB) (DDP)', '亚太', 'MY', 'parcel', 'ComOne-西马内电含税(MY04-DB)', 'DDP', 'USD',
  0.5, 100, 0.5, 6.69,
  0.5, 2.01, 0, 6000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 76. ComOne Express 马来西亚空派专线DDP（含税）ComOne-西马内电含税(MY04-DB)：首0.5KG=USD6.69，续0.5KG=USD2.01；大货分档 3-10KG=3.86.5/10-20KG=3.86.0/20-30KG=3.86.0/30-50KG=3.71.5/50-100KG=3.71.5；内电含税；香港直飞；除6000；3-5工作天；支持带内置电池', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'MY ComOne-西马敏感含税(MY05-MB) (DDP)', '亚太', 'MY', 'parcel', 'ComOne-西马敏感含税(MY05-MB)', 'DDP', 'USD',
  0.5, 100, 0.5, 7.43,
  0.5, 2.15, 0, 6000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 77. ComOne Express 马来西亚空派专线DDP（含税）ComOne-西马敏感含税(MY05-MB)：首0.5KG=USD7.43，续0.5KG=USD2.15；大货分档 3-10KG=4.16.0/10-20KG=4.01.5/20-30KG=4.01.5/30-50KG=4.01.0/50-100KG=4.01.0；敏感货含税；除6000；3-5工作天；支持带内置电池', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'MY ComOne-东马普货含税(MY07-PB) (DDP)', '亚太', 'MY', 'parcel', 'ComOne-东马普货含税(MY07-PB)', 'DDP', 'USD',
  0.5, 100, 0.5, 7.88,
  0.5, 3.05, 0, 6000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 78. ComOne Express 马来西亚空派专线DDP（含税）ComOne-东马普货含税(MY07-PB)：首0.5KG=USD7.88，续0.5KG=USD3.05；大货分档 3-10KG=5.5.5/10-20KG=5.5.5/20-30KG=5.35.5/30-50KG=5.35.0/50-100KG=5.2.5；东马普货含税；木箱木架+3/KG；除6000；4-6工作天；支持带内置电池', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'MY ComOne-东马敏感含税(MY08-MB) (DDP)', '亚太', 'MY', 'parcel', 'ComOne-东马敏感含税(MY08-MB)', 'DDP', 'USD',
  0.5, 100, 0.5, 8.47,
  0.5, 3.19, 0, 6000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 79. ComOne Express 马来西亚空派专线DDP（含税）ComOne-东马敏感含税(MY08-MB)：首0.5KG=USD8.47，续0.5KG=USD3.19；大货分档 3-10KG=5.79.0/10-20KG=5.79.0/20-30KG=5.65.0/30-50KG=5.5.5/50-100KG=5.5.0；东马敏感货含税；除6000；4-6工作天；支持带内置电池', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'MY ComOne-西马香港交货(MY01-HKB) (DDP)', '亚太', 'MY', 'parcel', 'ComOne-西马香港交货(MY01-HKB)', 'DDP', 'USD',
  0.5, 100, 0.5, 18.57,
  0.5, 3.19, 0, 6000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 80. ComOne Express 马来西亚空派专线DDP（含税）ComOne-西马香港交货(MY01-HKB)：首0.5KG=USD18.57，续0.5KG=USD3.19；大货分档 3-10KG=4.75.0/10-20KG=4.46.5/20-30KG=4.46.5/30-50KG=4.16.5/50-100KG=4.16.5；香港直飞；除6000；3-5工作天；支持带内置电池', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'MY ComOne-东马香港交货(MY02-HKB) (DDP)', '亚太', 'MY', 'parcel', 'ComOne-东马香港交货(MY02-HKB)', 'DDP', 'USD',
  0.5, 100, 0.5, 23.77,
  0.5, 4.61, 0, 6000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 81. ComOne Express 马来西亚空派专线DDP（含税）ComOne-东马香港交货(MY02-HKB)：首0.5KG=USD23.77，续0.5KG=USD4.61；大货分档 3-10KG=7.73.0/10-20KG=7.58.5/20-30KG=7.13.0/30-50KG=6.84.0/50-100KG=6.39.0；东马香港交货；木箱木架+3/KG；除6000；5-7工作天；支持带内置电池', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'PH 菲律宾专线 空运双清包税(Y1) (DDP)', '亚太', 'PH', 'parcel', '菲律宾专线 空运双清包税(Y1)', 'DDP', 'USD',
  1, 500, 1, 6.39,
  0.5, 6.39, 0, 6000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 82. 菲律宾专线 空运双清包税(马尼拉,内电/杂货,Y1)：按KG计价,最低消费1KG,0.5KG进位;材积=长×宽×高/6000,材积与实重取大;单价分档 1-10KG=6.39/11-50KG=6.39/51-100KG=6.24/101-300KG=6.09/301-499KG=5.94/500KG+=5.79 (USD/KG);派送费 21KG以下4.46/票,21-50KG按0.3/KG,51-200KG按0.22/KG,201KG+按0.15/KG,吨货单询;货交仓前需提前提供箱单资料;可走带牌/内电/化妆品/食品/软糖/药贴,电子烟酒类单询;2-3工作天；支持带内置电池', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'VN 越南专线(包税)加急快递-河内/胡志明/平阳/同奈-普货 (DDP)', '亚太', 'VN', 'parcel', '越南专线(包税)加急快递-河内/胡志明/平阳/同奈-普货', 'DDP', 'USD',
  1, 1001, 1, 9.66,
  0.5, 2.23, 0, 6000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 83. 越南专线(包税)加急快递 【河内/胡志明/平阳/同奈】【普货】：首1KG+续0.5KG为前端价, 1-10KG=9.66 / 11-100KG=4.16 / 101-500KG=3.86 / 501-1000KG=3.57 / 1001KG+=3.27 (USD/KG); 材积=长×宽×高/6000, 材积与实重取大; 工作日1-2; 不接受带电/带磁/液体/粉末/食品/药品/医疗用品', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'VN 越南专线(包税)加急快递-河内/胡志明/平阳/同奈-品牌高价值 (DDP)', '亚太', 'VN', 'parcel', '越南专线(包税)加急快递-河内/胡志明/平阳/同奈-品牌高价值', 'DDP', 'USD',
  1, 1001, 1, 11.14,
  0.5, 2.67, 0, 6000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 84. 越南专线(包税)加急快递 【河内/胡志明/平阳/同奈】【品牌/高价值,价格上调】：首1KG+续0.5KG为前端价, 1-10KG=11.14 / 11-100KG=4.75 / 101-500KG=4.46 / 501-1000KG=4.16 / 1000KG+=3.86 (USD/KG); 材积=长×宽×高/6000, 材积与实重取大; 工作日1-2; 不接受带电/带磁/液体/粉末/食品/药品/医疗用品', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'VN 越南专线(包税)加急快递-北部其它城市/南部其它城市-普货 (DDP)', '亚太', 'VN', 'parcel', '越南专线(包税)加急快递-北部其它城市/南部其它城市-普货', 'DDP', 'USD',
  1, 1001, 1, 11.14,
  0.5, 2.67, 0, 6000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 85. 越南专线(包税)加急快递 【北部其它城市/南部其它城市】【普货】：首1KG+续0.5KG为前端价, 1-10KG=11.14 / 11-100KG=4.75 / 101-500KG=4.46 / 501-1000KG=4.16 / 1001KG+=3.86 (USD/KG); 材积=长×宽×高/6000, 材积与实重取大; 工作日2-3; 不接受带电/带磁/液体/粉末/食品/药品/医疗用品', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'VN 越南专线(包税)加急快递-北部其它城市/南部其它城市-品牌高价值 (DDP)', '亚太', 'VN', 'parcel', '越南专线(包税)加急快递-北部其它城市/南部其它城市-品牌高价值', 'DDP', 'USD',
  1, 1001, 1, 12.63,
  0.5, 3.27, 0, 6000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 86. 越南专线(包税)加急快递 【北部其它城市/南部其它城市】【品牌/高价值,价格上调】：首1KG+续0.5KG为前端价, 1-10KG=12.63 / 11-100KG=5.65 / 101-500KG=5.2 / 501-1000KG=4.9 / 1001KG+=4.46 (USD/KG); 材积=长×宽×高/6000, 材积与实重取大; 工作日2-3; 不接受带电/带磁/液体/粉末/食品/药品/医疗用品', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'VN 越南专线(包税)加急快递-中部其它城市-普货 (DDP)', '亚太', 'VN', 'parcel', '越南专线(包税)加急快递-中部其它城市-普货', 'DDP', 'USD',
  1, 1001, 1, 12.63,
  0.5, 3.27, 0, 6000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 87. 越南专线(包税)加急快递 【中部其它城市】【普货】：首1KG+续0.5KG为前端价, 1-10KG=12.63 / 11-100KG=5.65 / 101-500KG=5.2 / 501-1000KG=4.9 / 1001KG+=4.46 (USD/KG); 材积=长×宽×高/6000, 材积与实重取大; 工作日2-3; 不接受带电/带磁/液体/粉末/食品/药品/医疗用品', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'VN 越南专线(包税)加急快递-中部其它城市-品牌高价值 (DDP)', '亚太', 'VN', 'parcel', '越南专线(包税)加急快递-中部其它城市-品牌高价值', 'DDP', 'USD',
  1, 1001, 1, 14.12,
  0.5, 3.71, 0, 6000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 88. 越南专线(包税)加急快递 【中部其它城市】【品牌/高价值,价格上调】：首1KG+续0.5KG为前端价, 1-10KG=14.12 / 11-100KG=6.24 / 101-500KG=5.94 / 501-1000KG=5.65 / 1001KG+=5.2 (USD/KG); 材积=长×宽×高/6000, 材积与实重取大; 工作日2-3; 不接受带电/带磁/液体/粉末/食品/药品/医疗用品', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'KH 柬埔寨专线(包税)普通快递-广州/深圳→金边-普货 (DDP)', '亚太', 'KH', 'parcel', '柬埔寨专线(包税)普通快递-广州/深圳→金边-普货', 'DDP', 'USD',
  1, 1001, 1, 7.43,
  1, 4.61, 0, 6000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 89. 柬埔寨专线(包税)普通快递 【广州/深圳→金边】【普货】：首1KG+续1KG为前端价, 1-10KG=7.43 / 11-100KG=4.46 / 101-500KG=3.86 / 501-1000KG=3.71 / 1001KG+=3.57 (USD/KG); 材积=长×宽×高/6000, 材积与实重取大; 工作日3-4；支持带内置电池', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'KH 柬埔寨专线(包税)普通快递-广州/深圳→金边-敏感货 (DDP)', '亚太', 'KH', 'parcel', '柬埔寨专线(包税)普通快递-广州/深圳→金边-敏感货', 'DDP', 'USD',
  1, 1001, 1, 8.62,
  1, 5.65, 0, 6000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 90. 柬埔寨专线(包税)普通快递 【广州/深圳→金边】【敏感货】：首1KG+续1KG为前端价, 1-10KG=8.62 / 11-100KG=5.5 / 101-500KG=4.9 / 501-1000KG=4.75 / 1001KG+=4.61 (USD/KG); 材积=长×宽×高/6000, 材积与实重取大; 工作日3-4；支持带内置电池', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'KH 柬埔寨专线(包税)普通快递-柬埔寨其它城市-普货 (DDP)', '亚太', 'KH', 'parcel', '柬埔寨专线(包税)普通快递-柬埔寨其它城市-普货', 'DDP', 'USD',
  1, 1001, 1, 9.66,
  1, 4.9, 0, 6000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 91. 柬埔寨专线(包税)普通快递 【柬埔寨其它城市】【普货】：首1KG+续1KG为前端价, 1-10KG=9.66 / 11-100KG=4.9 / 101-500KG=4.31 / 501-1000KG=4.16 / 1001KG+=4.01 (USD/KG); 材积=长×宽×高/6000, 材积与实重取大; 工作日4-6；支持带内置电池', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'KH 柬埔寨专线(包税)普通快递-柬埔寨其它城市-敏感货 (DDP)', '亚太', 'KH', 'parcel', '柬埔寨专线(包税)普通快递-柬埔寨其它城市-敏感货', 'DDP', 'USD',
  1, 1001, 1, 10.85,
  1, 6.09, 0, 6000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 92. 柬埔寨专线(包税)普通快递 【柬埔寨其它城市】【敏感货】：首1KG+续1KG为前端价, 1-10KG=10.85 / 11-100KG=5.94 / 101-500KG=5.35 / 501-1000KG=5.2 / 1001KG+=5.05 (USD/KG); 材积=长×宽×高/6000, 材积与实重取大; 工作日4-6；支持带内置电池', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'MM 缅甸专线(包税)空运小包-深圳→仰光-一类货物(布料/服装辅料等) (DDP)', '亚太', 'MM', 'parcel', '缅甸专线(包税)空运小包-深圳→仰光-一类货物(布料/服装辅料等)', 'DDP', 'USD',
  1, 1001, 1, 17.83,
  1, 7.88, 0, 6000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 93. 缅甸专线(包税)空运小包 深圳→仰光 【一类货物(布料/服装辅料等)】：首1KG+续1KG为前端价, 1-20KG=17.83 / 21-100KG=7.58 / 101-500KG=6.84 / 501-1000KG=6.54 / 1001KG+=6.24 (USD/KG); 材积=长×宽×高/6000, 材积与实重取大; 工作日7-10天; 一票一件, 单件超21KG免首重, 单件≤40KG, 尺寸≤120×80×80CM; 三类货物(化妆品/电子产品)价格单询；支持带内置电池', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'MM 缅甸专线(包税)空运小包-深圳→仰光-二类货物(化妆品/药品等) (DDP)', '亚太', 'MM', 'parcel', '缅甸专线(包税)空运小包-深圳→仰光-二类货物(化妆品/药品等)', 'DDP', 'USD',
  1, 1001, 1, 23.77,
  1, 13.82, 0, 6000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 94. 缅甸专线(包税)空运小包 深圳→仰光 【二类货物(化妆品/药品等)】：首1KG+续1KG为前端价, 1-20KG=23.77 / 21-100KG=13.52 / 101-500KG=12.78 / 501-1000KG=12.48 / 1001KG+=12.18 (USD/KG); 材积=长×宽×高/6000, 材积与实重取大; 工作日7-10天; 一票一件, 单件超21KG免首重, 单件≤40KG, 尺寸≤120×80×80CM; 三类货物(化妆品/电子产品)价格单询；支持带内置电池', true, now()
);

INSERT INTO public.shipping_templates (
  name, zone, country_code, shipping_class, method, trade_terms, currency,
  min_weight_kg, max_weight_kg, base_weight_kg, base_fee,
  increment_weight_kg, increment_fee, minimum_fee, volumetric_divisor,
  valid_from, valid_to, notes, is_active, updated_at
) VALUES (
  'ID 印尼专线(包税)敏感货快线(YC/F) (DDP)', '亚太', 'ID', 'parcel', '印尼专线(包税)敏感货快线(YC/F)', 'DDP', 'USD',
  11, 1001, 11, 14.71,
  0.5, 14.71, 0, 6000,
  '2026-07-27', '2027-01-01', 'Source: Reach_Projector_运费模板_V2_USD.xlsx; row 95. 印尼专线(包税)敏感货快线(YC/F)：适用内置电池/带磁/化妆品/护肤品/日化/食品/木箱木架货物; 按KG计价, 11KG起, 单价分档 11-100KG=14.71/101-500KG=14.41/501-1000KG=14.12/1001KG+=13.97 (USD/KG); 材积=长×宽×高/6000, 材积与实重取大; 工作日5-7天; 附加费: 单件>149KG 超重费104.01/票, 宽或高>1.5m 超宽超高操作费297.18/票, 长度≤2.5m', true, now()
);

UPDATE public.products SET
  weight_kg = 14.5,
  packed_weight_kg = 15,
  package_length_cm = 71,
  package_width_cm = 47,
  package_height_cm = 28,
  package_count = 1,
  shipping_class = 'parcel',
  shipping_quote_required = false,
  updated_at = now()
WHERE slug = 'awol-aetherion-max-ust-projector';

UPDATE public.products SET
  weight_kg = 9,
  packed_weight_kg = 9.3,
  package_length_cm = 35.3,
  package_width_cm = 27.1,
  package_height_cm = 44.9,
  package_count = 1,
  shipping_class = 'parcel',
  shipping_quote_required = false,
  updated_at = now()
WHERE slug = 'awol-plus-2-projector';

UPDATE public.products SET
  weight_kg = 15,
  packed_weight_kg = 15.4,
  package_length_cm = 58,
  package_width_cm = 48,
  package_height_cm = 40,
  package_count = 1,
  shipping_class = 'parcel',
  shipping_quote_required = false,
  updated_at = now()
WHERE slug = 'hisense-c5-master-4k-projector';

UPDATE public.products SET
  weight_kg = 16,
  packed_weight_kg = 16.29,
  package_length_cm = 58,
  package_width_cm = 48,
  package_height_cm = 40,
  package_count = 1,
  shipping_class = 'parcel',
  shipping_quote_required = false,
  updated_at = now()
WHERE slug = 'hisense-xr10-4k-triple-laser-projector';

UPDATE public.products SET
  weight_kg = 12.5,
  packed_weight_kg = 13,
  package_length_cm = 33,
  package_width_cm = 68,
  package_height_cm = 42,
  package_count = 1,
  shipping_class = 'parcel',
  shipping_quote_required = false,
  updated_at = now()
WHERE slug = 'hisense-px4-pro-rgb-laser-projector';

UPDATE public.products SET
  weight_kg = 10,
  packed_weight_kg = 10.3,
  package_length_cm = 46,
  package_width_cm = 33,
  package_height_cm = 47,
  package_count = 1,
  shipping_class = 'parcel',
  shipping_quote_required = false,
  updated_at = now()
WHERE slug = 'jmgo-n5s-ultra-max-laser-projector';

UPDATE public.products SET
  weight_kg = 17,
  packed_weight_kg = 17.6,
  package_length_cm = 58,
  package_width_cm = 48,
  package_height_cm = 44,
  package_count = 1,
  shipping_class = 'parcel',
  shipping_quote_required = false,
  updated_at = now()
WHERE slug = 'xgimi-x50-ultra-max-4k-laser-projector';

UPDATE public.products SET
  weight_kg = 13,
  packed_weight_kg = 13.2,
  package_length_cm = 55,
  package_width_cm = 38,
  package_height_cm = 55,
  package_count = 1,
  shipping_class = 'parcel',
  shipping_quote_required = false,
  updated_at = now()
WHERE slug = 'xgimi-x50-ultra-4k-rgb-laser-projector';

UPDATE public.products SET
  weight_kg = 1.3,
  packed_weight_kg = 1.5,
  package_length_cm = 30,
  package_width_cm = 28,
  package_height_cm = 8,
  package_count = 1,
  shipping_class = 'parcel',
  shipping_quote_required = false,
  updated_at = now()
WHERE slug = 'c1ne-ph89-projector-ceiling-mount';

UPDATE public.products SET
  weight_kg = 1.8,
  packed_weight_kg = 2,
  package_length_cm = 50,
  package_width_cm = 48,
  package_height_cm = 5,
  package_count = 1,
  shipping_class = 'parcel',
  shipping_quote_required = false,
  updated_at = now()
WHERE slug = 'jingmi-bg9r-freestanding-projector-stand';

UPDATE public.products SET
  weight_kg = 1.3,
  packed_weight_kg = 1.5,
  package_length_cm = 30,
  package_width_cm = 28,
  package_height_cm = 8,
  package_count = 1,
  shipping_class = 'parcel',
  shipping_quote_required = false,
  updated_at = now()
WHERE slug = 'vidda-asc6-projector-ceiling-mount';

UPDATE public.products SET
  weight_kg = 74,
  packed_weight_kg = 76,
  package_length_cm = 228,
  package_width_cm = 53,
  package_height_cm = 54,
  package_count = 1,
  shipping_class = 'freight',
  shipping_quote_required = true,
  updated_at = now()
WHERE slug = 'neotunt-s8-2-2m-concealed-laser-tv-cabinet';

UPDATE public.products SET
  weight_kg = 82,
  packed_weight_kg = 84,
  package_length_cm = 248,
  package_width_cm = 53,
  package_height_cm = 54,
  package_count = 1,
  shipping_class = 'freight',
  shipping_quote_required = true,
  updated_at = now()
WHERE slug = 'neotunt-s8-2-4m-concealed-laser-tv-cabinet';

UPDATE public.products SET
  weight_kg = 94,
  packed_weight_kg = 96,
  package_length_cm = 288,
  package_width_cm = 53,
  package_height_cm = 54,
  package_count = 1,
  shipping_class = 'freight',
  shipping_quote_required = true,
  updated_at = now()
WHERE slug = 'neotunt-s8-2-8m-concealed-laser-tv-cabinet';

UPDATE public.products SET
  weight_kg = 106,
  packed_weight_kg = 108,
  package_length_cm = 328,
  package_width_cm = 53,
  package_height_cm = 54,
  package_count = 1,
  shipping_class = 'freight',
  shipping_quote_required = true,
  updated_at = now()
WHERE slug = 'neotunt-s8-3-2m-concealed-laser-tv-cabinet';

COMMIT;

SELECT
  count(*) FILTER (WHERE is_active AND notes LIKE 'Source: Reach_Projector_运费模板_V2_USD.xlsx;%') AS active_v2_rates,
  count(DISTINCT country_code) FILTER (WHERE is_active AND notes LIKE 'Source: Reach_Projector_运费模板_V2_USD.xlsx;%') AS active_v2_countries,
  count(*) FILTER (WHERE country_code = 'MX' AND trade_terms <> 'DDP' AND is_active) AS active_mexico_non_ddp
FROM public.shipping_templates;

-- Generated 171 active country-rate records from 75 reviewed workbook rows.
