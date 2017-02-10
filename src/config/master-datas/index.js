import {loadCivility} from '../../services/load-civility';
import {loadSex} from '../../services/load-sex';

export const masterDataConfig  = [
    {
        name: 'civility',
        service: loadCivility
    },
    {
        name: 'sex',
        service: loadSex
    }
];
