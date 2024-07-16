import { isCurrentLocalTimeZone } from './utils';

type Place = {
  name: string;
  city: string;
  timeZone: string;
  current: boolean;
};

export const places: Place[] = [
  {
    name: 'Florianópolis/Brazil',
    city: 'Florianópolis, Santa Catarina, Brazil',
    timeZone: 'America/Sao_Paulo',
  },
  {
    name: 'Munich/Germany',
    city: 'Munich, Germany',
    timeZone: 'Europe/Berlin',
  },
  {
    name: 'San Francisco/USA',
    city: 'San Francisco, California, USA',
    timeZone: 'America/Los_Angeles',
  },
  {
    name: 'Lisbon/Portugal',
    city: 'Lisbon, Portugal',
    timeZone: 'Europe/Lisbon',
  },
  {
    name: 'Dublin/Ireland',
    timeZone: 'Europe/Dublin',
    city: 'Dublin, Ireland',
  },
  {
    name: 'Europe/Gothenburg',
    city: 'Gothenburg, Sweden',
    timeZone: 'Europe/Stockholm',
  },
].map(place => ({
  ...place,
  current: isCurrentLocalTimeZone(place.timeZone),
}));
