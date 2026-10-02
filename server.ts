import express, { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');
const UPLOADS_DIR = path.join(__dirname, 'public', 'uploads');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Support large payloads for direct image and video uploads from mobile gallery/camera
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));
app.use('/uploads', express.static(UPLOADS_DIR));

// Initial seed database
const initialSettings = {
  mallName: 'CLEAR MALL 555',
  hotlinePhone: '0798010110',
  hotlineInternational: '+250798010110',
  whatsappUrl: 'https://wa.me/250798010110',
  mtnPaymentCodeTemplate: '*182*8*1*2262742*AMOUNT#',
  mtnMerchantNumber: '2262742',
  defaultCommissionPercent: 5,
  deliveryZones: [
    {
      id: 'kigali-urban',
      name: 'Kigali Urban Delivery',
      description: 'Nyarugenge, Gasabo, and Kicukiro sectors (Standard)',
      feeRwf: 2000,
      estimatedDelivery: 'Same Day / 24 Hours'
    },
    {
      id: 'kigali-express',
      name: 'Kigali VIP 2-Hour Express',
      description: 'Direct courier delivery directly to your door in Kigali',
      feeRwf: 3500,
      estimatedDelivery: 'Within 2 Hours'
    },
    {
      id: 'provincial-rwanda',
      name: 'Provincial Rwanda Express',
      description: 'Musanze, Rubavu, Huye, Rwamagana, Muhanga, Rusizi',
      feeRwf: 5000,
      estimatedDelivery: '24 - 48 Hours'
    },
    {
      id: 'store-pickup',
      name: 'Self-Pickup at Clear Mall 555 Hub',
      description: 'Clear Mall 555 Central Station, CBD Kigali',
      feeRwf: 0,
      estimatedDelivery: 'Immediate Ready'
    }
  ],
  currencies: {
    base: 'RWF',
    rates: {
      RWF: 1,
      USD: 0.000704, // 1 USD ~ 1420 RWF
      EUR: 0.000645  // 1 EUR ~ 1550 RWF
    }
  }
};

const initialUsers = [
  {
    id: 'usr-admin-1',
    name: 'Clear Mall 555 Director',
    email: 'admin@clearmall.com',
    phone: '0798010110',
    role: 'admin',
    createdAt: new Date().toISOString()
  },
  {
    id: 'usr-seller-1',
    name: 'Kigali Prime Tech Ltd',
    email: 'tech@clearmall.com',
    phone: '0788123456',
    role: 'seller',
    shopId: 'shop-tech-1',
    createdAt: new Date().toISOString()
  },
  {
    id: 'usr-seller-2',
    name: '555 Elite Fashion & Sneakers',
    email: 'fashion@clearmall.com',
    phone: '0788654321',
    role: 'seller',
    shopId: 'shop-fashion-2',
    createdAt: new Date().toISOString()
  },
  {
    id: 'usr-customer-1',
    name: 'Clement Ishimwe',
    email: 'ishimweclement537@gmail.com',
    phone: '0798010110',
    role: 'customer',
    createdAt: new Date().toISOString()
  }
];

