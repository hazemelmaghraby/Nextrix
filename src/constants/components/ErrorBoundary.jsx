import React from "react";

export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("❌ Error caught by ErrorBoundary:", error, errorInfo);
    }

    handleReload = () => {
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950 text-white text-center p-6">
                    <h1 className="text-3xl font-bold mb-3 text-red-500">
                        Something went wrong 😢
                    </h1>
                    <p className="text-gray-300 max-w-md mb-6">
                        {this.state.error?.message || "An unexpected error occurred."}
                    </p>
                    <button
                        onClick={this.handleReload}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 transition-all rounded-lg"
                    >
                        Reload Page
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
