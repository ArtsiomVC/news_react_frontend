export const getUrlParamsString = (obj) => {
  const urlParams = {};

  for (let key in obj) {
    if (obj[key]) {
      urlParams[key] = obj[key];
    }
  }

  const paramsString = new URLSearchParams(urlParams).toString();

  return paramsString ? `?${paramsString}` : '';
};
