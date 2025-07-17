interface ServerInterface {
    port: number;
    routes: any;
    errorHandler?: any;
    database: DataBase;
}