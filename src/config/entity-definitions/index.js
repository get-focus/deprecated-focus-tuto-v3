export const finance = {
    uuid:  {
        domain: 'DO_ID',
        isRequired: true
    },
    name:  {
        domain: 'DO_TEXTE',
        isRequired: true
    },
    amount:  {
        domain: 'DO_MONTANT',
        isRequired: true
    },
    moves: {
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
