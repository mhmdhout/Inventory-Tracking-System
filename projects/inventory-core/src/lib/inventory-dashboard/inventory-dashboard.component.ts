import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryService, InventoryItem, StockMovement } from '../inventory.service';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-inventory-dashboard',
  templateUrl: './inventory-dashboard.component.html',
  styleUrls: ['./inventory-dashboard.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule] 
})
export class InventoryDashboardComponent implements OnInit {
  inventory: InventoryItem[] = [];
  totalItems: number = 0;
  lowStockItems: number = 0;
  stockMovements: StockMovement[] = [];
  newMovement: StockMovement = {
    itemId: 0,
    type: 'inbound',  
    quantity: 0,
    date: new Date().toISOString()
  };

  constructor(private inventoryService: InventoryService) {}

  ngOnInit(): void {
    this.inventoryService.getInventory().subscribe((inventory) => {
      this.inventory = inventory;
      this.totalItems = inventory.length;
      this.calculateLowStockItems();
    });
    this.inventoryService.getStockMovements().subscribe((stockMovements) => {
      this.stockMovements = stockMovements;
    });
  }
  addItem() {
    const newItem: InventoryItem = {
      id: this.inventory.length + 1,
      name: 'New Item',
      quantity: 10,
      threshold: 5,
    };

    this.inventoryService.addItem(newItem).subscribe(() => {
      this.calculateLowStockItems();
    });
  }
  editItem(itemId: number) {
    const updatedItem = this.inventory.find((item) => item.id === itemId);
    if (updatedItem) {
      updatedItem.name = 'Updated Item';
      updatedItem.quantity = 4;

      this.inventoryService.editItem(updatedItem).subscribe(() => {
        this.calculateLowStockItems();
      });
    }
  }
  deleteItem(itemId: number) {
    this.inventoryService.deleteItem(itemId).subscribe(() => {
      this.calculateLowStockItems();
    });
  }
  calculateLowStockItems(): void {
    this.lowStockItems = this.inventory.filter(
      (item) => item.quantity <= item.threshold
    ).length;
  }
  recordStockMovement(): void {
    if (this.newMovement.itemId && this.newMovement.quantity > 0) {
      this.inventoryService.addStockMovement(this.newMovement).subscribe(() => {
        this.stockMovements.push(this.newMovement);
        this.newMovement = {
          itemId: 0,
          type: 'inbound',
          quantity: 0,
          date: new Date().toISOString()
        };
      });
    }
  }
}
