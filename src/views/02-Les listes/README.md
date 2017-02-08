# Les listes

Via le connecteur fieldHelpers il est possible d'utiliser un listFor et ainsi d'avoir une liste éditable.
Toujours quatre étapes à réaliser : la vue, les actions, les services et les reducers. Il n'est pas utile de redétailler les mêmes étapes que pour le cas d'un User, ainsi nous allons nous concentrer sur les changements :
 - l'objet serveur
 - les actions et les reducers
 - la vue et le LineComponent

```
/views/user/finance-form.js
import React, {Component, PropTypes} from 'react';
import {connect as connectToForm } from 'focus-graph/behaviours/form';
import {connect as connectToMetadata} from 'focus-graph/behaviours/metadata';
import {connect as connectToFieldHelpers} from 'focus-graph/behaviours/field';
import {loadFinanceAction, saveFinanceAction} from '../../actions/finance-actions';

import Panel from 'focus-components/panel';
import {compose} from 'redux';
import FinancialMoveLine from './financialMoveLine'

const Finance = ({fieldFor,listFor, ...otherProps}) => (
    <Panel title='Finance ' {...otherProps}>
        {fieldFor('name', {entityPath: 'finance'})}
        {fieldFor('amount', {entityPath: 'finance'})}
        {listFor('moves', {entityPath : 'finance', redirectEntityPath: ['financialMove'], LineComponent: FinancialMoveLine})}
    </Panel>
)

class SmartFinance extends Component {
    componentWillMount() {
        const {id, load} = this.props;
        load({id});
    }

    render() {
        const {fieldFor, listFor} = this.props;
        return (
            <div>
                <p>
                    Formulaire classique avec une liste éditable (listFor) pour le champs opérations sur le compte.
                </p>
                <Finance fieldFor={fieldFor} listFor={listFor} { ...this.props}/>
            </div>
        );
    }
};

Finance.displayName = 'SmartFinance ';

const formConfig = {
    formKey: 'userForm',
    entityPathArray: ['finance'],
    loadAction: loadFinanceAction,
    saveAction: saveFinanceAction
};

const ConnectedFinanceForm = compose(
    connectToMetadata(['financialMove', 'finance']),
    connectToForm(formConfig),
    connectToFieldHelpers()
)(SmartFinance);

export default ConnectedFinanceForm;

```

### Structure de l'objet
Pour cet exemple voici l'objet envoyé par le serveur.
```jsx
"finance":{
      "name":"Personal Loan Account",
      "amount":"157.00",
      "currency":"European Unit of Account 9(E.U.A.-9)",
      "moves":[
         {
            "transactionType":"withdrawal",
            "amount":"971.00"
         },
         {
            "transactionType":"payment",
            "amount":"838.00"
         }
      ]
   }
```
### Les actions

Les actions et les reducers n'ont rien de particulier pour une liste par rapport au formulaire classique.

```jsx
import {actionBuilder} from 'focus-graph/actions/entity-actions-builder';
import {loadFinance, saveFinance} from '../services/finance-service';

// Création de l'action de Load via un tableau de node pour le store redux, un type d'action et un service associé
const _loadFinanceAction = actionBuilder({names: ['finance' ], type: 'load', service: loadFinance});
//En retour on a l'action à appelé dans la vue, et les types des actions redux crées à donner au reduce redux
export const loadFinanceTypes = _loadFinanceAction.types;
export const loadFinanceAction = _loadFinanceAction.action;

// Création de l'action de Load via un tableau de node pour le store redux, un type d'action et un service associé
const _saveFinanceAction = actionBuilder({names: ['finance'], type: 'save', service: saveFinance});
//En retour on a l'action à appelé dans la vue, et les types des actions redux crées à donner au reduce redux
export const saveFinanceTypes = _saveFinanceAction.types;
export const saveFinanceAction = _saveFinanceAction.action;
```

### Les reducers

```jsx
import {reducerBuilder} from 'focus-graph/reducers/reducer-builder';
import {loadFinanceTypes, saveFinanceTypes} from '../actions/finance-actions';

const financeReducer = reducerBuilder({
    name: 'finance',
    loadTypes: loadFinanceTypes,
    saveTypes: saveFinanceTypes
});

export default financeReducer;
```

### La vue et le LineComponent

Dans notre exemple, le champ `moves` de finance est une liste. Ainsi il a été précisé lors de la déclaration de l'entity definition, l'entity de redirection de la liste. Chacune de ses lignes sera un objet de cette entity de redirection.

```jsx
// config/entity-definitions.js
export const finance = {
    name:  {
        domain: 'DO_TEXTE',
        isRequired: true
    },
    amount:  {
        domain: 'DO_AMOUNT',
        isRequired: true
    },
    currency: {
        domain: 'DO_SYMBOL',
        isRequired: true
    },
    date: {
        domain: 'DO_DATE',
        isRequired: false
    },
    moves:{
        redirect: ['financialMove']
    }
}
```

Il suffit alors d'ajouter un listFor :
`{listFor('moves', {redirectEntityPath: ['financialMove'], LineComponent: FinancialMoveLine})}`

En lui indiquant le champ qui doit être une liste et en lui donnant l'entité de la redirection ainsi que le LineCompoment :
```jsx
//views/user/financialMoveLine.js
import React, {PropTypes} from 'react';

function FinancialMoveLine({fieldForLine, ...otherProps}) {
    return (
    <div>
        <div> {fieldForLine('transactionType', {entityPath: 'financialMove'})} </div>
        <div> {fieldForLine('amount', {entityPath: 'financialMove'})} </div>
    </div>
  );
}

FinancialMoveLine.displayName = 'financialMoveLine';
FinancialMoveLine.propTypes = {
    onClick: PropTypes.func.isRequired,
    options: PropTypes.arrayOf(PropTypes.string)
};
FinancialMoveLine.defaultProps = {
    options: []
}
export default FinancialMoveLine;
```

Voici ce que vous devriez obtenir :
![image](https://cloud.githubusercontent.com/assets/8124804/22733835/bb42826a-edf3-11e6-93ca-5273032c0f45.png)

---

[Prochaine partie : un formulaire à deux nœud](../03-Deux%20noeuds/)
