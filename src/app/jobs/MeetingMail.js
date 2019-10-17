import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class MeetingMail {
  get key() {
    return 'MeetingMail';
  }

  async handle({ data }) {
    const { user, organizer, meetup, total } = data;

    await Mail.sendMail({
      to: `${organizer.name} <${organizer.email}>`,
      subject: 'Nova inscrição',
      template: 'meeting',
      context: {
        meetup: meetup.title,
        subscriberName: user.name,
        subscriberEmail: user.email,
        user: organizer.name,
        total,
        date: format(
          parseISO(meetup.date),
          "'dia' dd 'de' MMMM', às' H:mm'h'",
          {
            locale: pt,
          }
        ),
      },
    });
  }
}

export default new MeetingMail();
