import {TYPE_VIETLOTT645, TYPE_VIETLOTT655} from '../constants';

export default function lotterTypeToQueryParam(type) {
  if (type === TYPE_VIETLOTT645) {
    return TYPE_VIETLOTT645;
  }

  return TYPE_VIETLOTT655;
}
