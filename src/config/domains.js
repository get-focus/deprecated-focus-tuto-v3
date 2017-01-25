import React, {Component, PropTypes} from 'react';


import Checkbox from 'focus-components/input-checkbox';
import InputDate from 'focus-components/input-date';
import InputText from 'focus-components/input-text';
import InputSelect from 'focus-components/select-mdl';
import Autocompelte from 'focus-components/autocomplete-text/field';

export const DO_ID = {
    type: 'text'
    //InputComponent: (props) => <div>DO_ID {JSON.stringify(props)}</div>
}

export const DO_TEXTE = {
    type: 'text'
    //InputComponent: (props) => <div>DO_TEXTE {JSON.stringify(props)}</div>
}

export const DO_DATE = {
    type: 'text',
    InputComponent: InputDate
}

export const DO_AMOUNT = {
    type: 'number'
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

export const DO_CIVILITE= {
    type: 'text',
    validators: [{
        type: 'string',
        options: {
            maxLength: 200
        }
    }],
    SelectComponent: InputSelect
}

export const DO_ACCOUNTS_NAMES = {
    type: 'text',
    InputComponent: Autocompelte
}

export const DO_CHECKBOX = {
    type: 'boolean',
    InputComponent: Checkbox
}