const initialShops = [
  {
    id: 'shop-tech-1',
    ownerId: 'usr-seller-1',
    ownerName: 'Kigali Prime Tech Ltd',
    name: 'Clear Tech & Electronics',
    slug: 'clear-tech-electronics',
    description: 'Premier authorized distributor of flagship smartphones, smartwatches, high-fidelity wireless audio, and laptop computing gear in Rwanda.',
    logo: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=200&q=80',
    banner: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80',
    phone: '0788123456',
    address: 'CLEAR MALL 555, Floor 2, Tech Plaza, Kigali',
    rating: 4.9,
    totalSales: 142,
    commissionRate: 5,
    status: 'active',
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString()
  },
  {
    id: 'shop-fashion-2',
    ownerId: 'usr-seller-2',
    ownerName: '555 Elite Fashion & Sneakers',
    name: '555 Luxury Streetwear & Kicks',
    slug: '555-luxury-streetwear',
    description: 'Curated original footwear, limited-edition sneakers, apparel, and premium accessories tailored for Rwandan urban elegance.',
    logo: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=200&q=80',
    banner: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
    phone: '0788654321',
    address: 'CLEAR MALL 555, Floor 1, Avenue 4, Kigali',
    rating: 4.8,
    totalSales: 98,
    commissionRate: 5,
    status: 'active',
    createdAt: new Date(Date.now() - 25 * 86400000).toISOString()
  },
  {
    id: 'shop-beauty-3',
    ownerId: 'usr-admin-1',
    ownerName: 'Clear Mall 555 Director',
    name: 'Glow Rwanda Luxury Fragrance & Beauty',
    slug: 'glow-rwanda-beauty',
    description: 'Authentic French & Arabian luxury perfumes, clinical skincare serums, and organic dermatological cosmetics.',
    logo: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=200&q=80',
    banner: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=1200&q=80',
    phone: '0798010110',
    address: 'CLEAR MALL 555, Ground Floor, Atrium, Kigali',
    rating: 4.95,
    totalSales: 87,
    commissionRate: 5,
    status: 'active',
    createdAt: new Date(Date.now() - 20 * 86400000).toISOString()
  },
  {
    id: 'shop-auto-4',
    ownerId: 'usr-admin-1',
    ownerName: 'Clear Mall 555 Director',
    name: '555 Prime Motors & Car Showroom',
    slug: '555-prime-motors-rwanda',
    description: 'Direct importer of certified luxury SUVs, hybrid crossover vehicles, and premium sedans in Kigali. Full Rwanda tax clearance and registration assistance.',
    logo: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=200&q=80',
    banner: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
    phone: '0798010110',
    address: 'CLEAR MALL 555, Auto Pavilion, Boulevard de l’Umuganda, Kigali',
    rating: 4.98,
    totalSales: 24,
    commissionRate: 5,
    status: 'active',
    createdAt: new Date(Date.now() - 15 * 86400000).toISOString()
  }
];

