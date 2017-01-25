import React from 'react';
import {Provider as StoreProvider} from 'react-redux';
import {Provider as MetadataProvider} from 'focus-graph/behaviours/metadata';
import {Provider as FieldHelpersProvider} from 'focus-graph/behaviours/field';
import {Provider as MasterDataProvider} from 'focus-graph/behaviours/master-data';
import {masterDataConfig} from '../config/master-data-config';

import InputText from 'focus-components/input-text';

import router from '../router';

import * as definitions from '../config/entity-definitions';
import * as domains from '../config/domains';

const RootProvider = ({store}) =>
  <StoreProvider store={store}>
    <MetadataProvider definitions={definitions} domains={domains}>
      <FieldHelpersProvider InputComponent={InputText}>
        <MasterDataProvider configuration={masterDataConfig}>
          {router}
        </MasterDataProvider>
      </FieldHelpersProvider>
    </MetadataProvider>
  </StoreProvider>

 export default RootProvider;
