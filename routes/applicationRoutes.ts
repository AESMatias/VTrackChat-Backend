import express from 'express';
import { getCurrentVersion } from '../controllers/getVersionController';

const router = express.Router();

router.get('/:platform/versions/:currentVersion/check-update', getCurrentVersion);

export default router;