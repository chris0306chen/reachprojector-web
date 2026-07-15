import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const SETUP_SECRET = 'reachtronics-db-setup-2026'

const SUPABASE_URL = 'https://br-handy-deer-627f60fc.supabase2.aidap-global.cn-beijing.volces.com'
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjMzNjQ3MTAzNDAsInJvbGUiOiJzZXJ2aWNlX3JvbGUifQ.2SKx37Jklte9cKRFNwfe7m1C3NEThWJwJZkIG9xpl8g'

function getSupabase() {
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    db: { timeout: 60000 },
    auth: { autoRefreshToken: false, persistSession: false },
  })
}

// 4 categories
const categories = [
  { name: '4K Laser Projectors', slug: '4k-laser-projectors', description: 'Premium 4K laser projectors for home theater and professional use.', image_url: '/images/categories/projector-4k.jpg', sort_order: 1 },
  { name: 'UST Laser TV', slug: 'ust-laser-tv', description: 'Ultra short throw laser TVs with massive screen experience.', image_url: '/images/categories/ust-laser-tv.jpg', sort_order: 2 },
  { name: 'Printers & Scanners', slug: 'printers-scanners', description: 'High-performance printers and scanners for office and home.', image_url: '/images/categories/printer-scanner.jpg', sort_order: 3 },
  { name: 'Components', slug: 'components', description: 'PC components including CPUs, GPUs, motherboards, memory and storage.', image_url: '/images/categories/components.jpg', sort_order: 4 },
]

