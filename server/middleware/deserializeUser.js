const User = require('../models/User'); // Import User model

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

      // Fetch user from the database and attach to req.user
      try {
        const user = await User.findById(session.passport.user);
        if (!user) {
          return res.status(401).json({ error: 'User not found' });
        }

        req.user = user; // Attach complete user object
        next();
      } catch (dbError) {
        res.status(500).json({ error: 'Database Error' });
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
}

module.exports = deserializeUser;
