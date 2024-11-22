import { Component } from '@angular/core';
// Import the component(s) from your inventory-core library
import { InventoryDashboardComponent } from '../../../inventory-core/src/public-api';  // Adjust the path as needed

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,  // Mark this component as standalone
  imports: [InventoryDashboardComponent]  // Import components you want to use in this component
})
export class AppComponent {
  title = 'Inventory Tracking System';  // Set the title of the app
}
