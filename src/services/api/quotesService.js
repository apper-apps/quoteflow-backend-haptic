import quotesData from "@/services/mockData/quotes.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const quotesService = {
  async getAll() {
    await delay(400);
    return [...quotesData];
  },

  async getById(id) {
    await delay(250);
    const quote = quotesData.find(q => q.Id === parseInt(id));
    if (!quote) {
      throw new Error("Quote not found");
    }
    return { ...quote };
  },

  async create(quoteData) {
    await delay(600);
    const newQuote = {
      ...quoteData,
      Id: Math.max(...quotesData.map(q => q.Id)) + 1,
      createdAt: new Date().toISOString()
    };
    quotesData.push(newQuote);
    return { ...newQuote };
  },

  async update(id, updateData) {
    await delay(500);
    const index = quotesData.findIndex(q => q.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Quote not found");
    }
    
    quotesData[index] = { ...quotesData[index], ...updateData };
    return { ...quotesData[index] };
  },

  async delete(id) {
    await delay(400);
    const index = quotesData.findIndex(q => q.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Quote not found");
    }
    
    const deletedQuote = quotesData.splice(index, 1)[0];
    return { ...deletedQuote };
  }
};