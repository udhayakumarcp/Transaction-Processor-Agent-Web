import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient) {}

  processTransaction(
    apiKey: string,
    aiModel: string,
    statements: File,
    vendorFile: File,
  ) {
    const formData = new FormData();
    formData.append('statements', statements);
    formData.append('vendor_file', vendorFile);

    formData.append('ai_model', aiModel);
    formData.append('api_key', apiKey);
    return this.httpClient.post(`${this.apiUrl}/process`, formData);
  }
}
