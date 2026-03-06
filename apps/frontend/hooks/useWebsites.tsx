"use client";
import { API_BACKEND_URL } from "@/config";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { useEffect, useState, useCallback } from "react";

interface Website {
    id: string;
    url: string;
    paused: boolean;
    ticks: {
        id: string;
        createdAt: string;
        status: string;
        latency: number;
    }[];
}

export function useWebsites() {
    const { getToken } = useAuth();
    const [websites, setWebsites] = useState<Website[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refreshWebsites = useCallback(async () => {
        try {
            const token = await getToken();
            if (!token) {
                console.error("No token available");
                setError("Authentication token not available");
                setLoading(false);
                return;
            }
            setError(null);
            const response = await axios.get(`${API_BACKEND_URL}/api/v1/websites`, {
                headers: {
                    Authorization: token,
                },
                timeout: 10000,
            });

            setWebsites(response.data.websites);
        } catch (err) {
            console.error("Error fetching websites:", err);
            if (axios.isAxiosError(err)) {
                if (err.code === 'ECONNREFUSED' ||
                    err.code === 'ERR_NETWORK' ||
                    err.message === 'Network Error' ||
                    err.message?.includes('Network Error') ||
                    (!err.response && err.request)) {
                    setError("Cannot connect to API server. Please make sure the API server is running on port 8080.");
                } else if (err.response?.status === 401) {
                    setError("Authentication failed. Please try logging in again.");
                } else {
                    setError(err.response?.data?.message || err.message || "Failed to fetch websites");
                }
            } else {
                setError("An unexpected error occurred");
            }
        } finally {
            setLoading(false);
        }
    }, [getToken]);

    useEffect(() => {
        refreshWebsites();

        const interval = setInterval(() => {
            refreshWebsites();
        }, 1000 * 60 * 1);

        return () => clearInterval(interval);
    }, [refreshWebsites]);

    return { websites, refreshWebsites, loading, error };

}