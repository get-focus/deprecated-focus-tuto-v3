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
