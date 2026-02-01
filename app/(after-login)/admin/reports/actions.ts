"use server";

import axios from "axios";

export async function getSupersetGuestToken() {
    const SUPERSET_URL = process.env.SUPERSET_URL?.replace(/\/$/, "") || "";
    const SUPERSET_USERNAME = process.env.SUPERSET_USERNAME!;
    const SUPERSET_PASSWORD = process.env.SUPERSET_PASSWORD!;
    const DASHBOARD_ID = process.env.SUPERSET_DASHBOARD_ID!;

    try {
        console.log("Attempting Superset Login...");
        // 1️⃣ Login to Superset
        const loginRes = await axios.post(
            `${SUPERSET_URL}/api/v1/security/login`,
            {
                username: SUPERSET_USERNAME,
                password: SUPERSET_PASSWORD,
                provider: "db",
                refresh: true,
            }
        );

        const accessToken = loginRes.data.access_token || loginRes.data.token;

        // 2️⃣ Create Guest Token
        console.log("Requesting Guest Token for dashboard:", DASHBOARD_ID);
        const guestTokenRes = await axios.post(
            `${SUPERSET_URL}/api/v1/security/guest_token/`,
            {
                resources: [
                    {
                        type: "dashboard",
                        id: DASHBOARD_ID,
                    },
                ],
                rls: [],
                user: {
                    username: "embedded_user",
                    first_name: "Embedded",
                    last_name: "User",
                },
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        return {
            token: guestTokenRes.data.token,
            supersetDomain: SUPERSET_URL,
            dashboardId: DASHBOARD_ID
        };
    } catch (err: any) {
        console.error("Superset token error:", err.message);
        if (err.response) {
            console.error("Status:", err.response.status);
            console.error("Data:", JSON.stringify(err.response.data, null, 2));
        }
        throw new Error("Failed to generate guest token");
    }
}
