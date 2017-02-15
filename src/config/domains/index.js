import React, {Component, PropTypes} from 'react';

import Checkbox from 'focus-components/input-checkbox';
import Radio from 'focus-components/input-radio';
import InputDate from 'focus-components/input-date';
import InputText from 'focus-components/input-text';
import InputSelect from 'focus-components/select-mdl';
import RadioSelect from 'focus-components/select-radio';
import Autocomplete from 'focus-components/autocomplete-text/edit';

export const DO_ID = {
    type: 'text'
}

export const DO_TEXTE = {
    type: 'text'
}

export const DO_SYMBOL = {
    type: 'text'
}

export const DO_CODE = {
    type: 'text'
}

export const DO_MONTANT = {
    type: 'number'
}

export const DO_DATE = {
    type: 'text',
    InputComponent: InputDate
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

export const DO_ACCOUNTS_NAMES = {
    type: 'text',
   InputComponent: props => <div><Autocomplete querySearcher={_querySearcher}/></div>
}

export const DO_CHECKBOX = {
    type: 'checkbox',
    InputComponent: Checkbox
}

const _querySearcher = query => {
    let data = [
        {
            key: 'JL',
            label: 'Joh Lickeur'
        },
        {
            key: 'GK',
            label: 'Guénolé Kikabou'
        },
        {
            key: 'YL',
            label: 'Yannick Lounivis'
        }
    ];
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({
                data,
                totalCount: data.length
            });
        }, 500);
    });
};
