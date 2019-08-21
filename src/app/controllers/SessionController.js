import jwt from 'jsonwebtoken';
import User from '../models/User';
import authConfig from '../../config/auth';

class SessionController {
  async store(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({
        where: {
          email,
        },
      });

      if (!user) return res.status(404).json({ error: 'User not found' });

      const passwordChecked = await user.checkPassword(password);

      if (!passwordChecked)
        return res.json(401).json({ error: 'Password does not match' });

      const { id, name } = user;
      const token = jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      });

      return res.json({
        id,
        name,
        email,
        token,
      });
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default new SessionController();
