import RmkFwEditorError from "../lib/error";

export interface IDataResponse<T> {
  data: T
}
export interface IErrorResponse {
  error: RmkFwEditorError;
}


export type IApiResponse<T> = IErrorResponse | IDataResponse<T>

export interface EmptyData { }
