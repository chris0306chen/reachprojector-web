import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Original Supabase credentials (hardcoded for this setup endpoint)
const SUPABASE_URL = 'https://ufzzynacrknnmmyczmzl.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'sb_secret_QNxTm6b3xTUtd9dXB1mteg_ehJmKU-5';

// Categories with specific slugs
const categories = [
  { name: '4K Laser Projectors', slug: '4k-laser-projectors', description: 'Premium 4K laser projectors for home theater and professional use.', image_url: '/images/category-projectors.jpg', sort_order: 1 },
  { name: 'UST Laser TV', slug: 'ust-laser-tv', description: 'Ultra short throw laser TVs with massive screens from inches away.', image_url: '/images/category-ust.jpg', sort_order: 2 },
  { name: 'Printers & Scanners', slug: 'printers-scanners', description: 'High-performance printers and scanners for office and home.', image_url: '/images/category-printers.jpg', sort_order: 3 },
  { name: 'Components', slug: 'components', description: 'Premium PC components: CPUs, GPUs, motherboards, memory, storage.', image_url: '/images/category-components.jpg', sort_order: 4 },
];

// Products data
const products = [
  // 4K Laser Projectors
  { name: 'JMGO N5S ULTRA MAX 4K', slug: 'jmgo-n5s-ultra-max-4k', brand: 'JMGO', category_slug: '4k-laser-projectors', price: 1600, short_description: 'Premium 4K laser projector with exceptional brightness and color accuracy.', description: 'The JMGO N5S ULTRA MAX 4K delivers an immersive cinematic experience with its advanced laser light source.', features: ['4K UHD Resolution', 'Laser Light Source', '3000+ ANSI Lumens', 'HDR10+ Support', 'Auto Keystone Correction', 'Built-in Speaker'], specifications: { Resolution: '3840 x 2160', Brightness: '3200 ANSI Lumens', Light_Source: 'Triple Color Laser', Contrast_Ratio: '3000:1', Throw_Ratio: '1.2:1', Speaker: '2 x 10W', Weight: '9.5 kg' }, images: [], is_bestseller: true, is_featured: true, stock_status: 'in_stock' },
  { name: 'XGIMI RS 10 Ultra 4K', slug: 'xgimi-rs-10-ultra-4k', brand: 'XGIMI', category_slug: '4k-laser-projectors', price: 2499.99, short_description: 'Flagship 4K laser projector with dual laser engine and Dolby Vision.', description: 'The XGIMI RS 10 Ultra represents the pinnacle of home projection technology.', features: ['4K UHD Resolution', 'Dual Laser Engine', '3500+ ANSI Lumens', 'Dolby Vision + HDR10+', 'Auto Focus & Keystone', 'Harman Kardon Speakers'], specifications: { Resolution: '3840 x 2160', Brightness: '3500 ANSI Lumens', Light_Source: 'Dual Laser', Contrast_Ratio: '3500:1', Throw_Ratio: '1.2:1', Speaker: '2 x 12W Harman Kardon', Weight: '10.2 kg' }, images: [], is_bestseller: true, is_featured: true, stock_status: 'in_stock' },
  { name: 'XGIMI RS 10 Mini 4K', slug: 'xgimi-rs-10-mini-4k', brand: 'XGIMI', category_slug: '4k-laser-projectors', price: 1199.99, short_description: 'Compact 4K laser projector with premium features in a smaller form factor.', description: 'The XGIMI RS 10 Mini 4K brings flagship performance to a compact design.', features: ['4K UHD Resolution', 'Laser Light Source', '2000+ ANSI Lumens', 'HDR10+ Support', 'Smart Auto Adjustment', 'Portable Design'], specifications: { Resolution: '3840 x 2160', Brightness: '2000 ANSI Lumens', Light_Source: 'Laser', Contrast_Ratio: '2500:1', Throw_Ratio: '1.2:1', Speaker: '2 x 8W', Weight: '4.5 kg' }, images: [], is_new_arrival: true, stock_status: 'in_stock' },
  { name: 'Hisense VIDDA C5 Master 4K', slug: 'hisense-vidda-c5-master-4k', brand: 'Hisense', category_slug: '4k-laser-projectors', price: 2699.99, short_description: 'Professional-grade 4K laser projector with cinema-level color accuracy.', description: 'The Hisense VIDDA C5 Master 4K is engineered for the most demanding home theater enthusiasts.', features: ['4K UHD Resolution', 'Triple Laser (ALPD 5.0)', '4000+ ANSI Lumens', 'Cinema-grade Color', '120Hz Refresh Rate', 'Advanced Cooling System'], specifications: { Resolution: '3840 x 2160', Brightness: '4200 ANSI Lumens', Light_Source: 'ALPD 5.0 Triple Laser', Color_Gamut: '110% BT.2020', Throw_Ratio: '0.9:1 - 1.5:1', Speaker: '2 x 15W', Weight: '12.5 kg' }, images: [], is_bestseller: true, stock_status: 'in_stock' },
  { name: 'XGIMI Horizon Ultra', slug: 'xgimi-horizon-ultra', brand: 'XGIMI', category_slug: '4k-laser-projectors', price: 1799.99, short_description: 'Premium 4K HDR projector with Dolby Vision and hybrid light source.', description: 'The XGIMI Horizon Ultra combines a hybrid light source (LED + Laser) for exceptional brightness.', features: ['4K UHD Resolution', 'Hybrid LED+Laser', '2300 ISO Lumens', 'Dolby Vision', 'Harman Kardon Audio', 'Android TV 11'], specifications: { Resolution: '3840 x 2160', Brightness: '2300 ISO Lumens', Light_Source: 'LED + Laser', Throw_Ratio: '1.2:1', Speaker: '2 x 12W Harman Kardon', Weight: '5.5 kg' }, images: [], is_bestseller: true, stock_status: 'in_stock' },
  { name: 'XGIMI MoGo 3 Pro', slug: 'xgimi-mogo-3-pro', brand: 'XGIMI', category_slug: '4k-laser-projectors', price: 599.99, short_description: 'Portable 1080p projector with built-in battery and Android TV.', description: 'Take your entertainment anywhere with the XGIMI MoGo 3 Pro.', features: ['1080p Full HD', 'Built-in Battery', '400 ISO Lumens', 'Android TV', 'Auto Keystone', 'Portable Design'], specifications: { Resolution: '1920 x 1080', Brightness: '400 ISO Lumens', Battery_Life: '2.5 hours', Throw_Ratio: '1.1:1', Speaker: '2 x 4W', Weight: '1.6 kg' }, images: [], is_new_arrival: true, stock_status: 'in_stock' },
  { name: 'JMGO N1 Ultra 4K', slug: 'jmgo-n1-ultra-4k', brand: 'JMGO', category_slug: '4k-laser-projectors', price: 1399.99, short_description: 'Compact 4K laser projector with innovative gimbal design.', description: 'The JMGO N1 Ultra features an innovative built-in gimbal stand.', features: ['4K UHD Resolution', 'Laser Light Source', '2200 ANSI Lumens', '360-degree Gimbal', 'Auto Focus & Keystone', 'Cloud Gaming Ready'], specifications: { Resolution: '3840 x 2160', Brightness: '2200 ANSI Lumens', Light_Source: 'Triple Color Laser', Throw_Ratio: '0.6:1 - 4.5:1', Speaker: '2 x 10W', Weight: '4.6 kg' }, images: [], stock_status: 'in_stock' },
  // UST Laser TV
  { name: 'Hisense PX2-Pro 4K UST', slug: 'hisense-px2-pro-4k-ust', brand: 'Hisense', category_slug: 'ust-laser-tv', price: 2399.99, short_description: 'Ultra Short Throw 4K laser TV with 120" image from inches away.', description: 'The Hisense PX2-Pro transforms any wall into a massive 120-inch 4K display.', features: ['4K UHD Resolution', 'Ultra Short Throw', '2400+ ANSI Lumens', 'Triple Laser', 'Dolby Vision', 'Ambient Light Rejecting'], specifications: { Resolution: '3840 x 2160', Brightness: '2400 ANSI Lumens', Light_Source: 'Triple Laser', Throw_Ratio: '0.23:1', Screen_Size: '80" - 150"', Speaker: '2 x 15W + Subwoofer', Weight: '14 kg' }, images: [], is_featured: true, stock_status: 'in_stock' },
  { name: 'AWOL Vision LTV-3500 4K', slug: 'awol-vision-ltv-3500-4k', brand: 'AWOL Vision', category_slug: 'ust-laser-tv', price: 5999.99, short_description: 'Premium RGB triple laser UST projector with unmatched brightness.', description: 'The AWOL Vision LTV-3500 is the ultimate ultra-short throw projector.', features: ['4K UHD Resolution', 'RGB Triple Laser', '5500+ ANSI Lumens', '150" Display', 'HDR Support', 'Premium Build'], specifications: { Resolution: '3840 x 2160', Brightness: '5500 ANSI Lumens', Light_Source: 'RGB Triple Laser', Throw_Ratio: '0.198:1', Screen_Size: '80" - 150"', Speaker: '2 x 15W', Weight: '18 kg' }, images: [], is_featured: true, stock_status: 'in_stock' },
  { name: 'Formovie Theater 4K', slug: 'formovie-theater-4k', brand: 'Formovie', category_slug: 'ust-laser-tv', price: 3499.99, short_description: 'Award-winning UST laser projector with ALPD 4.5 technology.', description: 'The Formovie Theater combines ALPD 4.5 laser technology with an ultra-short throw design.', features: ['4K UHD Resolution', 'ALPD 4.5 Laser', '2800+ ANSI Lumens', 'Dolby Vision + HDR10+', '150" Screen', 'Android TV Built-in'], specifications: { Resolution: '3840 x 2160', Brightness: '2800 ANSI Lumens', Light_Source: 'ALPD 4.5', Throw_Ratio: '0.23:1', Screen_Size: '80" - 150"', Speaker: '2 x 15W Dolby Audio', Weight: '12 kg' }, images: [], is_new_arrival: true, stock_status: 'in_stock' },
  { name: 'JMGO U2 4K Laser TV', slug: 'jmgo-u2-4k-laser-tv', brand: 'JMGO', category_slug: 'ust-laser-tv', price: 2199.99, short_description: 'Sleek 4K laser TV with superior optics and smart features.', description: 'The JMGO U2 brings cinematic 4K quality to your living room.', features: ['4K UHD Resolution', 'Laser Light Source', '2400 ANSI Lumens', 'HDR10+', 'Auto Focus', 'Smart OS'], specifications: { Resolution: '3840 x 2160', Brightness: '2400 ANSI Lumens', Light_Source: 'Laser', Throw_Ratio: '0.23:1', Screen_Size: '80" - 130"', Speaker: '2 x 10W', Weight: '8.5 kg' }, images: [], stock_status: 'in_stock' },
  { name: 'Hisense PL1 4K Laser TV', slug: 'hisense-pl1-4k-laser-tv', brand: 'Hisense', category_slug: 'ust-laser-tv', price: 1899.99, short_description: 'Affordable 4K UST laser TV with impressive performance.', description: 'The Hisense PL1 offers 4K ultra-short throw projection at an accessible price.', features: ['4K UHD Resolution', 'Laser Light Source', '2100 ANSI Lumens', 'Ultra Short Throw', 'Smart TV Built-in', 'Voice Control'], specifications: { Resolution: '3840 x 2160', Brightness: '2100 ANSI Lumens', Light_Source: 'Laser', Throw_Ratio: '0.25:1', Screen_Size: '80" - 120"', Speaker: '2 x 10W', Weight: '8 kg' }, images: [], stock_status: 'in_stock' },
  // Printers & Scanners
  { name: 'HP LaserJet Pro M404dn', slug: 'hp-laserjet-pro-m404dn', brand: 'HP', category_slug: 'printers-scanners', price: 329, short_description: 'Fast monochrome laser printer for busy offices.', description: 'The HP LaserJet Pro M404dn delivers fast, reliable monochrome printing.', features: ['Monochrome Laser', '40 ppm Print Speed', 'Auto Duplex', 'Network Ready', '250-sheet Tray', 'Low Toner Cost'], specifications: { Type: 'Monochrome Laser', Speed: '40 ppm', Resolution: '1200 x 1200 dpi', Duplex: 'Automatic', Connectivity: 'USB, Ethernet', Paper_Capacity: '350 sheets', Weight: '10.2 kg' }, images: [], is_bestseller: true, stock_status: 'in_stock' },
  { name: 'Canon imageCLASS LBP226dw', slug: 'canon-imageclass-lbp226dw', brand: 'Canon', category_slug: 'printers-scanners', price: 299, short_description: 'Compact wireless monochrome laser printer with duplex printing.', description: 'The Canon imageCLASS LBP226dw combines compact design with powerful performance.', features: ['Monochrome Laser', '40 ppm Print Speed', 'Wireless + Ethernet', 'Auto Duplex', 'Canon UFR II', 'Energy Efficient'], specifications: { Type: 'Monochrome Laser', Speed: '40 ppm', Resolution: '1200 x 1200 dpi', Duplex: 'Automatic', Connectivity: 'USB, Wi-Fi, Ethernet', Weight: '8.4 kg' }, images: [], stock_status: 'in_stock' },
  { name: 'Brother HL-L2370DW', slug: 'brother-hl-l2370dw', brand: 'Brother', category_slug: 'printers-scanners', price: 209, short_description: 'Reliable wireless monochrome laser printer for home and small office.', description: 'The Brother HL-L2370DW offers reliable, cost-effective monochrome printing.', features: ['Monochrome Laser', '36 ppm Print Speed', 'Wireless Printing', 'Auto Duplex', '250-sheet Tray', 'Mobile Printing'], specifications: { Type: 'Monochrome Laser', Speed: '36 ppm', Resolution: '2400 x 600 dpi', Duplex: 'Automatic', Connectivity: 'USB 2.0, Wi-Fi', Weight: '7.2 kg' }, images: [], is_bestseller: true, stock_status: 'in_stock' },
  { name: 'Epson EcoTank ET-4850', slug: 'epson-ecotank-et-4850', brand: 'Epson', category_slug: 'printers-scanners', price: 449, short_description: 'All-in-one color inkjet with ultra-low cost per page.', description: 'The Epson EcoTank ET-4850 revolutionizes printing with its cartridge-free design.', features: ['Color Inkjet', 'All-in-One', 'Ultra-low Cost Per Page', 'Auto Duplex', 'ADF Scanner', 'Wi-Fi Direct'], specifications: { Type: 'Color Inkjet', Speed: '15 ppm (black)', Resolution: '4800 x 1200 dpi', Duplex: 'Automatic', Connectivity: 'USB, Wi-Fi, Ethernet', Weight: '6.8 kg' }, images: [], is_new_arrival: true, stock_status: 'in_stock' },
  { name: 'HP Color LaserJet Pro M479fdw', slug: 'hp-color-laserjet-pro-m479fdw', brand: 'HP', category_slug: 'printers-scanners', price: 549, short_description: 'Multifunction color laser printer with advanced security features.', description: 'The HP Color LaserJet Pro M479fdw delivers professional color printing.', features: ['Color Laser', 'Multifunction', '28 ppm Print Speed', 'Auto Duplex', '50-sheet ADF', 'HP Security Features'], specifications: { Type: 'Color Laser', Speed: '28 ppm', Resolution: '600 x 600 dpi', Duplex: 'Automatic', Connectivity: 'USB, Wi-Fi, Ethernet', Weight: '20.3 kg' }, images: [], stock_status: 'in_stock' },
  { name: 'Canon MAXIFY GX7020', slug: 'canon-maxify-gx7020', brand: 'Canon', category_slug: 'printers-scanners', price: 499, short_description: 'High-volume refillable ink tank all-in-one printer.', description: 'The Canon MAXIFY GX7020 is built for high-volume business printing.', features: ['Color Inkjet', 'Refillable Ink Tanks', 'All-in-One', '24 ppm Print Speed', 'Auto Duplex', 'Dual Paper Trays'], specifications: { Type: 'Color Inkjet', Speed: '24 ppm (black)', Resolution: '4800 x 1200 dpi', Duplex: 'Automatic', Connectivity: 'USB, Wi-Fi, Ethernet', Weight: '11.5 kg' }, images: [], stock_status: 'in_stock' },
  { name: 'Brother MFC-L3770CDW', slug: 'brother-mfc-l3770cdw', brand: 'Brother', category_slug: 'printers-scanners', price: 449, short_description: 'Wireless color laser all-in-one with fast duplex printing.', description: 'The Brother MFC-L3770CDW delivers fast color laser printing.', features: ['Color Laser', 'Multifunction', '33 ppm Print Speed', 'Wireless', 'Auto Duplex', '50-sheet ADF'], specifications: { Type: 'Color Laser', Speed: '33 ppm', Resolution: '2400 x 600 dpi', Duplex: 'Automatic', Connectivity: 'USB 3.0, Wi-Fi, Ethernet', Weight: '24 kg' }, images: [], stock_status: 'in_stock' },
  { name: 'Epson WorkForce Pro WF-C5790', slug: 'epson-workforce-pro-wf-c5790', brand: 'Epson', category_slug: 'printers-scanners', price: 399, short_description: 'Business color inkjet with PrecisionCore technology.', description: 'The Epson WorkForce Pro WF-C5790 uses PrecisionCore heat-free technology.', features: ['Color Inkjet', 'PrecisionCore Technology', '25 ppm Print Speed', 'Replace Pack Ink', 'Auto Duplex', 'Low Energy Use'], specifications: { Type: 'Color Inkjet', Speed: '25 ppm', Resolution: '4800 x 1200 dpi', Duplex: 'Automatic', Connectivity: 'USB, Wi-Fi, Ethernet, NFC', Weight: '16.5 kg' }, images: [], stock_status: 'in_stock' },
  // Components
  { name: 'Intel Core i9-14900K', slug: 'intel-core-i9-14900k', brand: 'Intel', category_slug: 'components', price: 589, short_description: 'Flagship 24-core desktop processor with 6.0 GHz boost.', description: 'The Intel Core i9-14900K is the ultimate desktop processor.', features: ['24 Cores / 32 Threads', 'Up to 6.0 GHz', '36MB Intel Smart Cache', 'DDR5 Support', 'PCIe 5.0', 'Intel 7 Process'], specifications: { Cores: '24 (8P + 16E)', Threads: '32', Base_Clock: '3.2 GHz', Boost_Clock: '6.0 GHz', Cache: '36 MB', TDP: '125W', Socket: 'LGA 1700', Memory: 'DDR5-5600' }, images: [], is_bestseller: true, is_featured: true, stock_status: 'in_stock' },
  { name: 'AMD Ryzen 9 7950X', slug: 'amd-ryzen-9-7950x', brand: 'AMD', category_slug: 'components', price: 549, short_description: '16-core Zen 4 processor with exceptional multi-threaded performance.', description: 'The AMD Ryzen 9 7950X delivers 16 cores of Zen 4 performance.', features: ['16 Cores / 32 Threads', 'Up to 5.7 GHz', '64MB L3 Cache', 'Zen 4 Architecture', 'DDR5 Support', 'PCIe 5.0'], specifications: { Cores: '16', Threads: '32', Base_Clock: '4.5 GHz', Boost_Clock: '5.7 GHz', L3_Cache: '64 MB', TDP: '170W', Socket: 'AM5', Memory: 'DDR5-5200' }, images: [], is_bestseller: true, stock_status: 'in_stock' },
  { name: 'Intel Core i7-14700K', slug: 'intel-core-i7-14700k', brand: 'Intel', category_slug: 'components', price: 409, short_description: 'High-performance 20-core processor for gaming and productivity.', description: 'The Intel Core i7-14700K offers 20 cores and 28 threads.', features: ['20 Cores / 28 Threads', 'Up to 5.6 GHz', '33MB Intel Smart Cache', 'DDR5 Support', 'PCIe 5.0', 'Intel 7 Process'], specifications: { Cores: '20 (8P + 12E)', Threads: '28', Base_Clock: '3.4 GHz', Boost_Clock: '5.6 GHz', Cache: '33 MB', TDP: '125W', Socket: 'LGA 1700', Memory: 'DDR5-5600' }, images: [], stock_status: 'in_stock' },
  { name: 'AMD Ryzen 7 7800X3D', slug: 'amd-ryzen-7-7800x3d', brand: 'AMD', category_slug: 'components', price: 449, short_description: 'Best gaming CPU with 3D V-Cache technology.', description: 'The AMD Ryzen 7 7800X3D features AMD 3D V-Cache technology.', features: ['8 Cores / 16 Threads', 'Up to 5.0 GHz', '96MB L3 Cache (3D V-Cache)', 'Zen 4 Architecture', 'Best Gaming CPU', 'Low Power 120W TDP'], specifications: { Cores: '8', Threads: '16', Base_Clock: '4.2 GHz', Boost_Clock: '5.0 GHz', L3_Cache: '96 MB (3D V-Cache)', TDP: '120W', Socket: 'AM5', Memory: 'DDR5-5200' }, images: [], is_bestseller: true, is_featured: true, stock_status: 'in_stock' },
  { name: 'NVIDIA GeForce RTX 4090', slug: 'nvidia-rtx-4090', brand: 'NVIDIA', category_slug: 'components', price: 1599, short_description: 'Ultimate GPU with Ada Lovelace architecture and 24GB GDDR6X.', description: 'The NVIDIA GeForce RTX 4090 is the most powerful consumer GPU.', features: ['16384 CUDA Cores', '24GB GDDR6X', 'DLSS 3.0', 'Ray Tracing Cores', 'Ada Lovelace Architecture', '450W TDP'], specifications: { CUDA_Cores: '16384', Memory: '24 GB GDDR6X', Boost_Clock: '2520 MHz', Memory_Bus: '384-bit', TDP: '450W', Length: '336 mm' }, images: [], is_bestseller: true, is_featured: true, stock_status: 'in_stock' },
  { name: 'MSI GeForce RTX 4080 SUPER', slug: 'msi-rtx-4080-super', brand: 'MSI', category_slug: 'components', price: 999, short_description: 'High-end GPU with 16GB GDDR6X for 4K gaming.', description: 'The MSI GeForce RTX 4080 SUPER delivers exceptional 4K gaming.', features: ['10240 CUDA Cores', '16GB GDDR6X', 'DLSS 3.0', 'Ray Tracing', 'MSI Cooling', '4K Gaming Ready'], specifications: { CUDA_Cores: '10240', Memory: '16 GB GDDR6X', Boost_Clock: '2550 MHz', Memory_Bus: '256-bit', TDP: '320W', Length: '340 mm' }, images: [], stock_status: 'in_stock' },
  { name: 'Corsair Vengeance DDR5-6000 32GB', slug: 'corsair-vengeance-ddr5-6000-32gb', brand: 'Corsair', category_slug: 'components', price: 119, short_description: 'High-performance DDR5 memory kit optimized for AMD and Intel.', description: 'Corsair Vengeance DDR5-6000 32GB kit delivers excellent performance.', features: ['DDR5-6000', '32GB (2x16GB)', 'CL36 Latency', 'Intel XMP 3.0', 'AMD EXPO', 'Aluminum Heat Spreader'], specifications: { Type: 'DDR5', Speed: '6000 MHz', Capacity: '32 GB (2x16GB)', Latency: 'CL36-36-36-76', Voltage: '1.35V', Heat_Spreader: 'Aluminum' }, images: [], is_bestseller: true, stock_status: 'in_stock' },
  { name: 'Samsung 990 Pro 2TB SSD', slug: 'samsung-990-pro-2tb-ssd', brand: 'Samsung', category_slug: 'components', price: 179, short_description: 'PCIe 4.0 NVMe SSD with sequential read up to 7450 MB/s.', description: 'The Samsung 990 Pro 2TB delivers blazing-fast storage performance.', features: ['PCIe 4.0 NVMe', '2TB Capacity', '7450 MB/s Read', '6900 MB/s Write', 'Samsung V-NAND', '5-Year Warranty'], specifications: { Interface: 'PCIe 4.0 x4 NVMe', Capacity: '2 TB', Sequential_Read: '7450 MB/s', Sequential_Write: '6900 MB/s', Random_Read: '1400K IOPS', Endurance: '1200 TBW', Form_Factor: 'M.2 2280' }, images: [], is_bestseller: true, stock_status: 'in_stock' },
  { name: 'WD Black SN850X 2TB SSD', slug: 'wd-black-sn850x-2tb-ssd', brand: 'Western Digital', category_slug: 'components', price: 159, short_description: 'High-performance gaming SSD with up to 7300 MB/s read speed.', description: 'The WD Black SN850X 2TB is engineered for gamers and content creators.', features: ['PCIe 4.0 NVMe', '2TB Capacity', '7300 MB/s Read', 'Game Mode 2.0', 'Predictive Loading', '5-Year Warranty'], specifications: { Interface: 'PCIe 4.0 x4 NVMe', Capacity: '2 TB', Sequential_Read: '7300 MB/s', Sequential_Write: '6600 MB/s', Random_Read: '1200K IOPS', Endurance: '1200 TBW', Form_Factor: 'M.2 2280' }, images: [], stock_status: 'in_stock' },
  { name: 'ASUS ROG Strix Z790-E', slug: 'asus-rog-strix-z790-e', brand: 'ASUS', category_slug: 'components', price: 429, short_description: 'Premium Intel Z790 ATX motherboard with PCIe 5.0 and DDR5.', description: 'The ASUS ROG Strix Z790-E Gaming WiFi is a premium motherboard.', features: ['Intel Z790 Chipset', 'LGA 1700 Socket', 'DDR5 Support', 'PCIe 5.0 x16', 'WiFi 6E', '20+1 Power Stages'], specifications: { Chipset: 'Intel Z790', Socket: 'LGA 1700', Memory: '4x DDR5 (max 192GB)', PCIe: '1x 5.0 x16, 1x 4.0 x4', Storage: '5x M.2, 4x SATA', Networking: '2.5G LAN + WiFi 6E', Form_Factor: 'ATX' }, images: [], is_featured: true, stock_status: 'in_stock' },
  { name: 'Gigabyte X670E Aorus Master', slug: 'gigabyte-x670e-aorus-master', brand: 'Gigabyte', category_slug: 'components', price: 499, short_description: 'Premium AMD X670E motherboard with full PCIe 5.0 support.', description: 'The Gigabyte X670E Aorus Master is the ultimate motherboard for AMD Ryzen 7000.', features: ['AMD X670E Chipset', 'AM5 Socket', 'DDR5 Support', 'Full PCIe 5.0', 'WiFi 6E', '18+2+2 Power Stages'], specifications: { Chipset: 'AMD X670E', Socket: 'AM5', Memory: '4x DDR5 (max 128GB)', PCIe: '1x 5.0 x16, 1x 5.0 M.2', Storage: '5x M.2, 4x SATA', Networking: '10G LAN + WiFi 6E', Form_Factor: 'ATX' }, images: [], stock_status: 'in_stock' },
];