const initialProducts = [
  {
    id: 'prod-car-5',
    shopId: 'shop-auto-4',
    shopName: '555 Prime Motors & Car Showroom',
    name: 'Toyota Land Cruiser Prado TX-L Luxury SUV (2024)',
    slug: 'toyota-land-cruiser-prado-tx-l-2024',
    description: 'Flagship 7-seater luxury SUV designed for Rwanda roads and overland travel. Powered by a refined 2.8L D-4D Turbo Diesel engine paired with full-time 4WD, kinetic dynamic suspension, multi-terrain monitor, panoramic sunroof, and premium cooled leather seating.',
    category: 'Cars & Automotive',
    priceRwf: 68500000,
    originalPriceRwf: 73000000,
    stock: 2,
    images: ['/src/assets/images/product_suv_luxury_car_1790942254000.jpg'],
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-car-driving-through-a-modern-city-at-night-42171-large.mp4',
    rating: 5.0,
    reviewsCount: 16,
    featured: true,
    specs: {
      'Year Model': '2024 Brand New Import',
      'Engine': '2.8L D-4D 4-Cylinder Turbo Diesel (204 HP)',
      'Transmission': '6-Speed Super ECT Automatic 4WD',
      'Fuel Economy': '7.9 L / 100km',
      'Seating': '7 Seats Premium Perforated Leather',
      'Registration': 'Kigali Registration Ready (All Customs Duty Paid)',
      'Warranty': '3 Years / 100,000 km Warranty'
    },
    status: 'active',
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-phone-1',
    shopId: 'shop-tech-1',
    shopName: 'Clear Tech & Electronics',
    name: 'Titanium Ultra 5G Pro Flagship Smartphone (256GB)',
    slug: 'titanium-ultra-5g-pro-flagship',
    description: 'Ultra-thin aerospace titanium frame, 6.8" 120Hz LTPO Dynamic AMOLED display, 200MP pro-grade cinematic camera system, and ultra-fast 65W charging. Dual SIM 5G compatible across all Rwandan carriers including MTN and Airtel.',
    category: 'Electronics',
    priceRwf: 685000,
    originalPriceRwf: 750000,
    stock: 18,
    images: ['/src/assets/images/product_smartphone_flagship_1790926862084.jpg'],
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-holding-a-modern-smartphone-with-a-green-screen-41221-large.mp4',
    rating: 4.9,
    reviewsCount: 38,
    featured: true,
    specs: {
      'Storage': '256GB UFS 4.0',
      'RAM': '12GB LPDDR5X',
      'Processor': 'Snapdragon 8 Gen 3',
      'Display': '6.8" 120Hz LTPO AMOLED',
      'Battery': '5000 mAh (65W Fast Charge)',
      'Warranty': '1 Year Full Clear Mall Warranty'
    },
    status: 'active',
    createdAt: new Date(Date.now() - 15 * 86400000).toISOString()
  },
  {
    id: 'prod-sneakers-2',
    shopId: 'shop-fashion-2',
    shopName: '555 Luxury Streetwear & Kicks',
    name: 'CLEAR 555 Apex Edition Lifestyle Sneakers',
    slug: 'clear-555-apex-lifestyle-sneakers',
    description: 'Designed exclusively for CLEAR MALL 555 with vibrant orange and deep midnight blue overlays. Ultra-cushioned responsive midsole, breathable composite mesh upper, and high-traction rubber outsole engineered for long-lasting comfort.',
    category: 'Fashion & Shoes',
    priceRwf: 58000,
    originalPriceRwf: 72000,
    stock: 35,
    images: ['/src/assets/images/product_designer_sneakers_1790926873469.jpg'],
    rating: 4.8,
    reviewsCount: 42,
    featured: true,
    specs: {
      'Available Sizes': 'EU 39, 40, 41, 42, 43, 44, 45',
      'Colorway': 'Clear Orange / Midnight Navy / Arctic White',
      'Material': 'Perforated Leather & Composite Mesh',
      'Sole': 'Responsive Nitrogen Infused EVA'
    },
    status: 'active',
    createdAt: new Date(Date.now() - 12 * 86400000).toISOString()
  },
  {
    id: 'prod-watch-3',
    shopId: 'shop-tech-1',
    shopName: 'Clear Tech & Electronics',
    name: 'Apex Pro OLED Smartwatch & Hi-Res Wireless ANC Earbuds Duo',
    slug: 'apex-pro-smartwatch-and-wireless-earbuds-bundle',
    description: 'All-in-one connectivity bundle. The Apex Pro Smartwatch features GPS navigation, continuous heart rate and SpO2 tracking, and Bluetooth call speaker. Includes high-fidelity active noise-canceling earbuds with 36-hour battery case.',
    category: 'Electronics',
    priceRwf: 89000,
    originalPriceRwf: 110000,
    stock: 24,
    images: ['/src/assets/images/product_smartwatch_audio_1790926884217.jpg'],
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-close-up-of-a-smartwatch-on-a-mans-wrist-41584-large.mp4',
    rating: 4.95,
    reviewsCount: 29,
    featured: true,
    specs: {
      'Watch Display': '1.96" Sapphire AMOLED Always-On',
      'Water Resistance': '5 ATM / 50 meters',
      'Battery Life': 'Up to 10 days on single charge',
      'Earbuds ANC': 'Up to 42dB Hybrid Noise Cancellation',
      'Compatibility': 'iOS & Android (MTN MoMo notifications compatible)'
    },
    status: 'active',
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString()
  },
  {
    id: 'prod-perfume-4',
    shopId: 'shop-beauty-3',
    shopName: 'Glow Rwanda Luxury Fragrance & Beauty',
    name: 'Amber Oud Royale Eau De Parfum (100ml)',
    slug: 'amber-oud-royale-eau-de-parfum',
    description: 'An intoxicating masterwork of sweet Madagascar vanilla, rich Cambodian agarwood, velvety amber, and subtle notes of bergamot and pink pepper. Boasts over 18 hours of projection and luxurious trail.',
    category: 'Beauty & Fragrance',
    priceRwf: 65000,
    originalPriceRwf: 80000,
    stock: 40,
    images: ['/src/assets/images/product_beauty_perfume_1790926895803.jpg'],
    rating: 4.9,
    reviewsCount: 51,
    featured: true,
    specs: {
      'Concentration': 'Eau De Parfum (25% Oil Essence)',
      'Volume': '100ml / 3.4 fl oz',
      'Origin': 'Artisanal Blend',
      'Longevity': '18+ Hours'
    },
    status: 'active',
    createdAt: new Date(Date.now() - 8 * 86400000).toISOString()
  }
];

