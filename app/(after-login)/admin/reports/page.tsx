"use client";

import { embedDashboard } from "@superset-ui/embedded-sdk";
import { useEffect, useRef, useState } from "react";
import { getSupersetGuestToken } from "./actions";
import { AdminNav } from "@/components/admin-nav";

export default function SupersetDashboardPage() {
  const dashboardRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const embed = async () => {
      try {
        const data = await getSupersetGuestToken();

        if (data.token && data.supersetDomain && dashboardRef.current) {
          await embedDashboard({
            id: data.dashboardId,
            supersetDomain: data.supersetDomain,
            mountPoint: dashboardRef.current,
            fetchGuestToken: () => Promise.resolve(data.token),
            dashboardUiConfig: {
              hideTitle: true,
              hideChartControls: true,
              hideTab: true,
              filters: {
                expanded: true
              },
              urlParams: {
                standalone: 3
              }
            }
          });

          // Apply styling after embed
          const iframe = dashboardRef.current.querySelector("iframe");
          if (iframe) {
            iframe.style.width = "100%";
            iframe.style.height = "100%";
            iframe.style.border = "none";
          }
        } else {
          setError("Missing token or domain from Server Action");
        }
      } catch (error: any) {
        console.error("Failed to load dashboard:", error);
        setError(error.message || "Unknown error");
      }
    };

    embed();
  }, []);

  if (error) return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      <div className="container mx-auto px-4 md:px-8">
        <AdminNav className="mb-0" />
      </div>
      <div className="flex-1 p-4 text-red-500">Error loading dashboard: {error}</div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      <div className="container mx-auto px-4 md:px-8">
        <AdminNav className="mb-0" />
      </div>
      <div className="flex-1 w-full relative bg-slate-50 dark:bg-slate-900 border-t">
        <div id="superset-container" ref={dashboardRef} className="absolute inset-0 w-full h-full" />
      </div>
    </div>
  );
}
