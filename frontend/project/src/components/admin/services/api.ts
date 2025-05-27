import { Product, Order, User } from '../types';

// Simulated API calls with mock data
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Premium Headphones',
    price: 199.99,
    stock: 50,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800'
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  // Add more mock products as needed
];

export const productService = {
  getProducts: async (): Promise<Product[]> => {
    await delay(500);
    return mockProducts;
  },

  createProduct: async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> => {
    await delay(500);
    const newProduct = {
      ...product,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockProducts.push(newProduct);
    return newProduct;
  },

  updateProduct: async (id: string, product: Partial<Product>): Promise<Product> => {
    await delay(500);
    const index = mockProducts.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Product not found');
    
    mockProducts[index] = {
      ...mockProducts[index],
      ...product,
      updatedAt: new Date().toISOString()
    };
    return mockProducts[index];
  },

  deleteProduct: async (id: string): Promise<void> => {
    await delay(500);
    const index = mockProducts.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Product not found');
    mockProducts.splice(index, 1);
  }
};