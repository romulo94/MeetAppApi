import User from '../models/User';

class UserController {
  async index(req, res) {
    try {
      const users = await User.findAll({
        attributes: ['id', 'name', 'email'],
      });

      return res.json(users);
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async store(req, res) {
    try {
      const { id, name, email } = await User.create(req.body);

      return res.json({
        id,
        name,
        email,
      });
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default new UserController();
