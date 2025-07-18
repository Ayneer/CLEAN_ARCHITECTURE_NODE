import { AuthRepository, UserEntity } from "../../../../domain";
import {
  getFirestore,
  collection,
  getDocs,
  DocumentData,
  QueryDocumentSnapshot,
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
  BcryptAdapter,
  CustomError,
  DeleteOneUserByIdDto,
  envs,
  GetUserByIdDto,
  LoginUserDto,
  UserDto,
} from "../../../../config";
import { firebaseCollections } from "../../../../drivers/data/firebase/firebase_collections";

type Hash = (password: string) => string;
type CompareHash = (password: string, hash: string) => boolean;
type UserMapperType = (
  object: { [key: string]: any },
  fielsToDelete?: (keyof UserEntity)[]
) => UserEntity;

export class AuthFirebaseDatasourceImpl implements AuthRepository {
  private userCollection: CollectionReference<DocumentData, DocumentData>;

  constructor(
    private readonly hashPassword: Hash = BcryptAdapter.generateBcryptHash,
    private readonly compareHashPassword: CompareHash = BcryptAdapter.compareBcryptHash,
    private readonly userMapper: UserMapperType = UserMapper.userEntityFromObject
  ) {
    this.userCollection = collection(
      FirebaseDatabase.db,
      firebaseCollections.users
    );
  }

  login(loginUserDto: LoginUserDto): Promise<Partial<UserEntity>> {
    throw new Error("Method not implemented.");
  }

  async register(registerUserDto: UserDto): Promise<UserEntity> {
    try {
      const { name, email, password, role, img } = registerUserDto;
      //verificar el correo
      const emailExist = await getDocs(
        query(this.userCollection, where("email", "==", email))
      );

      if (emailExist.docs.length > 0)
        throw CustomError.badRequest("User already exists");

      const snapShot = await addDoc(this.userCollection, {
        name,
        email,
        password: this.hashPassword(password),
        role: role ?? "ADMIN_ROLE",
        img: img ?? "DEFAULT_IMG_URL",
      });

      const newUser = await getDoc(doc(this.userCollection, snapShot.id));
      return this.userMapper({ ...newUser.data(), id: snapShot.id }, ['password']);
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      console.error(error);
      throw CustomError.internalServerError();
    }
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

  getOneUserById(getUserByIdDto: GetUserByIdDto): Promise<Partial<UserEntity>> {
    throw new Error("Method not implemented.");
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
