import { Component, OnInit } from '@angular/core';
import { MasterService } from 'src/app/Services/master.service';

@Component({
  selector: 'app-project-management',
  templateUrl: './project-management.component.html',
  styleUrls: ['./project-management.component.css']
})
export class ProjectManagementComponent implements OnInit {

  plusChecked: boolean = false;
  multiChecked: boolean = false;
  singleChecked: boolean = false;

  name: string = '';
  price: string = '';
  time: string = '';
  deviceID: string = '';

  singleValue: number = 0;
  multiValue: number = 0;
  plusValue: number = 0;

  devices: any[] = [];
  selectedDevice: any = null;

  nameExistsError: boolean = false;

  constructor(private service: MasterService) { }

  ngOnInit(): void {
    this.fetchDevices();
  }

  DeviceType(): number {
    if (this.singleChecked) {
      return 1;
    }
    if (this.multiChecked) {
      return 2;
    }
    if (this.plusChecked) {
      return 3;
    }
    return 0;
  }

  checkAndAddDevice() {
    const id = this.selectedDevice ? this.selectedDevice.deviceID : 0; 
    this.service.checkNameExists(id, this.name).subscribe(nameExists => {
      if (nameExists) {
        this.nameExistsError = true;
      } else {
        this.nameExistsError = false;
        this.addDevice();
      }
    }, error => {
      console.error('Error checking name existence', error);
    });
  }

  addDevice() {
    if (!this.name || !this.price || !this.time) {
      console.error('Please fill all the required fields');
      return;
    }

    this.service.getLastCode().subscribe(lastCode => {
      const newCode = lastCode + 1;

      let subscriptions = [];

      if (this.singleChecked) {
        subscriptions.push({
          deviceSubscriptionID: 0,
          deviceID: 0,
          deviceSubscribeTypeID: 1,
          additionalPrice: this.singleValue
        });
      }

      if (this.multiChecked) {
        subscriptions.push({
          deviceSubscriptionID: 0,
          deviceID: 0,
          deviceSubscribeTypeID: 2,
          additionalPrice: this.multiValue
        });
      }

      if (this.plusChecked) {
        subscriptions.push({
          deviceSubscriptionID: 0,
          deviceID: 0,
          deviceSubscribeTypeID: 3,
          additionalPrice: this.plusValue
        });
      }

      const device = {
        deviceID: 0, 
        name: this.name,
        deviceType: this.DeviceType(),
        code: newCode,
        price: Number(this.price),
        hours: Number(this.time),
        subscriptions: subscriptions
      };

      this.service.addDevice(device).subscribe(response => {
        console.log('Device added successfully', response);
        this.fetchDevices();
        this.resetForm();
      }, error => {
        console.error('Error adding device', error);
      });
    });
  }

  updateDevice() {
    if (!this.selectedDevice) {
      console.error('No device selected for update');
      return;
    }

    let subscriptions = [];

    if (this.singleChecked) {
      subscriptions.push({
        deviceSubscriptionID: this.selectedDevice.subscriptions.find((sub: any) => sub.deviceSubscribeTypeID === 1)?.deviceSubscriptionID || 0,
        deviceID: this.deviceID,
        deviceSubscribeTypeID: 1,
        additionalPrice: this.singleValue
      });
    }

    if (this.multiChecked) {
      subscriptions.push({
        deviceSubscriptionID: this.selectedDevice.subscriptions.find((sub: any) => sub.deviceSubscribeTypeID === 2)?.deviceSubscriptionID || 0,
        deviceID: this.deviceID,
        deviceSubscribeTypeID: 2,
        additionalPrice: this.multiValue
      });
    }

    if (this.plusChecked) {
      subscriptions.push({
        deviceSubscriptionID: this.selectedDevice.subscriptions.find((sub: any) => sub.deviceSubscribeTypeID === 3)?.deviceSubscriptionID || 0,
        deviceID: this.deviceID,
        deviceSubscribeTypeID: 3,
        additionalPrice: this.plusValue
      });
    }

    const updatedDevice = {
      deviceID: this.deviceID,
      name: this.name,
      deviceType: this.DeviceType(),
      code: this.selectedDevice.code,
      price: Number(this.price),
      hours: Number(this.time),
      subscriptions: subscriptions
    };

    this.service.updateDevice(updatedDevice).subscribe(response => {
      console.log('Updated Device:', updatedDevice);
      console.log('Device updated successfully', response);
      this.fetchDevices();
      this.resetForm();
    }, error => {
      console.error('Error updating device', error);
    });
  }

  fetchDevices() {
    this.service.getAllDevices().subscribe(response => {
      this.devices = response;
    }, error => {
      console.error('Error fetching devices', error);
    });
  }

  onSelectDevice(deviceId: number) {
    this.service.getDeviceById(deviceId).subscribe(response => {
      this.selectedDevice = response;
      this.populateDeviceFields(this.selectedDevice);
    }, error => {
      console.error('Error fetching device data', error);
    });
  }

  populateDeviceFields(device: any) {
    this.name = device.name;
    this.price = device.price;
    this.time = device.hours;
    this.deviceID = device.deviceID;

    const singleSubscription = device.subscriptions.find((sub: any) => sub.deviceSubscribeTypeID === 1);
    const multiSubscription = device.subscriptions.find((sub: any) => sub.deviceSubscribeTypeID === 2);
    const plusSubscription = device.subscriptions.find((sub: any) => sub.deviceSubscribeTypeID === 3);

    this.singleValue = singleSubscription ? singleSubscription.additionalPrice : 0;
    this.multiValue = multiSubscription ? multiSubscription.additionalPrice : 0;
    this.plusValue = plusSubscription ? plusSubscription.additionalPrice : 0;

    this.singleChecked = !!singleSubscription;
    this.multiChecked = !!multiSubscription;
    this.plusChecked = !!plusSubscription;
  }

  resetForm() {
    this.name = '';
    this.price = '';
    this.time = '';
    this.deviceID = '';
    this.singleValue = 0;
    this.multiValue = 0;
    this.plusValue = 0;
    this.singleChecked = false;
    this.multiChecked = false;
    this.plusChecked = false;
    this.selectedDevice = null;
    this.nameExistsError = false;
  }

  FormEmpty(): boolean {
    return !this.name && !this.price && !this.time && !this.singleChecked && !this.multiChecked && !this.plusChecked;
  }

  deleteDevice(deviceId: number) {
    if (confirm('هل أنت متأكد أنك تريد حذف هذا الجهاز؟')) {
      this.service.deleteDevice(deviceId).subscribe(response => {
        console.log('Device deleted successfully', response);
        this.fetchDevices();
        this.resetForm();
      }, error => {
        console.error('Error deleting device', error);
      });
    }
  }

  checkNameExists(name: string): void {
    const id = this.selectedDevice ? this.selectedDevice.deviceID : 0;
    this.service.checkNameExists(id, name).subscribe(nameExists => {
      this.nameExistsError = nameExists;
    }, error => {
      console.error('هذا الاسم موجود مسبقًا، يرجى إدخال اسم آخر.', error);
    });
  }

  resetButton(){
    this.resetForm();
  }
}
