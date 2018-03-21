type Api = {
  get: () => any;
  setMockResponse(data: any): void
};

const api: Api = jest.genMockFromModule('../api');
let mockResponse = {};

api.get = () => new Promise(resolve => resolve(mockResponse));
api.setMockResponse = (data: any) => {
  mockResponse = data;
};

export default api;
