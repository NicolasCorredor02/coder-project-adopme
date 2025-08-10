import { Router } from 'express';
import mocksController from '../controllers/mocks.controller.js';

const router = Router();

router.get('/mockingpets', mocksController.createPetsMock);
router.get('/mockingusers', mocksController.createUsersMock);
router.post('/generateData', mocksController.generateDataWithMock);

export default router;