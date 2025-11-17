"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { useState } from 'react'
import useSeller from "../hooks/useSeller";
import { WebSocketProvider } from "../context/web-socket-context";
import { usePathname } from "next/navigation";

const Providers = ({ children }: { children: React.ReactNode }) => {
    const [queryClient] = useState(() => new QueryClient());

    return (
        <QueryClientProvider client={queryClient}>
            <ProvidersWithWebSocket>
                {children}
            </ProvidersWithWebSocket>
        </QueryClientProvider>
    )
}

const ProvidersWithWebSocket = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const { seller, isLoading } = useSeller();
    const pathname = usePathname();


    if (pathname === "/inbox" && isLoading) return null;
    // if (isLoading) return null;

    return (
        <>
            {seller && <WebSocketProvider seller={seller}>{children}</WebSocketProvider>}
            {!seller && children}
        </>
    );
};

export default Providers;