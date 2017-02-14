import {loadCivility} from '../../services/load-civility';
import {loadSex} from '../../services/load-sex';
import {loadAccountsNames} from '../../services/load-accounts-names';

export const masterDataConfig  = [
    {
        name: 'civility',
        service: loadCivility
    },
    {
        name: 'sex',
        service: loadSex
    },
    {
        name: 'accountsNames',
        service: loadAccountsNames
    }
];
