export type CommonResponse<T> = {
  success: true,
  resultInfo?: T
} | {
  success: false
}
