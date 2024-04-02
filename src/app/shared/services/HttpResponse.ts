export interface HttpResponse<T> {
  message: string,
  success: boolean,
  data: T
}
