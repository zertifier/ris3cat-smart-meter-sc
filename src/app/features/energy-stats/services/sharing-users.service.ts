import {Injectable} from '@angular/core';

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

@Injectable({
  providedIn: 'root'
})
export class SharingUsersService {

  users: User[] = [];
  sharingUsers: User[] = [];
  names = ["Jolie Willshee",
    "Sollie MacMoyer",
    "Riki Quirke",
    "Dorie Arzu",
    "Mikaela Farrimond",
    "Cirillo Beavers",
    "Deana Anthona",
    "Ajay Othick",
    "Ayn Glentworth",
    "Lezlie Antoons",
    "Carmita Domingues",
    "Tamiko Harburtson",
    "Ursola Gwyer",
    "Sharia Rogier",
    "Boyce Rudledge",
    "Abbott Kemshell",
    "Meg Hafner",
    "Torey Gopsill",
    "Horatio Gradwell",
    "Erminia Phibb",
  ]
  ids = ["19e82c36-5515-4247-8cbf-b040c84c2a50",
    "4bb3c291-139b-4e22-ac50-d0103886c080",
    "c702d5d9-e850-4eb8-96cf-86128b9c1b50",
    "60132dee-574a-48d0-b5ae-7d3d70fc3e7c",
    "5c786d23-764f-41dc-9668-26b913027792",
    "75c4f673-343c-4c5d-8d73-3f4ea9cce0bf",
    "df04e528-aae3-4cbe-9b71-a4e3b0507545",
    "7fe19b95-83a8-4525-bd7b-ccd19825f3d3",
    "943f81f0-ce27-4d81-968a-32574514fbb9",
    "875008fa-b9fb-4a4f-9d73-ded2bbc2c078",
    "3fe20639-791c-429c-9a7d-72b01fdc651f",
    "66bc6083-eda5-4d9f-bcfa-fc3068695ce7",
    "ee52fac2-3f6c-4076-9526-4f62c8db2391",
    "15d4d08d-91bd-445d-af1f-928fe2c47504",
    "9295f4bf-960d-46f2-9c50-47168345c30a",
    "318e6fb7-079c-4365-b55c-fb303a23758e",
    "c54c2259-ba4b-40ea-986f-44ca5a5d72df",
    "269a6796-8f64-442c-a92f-b216b155acef",
    "ae6044fa-d99e-47f2-a6ec-d7295e8fea21",
    "154ce9d1-2908-4587-b199-bf636cbce503",
  ]
  emails = [
    "tblizard0@businessinsider.com",
    "aariss1@forbes.com",
    "awhyard2@marriott.com",
    "efolling3@sina.com",
    "kunwin4@freewebs.com",
    "pprazor5@yelp.com",
    "kcomo6@google.it",
    "dluisetti7@europa.eu",
    "gsprake8@zimbio.com",
    "goxenford9@ifeng.com",
    "cclampea@toplist.cz",
    "fthomingab@netscape.com",
    "giglesiasc@spotify.com",
    "kcarleyd@house.gov",
    "fsopere@ycombinator.com",
    "bmceloryf@chron.com",
    "kmurpheyg@smugmug.com",
    "wstiddardh@trellian.com",
    "wshelbournei@g.co",
    "lfrogleyj@mail.ru",
  ]


  constructor() {
    const numberOfUsers = 20;
    for (let i = 0; i < numberOfUsers; i++) {
      const user: User = {
        id: this.ids[i],
        name: this.names[i],
        email: this.emails[i],
        price: this.getAlternateEnumValue()
      };
      this.users.push(user);
    }
  }

  getAlternateEnumValue(): EnergyPrice {
    const randomIndex = Math.floor(Math.random() * 2); // Genera un número aleatorio entre 0 y 1
    return randomIndex === 0 ? EnergyPrice.FREE : EnergyPrice.COMMUNITY;
  }

  addSharingUser(user: User) {
    this.sharingUsers.push(user);
  }

  removeUser(id: string) {
    this.sharingUsers = this.sharingUsers.filter(u => u.id !== id);
  }
}
