import React, { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { ApiError } from '../services/apiErrors';

interface Props {
  children: ReactNode;
  fallbackRender?: (error: Error, statusCode?: number, backendMessage?: string) => ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  statusCode?: number;
  backendMessage?: string;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    let statusCode: number | undefined;
    let backendMessage: string | undefined;

    if (error instanceof ApiError) {
      statusCode = error.statusCode;
      backendMessage = error.backendMessage;
    }
    return { hasError: true, error, statusCode, backendMessage };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    // 여기에 Sentry, LogRocket 같은 에러 리포팅 서비스 연동 가능
  }

  public render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallbackRender) {
        return this.props.fallbackRender(this.state.error, this.state.statusCode, this.state.backendMessage);
      }
      
      // 기본 폴백 UI
      let displayMessage = "죄송합니다. 요청 처리 중 문제가 발생했습니다.";
      if (this.state.backendMessage) {
        displayMessage = `오류: ${this.state.backendMessage}`;
      } else if (this.state.error.message) {
        displayMessage = this.state.error.message;
      }

      let statusCodeInfo = "";
      if (this.state.statusCode) {
        statusCodeInfo = ` (상태 코드: ${this.state.statusCode})`;
      }

      return (
        <div className="container mx-auto p-8 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">오류 발생{statusCodeInfo}</h1>
          <p className="text-gray-700 mb-6">{displayMessage}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            새로고침
          </button>
          {/* 특정 페이지로 이동하는 버튼 등을 추가할 수 있음 */}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 