const initialOrders = [
  {
    id: 'ord-555-101',
    orderNumber: 'CLM-555-1001',
    customerId: 'usr-customer-1',
    customerName: 'Clement Ishimwe',
    customerEmail: 'ishimweclement537@gmail.com',
    customerPhone: '0798010110',
    deliveryAddress: {
      fullName: 'Clement Ishimwe',
      phone: '0798010110',
      cityProvince: 'Kigali City',
      district: 'Gasabo',
      streetAddress: 'KG 9 Ave, Kimihurura, House 24',
      deliveryNotes: 'Call upon arrival at the gate.'
    },
    deliveryZone: {
      id: 'kigali-urban',
      name: 'Kigali Urban Delivery',
      description: 'Nyarugenge, Gasabo, and Kicukiro sectors (Standard)',
      feeRwf: 2000,
      estimatedDelivery: 'Same Day / 24 Hours'
    },
    items: [
      {
        productId: 'prod-sneakers-2',
        productName: 'CLEAR 555 Apex Edition Lifestyle Sneakers',
        shopId: 'shop-fashion-2',
        shopName: '555 Luxury Streetwear & Kicks',
        priceRwf: 58000,
        quantity: 1,
        image: '/src/assets/images/product_designer_sneakers_1790926873469.jpg'
      }
    ],
    subtotalRwf: 58000,
    deliveryFeeRwf: 2000,
    totalRwf: 60000,
    displayCurrency: 'RWF',
    displayTotal: 60000,
    paymentMethod: 'mtn_momo',
    paymentStatus: 'verified',
    momoDetails: {
      code: '*182*8*1*2262742*60000#',
      customerMomoPhone: '0798010110',
      transactionRef: 'MTN-TX-89241512',
      submittedAt: new Date(Date.now() - 24 * 3600000).toISOString(),
      verifiedAt: new Date(Date.now() - 23 * 3600000).toISOString(),
      verifiedBy: 'Clear Mall 555 Director'
    },
    orderStatus: 'shipped',
    timeline: [
      {
        status: 'pending_payment',
        label: 'Order Placed & MTN MoMo Code Generated',
        timestamp: new Date(Date.now() - 24 * 3600000).toISOString(),
        note: 'USSD *182*8*1*2262742*60000# prepared for customer'
      },
      {
        status: 'payment_submitted',
        label: 'MTN Payment Proof Received',
        timestamp: new Date(Date.now() - 23.5 * 3600000).toISOString(),
        note: 'Customer submitted MTN Ref: MTN-TX-89241512'
      },
      {
        status: 'processing',
        label: 'Payment Verified & Order Processing',
        timestamp: new Date(Date.now() - 23 * 3600000).toISOString(),
        note: 'Payment verified with MTN merchant account 2262742'
      },
      {
        status: 'shipped',
        label: 'Dispatched with Clear Mall Courier',
        timestamp: new Date(Date.now() - 4 * 3600000).toISOString(),
        note: 'Courier en route to Gasabo'
      }
    ],
    createdAt: new Date(Date.now() - 24 * 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 3600000).toISOString()
  }
];

function getDB() {
  if (!fs.existsSync(DB_FILE)) {
    const freshData = {
      settings: initialSettings,
      users: initialUsers,
      shops: initialShops,
      products: initialProducts,
      orders: initialOrders
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(freshData, null, 2), 'utf-8');
    return freshData;
  }
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading db.json, returning backup state:', err);
    return {
      settings: initialSettings,
      users: initialUsers,
      shops: initialShops,
      products: initialProducts,
      orders: initialOrders
    };
  }
}

function saveDB(data: any) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// -------------------------------------------------------------
// API ENDPOINTS
// -------------------------------------------------------------

// Settings
app.get('/api/settings', (req: Request, res: Response) => {
  const db = getDB();
  res.json({ success: true, settings: db.settings });
});

app.put('/api/settings', (req: Request, res: Response) => {
  const db = getDB();
  const newSettings = req.body;
  db.settings = { ...db.settings, ...newSettings };
  saveDB(db);
  res.json({ success: true, settings: db.settings });
});

