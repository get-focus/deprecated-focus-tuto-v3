import React, {PropTypes, Component} from 'react';
import { browserHistory, Router } from 'react-router';
import { Provider as StoreProvider } from 'react-redux';
import { Provider as MetadataProvider } from 'focus-graph/behaviours/metadata';
import { Provider as FieldHelpersProvider } from 'focus-graph/behaviours/field';
import { Provider as MasterdataProvider } from 'focus-graph/behaviours/master-data';

import routes from './router';
import * as definitions from './config/entity-definitions';
import * as domains from './config/domains';
import masterdatas from './config/master-datas';

import InputText from 'focus-components/input-text';
import DisplayComponent from 'focus-components/input-display/text';
import SelectComponent from 'focus-components/select-mdl';
import SelectComponentDisplay from 'focus-components/input-display/text';

const fieldHelperProps = {
    InputComponent: InputText,
    DisplayComponent: DisplayComponent,
    SelectComponent: SelectComponent,
    SelectComponentDisplay: SelectComponentDisplay
};

class Root extends Component {
    render() {
        const {store} = this.props;
        return (
            <StoreProvider store={store}>
                <MetadataProvider definitions={definitions} domains={domains}>
                    <FieldHelpersProvider {...fieldHelperProps}>
                        <MasterdataProvider configuration={masterdatas}>
                            <Router history={browserHistory} routes={routes} />
                        </MasterdataProvider>
                    </FieldHelpersProvider>
                </MetadataProvider>
            </StoreProvider>
        );
    }
}

Root.propTypes = {
    store: PropTypes.object.isRequired
};

export default Root;
