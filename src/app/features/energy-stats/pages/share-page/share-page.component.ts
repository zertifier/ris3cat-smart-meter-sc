import { Component } from '@angular/core';
import {NavbarComponent} from "../../../../shared/components/navbar/navbar.component";

export enum EnergyPrice {
  COMMUNITY = "COMMUNITY",
  FREE = "FREE"
}

export interface User {
  id: string;
  name: string;
  email: string;
  price: EnergyPrice
}

@Component({
  selector: 'app-share-page',
  standalone: true,
  imports: [
    NavbarComponent
  ],
  templateUrl: './share-page.component.html',
  styleUrl: './share-page.component.scss'
})
export class SharePageComponent {
  sharingUsers: User[] = [
    {
      price: EnergyPrice.COMMUNITY,
      email: 'jdavid@zertifier.com',
      name: 'jose david',
      id: 'asldjf;aslkdj'
    },
    {
      price: EnergyPrice.COMMUNITY,
      email: 'jdavid@zertifier.com',
      name: 'jose david',
      id: 'aasldjf;aslkdj'
    }
  ];
  protected readonly EnergyPrice = EnergyPrice;
}
