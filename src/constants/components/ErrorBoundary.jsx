import React from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, info) {
        console.error("🔥 Error Boundary Caught:", error, info);
    }

    handleReload = () => {
        this.setState({ hasError: false, error: null });
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-black via-gray-950 to-black text-white text-center px-4">
                    <div className="bg-gray-900/70 border border-gray-800 rounded-2xl shadow-2xl p-10 backdrop-blur-xl max-w-md w-full">
                        <div className="flex flex-col items-center space-y-4">
                            <AlertTriangle className="w-16 h-16 text-red-500 animate-pulse" />
                            <h1 className="text-2xl font-bold tracking-wide">
                                Something went wrong
                            </h1>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                We’ve encountered an unexpected issue. Please try again or
                                refresh the page.
                            </p>

                            <div className="flex gap-4 mt-4">
                                <button
                                    onClick={this.handleReload}
                                    className="flex items-center gap-2 px-6 py-2 bg-blue-600/80 hover:bg-blue-700 transition rounded-xl font-semibold shadow-lg"
                                >
                                    <RefreshCcw className="w-4 h-4" /> Reload Page
                                </button>

                                <a
                                    href="/"
                                    className="flex items-center gap-2 px-6 py-2 bg-gray-800/80 hover:bg-gray-700 transition rounded-xl font-semibold shadow-lg"
                                >
                                    Go Home
                                </a>
                            </div>

                            <div className="text-xs text-gray-500 mt-6">
                                {this.state.error?.message && (
                                    <p className="break-words text-red-400/70">
                                        {this.state.error.message}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
