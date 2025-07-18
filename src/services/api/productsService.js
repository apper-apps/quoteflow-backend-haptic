import productsData from "@/services/mockData/products.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const productsService = {
  async getAll() {
    await delay(300);
    return [...productsData];
  },

  async getById(id) {
    await delay(200);
    const product = productsData.find(p => p.Id === parseInt(id));
    if (!product) {
      throw new Error("Product not found");
    }
    return { ...product };
  },

  async create(productData) {
    await delay(500);
    const newProduct = {
      ...productData,
      Id: Math.max(...productsData.map(p => p.Id)) + 1
    };
    productsData.push(newProduct);
    return { ...newProduct };
  },

  async update(id, updateData) {
    await delay(400);
    const index = productsData.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Product not found");
    }
    
    productsData[index] = { ...productsData[index], ...updateData };
    return { ...productsData[index] };
  },

  async delete(id) {
    await delay(300);
    const index = productsData.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Product not found");
    }
    
    const deletedProduct = productsData.splice(index, 1)[0];
    return { ...deletedProduct };
  }
};