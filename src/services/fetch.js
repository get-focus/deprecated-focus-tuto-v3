import createfocusFetchProxy from 'focus-application/fetch/fetch-proxy'
let fetch;

export const initFetch =  dispatch => {
  fetch = createfocusFetchProxy(dispatch);
}
export default (...fetchArgs) => {
    const {url, data, method} = fetchArgs[0];
    return fetch(url, {
        method: method,
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    });
}


export const buildUrl = (url, method, data) => {
    return {
        url,
        method,
        data
    }
}

export const getAsync = async ({url, data, method}, isReturnVoid) => {
   const response = await fetchCustom({url, data, method});
   if (isReturnVoid) {
       return {status: response.status};
   } else {
       const dataServer = await response.response.json();
       return {...dataServer};
   }
}
