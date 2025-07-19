import { DocumentType } from "../enum";

export class ClientEntity {
  id: string;
  name: string;
  documentNumber: string;
  documentType: DocumentType;
  email?: string;
  phone: string;
  address: string;
  city: string;

  constructor(props: ClientEntity) {
    this.id = props.id;
    this.name = props.name;
    this.documentNumber = props.documentNumber;
    this.documentType = props.documentType;
    this.email = props.email;
    this.phone = props.phone;
    this.address = props.address;
    this.city = props.city;
  }
}
