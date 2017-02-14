import {loadCivility} from '../services/load-civility';
import {loadSexe} from '../services/load-sexe';
export const masterDataConfig  = [
    {name: 'civility', service: loadCivility},
    {name: 'sexe', service: loadSexe},
];
