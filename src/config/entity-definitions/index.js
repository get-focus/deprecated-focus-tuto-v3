export const user = {
    uuid: {
        domain: 'DO_ID',
        isRequired: true
    },
    firstName: {
        domain: 'DO_TEXTE',
        isRequired: true
    },
    lastName: {
        domain: 'DO_TEXTE',
        isRequired: true
    },
    civility: {
        domain: 'DO_CIVILITE',
        isRequired: true
    },
    sex: {
        domain: 'DO_SEXE',
        isRequired: true
    },
    style: {
        domain: 'DO_CHECKBOX',
        isRequired: true
    },
    accountsNames: {
        domain: 'DO_ACCOUNTS_NAMES',
        isRequired: true
    },
    date: {
        domain: 'DO_DATE',
        isRequired: false
    }
}

export const finance = {
    uuid: {
        domain: 'DO_ID',
        isRequired: true
    },
    name: {
        domain: 'DO_TEXTE',
        isRequired: true
    },
    amount: {
        domain: 'DO_MONTANT',
        isRequired: true
    },
    moves:{
        redirect: ['financialMove']
    }
}

export const financialMove = {
    transactionType: {
        domain: 'DO_CODE',
        isRequired: true
    },
    amount: {
        domain: 'DO_MONTANT',
        isRequired: true
    }
}
