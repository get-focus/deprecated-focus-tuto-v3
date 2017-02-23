import React from 'react';
import {connect as connectToStore} from 'react-redux';

// focus-application
import Layout from 'focus-application/layout'
import ScrollTrigger from 'focus-application/layout/scroll-trigger';
import LoadingBar from 'focus-application/fetch'
import ConfirmWrapper from 'focus-application/confirm';
import MessageCenter from 'focus-application/messages';
import Header from 'focus-application/header';
import DevTools from './dev-tools'
import MenuLeft from 'focus-components/menu';

// focus-components
import ConfirmationPopin from 'focus-components/confirmation-popin';
import SnackBar from 'focus-components/snackbar';
import ContentActionsComponent from 'focus-components/header-actions';

// This should be done by default by focus-application
import {headerIsExpandedSelector} from 'focus-application/header/header-reducer';
import {expandHeader, unExpandHeader} from 'focus-application/header/header-actions'
const ConnectedScrollTrigger = connectToStore(headerIsExpandedSelector,{expandHeader, unExpandHeader})(ScrollTrigger);

const ConfirmComponent = props => <ConfirmWrapper {...props} ConfirmationModal={ConfirmationPopin}/>
const AppMessages = props => <MessageCenter {...props} MessageComponent={SnackBar} />
const AppHeader = props => <Header {...props} ContentActionsComponent={ContentActionsComponent} />

//confirmation-popin
function AppLayout(props) {
    return  (
        <ConnectedScrollTrigger>
            <Layout AppHeader={AppHeader} LoadingBar={LoadingBar} ConfirmWrapper={ConfirmComponent} MessageCenter={AppMessages}>
                {props.children}
                {props.hasDevtools && <DevTools />}
            </Layout>
        </ConnectedScrollTrigger>
    )
};
AppLayout.defaultProps = {
    hasDevtools: true
};
export default AppLayout
