import { ClientEntity } from "../../../../domain";
import { ClientRepository } from "../../../../domain/repositories";
import { DocumentType } from "../../../../domain/enum";
import {
  collection,
  CollectionReference,
  DocumentData,
} from "firebase/firestore/lite";
import { FirebaseDatabase } from "../../../../drivers/data/firebase/firebase_database";
import { firebaseCollections } from "../../../../drivers/data/firebase/firebase_collections";

export class ClientFirebaseDatasourceImpl implements ClientRepository {
  private clientCollection: CollectionReference<DocumentData, DocumentData>;

  constructor() {
    this.clientCollection = collection(
      FirebaseDatabase.db,
      firebaseCollections.clients
    );
  }

  async createClient(client: Partial<ClientEntity>): Promise<ClientEntity> {
    throw new Error("Method not implemented.");
  }

  async getClientByDocument(
    documentNumber: string,
    documentType: DocumentType
  ): Promise<ClientEntity> {
    throw new Error("Method not implemented.");
  }
}
