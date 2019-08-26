import { parseISO, startOfDay, endOfDay } from 'date-fns';
import { Op } from 'sequelize';
import Meetup from '../models/Meetup';
import User from '../models/User';
import File from '../models/File';

class MeetupOwnerController {
  async index(req, res) {
    const where = {
      user_id: req.userId,
    };
    const order = [];
    let orderIndex = null;
    if (req.query.date) {
      const searchDate = parseISO(req.query.date);
      where.date = {
        [Op.between]: [startOfDay(searchDate), endOfDay(searchDate)],
      };
    } else if (req.query.past) {
      const searchDate = new Date();
      if (req.query.past === 'false') where.date = { [Op.gt]: searchDate };
      if (req.query.past === 'true') where.date = { [Op.lt]: searchDate };
    }

    if (req.query.order) {
      orderIndex = order.length;
      if (req.query.order === 'ASC') order[orderIndex] = ['date', 'ASC'];
      if (req.query.order === 'DESC') order[orderIndex] = ['date', 'DESC'];
    }

    const meetups = await Meetup.findAll({
      where,
      include: [
        {
          model: User,

          attributes: ['id', 'name', 'email'],
        },
        {
          model: File,
        },
      ],
      order,
    });

    return res.json(meetups);
  }
}

export default new MeetupOwnerController();
