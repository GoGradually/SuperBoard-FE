import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import ErrorBoundary from './components/common/ErrorBoundary'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary 
      fallbackRender={(error, statusCode, backendMessage) => (
        <div className="container mx-auto p-8 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            {statusCode ? `오류 ${statusCode}` : "애플리케이션 오류"}
          </h1>
          <p className="text-gray-700 mb-6">
            {backendMessage || error.message || "알 수 없는 오류가 발생했습니다."}
          </p>
          <p className="text-sm text-gray-500 mb-4">문제를 해결하기 위해 노력 중입니다. 잠시 후 다시 시도해주세요.</p>
          <button 
            onClick={() => window.location.assign('/')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            홈으로 돌아가기
          </button>
        </div>
      )}
    >
    <App />
    </ErrorBoundary>
  </React.StrictMode>,
)
