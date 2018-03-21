async function getAPI(requestUrl: string): Promise<null> {
  const response = await fetch(requestUrl);

  if (response.ok) {
    return await response.json();
  }

  throw new Error();
}

type Api = {
  get(requestUrl: string): Promise<null>,
  setMockResponse?(data: any): void;
};

const api: Api = {
  get: getAPI,
};

export default api;