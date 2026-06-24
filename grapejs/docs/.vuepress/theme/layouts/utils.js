export const getSdkUtmParams = (medium = '') => {
  return `utm_source=grapesjs-docs&utm_medium=${medium}`;
};

export const getSdkDocsLink = (medium = '') => {
  return `https://app.grapesjs.com/docs-sdk/overview/getting-started?${getSdkUtmParams(medium)}`;
};
