import createfocusFetchProxy from 'focus-application/fetch/fetch-proxy'
let fetch;

export const initFetch =  dispatch => {
  fetch = createfocusFetchProxy(dispatch);
}
export default (...fetchArgs) =>  fetch(...fetchArgs);
