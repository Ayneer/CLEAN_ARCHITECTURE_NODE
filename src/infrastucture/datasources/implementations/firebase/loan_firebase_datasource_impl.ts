import { ClientEntity, LoanEntity } from "../../../../domain";
import { LoanRepository } from "../../../../domain/repositories";
import {
  collection,
  CollectionReference,
  DocumentData,
} from "firebase/firestore/lite";
import { FirebaseDatabase } from "../../../../drivers/data/firebase/firebase_database";
import { firebaseCollections } from "../../../../drivers/data/firebase/firebase_collections";

export class LoanFirebaseDatasourceImpl implements LoanRepository {
  private loanCollection: CollectionReference<DocumentData, DocumentData>;

  constructor() {
    this.loanCollection = collection(
      FirebaseDatabase.db,
      firebaseCollections.loans
    );
  }

  createLoan(loan: Partial<LoanEntity>): Promise<LoanEntity> {
    throw new Error("Method not implemented.");
  }
}
