import { Op } from 'sequelize';
import User from '../models/User';
import Meetup from '../models/Meetup';
import Subscription from '../models/Subscription';
// import CancellationsMail from '../jobs/CancellationMail';
import MeetingMail from '../jobs/MeetingMail';
import Queue from '../../lib/Queue';

class SubscriptionController {
  async index(req, res) {
    const subscriptions = await Subscription.findAll({
      where: {
        user_id: req.userId,
      },
      include: [
        {
          model: Meetup,
          where: {
            date: {
              [Op.gt]: new Date(),
            },
          },
          required: true,
        },
      ],
      order: [[Meetup, 'date']],
    });

    return res.json(subscriptions);
  }

  async store(req, res) {
    const user = await User.findByPk(req.userId);
    const meetup = await Meetup.findByPk(req.params.meetupId, {
      include: [
        {
          model: User,
        },
      ],
    });
    if (!meetup) {
      return res.status(404).json({ error: 'Non-existent meetup' });
    }

    if (meetup.user_id === req.userId) {
      return res
        .status(400)
        .json({ error: 'Unable to subscribe up for your own meetings' });
    }

    if (meetup.past) {
      return res
        .status(400)
        .json({ error: 'Unable subscribe to past meetups' });
    }

    const checkDuplicate = await Subscription.findOne({
      where: {
        user_id: user.id,
      },
      include: [
        {
          model: Meetup,
          required: true,
          where: {
            date: meetup.date,
          },
        },
      ],
    });

    if (checkDuplicate) {
      if (checkDuplicate.meetup_id === Number(req.params.meetupId))
        return res
          .status(400)
          .json({ error: 'Unable subscribe to the same meetup at twice' });

      return res
        .status(400)
        .json({ error: 'Unable subscribe to two meetups at the same time' });
    }

    const subscription = await Subscription.create({
      user_id: user.id,
      meetup_id: meetup.id,
    });

    const subscriptionsCount = await Subscription.findAll({
      where: {
        meetup_id: req.params.meetupId,
      },
    });

    await Queue.add(MeetingMail.key, {
      meetup,
      organizer: meetup.User,
      user,
      total: subscriptionsCount.length,
    });

    return res.json(subscription);
  }
}

export default new SubscriptionController();