// 31 products
const products = [
  // 4K Laser Projectors (10)
  { name: 'JMGO N5S ULTRA MAX 4K', slug: 'jmgo-n5s-ultra-max-4k', brand: 'JMGO', category_slug: '4k-laser-projectors', price: 1600, compare_at_price: 1800, short_description: 'Premium 4K laser projector with exceptional brightness.', description: 'The JMGO N5S ULTRA MAX 4K delivers an immersive cinematic experience with advanced laser light source.', features: '["4K UHD","Laser Light Source","3000+ ANSI Lumens","HDR10+","Auto Keystone","Built-in Speaker"]', specifications: '{"Resolution":"3840x2160","Brightness":"3200 ANSI Lumens","Light Source":"Triple Color Laser","Contrast":"3000:1","Throw Ratio":"1.2:1","Speaker":"2x10W","Weight":"9.5kg"}', images: '[]', is_bestseller: true, is_new_arrival: false, is_featured: true, stock_status: 'in_stock' },
  { name: 'XGIMI RS 10 Ultra 4K', slug: 'xgimi-rs-10-ultra-4k', brand: 'XGIMI', category_slug: '4k-laser-projectors', price: 2499.99, compare_at_price: 2799.99, short_description: 'Flagship 4K laser projector with dual laser engine.', description: 'The XGIMI RS 10 Ultra represents the pinnacle of home projection with dual laser engine.', features: '["4K UHD","Dual Laser Engine","3500+ ANSI Lumens","Dolby Vision+HDR10+","Auto Focus","Harman Kardon"]', specifications: '{"Resolution":"3840x2160","Brightness":"3500 ANSI Lumens","Light Source":"Dual Laser","Contrast":"3500:1","Speaker":"2x12W Harman Kardon","Weight":"10.2kg"}', images: '[]', is_bestseller: true, is_new_arrival: false, is_featured: true, stock_status: 'in_stock' },
  { name: 'XGIMI RS 10 Mini 4K', slug: 'xgimi-rs-10-mini-4k', brand: 'XGIMI', category_slug: '4k-laser-projectors', price: 1199.99, compare_at_price: 1399.99, short_description: 'Compact 4K laser projector with premium features.', description: 'The XGIMI RS 10 Mini 4K brings flagship performance to a compact design.', features: '["4K UHD","Laser","2000+ ANSI Lumens","HDR10+","Smart Auto","Portable"]', specifications: '{"Resolution":"3840x2160","Brightness":"2000 ANSI Lumens","Light Source":"Laser","Contrast":"2500:1","Speaker":"2x8W","Weight":"4.5kg"}', images: '[]', is_bestseller: false, is_new_arrival: true, is_featured: false, stock_status: 'in_stock' },
  { name: 'Hisense VIDDA C5 Master 4K', slug: 'hisense-vidda-c5-master-4k', brand: 'Hisense', category_slug: '4k-laser-projectors', price: 2699.99, compare_at_price: 2999.99, short_description: 'Professional-grade 4K laser with cinema-level color.', description: 'The Hisense VIDDA C5 Master 4K is engineered for demanding home theater enthusiasts.', features: '["4K UHD","Triple Laser ALPD 5.0","4000+ ANSI Lumens","Cinema Color","120Hz","Advanced Cooling"]', specifications: '{"Resolution":"3840x2160","Brightness":"4200 ANSI Lumens","Light Source":"ALPD 5.0 Triple Laser","Color Gamut":"110% BT.2020","Speaker":"2x15W","Weight":"12.5kg"}', images: '[]', is_bestseller: true, is_new_arrival: false, is_featured: false, stock_status: 'in_stock' },
  { name: 'XGIMI Horizon Ultra', slug: 'xgimi-horizon-ultra', brand: 'XGIMI', category_slug: '4k-laser-projectors', price: 1799.99, compare_at_price: 1999.99, short_description: 'Premium 4K HDR with Dolby Vision and hybrid light.', description: 'The XGIMI Horizon Ultra combines hybrid LED+Laser for exceptional brightness and color.', features: '["4K UHD","Hybrid LED+Laser","2300 ISO Lumens","Dolby Vision","Harman Kardon","Android TV 11"]', specifications: '{"Resolution":"3840x2160","Brightness":"2300 ISO Lumens","Light Source":"LED+Laser","Speaker":"2x12W Harman Kardon","Weight":"5.5kg"}', images: '[]', is_bestseller: true, is_new_arrival: false, is_featured: false, stock_status: 'in_stock' },
  { name: 'XGIMI MoGo 3 Pro', slug: 'xgimi-mogo-3-pro', brand: 'XGIMI', category_slug: '4k-laser-projectors', price: 599.99, compare_at_price: 699.99, short_description: 'Portable 1080p projector with built-in battery.', description: 'Take entertainment anywhere with built-in battery for cord-free viewing.', features: '["1080p Full HD","Built-in Battery","400 ISO Lumens","Android TV","Auto Keystone","Portable"]', specifications: '{"Resolution":"1920x1080","Brightness":"400 ISO Lumens","Battery":"2.5 hours","Speaker":"2x4W","Weight":"1.6kg"}', images: '[]', is_bestseller: false, is_new_arrival: true, is_featured: false, stock_status: 'in_stock' },
  { name: 'JMGO N1 Ultra 4K', slug: 'jmgo-n1-ultra-4k', brand: 'JMGO', category_slug: '4k-laser-projectors', price: 1399.99, compare_at_price: 1599.99, short_description: 'Compact 4K laser with innovative gimbal design.', description: 'The JMGO N1 Ultra features an innovative built-in gimbal stand for 360-degree rotation.', features: '["4K UHD","Laser","2200 ANSI Lumens","360-degree Gimbal","Auto Focus","Cloud Gaming"]', specifications: '{"Resolution":"3840x2160","Brightness":"2200 ANSI Lumens","Light Source":"Triple Color Laser","Throw Ratio":"0.6:1-4.5:1","Speaker":"2x10W","Weight":"4.6kg"}', images: '[]', is_bestseller: false, is_new_arrival: false, is_featured: false, stock_status: 'in_stock' },
  { name: 'Intel Core i9-14900K', slug: 'intel-core-i9-14900k', brand: 'Intel', category_slug: '4k-laser-projectors', price: 589, compare_at_price: 649, short_description: 'Flagship 24-core desktop processor.', description: 'The Intel Core i9-14900K with 24 cores and boost up to 6.0 GHz.', features: '["24 Cores/32 Threads","Up to 6.0 GHz","36MB Cache","DDR5","PCIe 5.0","Intel 7"]', specifications: '{"Cores":"24 (8P+16E)","Threads":"32","Boost":"6.0 GHz","Cache":"36 MB","TDP":"125W","Socket":"LGA 1700"}', images: '[]', is_bestseller: true, is_new_arrival: false, is_featured: true, stock_status: 'in_stock' },
  { name: 'AMD Ryzen 9 7950X', slug: 'amd-ryzen-9-7950x', brand: 'AMD', category_slug: '4k-laser-projectors', price: 549, compare_at_price: 599, short_description: '16-core Zen 4 processor.', description: 'The AMD Ryzen 9 7950X delivers 16 cores of Zen 4 performance on AM5.', features: '["16 Cores/32 Threads","Up to 5.7 GHz","64MB L3","Zen 4","DDR5","PCIe 5.0"]', specifications: '{"Cores":"16","Threads":"32","Boost":"5.7 GHz","L3 Cache":"64 MB","TDP":"170W","Socket":"AM5"}', images: '[]', is_bestseller: true, is_new_arrival: false, is_featured: false, stock_status: 'in_stock' },
  { name: 'AMD Ryzen 7 7800X3D', slug: 'amd-ryzen-7-7800x3d', brand: 'AMD', category_slug: '4k-laser-projectors', price: 449, compare_at_price: 499, short_description: 'Best gaming CPU with 3D V-Cache.', description: 'The AMD Ryzen 7 7800X3D features 96MB L3 cache, the ultimate gaming processor.', features: '["8 Cores/16 Threads","Up to 5.0 GHz","96MB L3 3D V-Cache","Zen 4","Best Gaming","120W TDP"]', specifications: '{"Cores":"8","Threads":"16","Boost":"5.0 GHz","L3 Cache":"96 MB (3D)","TDP":"120W","Socket":"AM5"}', images: '[]', is_bestseller: true, is_new_arrival: false, is_featured: true, stock_status: 'in_stock' },

  // UST Laser TV (5)
  { name: 'Hisense PX2-Pro 4K UST', slug: 'hisense-px2-pro-4k-ust', brand: 'Hisense', category_slug: 'ust-laser-tv', price: 2399.99, compare_at_price: 2699.99, short_description: 'Ultra Short Throw 4K laser TV.', description: 'The Hisense PX2-Pro transforms any wall into a massive 120-inch 4K display.', features: '["4K UHD","Ultra Short Throw","2400+ ANSI Lumens","Triple Laser","Dolby Vision","ALR Screen"]', specifications: '{"Resolution":"3840x2160","Brightness":"2400 ANSI Lumens","Throw Ratio":"0.23:1","Screen":"80-150 inch","Speaker":"2x15W+Sub","Weight":"14kg"}', images: '[]', is_bestseller: false, is_new_arrival: false, is_featured: true, stock_status: 'in_stock' },
  { name: 'AWOL Vision LTV-3500 4K', slug: 'awol-vision-ltv-3500-4k', brand: 'AWOL Vision', category_slug: 'ust-laser-tv', price: 5999.99, compare_at_price: 6499.99, short_description: 'Premium RGB triple laser UST.', description: 'The AWOL Vision LTV-3500 is the ultimate ultra-short throw with RGB triple laser.', features: '["4K UHD","RGB Triple Laser","5500+ ANSI Lumens","150 inch","HDR","Premium Build"]', specifications: '{"Resolution":"3840x2160","Brightness":"5500 ANSI Lumens","Light Source":"RGB Triple Laser","Throw Ratio":"0.198:1","Speaker":"2x15W","Weight":"18kg"}', images: '[]', is_bestseller: false, is_new_arrival: false, is_featured: true, stock_status: 'in_stock' },
  { name: 'Formovie Theater 4K', slug: 'formovie-theater-4k', brand: 'Formovie', category_slug: 'ust-laser-tv', price: 3499.99, compare_at_price: 3999.99, short_description: 'Award-winning UST with ALPD 4.5.', description: 'The Formovie Theater combines ALPD 4.5 laser technology with UST design.', features: '["4K UHD","ALPD 4.5","2800+ ANSI Lumens","Dolby Vision+HDR10+","150 inch","Android TV"]', specifications: '{"Resolution":"3840x2160","Brightness":"2800 ANSI Lumens","Light Source":"ALPD 4.5","Throw Ratio":"0.23:1","Speaker":"2x15W Dolby","Weight":"12kg"}', images: '[]', is_bestseller: false, is_new_arrival: true, is_featured: false, stock_status: 'in_stock' },
  { name: 'JMGO U2 4K Laser TV', slug: 'jmgo-u2-4k-laser-tv', brand: 'JMGO', category_slug: 'ust-laser-tv', price: 2199.99, compare_at_price: 2499.99, short_description: 'Sleek 4K laser TV with superior optics.', description: 'The JMGO U2 brings cinematic 4K quality with compact laser TV design.', features: '["4K UHD","Laser","2400 ANSI Lumens","HDR10+","Auto Focus","Smart OS"]', specifications: '{"Resolution":"3840x2160","Brightness":"2400 ANSI Lumens","Throw Ratio":"0.23:1","Screen":"80-130 inch","Speaker":"2x10W","Weight":"8.5kg"}', images: '[]', is_bestseller: false, is_new_arrival: false, is_featured: false, stock_status: 'in_stock' },
  { name: 'Hisense PL1 4K Laser TV', slug: 'hisense-pl1-4k-laser-tv', brand: 'Hisense', category_slug: 'ust-laser-tv', price: 1899.99, compare_at_price: 2199.99, short_description: 'Affordable 4K UST laser TV.', description: 'The Hisense PL1 offers 4K ultra-short throw at an accessible price.', features: '["4K UHD","Laser","2100 ANSI Lumens","Ultra Short Throw","Smart TV","Voice Control"]', specifications: '{"Resolution":"3840x2160","Brightness":"2100 ANSI Lumens","Throw Ratio":"0.25:1","Screen":"80-120 inch","Speaker":"2x10W","Weight":"8kg"}', images: '[]', is_bestseller: false, is_new_arrival: false, is_featured: false, stock_status: 'in_stock' },

  // Printers & Scanners (8)
  { name: 'HP LaserJet Pro M404dn', slug: 'hp-laserjet-pro-m404dn', brand: 'HP', category_slug: 'printers-scanners', price: 329, compare_at_price: 379, short_description: 'Fast monochrome laser for busy offices.', description: 'The HP LaserJet Pro M404dn delivers fast monochrome printing for workgroups.', features: '["Monochrome Laser","40 ppm","Auto Duplex","Network","250-sheet Tray","Low Cost"]', specifications: '{"Type":"Monochrome Laser","Speed":"40 ppm","Resolution":"1200x1200 dpi","Duplex":"Auto","Connectivity":"USB, Ethernet","Weight":"10.2kg"}', images: '[]', is_bestseller: true, is_new_arrival: false, is_featured: false, stock_status: 'in_stock' },
  { name: 'Canon imageCLASS LBP226dw', slug: 'canon-imageclass-lbp226dw', brand: 'Canon', category_slug: 'printers-scanners', price: 299, compare_at_price: 349, short_description: 'Compact wireless monochrome laser.', description: 'The Canon imageCLASS LBP226dw combines compact design with powerful performance.', features: '["Monochrome Laser","40 ppm","Wireless+Ethernet","Auto Duplex","Canon UFR II","Energy Efficient"]', specifications: '{"Type":"Monochrome Laser","Speed":"40 ppm","Resolution":"1200x1200 dpi","Duplex":"Auto","Connectivity":"USB, Wi-Fi, Ethernet","Weight":"8.4kg"}', images: '[]', is_bestseller: false, is_new_arrival: false, is_featured: false, stock_status: 'in_stock' },
  { name: 'Brother HL-L2370DW', slug: 'brother-hl-l2370dw', brand: 'Brother', category_slug: 'printers-scanners', price: 209, compare_at_price: 249, short_description: 'Reliable wireless monochrome laser.', description: 'The Brother HL-L2370DW offers reliable, cost-effective monochrome printing.', features: '["Monochrome Laser","36 ppm","Wireless","Auto Duplex","250-sheet","Mobile Print"]', specifications: '{"Type":"Monochrome Laser","Speed":"36 ppm","Resolution":"2400x600 dpi","Duplex":"Auto","Connectivity":"USB, Wi-Fi","Weight":"7.2kg"}', images: '[]', is_bestseller: true, is_new_arrival: false, is_featured: false, stock_status: 'in_stock' },
  { name: 'Epson EcoTank ET-4850', slug: 'epson-ecotank-et-4850', brand: 'Epson', category_slug: 'printers-scanners', price: 449, compare_at_price: 499, short_description: 'All-in-one color inkjet with ultra-low cost.', description: 'The Epson EcoTank ET-4850 with cartridge-free design saves up to 90% on ink.', features: '["Color Inkjet","All-in-One","Ultra-low Cost","Auto Duplex","ADF Scanner","Wi-Fi Direct"]', specifications: '{"Type":"Color Inkjet","Speed":"15 ppm (black)","Resolution":"4800x1200 dpi","Duplex":"Auto","Connectivity":"USB, Wi-Fi, Ethernet","Weight":"6.8kg"}', images: '[]', is_bestseller: false, is_new_arrival: true, is_featured: false, stock_status: 'in_stock' },
  { name: 'HP Color LaserJet Pro M479fdw', slug: 'hp-color-laserjet-pro-m479fdw', brand: 'HP', category_slug: 'printers-scanners', price: 549, compare_at_price: 599, short_description: 'Multifunction color laser with security.', description: 'The HP Color LaserJet Pro M479fdw delivers professional color with advanced security.', features: '["Color Laser","Multifunction","28 ppm","Auto Duplex","50-sheet ADF","HP Security"]', specifications: '{"Type":"Color Laser","Speed":"28 ppm","Resolution":"600x600 dpi","Duplex":"Auto","Connectivity":"USB, Wi-Fi, Ethernet","Weight":"20.3kg"}', images: '[]', is_bestseller: false, is_new_arrival: false, is_featured: false, stock_status: 'in_stock' },
  { name: 'Canon MAXIFY GX7020', slug: 'canon-maxify-gx7020', brand: 'Canon', category_slug: 'printers-scanners', price: 499, compare_at_price: 549, short_description: 'High-volume refillable ink tank AIO.', description: 'The Canon MAXIFY GX7020 is built for high-volume with refillable ink tanks.', features: '["Color Inkjet","Refillable Tanks","All-in-One","24 ppm","Auto Duplex","Dual Trays"]', specifications: '{"Type":"Color Inkjet","Speed":"24 ppm (black)","Resolution":"4800x1200 dpi","Duplex":"Auto","Connectivity":"USB, Wi-Fi, Ethernet","Weight":"11.5kg"}', images: '[]', is_bestseller: false, is_new_arrival: false, is_featured: false, stock_status: 'in_stock' },
  { name: 'Brother MFC-L3770CDW', slug: 'brother-mfc-l3770cdw', brand: 'Brother', category_slug: 'printers-scanners', price: 449, compare_at_price: 499, short_description: 'Wireless color laser all-in-one.', description: 'The Brother MFC-L3770CDW delivers fast color laser printing and scanning.', features: '["Color Laser","Multifunction","33 ppm","Wireless","Auto Duplex","50-sheet ADF"]', specifications: '{"Type":"Color Laser","Speed":"33 ppm","Resolution":"2400x600 dpi","Duplex":"Auto","Connectivity":"USB 3.0, Wi-Fi, Ethernet","Weight":"24kg"}', images: '[]', is_bestseller: false, is_new_arrival: false, is_featured: false, stock_status: 'in_stock' },
  { name: 'Epson WorkForce Pro WF-C5790', slug: 'epson-workforce-pro-wf-c5790', brand: 'Epson', category_slug: 'printers-scanners', price: 399, compare_at_price: 449, short_description: 'Business color inkjet with PrecisionCore.', description: 'The Epson WorkForce Pro WF-C5790 uses PrecisionCore for fast, efficient printing.', features: '["Color Inkjet","PrecisionCore","25 ppm","Replace Pack Ink","Auto Duplex","Low Energy"]', specifications: '{"Type":"Color Inkjet","Speed":"25 ppm","Resolution":"4800x1200 dpi","Duplex":"Auto","Connectivity":"USB, Wi-Fi, Ethernet, NFC","Weight":"16.5kg"}', images: '[]', is_bestseller: false, is_new_arrival: false, is_featured: false, stock_status: 'in_stock' },

  // Components (8)
  { name: 'NVIDIA GeForce RTX 4090', slug: 'nvidia-rtx-4090', brand: 'NVIDIA', category_slug: 'components', price: 1599, compare_at_price: 1799, short_description: 'Ultimate GPU with Ada Lovelace.', description: 'The NVIDIA GeForce RTX 4090 with 16384 CUDA cores and 24GB GDDR6X.', features: '["16384 CUDA Cores","24GB GDDR6X","DLSS 3.0","Ray Tracing","Ada Lovelace","450W TDP"]', specifications: '{"CUDA Cores":"16384","Memory":"24 GB GDDR6X","Boost":"2520 MHz","Bus":"384-bit","TDP":"450W","Length":"336mm"}', images: '[]', is_bestseller: true, is_new_arrival: false, is_featured: true, stock_status: 'in_stock' },
  { name: 'MSI GeForce RTX 4080 SUPER', slug: 'msi-rtx-4080-super', brand: 'MSI', category_slug: 'components', price: 999, compare_at_price: 1099, short_description: 'High-end GPU with 16GB GDDR6X.', description: 'The MSI GeForce RTX 4080 SUPER delivers exceptional 4K gaming.', features: '["10240 CUDA Cores","16GB GDDR6X","DLSS 3.0","Ray Tracing","MSI Cooling","4K Ready"]', specifications: '{"CUDA Cores":"10240","Memory":"16 GB GDDR6X","Boost":"2550 MHz","Bus":"256-bit","TDP":"320W","Length":"340mm"}', images: '[]', is_bestseller: false, is_new_arrival: false, is_featured: false, stock_status: 'in_stock' },
  { name: 'Corsair Vengeance DDR5-6000 32GB', slug: 'corsair-vengeance-ddr5-6000-32gb', brand: 'Corsair', category_slug: 'components', price: 119, compare_at_price: 139, short_description: 'High-performance DDR5 memory kit.', description: 'Corsair Vengeance DDR5-6000 32GB optimized for AMD EXPO and Intel XMP 3.0.', features: '["DDR5-6000","32GB (2x16GB)","CL36","Intel XMP 3.0","AMD EXPO","Aluminum Heatspreader"]', specifications: '{"Type":"DDR5","Speed":"6000 MHz","Capacity":"32 GB (2x16GB)","Latency":"CL36","Voltage":"1.35V"}', images: '[]', is_bestseller: true, is_new_arrival: false, is_featured: false, stock_status: 'in_stock' },
  { name: 'Samsung 990 Pro 2TB SSD', slug: 'samsung-990-pro-2tb-ssd', brand: 'Samsung', category_slug: 'components', price: 179, compare_at_price: 199, short_description: 'PCIe 4.0 NVMe SSD 7450 MB/s.', description: 'The Samsung 990 Pro 2TB with sequential reads up to 7450 MB/s.', features: '["PCIe 4.0 NVMe","2TB","7450 MB/s Read","6900 MB/s Write","Samsung V-NAND","5-Year Warranty"]', specifications: '{"Interface":"PCIe 4.0 x4","Capacity":"2 TB","Read":"7450 MB/s","Write":"6900 MB/s","IOPS":"1400K","Endurance":"1200 TBW"}', images: '[]', is_bestseller: true, is_new_arrival: false, is_featured: false, stock_status: 'in_stock' },
  { name: 'WD Black SN850X 2TB SSD', slug: 'wd-black-sn850x-2tb-ssd', brand: 'Western Digital', category_slug: 'components', price: 159, compare_at_price: 179, short_description: 'Gaming SSD 7300 MB/s.', description: 'The WD Black SN850X 2TB engineered for gamers with Game Mode 2.0.', features: '["PCIe 4.0 NVMe","2TB","7300 MB/s Read","Game Mode 2.0","Predictive Loading","5-Year Warranty"]', specifications: '{"Interface":"PCIe 4.0 x4","Capacity":"2 TB","Read":"7300 MB/s","Write":"6600 MB/s","IOPS":"1200K","Endurance":"1200 TBW"}', images: '[]', is_bestseller: false, is_new_arrival: false, is_featured: false, stock_status: 'in_stock' },
  { name: 'Intel Core i7-14700K', slug: 'intel-core-i7-14700k', brand: 'Intel', category_slug: 'components', price: 409, compare_at_price: 449, short_description: 'High-performance 20-core processor.', description: 'The Intel Core i7-14700K with 20 cores (8P+12E) and 28 threads.', features: '["20 Cores/28 Threads","Up to 5.6 GHz","33MB Cache","DDR5","PCIe 5.0","Intel 7"]', specifications: '{"Cores":"20 (8P+12E)","Threads":"28","Boost":"5.6 GHz","Cache":"33 MB","TDP":"125W","Socket":"LGA 1700"}', images: '[]', is_bestseller: false, is_new_arrival: false, is_featured: false, stock_status: 'in_stock' },
  { name: 'ASUS ROG Strix Z790-E', slug: 'asus-rog-strix-z790-e', brand: 'ASUS', category_slug: 'components', price: 429, compare_at_price: 469, short_description: 'Premium Intel Z790 ATX motherboard.', description: 'The ASUS ROG Strix Z790-E with PCIe 5.0, DDR5, WiFi 6E.', features: '["Intel Z790","LGA 1700","DDR5","PCIe 5.0 x16","WiFi 6E","20+1 Power Stages"]', specifications: '{"Chipset":"Intel Z790","Socket":"LGA 1700","Memory":"4x DDR5","PCIe":"1x 5.0 x16","Storage":"5x M.2","Networking":"2.5G LAN + WiFi 6E"}', images: '[]', is_bestseller: false, is_new_arrival: false, is_featured: true, stock_status: 'in_stock' },
  { name: 'Gigabyte X670E Aorus Master', slug: 'gigabyte-x670e-aorus-master', brand: 'Gigabyte', category_slug: 'components', price: 499, compare_at_price: 549, short_description: 'Premium AMD X670E motherboard.', description: 'The Gigabyte X670E Aorus Master with full PCIe 5.0 support.', features: '["AMD X670E","AM5","DDR5","Full PCIe 5.0","WiFi 6E","18+2+2 Power"]', specifications: '{"Chipset":"AMD X670E","Socket":"AM5","Memory":"4x DDR5","PCIe":"1x 5.0 x16","Storage":"5x M.2","Networking":"10G LAN + WiFi 6E"}', images: '[]', is_bestseller: false, is_new_arrival: false, is_featured: false, stock_status: 'in_stock' },
]

