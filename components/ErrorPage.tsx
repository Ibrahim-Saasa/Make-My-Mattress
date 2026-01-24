/**
 * Error Page Component
 * Displays detailed error information with recovery options
 */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppError, ErrorCode, ErrorSeverity } from "../src/utils/errorTypes";
import { errorLogger } from "../src/utils/errorLogger";

interface ErrorPageProps {
  error?: AppError;
  errorCode?: ErrorCode;
  showDetails?: boolean;
}

const ErrorPage: React.FC<ErrorPageProps> = ({
  error,
  errorCode = ErrorCode.UNKNOWN_ERROR,
  showDetails = false,
}) => {
  const navigate = useNavigate();
  const [showDetailedInfo, setShowDetailedInfo] = useState(showDetails);
  const [errorLogs, setErrorLogs] = useState<any[]>([]);

  useEffect(() => {
    // Get all error logs from the logger
    const logs = errorLogger.getErrorLogs();
    setErrorLogs(logs.slice(-5)); // Get last 5 errors
  }, []);

  // Get error message based on code
  const getErrorInfo = (
    code: ErrorCode,
  ): { title: string; description: string; icon: string; color: string } => {
    const infoMap: Record<
      ErrorCode,
      { title: string; description: string; icon: string; color: string }
    > = {
      [ErrorCode.NETWORK_ERROR]: {
        title: "Network Error",
        description:
          "Unable to connect to the server. Please check your internet connection.",
        icon: "🌐",
        color: "text-blue-600",
      },
      [ErrorCode.UNAUTHORIZED]: {
        title: "Unauthorized",
        description: "You do not have permission to access this resource.",
        icon: "🔒",
        color: "text-red-600",
      },
      [ErrorCode.SESSION_EXPIRED]: {
        title: "Session Expired",
        description: "Your session has expired. Please log in again.",
        icon: "⏱️",
        color: "text-orange-600",
      },
      [ErrorCode.RESOURCE_NOT_FOUND]: {
        title: "404 - Not Found",
        description: "The page you are looking for does not exist.",
        icon: "🔍",
        color: "text-purple-600",
      },
      [ErrorCode.VALIDATION_ERROR]: {
        title: "Validation Error",
        description: "Please check your input and try again.",
        icon: "✓",
        color: "text-yellow-600",
      },
      [ErrorCode.INSUFFICIENT_INVENTORY]: {
        title: "Out of Stock",
        description: "This item is currently out of stock.",
        icon: "📦",
        color: "text-red-600",
      },
      [ErrorCode.PAYMENT_FAILED]: {
        title: "Payment Failed",
        description: "Your payment could not be processed. Please try again.",
        icon: "💳",
        color: "text-red-600",
      },
      [ErrorCode.SERVICE_UNAVAILABLE]: {
        title: "Service Unavailable",
        description:
          "The service is temporarily unavailable. Please try again later.",
        icon: "🔧",
        color: "text-orange-600",
      },
      [ErrorCode.INTERNAL_SERVER_ERROR]: {
        title: "Server Error",
        description:
          "Something went wrong on our end. Our team is working on it.",
        icon: "⚠️",
        color: "text-red-600",
      },
      [ErrorCode.UNKNOWN_ERROR]: {
        title: "Oops!",
        description: "An unexpected error occurred. Please try again.",
        icon: "😞",
        color: "text-gray-600",
      },
      // Add other error codes as needed
      [ErrorCode.TIMEOUT_ERROR]: {
        title: "Request Timeout",
        description: "The request took too long. Please try again.",
        icon: "⏳",
        color: "text-orange-600",
      },
      [ErrorCode.CONNECTION_REFUSED]: {
        title: "Connection Refused",
        description:
          "Unable to connect. Please check your connection and try again.",
        icon: "📴",
        color: "text-red-600",
      },
      [ErrorCode.FORBIDDEN]: {
        title: "Access Denied",
        description: "You do not have permission to access this resource.",
        icon: "🚫",
        color: "text-red-600",
      },
      [ErrorCode.INVALID_CREDENTIALS]: {
        title: "Invalid Credentials",
        description: "Your username or password is incorrect.",
        icon: "🔑",
        color: "text-red-600",
      },
      [ErrorCode.INVALID_INPUT]: {
        title: "Invalid Input",
        description: "Please check your input and try again.",
        icon: "⚠️",
        color: "text-yellow-600",
      },
      [ErrorCode.MISSING_REQUIRED_FIELD]: {
        title: "Missing Information",
        description: "Please fill in all required fields.",
        icon: "📝",
        color: "text-yellow-600",
      },
      [ErrorCode.PRICE_MISMATCH]: {
        title: "Price Mismatch",
        description: "The price has changed. Please review your cart.",
        icon: "💰",
        color: "text-orange-600",
      },
      [ErrorCode.ORDER_PROCESSING_FAILED]: {
        title: "Order Failed",
        description: "Unable to process your order. Please try again.",
        icon: "📦",
        color: "text-red-600",
      },
      [ErrorCode.SHIPPING_UNAVAILABLE]: {
        title: "Shipping Unavailable",
        description: "We cannot deliver to your location at this time.",
        icon: "🚚",
        color: "text-red-600",
      },
      [ErrorCode.DATABASE_ERROR]: {
        title: "Database Error",
        description: "We encountered a database issue. Please try again.",
        icon: "💾",
        color: "text-red-600",
      },
      [ErrorCode.QUERY_FAILED]: {
        title: "Query Failed",
        description: "Unable to retrieve the requested data.",
        icon: "🔍",
        color: "text-red-600",
      },
      [ErrorCode.FILE_UPLOAD_FAILED]: {
        title: "Upload Failed",
        description: "Unable to upload the file. Please try again.",
        icon: "📤",
        color: "text-red-600",
      },
      [ErrorCode.FILE_SIZE_EXCEEDED]: {
        title: "File Too Large",
        description: "The file size exceeds the maximum allowed size.",
        icon: "📁",
        color: "text-yellow-600",
      },
      [ErrorCode.INVALID_FILE_TYPE]: {
        title: "Invalid File Type",
        description: "This file type is not supported.",
        icon: "📄",
        color: "text-yellow-600",
      },
      [ErrorCode.THIRD_PARTY_API_ERROR]: {
        title: "External Service Error",
        description: "Unable to connect to the external service.",
        icon: "🔗",
        color: "text-red-600",
      },
      [ErrorCode.EXTERNAL_SERVICE_FAILURE]: {
        title: "Service Failure",
        description: "An external service is experiencing issues.",
        icon: "⚠️",
        color: "text-orange-600",
      },
      [ErrorCode.DUPLICATE_RESOURCE]: {
        title: "Duplicate Entry",
        description: "This resource already exists.",
        icon: "🔄",
        color: "text-yellow-600",
      },
    };

    return infoMap[code] || infoMap[ErrorCode.UNKNOWN_ERROR];
  };

  const errorInfo = getErrorInfo(error?.code || errorCode);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Main Error Card */}
        <div className="bg-white rounded-lg shadow-xl overflow-hidden border-l-4 border-red-500">
          <div className="p-8">
            {/* Icon and Title */}
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">{errorInfo.icon}</div>
              <h1 className={`text-3xl font-bold ${errorInfo.color} mb-2`}>
                {errorInfo.title}
              </h1>
              <p className="text-gray-600 text-lg">{errorInfo.description}</p>
            </div>

            {/* Error Details */}
            {error && (
              <div className="bg-gray-50 rounded p-4 mb-6">
                <button
                  onClick={() => setShowDetailedInfo(!showDetailedInfo)}
                  className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-2"
                >
                  {showDetailedInfo ? "▼" : "▶"} Error Details
                </button>

                {showDetailedInfo && (
                  <div className="mt-4 space-y-2 text-sm font-mono text-gray-700">
                    <p>
                      <span className="font-bold">Code:</span> {error.code}
                    </p>
                    <p>
                      <span className="font-bold">Status:</span>{" "}
                      {error.statusCode}
                    </p>
                    <p>
                      <span className="font-bold">Severity:</span>{" "}
                      {error.severity}
                    </p>
                    <p>
                      <span className="font-bold">Retryable:</span>{" "}
                      {error.retryable ? "Yes" : "No"}
                    </p>
                    {!import.meta.env.PROD && (
                      <>
                        <p className="mt-4 font-bold">Developer Message:</p>
                        <p className="whitespace-pre-wrap break-words">
                          {error.developerMessage}
                        </p>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Recent Error Logs (Admin Only) */}
            {!import.meta.env.PROD && errorLogs.length > 0 && (
              <div className="bg-blue-50 rounded p-4 mb-6">
                <p className="text-sm font-bold text-blue-900 mb-2">
                  Recent Errors (Dev Only)
                </p>
                <div className="space-y-2">
                  {errorLogs.map((log, idx) => (
                    <div
                      key={idx}
                      className="text-xs text-blue-800 bg-white rounded p-2"
                    >
                      <p>
                        <span className="font-bold">{log.code}</span> -{" "}
                        {log.timestamp}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 flex-wrap justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
              >
                Refresh Page
              </button>
              <button
                onClick={() => navigate("/")}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors"
              >
                Go to Home
              </button>
              <button
                onClick={() => window.history.back()}
                className="px-6 py-2 bg-gray-300 text-gray-900 rounded-lg font-medium hover:bg-gray-400 transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>

        {/* Support Info */}
        <div className="mt-8 text-center text-gray-600">
          <p>
            Need help? Contact our support team at{" "}
            <a
              href="mailto:support@makemymattress.com"
              className="text-blue-500 hover:underline"
            >
              support@makemymattress.com
            </a>
          </p>
          <p className="mt-2 text-sm">
            Error ID: {error?.context?.requestId || "N/A"} •{" "}
            {new Date().toLocaleTimeString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
