import React, { useState } from "react";
import { AppError } from "./errorTypes";
import { RetryHandler } from "./errorRecovery";
import { useErrorHandler } from "../../components/ErrorBoundary";

export const ExampleFormComponent: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<AppError | null>(null);
  const handleError = useErrorHandler();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData(e.currentTarget);
      const data = Object.fromEntries(formData);

      await RetryHandler.executeWithRetry(async () => {
        const response = await fetch("/api/submit", {
          method: "POST",
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        return response.json();
      });

      alert("Form submitted successfully");
    } catch (err) {
      if (err instanceof AppError) {
        setError(err);
      } else {
        handleError(err as Error, { context: "form-submission" });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="mb-4 rounded bg-red-100 p-4 text-red-700">
          {error.userMessage}
        </div>
      )}
      <button disabled={isLoading}>
        {isLoading ? "Loading..." : "Submit"}
      </button>
    </form>
  );
};
