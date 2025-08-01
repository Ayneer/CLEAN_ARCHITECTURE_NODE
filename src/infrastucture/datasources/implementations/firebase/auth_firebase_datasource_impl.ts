import { AuthRepository, UserEntity } from "../../../../domain";
import {
  collection,
  getDocs,
  DocumentData,
  CollectionReference,
  addDoc,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore/lite";
import { FirebaseDatabase } from "../../../../drivers/data/firebase/firebase_database";
import { UserMapper } from "../../mappers";
import {
  CustomError,
  DeleteOneUserByIdDto,
  GetUserByIdDto,
  LoginUserDto,
} from "../../../../config";
import { firebaseCollections } from "../../../../drivers/data/firebase/firebase_collections";
import { UserDto } from "../../../../models";
import { UserMapperType } from "../../../../utils/types_util";

export class AuthFirebaseDatasourceImpl implements AuthRepository {
  private readonly userCollection: CollectionReference<
    DocumentData,
    DocumentData
  >;
  private readonly userMapper: UserMapperType = UserMapper.userEntityFromObject;

  constructor() {
    this.userCollection = collection(
      FirebaseDatabase.db,
      firebaseCollections.users
    );
  }

  login(loginUserDto: LoginUserDto): Promise<Partial<UserEntity>> {
    throw new Error("Method not implemented.");
  }

  async getUserByEmail(
    email: string,
    fielsToDelete?: (keyof UserEntity)[]
  ): Promise<UserEntity | null> {
    const snapShot = await getDocs(
      query(this.userCollection, where("email", "==", email))
    );
    if (snapShot.docs.length === 0) return null;
    const userDoc = snapShot.docs[0];
    return this.userMapper(
      { ...userDoc.data(), id: userDoc.id },
      fielsToDelete
    );
  }

  async createUser(
    registerUserDto: UserDto,
    fielsToDelete?: (keyof UserEntity)[]
  ): Promise<UserEntity> {
    const snapShot = await addDoc(this.userCollection, registerUserDto);
    const newUser = await getDoc(doc(this.userCollection, snapShot.id));
    return this.userMapper(
      { ...newUser.data(), id: snapShot.id },
      fielsToDelete
    );
  }

  async getOneUserById(
    getUserByIdDto: GetUserByIdDto
  ): Promise<Partial<UserEntity>> {
    const { id } = getUserByIdDto;
    const newUser = await getDoc(doc(this.userCollection, id));
    return this.userMapper({ ...newUser.data(), id });
  }

  async register(registerUserDto: UserDto): Promise<UserEntity> {
    throw CustomError.internalServerError();
  }

  async getAllUsers(): Promise<Partial<UserEntity>[]> {
    try {
      const snapShot = await getDocs(collection(FirebaseDatabase.db, "users"));
      const users: Partial<UserEntity>[] = [];
      snapShot.forEach((doc) => {
        const data = doc.data();
        users.push(this.userMapper(data));
      });
      return users;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internalServerError();
    }
  }

  deleteAllUsers(): Promise<void> {
    throw new Error("Method not implemented.");
  }
  deleteUserById(
    deleteUserByIdDto: DeleteOneUserByIdDto
  ): Promise<Partial<UserEntity>[]> {
    throw new Error("Method not implemented.");
  }
}
