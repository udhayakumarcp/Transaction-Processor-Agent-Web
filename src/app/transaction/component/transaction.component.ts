import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TransactionService } from '../transaction.service';

@Component({
  selector: 'app-transaction',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transaction.component.html',
  styleUrl: './transaction.component.scss',
})
export class TransactionComponent {
  selectedModel: string = 'Gemini';
  apiKey: string = '';
  transactionFile: File | null = null;
  vendorFile: File | null = null;

  constructor(private transactionService: TransactionService) {}

  onFileChange(event: Event, fileType: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      if (fileType === 'transaction') {
        this.transactionFile = input.files[0];
      } else if (fileType === 'vendor') {
        this.vendorFile = input.files[0];
      }
    }
  }

  onSubmit(): void {
    if (this.transactionFile && this.vendorFile) {
      this.transactionService
        .processTransaction(
          this.apiKey,
          this.selectedModel,
          this.transactionFile,
          this.vendorFile,
        )
        .subscribe({
          next: () => {},
          error: (error) => {
            console.log('error', error);
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
