import { ClientEntity } from "../../entities";
import { DocumentType } from "../../enum";

export abstract class ClientRepository {
  constructor() { }

  abstract createClient(client: Partial<ClientEntity>): Promise<ClientEntity>;
  abstract getClientByDocument(documentNumber: string, documentType: DocumentType): Promise<ClientEntity | null>;
  abstract getClientById(id: string): Promise<ClientEntity | null>;
}
