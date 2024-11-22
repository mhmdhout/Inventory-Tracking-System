export interface StockMovement {
    itemId: number;
    type: 'inbound' | 'outbound';
    quantity: number;
    date: string;
  }
  