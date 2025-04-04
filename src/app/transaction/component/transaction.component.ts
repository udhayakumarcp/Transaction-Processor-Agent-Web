import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AgGridAngular } from 'ag-grid-angular';
import type { ColDef, GridReadyEvent } from 'ag-grid-community';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { TransactionService } from '../service/transaction.service';
import { Transaction } from '../transcation.types';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-transaction',
  standalone: true,
  imports: [CommonModule, FormsModule, AgGridAngular],
  templateUrl: './transaction.component.html',
  styleUrl: './transaction.component.scss',
})
export class TransactionComponent {
  loading = false;
  selectedModel: string = 'Gemini';
  apiKey: string = '';
  transactionFile: File[] | null = null;
  vendorFile: File | null = null;
  transactions: Transaction[] = [];

  // private gridApi: GridApi<any>;

  readonly defaultColDef: ColDef = {
    flex: 1,
  };

  readonly colDefs: ColDef<Transaction>[] = [
    { field: 'Date' },
    { field: 'Description' },
    { field: 'Deposits_Credits', headerName: 'Deposits Credits' },
    { field: 'Withdrawals_Debits', headerName: 'Withdrawals Debits' },
    { field: 'Vendor Name' },
  ];

  constructor(private transactionService: TransactionService) {}

  onFileChange(event: Event, fileType: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      if (fileType === 'transaction') {
        this.transactionFile = Array.from(input.files);
      } else if (fileType === 'vendor') {
        this.vendorFile = input.files[0];
      }
    }
  }

  onSubmit(): void {
    if (this.transactionFile && this.vendorFile) {
      this.loading = true;
      this.transactionService
        .processTransaction(
          this.apiKey,
          this.selectedModel,
          this.transactionFile,
          this.vendorFile,
        )
        // .getSampleResponse()
        .subscribe({
          next: (data) => {
            this.loading = false;
            this.transactions = data;
          },
          error: (error) => {
            this.loading = false;
            console.log('error', error.error);
          },
        });
    }

    // if (this.vendorFile) {
    //   this.getVendorList(this.vendorFile);
    // }
    // if (this.transactionFile) {
    //   this.parsePDf(this.transactionFile);
    // }
  }

  onGridReady(event: GridReadyEvent) {
    console.log(event);
    // this.gridApi = event.api;
  }

  // getVendorList(file: File) {
  //   const fileName = file.name.toLowerCase();

  //   const reader = new FileReader();

  //   reader.onload = () => {
  //     const data = reader.result;
  //     if (fileName.endsWith('.csv')) {
  //       // this.parseCSV(data as string);
  //     } else if (
  //       data &&
  //       (fileName.endsWith('.xls') || fileName.endsWith('.xlsx'))
  //     ) {
  //       this.parseExcel(data);
  //     } else {
  //       console.error(
  //         'Invalid file format. Please upload a CSV or Excel file.',
  //       );
  //     }
  //   };

  //   if (fileName.endsWith('.csv')) {
  //     reader.readAsText(file);
  //   } else {
  //     reader.readAsArrayBuffer(file);
  //   }
  // }

  // private parseExcel(data: ArrayBuffer | string): void {
  //   const workbook = XLSX.read(data, { type: 'array' });
  //   const sheetName = workbook.SheetNames[0];
  //   const sheet = workbook.Sheets[sheetName];
  //   const jsonData = XLSX.utils.sheet_to_json(sheet);

  //   const vendorList = jsonData.map((row: any) => row['Payee']).filter(Boolean);
  //   console.log(vendorList);
  // }

  // private parsePDf(file: File) {
  //   console.log('Parsing the PDF');
  //   this.pdfService
  //     .extractTextFromPDF(file)
  //     .then((textPages) => {
  //       // this.extractedText = textPages;
  //       console.log('Extracted text:', textPages);
  //     })
  //     .catch((error) => console.error('Error extracting text:', error));
  // }
}
