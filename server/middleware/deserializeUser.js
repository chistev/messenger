const User = require('../models/User');

function deserializeUser(req, res, next) {
  try {
    const cookie = req.headers.cookie;
    if (!cookie || !cookie.includes('connect.sid')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const sessionID = cookie.split('connect.sid=')[1].split(';')[0].trim();

    req.sessionStore.get(sessionID, async (err, session) => {
      if (err || !session) {
        return res.status(500).json({ error: 'Session retrieval failed' });
      }

      if (!session.passport || !session.passport.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const userId = session.passport.user;

      if (typeof userId === 'object' && userId.googleId) {
        req.user = userId;
        return next();
      }

      try {
        const user = await User.findById(userId);
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
        req.user = user;
        next();
      } catch (error) {
        return res.status(500).json({ error: 'Server error' });
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
}

module.exports = deserializeUser;
