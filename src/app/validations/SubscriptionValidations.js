import * as Yup from 'yup';
import { parseISO, isBefore } from 'date-fns';
import Validations from './Validations';
import Subscription from '../models/Subscription';
import { isPast } from 'date-fns';
import Meetup from '../models/Meetup';

class MeetupValidations extends Validations {
  async validateStore(req, res) {
    this.setError(null);
  
    const schema = Yup.object().shape({
      meetup_id: Yup.number().required('meetup is required'),
    });

    await this.isValid(schema, req.body);
  }

  async checkCanSubscribe(req, meetup) {
    if (!meetup) {
      this.setError({errors: 'Meetup doesn`t exists'})
    }

    if (meetup && meetup.user_id == req.userId) {
      this.setError({errors: "You cannot subscribe a meetup that you created!"});
    }

    const subscription = await Subscription.findOne({
      where: {
        user_id: req.userId,
        meetup_id: meetup.id
      }
    });

    if (meetup && isPast(meetup.start_at)) {
      this.setError({errors: 'This meetup already happened!'});  
    }

    if (subscription) {
      this.setError({errors: "You already subscribed in this meeetup"}); 
    }
  }

  async validateUpdate(req, res) {
    this.setError(null);
  
    const schema = Yup.object().shape({
      meetup_id: Yup.integer().required('meetup is required'),
    });

    await this.isValid(schema, req.body);
  }


}

export default new MeetupValidations();