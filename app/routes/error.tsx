import React from "react";

type ErrorPageProps = {
  status?: number | string;
  message?: string;
};

const Error: React.FC<ErrorPageProps> = ({
  status = 500,
  message = "Something went wrong",
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-xl bg-card border border-border-clr p-8 text-center shadow-sm">
        {/* Status Code */}
        <h1 className="text-heading-300 font-bold text-danger mb-2">
          {status}
        </h1>

        {/* Message */}
        <p className="text-text-200 text-clr-200 mb-6">
          {message}
        </p>

        {/* Optional action */}
        <button
          onClick={() => window.location.href = '/'}
          className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-text-100 text-clr-100 hover:opacity-90 transition"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

export default Error;
