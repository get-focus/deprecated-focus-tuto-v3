import focusFetch from 'focus-application/fetch/fetch-proxy'

export const loadUser = async ({id}) => {
    return focusFetch({url: `http://localhost:9999/x/users/${id}`, method: 'GET'}).then((data) => {
        return {
            ...data.user,
            __Focus__updateRequestStatus: data.__Focus__updateRequestStatus
        };
    });
}

export const saveUser = async ({user}) => {
    await new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, 0);
    });
    return {...user};
}

export const loadFinance = async ({id}) => {
    return focusFetch({url: `http://localhost:9999/x/finances/${id}`, method: 'GET'}).then((data) => {
        return {
            ...data.finance,
            __Focus__updateRequestStatus: data.__Focus__updateRequestStatus
        };
    });
}

export const saveFinance = async ({finance}) => {
    await new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, 0);
    });
    return {...finance};
}

export const loadUserFinance = async ({id}) => {
    return focusFetch({url: `http://localhost:9999/x/complex/${id}`, method: 'get'});
}

export const saveUserFinance = async ({user}) => {
    await new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, 0);
    });
    return {...finance};
}

export const loadError = async ({user}) => {
    return focusFetch({url: `http://localhost:9999/x/error`, method: 'GET'}).then((data) => {
        return {
            ...data.user,
            __Focus__updateRequestStatus: data.__Focus__updateRequestStatus,
            __Focus__status: data.__Focus__status,
            globalErrors: data.globalErrors
        };
    });
}
