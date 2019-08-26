import * as Yup from 'yup';
import { isBefore, parseISO, startOfDay, endOfDay } from 'date-fns';
import { Op } from 'sequelize';
import Meetup from '../models/Meetup';
import User from '../models/User';
import File from '../models/File';

class MeetupController {
  async index(req, res) {
    const page = req.query.page || 1;
    const where = {};
    const order = [];
    let orderIndex = null;
    if (req.query.date) {
      const searchDate = parseISO(req.query.date);

      where.date = {
        [Op.between]: [startOfDay(searchDate), endOfDay(searchDate)],
      };
    }
    if (req.query.orderDate) {
      orderIndex = order.length;
      if (req.query.orderDate === 'ASC') order[orderIndex] = ['date', 'ASC'];
      if (req.query.orderDate === 'DESC') order[orderIndex] = ['date', 'DESC'];
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
      // order,
      limit: 10,
      offset: 10 * page - 10,
    });

    return res.json(meetups);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      description: Yup.string().required(),
      local: Yup.string().required(),
      date: Yup.date().required(),
      file_id: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    if (isBefore(parseISO(req.body.date), new Date())) {
      return res.status(400).json({ error: 'Date invalid' });
    }

    const user_id = req.userId;
    const meetup = await Meetup.create({ ...req.body, user_id });

    return res.json(meetup);
  }

  async update(req, res) {
    const user_id = req.userId;

    const meetup = await Meetup.findByPk(req.params.id);

    if (meetup.user_id !== user_id) {
      return res.status(401).json({ error: 'Not authorized' });
    }

    const schema = Yup.object().shape({
      title: Yup.string(),
      description: Yup.string(),
      local: Yup.string(),
      date: Yup.date(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    if (meetup.past)
      return res.status(401).json({ error: 'Can not edit past meetups' });

    if (req.body.date && isBefore(parseISO(req.body.date), new Date()))
      return res.status(400).json({ error: 'Date invalid' });

    const { id, title, description, local, date } = await meetup.update(
      req.body
    );

    return res.json({
      id,
      title,
      description,
      local,
      date,
    });
  }

  async show(req, res) {
    const meetups = await Meetup.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email'],
        },
        {
          model: File,
        },
      ],
    });

    return res.json(meetups);
  }

  async delete(req, res) {
    const user_id = req.userId;

    const meetup = await Meetup.findByPk(req.params.id);

    if (meetup.user_id !== user_id) {
      return res.status(401).json({ error: 'Not authorized.' });
    }

    if (meetup.past) {
      return res.status(400).json({ error: 'Can not delete past meetups.' });
    }

    await meetup.destroy();

    return res.send();
  }
}

export default new MeetupController();
