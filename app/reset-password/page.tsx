import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Reset Password - BiteBase",
  description: "Reset your BiteBase account password",
};

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Reset Password
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Password reset functionality is coming soon.
            </p>
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/auth"
              className="text-primary-600 hover:text-primary-500"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}