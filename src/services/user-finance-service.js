import focusFetch from 'focus-application/fetch/fetch-proxy';

export const loadUserFinance = async ({id}) => {
  const response = await focusFetch({url: `http://localhost:9999/x/complex/${id}`, method: 'get'})
  const data = await response;
  console.log('DATA', data);
  return {...data, __Focus__updateRequestStatus: data.__Focus__updateRequestStatus};
}

export const saveUserFinance = async ({user}) => {
  await new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, 0);
  });
  return {...finance};

}
