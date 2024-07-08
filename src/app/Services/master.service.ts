import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MasterService {

  private apiUrl = 'http://xoooo.runasp.net/api/';
  private checkNameUrl = 'http://xoooo.runasp.net/api/Device/checkName/';


  constructor(private http: HttpClient) { }

  addDevice(deviceData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}Device/Add`, deviceData);
  }
  
  getAllDevices(): Observable<any> {
    return this.http.get(`${this.apiUrl}Device/all`);
  }

  getDeviceById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}Device/GetById/${id}`);
  }

  updateDevice(device: any): Observable<any> {
    return this.http.put(`${this.apiUrl}Device/Update`, device);
  }

  getLastCode(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}Device/GetLastCode`);
  }

  checkNameExists(id: number, name: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.checkNameUrl}?Id=${id}&Name=${encodeURIComponent(name)}`);
  }

  deleteDevice(deviceId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}Device/Delete?id=${deviceId}`);
  }
}
