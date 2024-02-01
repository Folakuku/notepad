export interface IResponse {
  status: Boolean;
  message: string;
  data: object | string;
}

export interface EmptyResponse {
  empty: boolean;
  message: string[];
}
