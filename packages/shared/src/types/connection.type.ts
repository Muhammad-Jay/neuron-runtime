
export type AuthType = "OAuth2" | "ApiKey" | "BasicAuth";

export interface Connection {
    id: string;             // UUID
    name: string;           // "My Slack Workspace"
    integrationId: string;  // "slack" or "whatsapp"
    authType: AuthType;
    status: "active" | "expired" | "error";
    // The actual sensitive data stays in the Vault, referenced by ID
    vaultReferenceId: string;
    createdAt: string;
}