import React from "react";

const LMSFooter = () => {
    return (
        <footer className="mt-24 py-6 border-t border-blue-900/40 text-center text-zinc-400 text-sm">
            <p>
                © {new Date().getFullYear()} Nextrix LMS — Empowering continuous learning.
            </p>
        </footer>
    );
};

export default LMSFooter;
