import { Component } from '@angular/core';
import { TransactionComponent } from './transaction/component/transaction.component';

@Component({
  selector: 'app-root',
  imports: [TransactionComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