// Admin user
const adminUser = {
  email: 'admin@reachtronics.com',
  password_hash: '$2a$10$rZ8vKxJqYxJqYxJqYxJqYuGxJqYxJqYxJqYxJqYxJqYxJqYxJqYx',
  role: 'admin',
  permissions: ['dashboard', 'products', 'orders', 'users', 'shipping', 'inquiries'],
  name: 'Admin',
};

// DDL statements for creating tables
const ddlStatements = [
  `CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    image_url TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ
  )`,
  `CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    brand VARCHAR(100) NOT NULL,
    category_id UUID REFERENCES categories(id),
    price NUMERIC(10,2) NOT NULL,
    compare_at_price NUMERIC(10,2),
    description TEXT,
    short_description TEXT,
    images JSONB DEFAULT '[]'::jsonb,
    specifications JSONB DEFAULT '{}'::jsonb,
    features JSONB DEFAULT '[]'::jsonb,
    stock_status VARCHAR(20) NOT NULL DEFAULT 'in_stock',
    is_bestseller BOOLEAN NOT NULL DEFAULT false,
    is_new_arrival BOOLEAN NOT NULL DEFAULT false,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    is_active BOOLEAN NOT NULL DEFAULT true,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ
  )`,
  `CREATE TABLE IF NOT EXISTS inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    company VARCHAR(200),
    phone VARCHAR(50),
    message TEXT NOT NULL,
    product_id UUID REFERENCES products(id),
    status VARCHAR(20) NOT NULL DEFAULT 'new',
    reply TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ
  )`,
  `CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id VARCHAR(100) NOT NULL UNIQUE,
    product_id UUID REFERENCES products(id),
    quantity INTEGER NOT NULL DEFAULT 1,
    amount NUMERIC(10,2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'USD',
    payer_email VARCHAR(255),
    payer_name VARCHAR(255),
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    payment_method VARCHAR(20) DEFAULT 'paypal',
    airwallex_intent_id VARCHAR(255),
    shipping_method VARCHAR(100),
    tracking_number VARCHAR(200),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ
  )`,
  `CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'staff',
    permissions JSONB DEFAULT '[]'::jsonb,
    name VARCHAR(100),
    is_active BOOLEAN NOT NULL DEFAULT true,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ
  )`,
  `CREATE TABLE IF NOT EXISTS shipping_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    zone VARCHAR(100) NOT NULL,
    method VARCHAR(50) NOT NULL,
    weight_rate JSONB DEFAULT '{}'::jsonb,
    volume_rate JSONB DEFAULT '{}'::jsonb,
    fixed_fee NUMERIC(10,2) DEFAULT 0,
    min_order NUMERIC(10,2) DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ
  )`,
  `CREATE TABLE IF NOT EXISTS health_check (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    status VARCHAR(20) NOT NULL DEFAULT 'ok',
    checked_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`,
];

