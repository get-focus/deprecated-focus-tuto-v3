import React, {Component, PropTypes} from 'react';
import moment from 'moment';


import Checkbox from 'focus-components/input-checkbox';
import Toggle from 'focus-components/input-toggle';
import Radio from 'focus-components/input-radio';
import SelectRadio from 'focus-components/select-radio';
import InputDate from 'focus-components/input-date';
import InputText from 'focus-components/input-text';
import InputSelect from 'focus-components/select-mdl';
import TextArea from 'focus-components/input-textarea';

export const DO_ID = {
    type: 'text'
    //InputComponent: (props) => <div>DO_ID {JSON.stringify(props)}</div>
}

export const DO_TEXTE = {
    type: 'text',
    formatter: (data) => {
        return data ? data.toUpperCase() : data;
    },
    //InputComponent: (props) => <div>DO_TEXTE {JSON.stringify(props)}</div>
}

export const DO_DATE = {
    InputComponent: InputDate,
    formatter: date => date ? moment(date, moment.ISO_8601).format('D MMMM YYYY') : '',
    format: ['DD/MM/YYYY', 'DD-MM-YYYY', 'D MMM YYYY']
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
    SelectComponent: InputSelect
}

export const DO_ACCOUNTS_NAMES = {
    type: 'text',
}

export const DO_CHECKBOX = {
    type: 'checkbox',
    InputComponent: Checkbox
}

export const DO_SEXE = {
    SelectComponent: SelectRadio
}
