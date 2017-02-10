import React, {PropTypes, PureComponent} from 'react';
import { render } from 'react-dom';
import { Provider as StoreProvider } from 'react-redux';
import { Provider as MetadataProvider } from 'focus-graph/behaviours/metadata';
import { Provider as FieldHelpersProvider } from 'focus-graph/behaviours/field';
import { Provider as MasterdataProvider } from 'focus-graph/behaviours/master-data';
import { Provider as SearchProvider } from 'focus-search/behaviours/search';

import * as definitions from './config/entity-definitions/';
import * as domains from './config/domains/';
import {masterDataConfig} from './config/master-datas';

import InputText from 'focus-components/input-text';
import DisplayComponent from 'focus-components/input-display/text';
import SelectComponent from 'focus-components/select-mdl';
import SelectComponentDisplay from 'focus-components/input-display/text';

import RooterRoot from './router';

const fieldHelperProps = {
    InputComponent: InputText,
    DisplayComponent: DisplayComponent,
    SelectComponent: SelectComponent,
    SelectComponentDisplay: SelectComponentDisplay
};

//to make hot reload work, we have to write Application as a Component.
class Application extends PureComponent {
    render() {
        const {store} = this.props;
        return (
            <StoreProvider store={store}>
                <MetadataProvider definitions={definitions} domains={domains}>
                    <FieldHelpersProvider {...fieldHelperProps}>
                        <MasterdataProvider configuration={masterDataConfig}>
                            {RooterRoot}
                        </MasterdataProvider>
                    </FieldHelpersProvider>
                </MetadataProvider>
            </StoreProvider>
        );
    }
}
Application.displayName = 'Application';
Application.propTypes = {
    store: PropTypes.object.isRequired
};
export default Application;
