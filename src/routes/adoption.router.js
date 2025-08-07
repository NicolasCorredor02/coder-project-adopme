import { Router } from 'express';
import adoptionsController from '../controllers/adoptions.controller.js';

const router = Router();

router.get('/', adoptionsController.getAllAdoptions);
router.get('/:aid', adoptionsController.getAdoption);
router.post('/:uid/:pid', adoptionsController.createAdoption);
router.get('/user/:uid', adoptionsController.getAdoptionsByUser);
// router.get('/pet/:pid', adoptionsController.getAdoptionsByPet);

export default router;
