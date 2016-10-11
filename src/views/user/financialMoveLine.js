import React, {PropTypes} from 'react';

function FinancialMoveLine({fieldForLine,  ...otherProps}) {
    return (
    <div>
        <div>  {fieldForLine('transactionType', {entityPath: 'financialMove'})} </div>
        <div>  {fieldForLine('amount', {entityPath: 'financialMove'})}  </div>
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
