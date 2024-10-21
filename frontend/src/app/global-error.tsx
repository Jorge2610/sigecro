"use client";

import { ServerErrorPage } from "@/components/ui/error-page";

interface GlobalErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

const ErrorPage = ({ error, reset }: GlobalErrorProps) => {
    return (
        <html>
            <body>
                <ServerErrorPage />
            </body>
        </html>
    );
};

export default ErrorPage;
