import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

// Define the interfaces for InventoryItem and StockMovement
export interface InventoryItem {
  id: number;
  name: string;
  quantity: number;
  threshold: number;
}

export interface StockMovement {
  itemId: number;
  type: 'inbound' | 'outbound'; // Stock movement type
  quantity: number;
  date: string; // Date of the movement
}

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  // Sample initial data for inventory
  private inventory: InventoryItem[] = [
    { id: 1, name: 'Item A', quantity: 5, threshold: 3 },
    { id: 2, name: 'Item B', quantity: 8, threshold: 2 }
  ];

  // Observable to emit inventory changes
  private inventorySubject = new BehaviorSubject<InventoryItem[]>(this.inventory);
  inventory$ = this.inventorySubject.asObservable();

  // Sample initial data for stock movements
  private stockMovements: StockMovement[] = [];
  private stockMovementsSubject = new BehaviorSubject<StockMovement[]>(this.stockMovements);
  stockMovements$ = this.stockMovementsSubject.asObservable();

  constructor() {}

  // Get all inventory items
  getInventory(): Observable<InventoryItem[]> {
    return this.inventory$;
  }

  // Get all stock movements
  getStockMovements(): Observable<StockMovement[]> {
    return this.stockMovements$;
  }

  // Add a new inventory item
  addItem(item: InventoryItem): Observable<void> {
    this.inventory.push(item);
    this.inventorySubject.next(this.inventory); // Emit new inventory list

    // Create a new stock movement for the added item
    const movement: StockMovement = {
      itemId: item.id,
      type: 'inbound', // Add stock movement type
      quantity: item.quantity,
      date: new Date().toISOString()
    };
    this.stockMovements.push(movement);
    this.stockMovementsSubject.next(this.stockMovements); // Emit updated stock movements

    return of(); // Return an observable for completion
  }

  // Edit an existing inventory item
  editItem(updatedItem: InventoryItem): Observable<void> {
    const index = this.inventory.findIndex(item => item.id === updatedItem.id);
    if (index !== -1) {
      this.inventory[index] = updatedItem;
      this.inventorySubject.next(this.inventory); // Emit updated inventory list

      // Create a stock movement for the update
      const movement: StockMovement = {
        itemId: updatedItem.id,
        type: 'outbound', // Outbound stock movement when updating the item
        quantity: updatedItem.quantity,
        date: new Date().toISOString()
      };
      this.stockMovements.push(movement);
      this.stockMovementsSubject.next(this.stockMovements); // Emit updated stock movements
    }

    return of(); // Return an observable for completion
  }

  // Delete an inventory item
  deleteItem(itemId: number): Observable<void> {
    this.inventory = this.inventory.filter(item => item.id !== itemId); // Remove item from inventory
    this.inventorySubject.next(this.inventory); // Emit updated inventory list

    // Create a stock movement for the deletion
    const movement: StockMovement = {
      itemId: itemId,
      type: 'outbound', // Deletion treated as outbound movement
      quantity: 0, // No quantity for deletions
      date: new Date().toISOString()
    };
    this.stockMovements.push(movement);
    this.stockMovementsSubject.next(this.stockMovements); // Emit updated stock movements

    return of(); // Return an observable for completion
  }

  // Add a stock movement (for inbound or outbound)
  addStockMovement(movement: StockMovement): Observable<void> {
    this.stockMovements.push(movement); // Add new movement
    this.stockMovementsSubject.next(this.stockMovements); // Emit updated stock movements
    return of(); // Return an observable for completion
  }
}
