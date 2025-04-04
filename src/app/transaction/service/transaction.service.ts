import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Transaction } from '../transcation.types';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient) {}

  processTransaction(
    apiKey: string,
    aiModel: string,
    statements: File[],
    vendorFile: File,
  ): Observable<Transaction[]> {
    const formData = new FormData();

    statements.forEach((statement) => formData.append('statements', statement));

    formData.append('vendor_file', vendorFile);

    formData.append('ai_model', aiModel);
    formData.append('api_key', apiKey);
    return this.httpClient.post<Transaction[]>(
      `${this.apiUrl}/process`,
      formData,
    );
  }

  getSampleResponse(): Observable<Transaction[]> {
    return this.httpClient.get<Transaction[]>('assets/sample-response.json');
  }
}
