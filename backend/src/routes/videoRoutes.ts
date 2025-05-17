import express from 'express';
import { getAllVideos, getVideoById, createVideo } from '../controllers/videoController';

const router = express.Router();

router.get('/', (req: express.Request, res: express.Response, next: express.NextFunction) => {
  return getAllVideos(req, res, next);
});
router.get('/:id', (req: express.Request, res: express.Response, next: express.NextFunction) => {
  return getVideoById(req, res, next);
});
router.post('/', (req: express.Request, res: express.Response, next: express.NextFunction) => {
  return createVideo(req, res, next);
});


export default router;