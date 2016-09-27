import React from 'react';
import  {compose} from 'redux';
import {connect as connectToState} from 'react-redux';
import {connect as connectToMetadata} from 'focus-graph/behaviours/metadata';
import {connect as connectToFieldHelpers} from 'focus-graph/behaviours/field';
import {selectFieldsByFormKey} from 'focus-graph/store/create-store';

function PureExpandedUserHeader({textFor}){
  return <div className='ExpandedUserHeader'>
      {textFor('uuid', {entityPath: 'user'})}
      {textFor('firstName', {entityPath: 'user'})}
      {textFor('lastName', {entityPath: 'user'})}
  </div>
};
export const ExpandedUserHeader = compose(
    connectToState(selectFieldsByFormKey('userForm')),
    connectToMetadata(['user']),
    connectToFieldHelpers()
)(PureExpandedUserHeader);

export const SummaryUserHeader = compose(
    connectToState(selectFieldsByFormKey('userForm')),
    connectToMetadata(['user']),
    connectToFieldHelpers()
)(PureExpandedUserHeader);
