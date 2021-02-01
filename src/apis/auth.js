import { Router } from 'express';
import passport from 'passport';

const router = Router();

/**
 * @description Auth with google
 * @method GET
 * @route /auth/google
 */
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile'],
  }),
);

/**
 * @description Google auth callback
 * @method GET
 * @route
 */
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/dashboard');
  },
);

/**
 * @description   Logout
 * @route
 * @method
 */
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

export default router;
