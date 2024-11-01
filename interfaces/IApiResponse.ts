import RmkFwEditorError from "../lib/error";

export interface IApiResponse<T> {
  error?: RmkFwEditorError;
  data?: T
}
export interface EmptyData { }