async function executeSQL(sql: string): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({ query: sql }),
    });
    
    if (response.ok) {
      return { success: true };
    }
    
    // If the RPC function doesn't exist, try alternative approach
    const errorText = await response.text();
    return { success: false, error: `HTTP ${response.status}: ${errorText}` };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

async function createTablesViaRest(): Promise<{ created: string[]; failed: string[]; skipped: string[] }> {
  const created: string[] = [];
  const failed: string[] = [];
  const skipped: string[] = [];
  
  // Try to execute DDL via Supabase REST API
  // Method 1: Try using the pg REST API directly
  for (const ddl of ddlStatements) {
    const tableName = ddl.match(/CREATE TABLE IF NOT EXISTS (\w+)/)?.[1] || 'unknown';
    
    // Try executing via REST API
    const result = await executeSQL(ddl);
    
    if (result.success) {
      created.push(tableName);
    } else {
      // Check if table already exists by trying to query it
      const checkResponse = await fetch(`${SUPABASE_URL}/rest/v1/${tableName}?limit=1`, {
        headers: {
          'apikey': SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        },
      });
      
      if (checkResponse.ok) {
        skipped.push(tableName);
      } else {
        failed.push(`${tableName}: ${result.error}`);
      }
    }
  }
  
  return { created, failed, skipped };
}

