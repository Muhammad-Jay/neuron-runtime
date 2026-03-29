'use server';

export async function authorizedFetch(
    url: string,
    options: RequestInit = {},
    token: any
) {
    if (!token){
        throw new Error("Missing token");
    }

    const response = await fetch(url, {
        ...options,
        headers: {
            ...options?.headers,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error("Request failed");
    }

    console.log("Request response", response);
    return response.json();
}