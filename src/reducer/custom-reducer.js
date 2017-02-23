import {MY_ACTION} from '../actions/custom-actions';

const customReducer = (state = {}, action) => {
    switch(action.type) {
        case MY_ACTION:
            return {victoire: 'De la Gloire'};
        default:
            return {echec: 'De l\'échec' };
    }
};

export default customReducer;
