import focusFetch from 'focus-application/fetch/fetch-proxy';

export const loadFinance = async ({id}) => {
    const response = await focusFetch({url: `http://localhost:9999/x/complex/${id}`, method: 'get'})
    const data = await response;
    return {...data.finance, __Focus__updateRequestStatus: data.__Focus__updateRequestStatus};
}

export const saveFinance = async ({finance}) => {
    await new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, 0);
    });
    return {...finance};

}
