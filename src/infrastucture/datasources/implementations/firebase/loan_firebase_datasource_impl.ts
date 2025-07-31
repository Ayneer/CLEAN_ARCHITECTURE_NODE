import { LoanEntity } from "../../../../domain";
import { LoanRepository } from "../../../../domain/repositories";
import {
  addDoc,
  collection,
  CollectionReference,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  updateDoc
} from "firebase/firestore/lite";
import { FirebaseDatabase } from "../../../../drivers/data/firebase/firebase_database";
import { firebaseCollections } from "../../../../drivers/data/firebase/firebase_collections";
import { LoanMapper } from "../../mappers";

export class LoanFirebaseDatasourceImpl implements LoanRepository {
  private readonly loanCollection: CollectionReference<DocumentData, DocumentData>;

  constructor() {
    this.loanCollection = collection(
      FirebaseDatabase.db,
      firebaseCollections.loans
    );
  }

  async getLoanCount(): Promise<number> {
    const snapShot = await getDocs(this.loanCollection);
    return snapShot.size;
  }

  async createLoan(loan: Partial<LoanEntity>): Promise<LoanEntity> {
    const snapShot = await addDoc(this.loanCollection, loan);
    const newLoan: LoanEntity | null = await this.getLoanById(snapShot.id);
    if (!newLoan) {
      throw new Error("Failed to create loan");
    }
    return newLoan;
  }

  async getLoanById(id: string): Promise<LoanEntity | null> {
    const snapShot = await getDoc(doc(this.loanCollection, id));
    if (!snapShot.exists()) {
      return null;
    }
    const loanData = snapShot.data();
    return LoanMapper.loanEntityFromObject({
      ...loanData,
      id: snapShot.id,
    });
  }

  async updateLoan(id: string, loan: Partial<LoanEntity>): Promise<void> {
    await updateDoc(doc(this.loanCollection, id), loan);
  }
}
