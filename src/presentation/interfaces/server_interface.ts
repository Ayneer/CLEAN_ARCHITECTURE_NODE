import { DataBase } from "../../drivers/interfaces/database_interface";

export interface ServerInterface {
    port: number;
    errorHandler?: any;
    database: DataBase;
}