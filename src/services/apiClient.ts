import { ApiError } from './apiErrors';

export const API_BASE_URL = import.meta.env.MODE === 'production' 
  ? 'https://api.board.go-gradually.me' // TODO: 실제 프로덕션 API URL로 변경해주세요.
  : 'http://localhost:8080';

export async function handleApiResponseError(response: Response, defaultErrorMessage: string): Promise<ApiError> {
  let backendMessage = defaultErrorMessage;
  try {
    const errorText = await response.text(); 
    if (errorText) {
      backendMessage = errorText;
    }
  } catch (e) {
    console.error('Failed to parse error response body:', e);
  }
  return new ApiError(defaultErrorMessage, response.status, backendMessage);
} 