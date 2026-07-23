import { Router } from 'express';
import {
  deleteBarang,
  getBarangDetail,
  getBarangList,
  postBarang,
  putBarang,
} from '../controllers/barang.controller';

const router = Router();

router.get('/', getBarangList);
router.get('/:id', getBarangDetail);
router.post('/', postBarang);
router.put('/:id', putBarang);
router.delete('/:id', deleteBarang);

export default router;