// Admin user
const adminUser = {
  email: 'admin@reachtronics.com',
  password_hash: '$2a$10$rZ8vKxJqYxJqYxJqYxJqYuGxJqYxJqYxJqYxJqYxJqYxJqYxJqYx',
  role: 'admin',
  permissions: '["dashboard","products","orders","users","shipping","inquiries"]',
  name: 'Admin',
}

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  const url = new URL(request.url)
  const token = url.searchParams.get('token') || authHeader?.replace('Bearer ', '')

  if (token !== SETUP_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = getSupabase()
  const results: string[] = []

  try {
    // 1. Check & insert categories
    const { data: existingCats, error: catCheckErr } = await supabase.from('categories').select('id, slug')
    if (catCheckErr) throw new Error(`categories check failed: ${catCheckErr.message}`)

    const existingCatSlugs = new Set((existingCats || []).map((c: { slug: string }) => c.slug))
    const catsToInsert = categories.filter(c => !existingCatSlugs.has(c.slug))

    if (catsToInsert.length > 0) {
      const { error: catInsertErr } = await supabase.from('categories').insert(catsToInsert)
      if (catInsertErr) throw new Error(`categories insert failed: ${catInsertErr.message}`)
      results.push(`Inserted ${catsToInsert.length} categories`)
    } else {
      results.push(`Categories already exist (${existingCats?.length || 0})`)
    }

    // 2. Get category ID map
    const { data: allCats } = await supabase.from('categories').select('id, slug')
    const catSlugToId = new Map<string, string>()
    for (const c of (allCats || [])) {
      catSlugToId.set(c.slug, c.id)
    }

    // 3. Check & insert products
    const { data: existingProds, error: prodCheckErr } = await supabase.from('products').select('id, slug')
    if (prodCheckErr) throw new Error(`products check failed: ${prodCheckErr.message}`)

    const existingProdSlugs = new Set((existingProds || []).map((p: { slug: string }) => p.slug))
    const prodsToInsert = products
      .filter(p => !existingProdSlugs.has(p.slug))
      .map(p => ({
        ...p,
        category_id: catSlugToId.get(p.category_slug) || null,
      }))

    if (prodsToInsert.length > 0) {
      const { error: prodInsertErr } = await supabase.from('products').insert(prodsToInsert)
      if (prodInsertErr) throw new Error(`products insert failed: ${prodInsertErr.message}`)
      results.push(`Inserted ${prodsToInsert.length} products`)
    } else {
      results.push(`Products already exist (${existingProds?.length || 0})`)
    }

    // 4. Check & insert admin user
    const { data: existingUsers } = await supabase.from('users').select('id, email').eq('email', adminUser.email)
    if (!existingUsers || existingUsers.length === 0) {
      const { error: userInsertErr } = await supabase.from('users').insert(adminUser)
      if (userInsertErr) throw new Error(`admin user insert failed: ${userInsertErr.message}`)
      results.push('Inserted admin user')
    } else {
      results.push('Admin user already exists')
    }

    // 5. Final row counts
    const [{ count: catCount }, { count: prodCount }, { count: userCount }] = await Promise.all([
      supabase.from('categories').select('*', { count: 'exact', head: true }),
      supabase.from('products').select('*', { count: 'exact', head: true }),
      supabase.from('users').select('*', { count: 'exact', head: true }),
    ])

    return NextResponse.json({
      success: true,
      results,
      final_row_counts: {
        categories: catCount,
        products: prodCount,
        users: userCount,
      },
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('Setup error:', error)
    return NextResponse.json({
      error: message,
      results,
      connection: 'supabase-rest-api',
      database_url: SUPABASE_URL,
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const token = url.searchParams.get('token')

  if (token !== SETUP_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = getSupabase()

  try {
    const [{ count: catCount }, { count: prodCount }, { count: userCount }] = await Promise.all([
      supabase.from('categories').select('*', { count: 'exact', head: true }),
      supabase.from('products').select('*', { count: 'exact', head: true }),
      supabase.from('users').select('*', { count: 'exact', head: true }),
    ])

    return NextResponse.json({
      status: 'ok',
      connection: 'supabase-rest-api',
      database_url: SUPABASE_URL,
      row_counts: {
        categories: catCount,
        products: prodCount,
        users: userCount,
      },
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: message, connection: 'supabase-rest-api' }, { status: 500 })
  }
}
