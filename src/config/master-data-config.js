import {loadCivility} from '../services/load-civility';
import {loadAccountsNames} from '../services/load-accounts-names';

export const masterDataConfig  = [
  {
    name: 'civility',
    service: loadCivility
  },
  {
    name: 'accountsNames',
    service: loadAccountsNames
  }
];
