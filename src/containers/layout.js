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
import Animation from 'focus-components/animation';
import ContentActionsComponent from 'focus-components/header-actions';
// This should be done by default by focus-application
import { headerIsExpandedSelector} from 'focus-application/header/header-reducer';
import { expandHeader, unExpandHeader} from 'focus-application/header/header-actions'
const ConnectedScrollTrigger = connectToStore(headerIsExpandedSelector,{expandHeader, unExpandHeader})(ScrollTrigger);

// const SB = props => {
//     const {id,content, title, deleteMessage, actionHandler, actionText} = props;
//
//     return (
//         <div className="mdl-js-snackbar mdl-snackbar mdl-snackbar--active animated slideInUp" data-upgraded="MaterialSnackbar" aria-hidden="false">
//             <div className="mdl-snackbar__text">{props.content}</div>
//             {actionHandler && actionText &&
//                 <button className='mdl-snackbar__action' type='button' onClick={() => {actionHandler(props); deleteMessage({id});}}>{actionText}</button>
//             }
//             <button className="mdl-snackbar__action" type="button" onClick={() => deleteMessage({id})}>Close</button>
//         </div>
//     );
// }

const ConfirmComponent = props => <ConfirmWrapper {...props}  ConfirmationModal={ConfirmationPopin}/>
const AppMessages = props => <MessageCenter {...props} MessageComponent={SnackBar} />
// const StateDisplayer = connectToStore(s => s)(props => <pre><code>{JSON.stringify(props, null, 4)}</code></pre>)
const AppHeader = props => <Header {...props} ContentActionsComponent={ContentActionsComponent} />

//confirmation-popin
function AppLayout(props) {
    return  (
        <ConnectedScrollTrigger>
            <Layout AppHeader={AppHeader} LoadingBar={LoadingBar} ConfirmWrapper={ConfirmComponent} Menu={MenuLeft} MessageCenter={AppMessages}>
                {props.hasDevtools  && <DevTools />}
                <h1>Tuto Focus v3{props.name} </h1>
                {/* On récupère les définitions dans les props*/}
                {props.children}
            </Layout>
        </ConnectedScrollTrigger>
    )
};
AppLayout.defaultProps = {
    hasDevtools: true
};
export default AppLayout
