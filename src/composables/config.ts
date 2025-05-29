export const config = {
  api: {
    url: import.meta.env.VITE_API as string,
    strapi: import.meta.env.VITE_STRAPI as string
  }
};

if (!config.api.url || !config.api.strapi) {
  throw new Error('.env is missing VITE_API or VITE_STRAPI');
}

export default config;
