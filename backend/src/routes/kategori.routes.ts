import { Router } from 'express';
import { getKategoriList } from '../controllers/kategori.controller';

const router = Router();

router.get('/', getKategoriList);

export default router;