// Authentication
app.post('/api/auth/register', (req: Request, res: Response) => {
  const { name, email, phone, role = 'customer', shopName, shopDescription } = req.body;
  if (!name || !email || !phone) {
    return res.status(400).json({ success: false, message: 'Name, email, and phone are required.' });
  }

  const db = getDB();
  const existing = db.users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
  }

  const userId = 'usr-' + Date.now();
  let createdShop = null;

  if (role === 'seller' && shopName) {
    const shopId = 'shop-' + Date.now();
    createdShop = {
      id: shopId,
      ownerId: userId,
      ownerName: name,
      name: shopName,
      slug: shopName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: shopDescription || `Welcome to ${shopName} at CLEAR MALL 555`,
      logo: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=200&q=80',
      banner: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
      phone: phone,
      address: 'CLEAR MALL 555, Retail Wing, Kigali',
      rating: 5.0,
      totalSales: 0,
      commissionRate: db.settings.defaultCommissionPercent || 5,
      status: 'active',
      createdAt: new Date().toISOString()
    };
    db.shops.push(createdShop);
  }

  const newUser = {
    id: userId,
    name,
    email,
    phone,
    role,
    shopId: createdShop ? createdShop.id : undefined,
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);
  saveDB(db);

  res.json({ success: true, user: newUser, shop: createdShop });
});

app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required.' });
  }

  const db = getDB();
  const user = db.users.find((u: any) => u.email.toLowerCase() === email.toLowerCase().trim());
  if (!user) {
    return res.status(404).json({ success: false, message: 'Account not found. Please register.' });
  }

  const shop = user.shopId ? db.shops.find((s: any) => s.id === user.shopId) : null;
  res.json({ success: true, user, shop });
});

// Users management (Admin)
app.get('/api/users', (req: Request, res: Response) => {
  const db = getDB();
  res.json({ success: true, users: db.users });
});

app.put('/api/users/:id/role', (req: Request, res: Response) => {
  const { role } = req.body;
  const db = getDB();
  const user = db.users.find((u: any) => u.id === req.params.id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  user.role = role;
  saveDB(db);
  res.json({ success: true, user });
});

// Shops
app.get('/api/shops', (req: Request, res: Response) => {
  const db = getDB();
  res.json({ success: true, shops: db.shops });
});

app.get('/api/shops/:id', (req: Request, res: Response) => {
  const db = getDB();
  const shop = db.shops.find((s: any) => s.id === req.params.id || s.slug === req.params.id);
  if (!shop) {
    return res.status(404).json({ success: false, message: 'Shop not found' });
  }
  const products = db.products.filter((p: any) => p.shopId === shop.id);
  res.json({ success: true, shop, products });
});

app.post('/api/shops', (req: Request, res: Response) => {
  const { ownerId, ownerName, name, description, phone, address, logo, banner, commissionRate } = req.body;
  if (!name || !ownerId) {
    return res.status(400).json({ success: false, message: 'Shop name and owner ID are required.' });
  }

  const db = getDB();
  const shopId = 'shop-' + Date.now();
  const newShop = {
    id: shopId,
    ownerId,
    ownerName: ownerName || 'Seller',
    name,
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    description: description || '',
    logo: logo || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=200&q=80',
    banner: banner || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
    phone: phone || '',
    address: address || 'CLEAR MALL 555, Kigali',
    rating: 5.0,
    totalSales: 0,
    commissionRate: commissionRate !== undefined ? Number(commissionRate) : (db.settings.defaultCommissionPercent || 5),
    status: 'active',
    createdAt: new Date().toISOString()
  };

  db.shops.push(newShop);

  // Link to user if seller
  const user = db.users.find((u: any) => u.id === ownerId);
  if (user) {
    user.shopId = shopId;
    user.role = user.role === 'admin' ? 'admin' : 'seller';
  }

  saveDB(db);
  res.json({ success: true, shop: newShop });
});

app.put('/api/shops/:id', (req: Request, res: Response) => {
  const db = getDB();
  const index = db.shops.findIndex((s: any) => s.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Shop not found' });
  }

  db.shops[index] = { ...db.shops[index], ...req.body };
  saveDB(db);
  res.json({ success: true, shop: db.shops[index] });
});

// Products
app.get('/api/products', (req: Request, res: Response) => {
  const db = getDB();
  let list = db.products.filter((p: any) => p.status !== 'archived');

  const { shopId, category, search, featured } = req.query;
  if (shopId) {
    list = list.filter((p: any) => p.shopId === shopId);
  }
  if (category && category !== 'All') {
    list = list.filter((p: any) => p.category.toLowerCase() === String(category).toLowerCase());
  }
  if (featured === 'true') {
    list = list.filter((p: any) => p.featured);
  }
  if (search) {
    const q = String(search).toLowerCase();
    list = list.filter((p: any) =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.shopName.toLowerCase().includes(q)
    );
  }

  res.json({ success: true, products: list });
});

app.get('/api/products/:id', (req: Request, res: Response) => {
  const db = getDB();
  const product = db.products.find((p: any) => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  res.json({ success: true, product });
});

// Upload media directly from phone gallery or camera
app.post('/api/upload', (req: Request, res: Response) => {
  const { dataUrl, filename, type } = req.body;
  if (!dataUrl) {
    return res.status(400).json({ success: false, message: 'Media dataUrl is required.' });
  }

  try {
    const matches = dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      // If it's already a URL, return it directly
      if (dataUrl.startsWith('http://') || dataUrl.startsWith('https://') || dataUrl.startsWith('/')) {
        return res.json({ success: true, url: dataUrl });
      }
      return res.status(400).json({ success: false, message: 'Invalid data URL format.' });
    }

    const mimeType = matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, 'base64');

    const ext = mimeType.includes('video') ? 'mp4' : mimeType.includes('png') ? 'png' : mimeType.includes('webp') ? 'webp' : 'jpg';
    const cleanName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
    const filePath = path.join(UPLOADS_DIR, cleanName);

    fs.writeFileSync(filePath, buffer);
    const mediaUrl = `/uploads/${cleanName}`;

    res.json({
      success: true,
      url: mediaUrl,
      mediaType: mimeType.includes('video') ? 'video' : 'image'
    });
  } catch (err: any) {
    console.error('File upload error:', err);
    res.status(500).json({ success: false, message: 'Failed to save media file.' });
  }
});

