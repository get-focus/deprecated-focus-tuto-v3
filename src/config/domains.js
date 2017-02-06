import React, {Component, PropTypes} from 'react';

import Checkbox from 'focus-components/input-checkbox';
import InputDate from 'focus-components/input-date';
import InputText from 'focus-components/input-text';
import InputSelect from 'focus-components/select-mdl';
import RadioSelect from 'focus-components/select-radio';
import Autocomplete from 'focus-components/autocomplete-text/field';
import SelectCheckbox from 'focus-components/select-checkbox';

export const DO_ID = {
    type: 'text'
}

export const DO_TEXTE = {
    type: 'text'
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

export const DO_CIVILITE = {
    type: 'text',
    validators: [{
        type: 'string',
        options: {
            maxLength: 200
        }
    }],
    SelectComponent: InputSelect
}

export const DO_SEXE = {
    listName: 'maleFemaleUnknownList',
    refContainer: {maleFemaleUnknownList: [{code: 'male', label: 'radio.male'}, {code: false, label: 'radio.female'}, {code: null, label: 'radio.unknown'}]},
    SelectComponent: RadioSelect
}

export const DO_ACCOUNTS_NAMES = {
    type: 'text',
    InputComponent: Autocomplete
}

export const DO_CHECKBOX = {
    type: 'boolean',
    InputComponent: Checkbox
}

export const DO_SELECT_CHECKBOX = {
    type: 'boolean',
    InputComponent: SelectCheckbox
}
