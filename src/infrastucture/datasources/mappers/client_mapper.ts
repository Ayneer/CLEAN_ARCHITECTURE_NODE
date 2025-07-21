import { PartialSchemaMap } from "joi";
import { CustomError } from "../../../config";
import { ClientEntity } from "../../../domain";

export class ClientMapper {
  static clientEntityFromObject(
    object: { [key: string]: any },
    fielsToDelete: (keyof ClientEntity)[] = []
  ): ClientEntity {
    const { id, _id, name, documentNumber, documentType, phone, address, city, email } = object;

    if (!id && !_id) throw CustomError.badRequest("Missing id");
    if (!name) throw CustomError.badRequest("Missing name");
    if (!documentNumber) throw CustomError.badRequest("Missing documentNumber");
    if (!documentType) throw CustomError.badRequest("Missing documentType");
    if (!phone) throw CustomError.badRequest("Missing phone");
    if (!address) throw CustomError.badRequest("Missing address");
    if (!city) throw CustomError.badRequest("Missing city");

    const client: ClientEntity = new ClientEntity({
      id: id || _id,
      name,
      email: email ?? null,
      documentNumber,
      documentType,
      phone,
      address,
      city,
    });

    fielsToDelete.forEach((field) => {
      delete client[field];
    });

    return client;
  }
}
