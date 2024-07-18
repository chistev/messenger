function deserializeUser(req, res, next) {
    try {
      const cookie = req.headers.cookie;
      if (!cookie || !cookie.includes('connect.sid')) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
  
      const sessionID = cookie.split('connect.sid=')[1].split(';')[0].trim();
  
      req.sessionStore.get(sessionID, (err, session) => {
        if (err || !session) {
          return res.status(500).json({ error: 'Session retrieval failed' });
        }
  
        if (!session.passport || !session.passport.user) {
          return res.status(401).json({ error: 'Unauthorized' });
        }
  
        req.user = { _id: session.passport.user }; 
  
        next();
      });
    } catch (error) {
      res.status(500).json({ error: 'Server Error' });
    }
  }
  
  module.exports = deserializeUser;
  