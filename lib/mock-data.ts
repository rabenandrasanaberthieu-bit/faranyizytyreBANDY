// Mock data for demonstration purposes
export const DEMO_ACCOUNTS = {
  admin: {
    id: "admin-001",
    username: "admin",
    password: "admin123",
    email: "admin@computerstore.com",
    role: "admin",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
    lastLogin: new Date().toISOString(),
    mustChangePassword: false,
  },
  stock_manager: {
    id: "stock-001",
    username: "stock",
    password: "stock123",
    email: "stock@computerstore.com",
    role: "stock_manager",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=stock",
    lastLogin: new Date().toISOString(),
    mustChangePassword: false,
  },
  cashier: {
    id: "cashier-001",
    username: "cashier",
    password: "cashier123",
    email: "cashier@computerstore.com",
    role: "cashier",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=cashier",
    lastLogin: new Date().toISOString(),
    mustChangePassword: false,
  },
}

export const DEMO_PRODUCTS = [
  {
    id: "prod-001",
    name: "Laptop Dell XPS 13",
    category: "Laptops",
    price: 1299.99,
    stock: 15,
    description: "High-performance ultrabook",
  },
  {
    id: "prod-002",
    name: "Monitor LG 27 inch",
    category: "Monitors",
    price: 349.99,
    stock: 32,
    description: "4K UHD Display",
  },
  {
    id: "prod-003",
    name: "Keyboard Mechanical RGB",
    category: "Peripherals",
    price: 129.99,
    stock: 48,
    description: "Cherry MX switches",
  },
  {
    id: "prod-004",
    name: "Mouse Logitech MX Master",
    category: "Peripherals",
    price: 99.99,
    stock: 56,
    description: "Wireless precision mouse",
  },
  {
    id: "prod-005",
    name: "GPU RTX 4080",
    category: "Components",
    price: 1199.99,
    stock: 8,
    description: "High-end graphics card",
  },
]

export const DEMO_SALES = [
  {
    id: "sale-001",
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    total: 1429.98,
    items: 2,
    cashier: "cashier",
  },
  {
    id: "sale-002",
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    total: 349.99,
    items: 1,
    cashier: "cashier",
  },
  {
    id: "sale-003",
    date: new Date().toISOString(),
    total: 229.98,
    items: 2,
    cashier: "cashier",
  },
]
