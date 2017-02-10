import React, {Component, PropTypes} from 'react';

import InputDate from 'focus-components/input-date';
import InputText from 'focus-components/input-text';
import InputSelect from 'focus-components/select-mdl';
import RadioSelect from 'focus-components/select-radio';

export const DO_ID = {
    type: 'text'
}

export const DO_TEXTE = {
    type: 'text'
}

export const DO_CIVILITE = {
    type: 'text',
    validators: [{
        type: 'string',
        options: {
            maxLength: 200
        }
    }],
    InputComponent: InputSelect
}

export const DO_SEXE = {
    SelectComponent: RadioSelect
}

export const DO_CODE = {
    type: 'text'
}

export const DO_MONTANT = {
    type: 'number'
}
