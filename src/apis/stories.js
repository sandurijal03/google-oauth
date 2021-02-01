import { Router } from 'express';
import { ensureAuth } from '../middleware/auth';

import Story from '../model/Story';

const router = Router();

/**
 * @desc Show add page
 * @route /stories/add
 * @method GET
 *
 */
router.get('/add', ensureAuth, (req, res) => {
  res.render('stories/add');
});

/**
 * @desc Process add form
 * @route /stories
 * @method POST
 *
 */
router.post('/', ensureAuth, async (req, res) => {
  try {
    req.body.user = req.user.id;
    await Story.create(req.body);
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.render('error/500');
  }
});
``;

/**
 * @desc show all stories
 * @route /stories
 * @method GET
 *
 */

router.get('/', ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({ status: 'public' })
      .populate('user')
      .sort({ createdAt: 'desc' })
      .lean();

    res.render('stories/index', {
      stories,
    });
  } catch (err) {
    console.error(err);
    res.render('error/500');
  }
});

/**
 * @desc show single story
 * @route /stories/:id
 * @method GET
 *
 */

router.get('/:id', ensureAuth, async (req, res) => {
  try {
    let story = await Story.findById(req.params.id).populate('user').lean();

    if (!story) {
      return res.render('error/404');
    }
    if (story.user._id != req.user.id && story.status == 'private') {
      res.render('error/404');
    } else {
      res.render('stories/show', {
        story,
      });
    }
  } catch (err) {
    console.error(err);
    res.render('error/404');
  }
});

/**
 * @desc show edit page
 * @route /stories/edit/:id
 * @method GET
 *
 */
router.get('/edit/:id', ensureAuth, async (req, res) => {
  try {
    const story = await Story.findOne({
      _id: req.params.id,
    }).lean();

    if (!story) {
      return res.render('error/404');
    }

    if (story.user != req.user.id) {
      res.redirect('/stories');
    } else {
      res.render('stories/edit', {
        story,
      });
    }
  } catch (err) {
    console.error(err);
    return res.render('error/500');
  }
});

/**
 * @desc update stories
 * @route /stories/:id
 * @method PUT
 *
 */
router.put('/:id', ensureAuth, async (req, res) => {
  try {
    let story = await Story.findById(req.params.id).lean();

    if (!story) {
      return res.render('error/404');
    }

    if (story.user != req.user.id) {
      res.redirect('/stories');
    } else {
      story = await Story.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidators: true,
      });

      res.redirect('/dashboard');
    }
  } catch (err) {
    console.error(err);
    return res.render('error/500');
  }
});

/**
 * @desc deelete story
 * @route /stories/:id
 * @method PUT
 *
 */
router.delete('/:id', ensureAuth, async (req, res) => {
  try {
    let story = await Story.findById(req.params.id).lean();

    if (!story) {
      return res.render('error/404');
    }

    if (story.user != req.user.id) {
      res.redirect('/stories');
    } else {
      await Story.remove({ _id: req.params.id });
      res.redirect('/dashboard');
    }
  } catch (err) {
    console.error(err);
    return res.render('error/500');
  }
});

/**
 * @desc User stories
 * @route /stories/user/:userId
 * @method GET
 *
 */
router.get('/user/:userId', ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({
      user: req.params.userId,
      status: 'public',
    })
      .populate('user')
      .lean();

    res.render('stories/index', {
      stories,
    });
  } catch (err) {
    console.error(err);
    res.render('error/500');
  }
});

export default router;
