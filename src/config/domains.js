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
    SelectComponent: RadioSelect
}

export const DO_ACCOUNTS_NAMES = {
    type: 'text',
    InputComponent: props => <div><Autocomplete/></div>

/*dans https://github.com/get-focus/focus-graph/blob/a65855cd8a5a39999ca783a146cb66c2db2cd8aa/src/example/config.js#L136*/
    //DisplayComponent: props => <div><AutoCompleteSelect isEdit={false} querySearcher={querySearcher} placeholder={'Your search...'} keyResolver={keyResolver} {...props} />{JSON.stringify(props)}</div>,
    //       InputComponent:  props => <div>
    //       value: {props.value}
           //{/*<AutoCompleteSelect isEdit={true} querySearcher={querySearcher} placeholder={'Your search...'} keyResolver={keyResolver} {...props} />*/}
    //       {JSON.stringify(props)}
    //       </div>
}
/*{ JSON.stringify(props) affiche :
    "valid":true,
    "error":true,
    "active":true,
    "dirty":false,
    "loading":false,
    "saving":false,
    "name":"accountsNames",
    "entityPath":"user",
    "dataSetValue":"GK",
    "rawInputValue":"GK",
    "rawValid":false,
    "formattedInputValue":"GK",
    "label":"comptes",
    "textForLine":{},
    "selectForLine":{},
    "editing":true,
    "metadata":{
        "isRequired":true,
        "type":"text"
    }
}*/

export const DO_CHECKBOX = {
    type: 'boolean',
    InputComponent: Checkbox
}

export const DO_SELECT_CHECKBOX = {
    type: 'boolean',
    InputComponent: SelectCheckbox
}
