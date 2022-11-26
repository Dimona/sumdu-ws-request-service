export type TRequest<T extends Record<string, any>> = {
  requestId: string;
  type: string;
  email: string;
  payload: T;
  createdAt: number;
}

export type TWeatherPayload = {
  longitude: number;
  latitude: number;
}
