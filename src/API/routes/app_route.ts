import { Router } from "express";
import { AuthRoutes } from "./auth_route";

export class AppRoutes {
    static get routes(): Router {
        const router = Router();

        router.use('/api/auth', AuthRoutes.routes);

        return router;
    }
}