async function runSetup() {
  const results: Record<string, any> = {};
  const errors: string[] = [];
  
  // Create Supabase client with original credentials
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  
  // Step 1: Try to create tables
  const tableResults = await createTablesViaRest();
  results.table_creation = tableResults;
  
  // Step 2: Insert health check
  try {
    const { error } = await supabase.from('health_check').insert({ status: 'ok' });
    if (error) {
      // Table might not exist yet, try to create it
      errors.push(`health_check insert failed: ${error.message}`);
    } else {
      results.health_check = 'ok';
    }
  } catch (err: any) {
    errors.push(`health_check error: ${err.message}`);
  }
  
  // Step 3: Insert categories
  try {
    const { data: existingCats } = await supabase.from('categories').select('slug');
    const existingSlugs = new Set((existingCats || []).map((c: any) => c.slug));
    
    const newCats = categories.filter(c => !existingSlugs.has(c.slug));
    if (newCats.length > 0) {
      const { data, error } = await supabase.from('categories').insert(newCats).select();
      if (error) throw error;
      results.categories_inserted = data?.length || 0;
    } else {
      results.categories_inserted = 0;
      results.categories_already_exist = existingCats?.length || 0;
    }
  } catch (err: any) {
    errors.push(`categories: ${err.message}`);
  }
  
  // Get category IDs for product insertion
  const { data: allCats } = await supabase.from('categories').select('id, slug');
  const catMap: Record<string, string> = {};
  for (const cat of allCats || []) {
    catMap[cat.slug] = cat.id;
  }
  
  // Step 4: Insert products
  try {
    const { data: existingProds } = await supabase.from('products').select('slug');
    const existingProdSlugs = new Set((existingProds || []).map((p: any) => p.slug));
    
    const newProds = products.filter(p => !existingProdSlugs.has(p.slug));
    if (newProds.length > 0) {
      const productRows = newProds.map(p => ({
        name: p.name,
        slug: p.slug,
        brand: p.brand,
        category_id: catMap[p.category_slug],
        price: p.price.toString(),
        short_description: p.short_description,
        description: p.description,
        features: p.features || [],
        specifications: p.specifications || {},
        images: p.images || [],
        stock_status: p.stock_status || 'in_stock',
        is_bestseller: p.is_bestseller || false,
        is_new_arrival: p.is_new_arrival || false,
        is_featured: p.is_featured || false,
        is_active: true,
        sort_order: 0,
      }));
      
      const { data, error } = await supabase.from('products').insert(productRows).select();
      if (error) throw error;
      results.products_inserted = data?.length || 0;
    } else {
      results.products_inserted = 0;
      results.products_already_exist = existingProds?.length || 0;
    }
  } catch (err: any) {
    errors.push(`products: ${err.message}`);
  }
  
  // Step 5: Insert admin user
  try {
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', adminUser.email)
      .maybeSingle();
    
    if (!existingUser) {
      const { data, error } = await supabase.from('users').insert(adminUser).select();
      if (error) throw error;
      results.admin_user = 'created';
    } else {
      results.admin_user = 'already exists';
    }
  } catch (err: any) {
    errors.push(`admin user: ${err.message}`);
  }
  
  // Step 6: Final row counts
  try {
    const counts: Record<string, number> = {};
    for (const table of ['categories', 'products', 'users', 'orders', 'inquiries', 'shipping_templates', 'health_check']) {
      const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true });
      counts[table] = error ? -1 : (count || 0);
    }
    results.final_row_counts = counts;
  } catch (err: any) {
    errors.push(`row counts: ${err.message}`);
  }
  
  return { success: errors.length === 0, results, errors };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const confirm = searchParams.get('confirm');
  
  if (confirm !== 'true') {
    return NextResponse.json({
      message: 'Database setup endpoint for ORIGINAL Supabase',
      url: SUPABASE_URL,
      warning: 'This will create tables and seed data. Add ?confirm=true to proceed.',
      tables_to_create: ['health_check', 'categories', 'products', 'inquiries', 'orders', 'users', 'shipping_templates'],
      categories: categories.map(c => ({ name: c.name, slug: c.slug })),
      product_count: products.length,
    });
  }
  
  try {
    const result = await runSetup();
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    const result = await runSetup();
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