// Create product (supports images & video directly uploaded)
app.post('/api/products', (req: Request, res: Response) => {
  const {
    shopId,
    name,
    description,
    category,
    priceRwf,
    originalPriceRwf,
    stock = 10,
    images = [],
    videoUrl,
    specs = {},
    featured = false
  } = req.body;

  if (!shopId || !name || priceRwf === undefined) {
    return res.status(400).json({ success: false, message: 'shopId, product name, and price are required.' });
  }

  const db = getDB();
  const shop = db.shops.find((s: any) => s.id === shopId);
  const shopName = shop ? shop.name : 'Clear Mall Vendor';

  const newProd = {
    id: 'prod-' + Date.now(),
    shopId,
    shopName,
    name,
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    description: description || '',
    category: category || 'General Merchandise',
    priceRwf: Number(priceRwf),
    originalPriceRwf: originalPriceRwf ? Number(originalPriceRwf) : undefined,
    stock: Number(stock),
    images: Array.isArray(images) && images.length > 0 ? images : ['/src/assets/images/product_smartphone_flagship_1790926862084.jpg'],
    videoUrl: videoUrl || undefined,
    rating: 5.0,
    reviewsCount: 1,
    featured: Boolean(featured),
    specs: specs || {},
    status: 'active',
    createdAt: new Date().toISOString()
  };

  db.products.unshift(newProd);
  saveDB(db);

  res.json({ success: true, product: newProd });
});

