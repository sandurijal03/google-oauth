import { Router } from 'express';
import { ensureAuth, ensureGuest } from '../middleware/auth';

import Story from '../model/Story';

const router = Router();

/**
 * @desc Login landing page
 * @route /
 * @method GET
 *
 */
router.get('/', ensureGuest, (req, res) => {
  res.render('login', {
    layout: 'login',
  });
});

/**
 * @desc Dashboard page
 * @route /dashboard
 * @method GET
 */
router.get('/dashboard', ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({ user: req.user.id }).lean();
    res.render('dashboard', {
      name: req.user.firstName,
      stories,
    });
  } catch (err) {
    console.error(err);
    res.render('error/500');
  }
});

export default router;
