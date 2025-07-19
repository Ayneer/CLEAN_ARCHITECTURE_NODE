import { Router } from "express";
import { AuthRoutes, LoanRoute } from ".";

export class AppRoutes {
    static get routes(): Router {
        const router = Router();

        router.use('/api/auth', AuthRoutes.routes);
        router.use('/api/loan', LoanRoute.routes);

        return router;
    }
}