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
  date: {
    domain: 'DO_DATE',
    isRequired: false
  },
  style: {
    domain: 'DO_CHECKBOX',
    isRequired: true
  },
  civility: { domain: 'DO_CIVILITE', isRequired: true},
  accountsNames: {domain: 'DO_ACCOUNTS_NAMES', isRequired: true}
}

export const address = {
  uuid: {
    domain: 'DO_ID',
    isRequired: true
  },
  city: {
    domain: 'DO_TEXTE',
    isRequired: true
  }
}

export const finance = {
  name:  {
    domain: 'DO_TEXTE',
    isRequired: true
  },
  amount:  {
    domain: 'DO_AMOUNT',
    isRequired: true
  },
  currency:  {
    domain: 'DO_SYMBOL',
    isRequired: true
  },
  date: {
    domain: 'DO_DATE',
    isRequired: false
  },
  test : {
    domain: 'DO_CHECKBOX',
    isRequired: false
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
