export interface InventoryItem {
    id: number;
    name: string;
    quantity: number;
    threshold: number;
    status: 'in-stock' | 'low-stock' | 'out-of-stock';
  }
  