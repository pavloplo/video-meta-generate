"use client";

import { useState, useEffect } from "react";
import { VideoMetadataForm } from "./VideoMetadataForm";
import { MobileMetadataForm } from "./MobileMetadataForm";

export const ResponsiveMetadataForm = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth < 1024);
        };

        // Check on mount
        checkIsMobile();

        // Listen for resize
        window.addEventListener('resize', checkIsMobile);
        return () => window.removeEventListener('resize', checkIsMobile);
    }, []);

    // Use mobile layout for screens < 1024px, desktop for larger
    return isMobile ? <MobileMetadataForm /> : <VideoMetadataForm />;
};