app.put('/api/products/:id', (req: Request, res: Response) => {
  const db = getDB();
  const index = db.products.findIndex((p: any) => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  db.products[index] = {
    ...db.products[index],
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  saveDB(db);

  res.json({ success: true, product: db.products[index] });
});

app.delete('/api/products/:id', (req: Request, res: Response) => {
  const db = getDB();
  const index = db.products.findIndex((p: any) => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  // Soft delete / archive
  db.products[index].status = 'archived';
  saveDB(db);

  res.json({ success: true, message: 'Product archived successfully' });
});

// Orders
app.get('/api/orders', (req: Request, res: Response) => {
  const db = getDB();
  const { customerId, shopId, status } = req.query;

  let orders = [...db.orders];

  if (customerId) {
    orders = orders.filter((o: any) => o.customerId === customerId);
  }

  if (shopId) {
    orders = orders.filter((o: any) => o.items.some((item: any) => item.shopId === shopId));
  }

  if (status && status !== 'all') {
    orders = orders.filter((o: any) => o.orderStatus === status);
  }

  orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  res.json({ success: true, orders });
});

app.get('/api/orders/:id', (req: Request, res: Response) => {
  const db = getDB();
  const order = db.orders.find((o: any) => o.id === req.params.id || o.orderNumber === req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }
  res.json({ success: true, order });
});

app.post('/api/orders', (req: Request, res: Response) => {
  const {
    customerId,
    customerName,
    customerEmail,
    customerPhone,
    deliveryAddress,
    deliveryZone,
    items,
    displayCurrency = 'RWF'
  } = req.body;

  if (!items || !items.length || !deliveryAddress || !customerPhone) {
    return res.status(400).json({ success: false, message: 'Items, delivery address, and customer phone are required.' });
  }

  const db = getDB();

  // Calculate subtotal
  const subtotalRwf = items.reduce((sum: number, it: any) => sum + (Number(it.priceRwf) * Number(it.quantity)), 0);
  const deliveryFeeRwf = deliveryZone && deliveryZone.feeRwf !== undefined ? Number(deliveryZone.feeRwf) : 2000;
  const totalRwf = subtotalRwf + deliveryFeeRwf;

  // Currency rate conversion
  const rate = db.settings.currencies.rates[displayCurrency] || 1;
  const displayTotal = displayCurrency === 'RWF' ? totalRwf : Number((totalRwf * rate).toFixed(2));

  // Generate MTN MoMo USSD Code replacing AMOUNT with actual totalRwf
  // Template: *182*8*1*2262742*AMOUNT#
  const mtnCode = db.settings.mtnPaymentCodeTemplate.replace('AMOUNT', String(totalRwf));

  const orderNum = 'CLM-555-' + Math.floor(1000 + Math.random() * 9000);
  const orderId = 'ord-' + Date.now();

  const newOrder = {
    id: orderId,
    orderNumber: orderNum,
    customerId: customerId || 'guest-' + Date.now(),
    customerName: customerName || deliveryAddress.fullName || 'Customer',
    customerEmail: customerEmail || 'customer@clearmall.com',
    customerPhone: customerPhone || deliveryAddress.phone,
    deliveryAddress,
    deliveryZone: deliveryZone || db.settings.deliveryZones[0],
    items,
    subtotalRwf,
    deliveryFeeRwf,
    totalRwf,
    displayCurrency,
    displayTotal,
    paymentMethod: 'mtn_momo',
    paymentStatus: 'unpaid',
    momoDetails: {
      code: mtnCode,
      notes: `Dial ${mtnCode} to complete payment to merchant 2262742`
    },
    orderStatus: 'pending_payment',
    timeline: [
      {
        status: 'pending_payment',
        label: 'Order Created & MTN MoMo Code Ready',
        timestamp: new Date().toISOString(),
        note: `USSD code ${mtnCode} generated for total ${totalRwf.toLocaleString()} RWF`
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.orders.unshift(newOrder);

  // Update shop total sales and product stock
  items.forEach((it: any) => {
    const prod = db.products.find((p: any) => p.id === it.productId);
    if (prod && prod.stock >= it.quantity) {
      prod.stock -= it.quantity;
    }
  });

  saveDB(db);
  res.json({ success: true, order: newOrder, ussdCode: mtnCode });
});

// Customer submits MTN MoMo payment proof (Transaction ID / Reference)
app.post('/api/orders/:id/momo-payment', (req: Request, res: Response) => {
  const { customerMomoPhone, transactionRef, receiptProofUrl } = req.body;
  const db = getDB();
  const order = db.orders.find((o: any) => o.id === req.params.id);

  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  order.paymentStatus = 'verification_pending';
  order.orderStatus = 'payment_submitted';
  order.momoDetails = {
    ...order.momoDetails,
    customerMomoPhone,
    transactionRef: transactionRef || 'REF-' + Date.now(),
    receiptProofUrl,
    submittedAt: new Date().toISOString()
  };

  order.timeline.push({
    status: 'payment_submitted',
    label: 'MTN Mobile Money Payment Submitted',
    timestamp: new Date().toISOString(),
    note: `Sender Phone: ${customerMomoPhone || 'N/A'}, MTN Ref: ${transactionRef || 'Provided'}`
  });

  order.updatedAt = new Date().toISOString();
  saveDB(db);

  res.json({ success: true, order });
});

// Admin or Seller verifies MTN Payment
app.post('/api/orders/:id/verify-payment', (req: Request, res: Response) => {
  const { verifiedBy = 'CLEAR MALL 555 Admin', approve = true, rejectionReason } = req.body;
  const db = getDB();
  const order = db.orders.find((o: any) => o.id === req.params.id);

  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  if (approve) {
    order.paymentStatus = 'verified';
    order.orderStatus = 'processing';
    order.momoDetails = {
      ...order.momoDetails,
      verifiedAt: new Date().toISOString(),
      verifiedBy
    };
    order.timeline.push({
      status: 'processing',
      label: 'Payment Verified by Clear Mall 555',
      timestamp: new Date().toISOString(),
      note: `Verified by ${verifiedBy}. Order sent to shop dispatch.`
    });

    // Credit shop sales
    order.items.forEach((item: any) => {
      const shop = db.shops.find((s: any) => s.id === item.shopId);
      if (shop) {
        shop.totalSales = (shop.totalSales || 0) + 1;
      }
    });
  } else {
    order.paymentStatus = 'failed';
    order.orderStatus = 'pending_payment';
    order.timeline.push({
      status: 'pending_payment',
      label: 'Payment Verification Unsuccessful',
      timestamp: new Date().toISOString(),
      note: rejectionReason || 'MTN transaction ID could not be reconciled. Please recheck or contact 0798010110.'
    });
  }

  order.updatedAt = new Date().toISOString();
  saveDB(db);

  res.json({ success: true, order });
});

// Update order status (shipped, out_for_delivery, delivered, cancelled)
app.put('/api/orders/:id/status', (req: Request, res: Response) => {
  const { status, note, courierName, trackingNumber } = req.body;
  const db = getDB();
  const order = db.orders.find((o: any) => o.id === req.params.id);

  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  order.orderStatus = status;

  const statusLabels: Record<string, string> = {
    pending_payment: 'Payment Pending',
    payment_submitted: 'Payment Submitted',
    processing: 'Order Processing',
    shipped: 'Order Shipped / En Route',
    out_for_delivery: 'Out for Immediate Delivery',
    delivered: 'Delivered Successfully',
    cancelled: 'Order Cancelled'
  };

  order.timeline.push({
    status,
    label: statusLabels[status] || status,
    timestamp: new Date().toISOString(),
    note: note || (courierName ? `Courier: ${courierName}, Tracking: ${trackingNumber || 'Active'}` : undefined)
  });

  order.updatedAt = new Date().toISOString();
  saveDB(db);

  res.json({ success: true, order });
});

// Admin Analytics & Mall Stats
app.get('/api/analytics', (req: Request, res: Response) => {
  const db = getDB();

  const totalOrders = db.orders.length;
  const verifiedOrders = db.orders.filter((o: any) => o.paymentStatus === 'verified');
  const totalVolumeRwf = verifiedOrders.reduce((sum: number, o: any) => sum + Number(o.totalRwf), 0);

  // Mall commissions (default 5%)
  const mallCommissionRwf = verifiedOrders.reduce((sum: number, o: any) => {
    const commission = (Number(o.subtotalRwf) * (db.settings.defaultCommissionPercent || 5)) / 100;
    return sum + commission;
  }, 0);

  const pendingVerificationCount = db.orders.filter((o: any) => o.paymentStatus === 'verification_pending').length;

  res.json({
    success: true,
    stats: {
      totalVolumeRwf,
      mallCommissionRwf,
      totalOrders,
      pendingVerificationCount,
      totalShops: db.shops.length,
      totalProducts: db.products.filter((p: any) => p.status === 'active').length,
      totalUsers: db.users.length
    }
  });
});

// Mount Vite or serve static
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CLEAR MALL 555 server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
