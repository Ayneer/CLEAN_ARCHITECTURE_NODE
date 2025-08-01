import { ClientEntity } from "../../../../domain";
import { ClientRepository } from "../../../../domain/repositories";
import { DocumentType } from "../../../../domain/enum";
import {
  addDoc,
  collection,
  CollectionReference,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore/lite";
import { FirebaseDatabase } from "../../../../drivers/data/firebase/firebase_database";
import { firebaseCollections } from "../../../../drivers/data/firebase/firebase_collections";
import { ClientMapper } from "../../mappers";

export class ClientFirebaseDatasourceImpl implements ClientRepository {
  private readonly clientCollection: CollectionReference<DocumentData, DocumentData>;

  constructor() {
    this.clientCollection = collection(
      FirebaseDatabase.db,
      firebaseCollections.clients
    );
  }

  async createClient(client: Partial<ClientEntity>): Promise<ClientEntity> {
    const snapShot = await addDoc(this.clientCollection, client);
    const newClient: ClientEntity | null = await this.getClientById(
      snapShot.id
    );
    if (!newClient) {
      throw new Error("Failed to create client");
    }
    return newClient;
  }

  async getClientByDocument(
    documentNumber: string,
    documentType: DocumentType
  ): Promise<ClientEntity | null> {
    const querySnapshot = query(
      this.clientCollection,
      where("documentNumber", "==", documentNumber),
      where("documentType", "==", documentType)
    );
    const snapshot = await getDocs(querySnapshot);
    if (snapshot.empty) {
      return null;
    }
    const clientData = snapshot.docs[0].data();
    return ClientMapper.clientEntityFromObject({
      ...clientData,
      id: snapshot.docs[0].id,
    });
  }

  async getClientById(id: string): Promise<ClientEntity | null> {
    const snapShot = await getDoc(doc(this.clientCollection, id));
    if (!snapShot.exists()) {
      return null;
    }
    const clientData = snapShot.data();
    return ClientMapper.clientEntityFromObject({
      ...clientData,
      id,
    });
  }
}
