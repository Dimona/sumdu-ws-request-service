export type TRequest<T extends Record<string, any>> = {
  id: string;
  email: string;
  payload: T;
  createdAt: number;
}

export type TWeatherPayload = {
  longitude: number;
  latitude: number;
}
