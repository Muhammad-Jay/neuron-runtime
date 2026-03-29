import {getAllVaultSecrets} from "../services/repository/vault.repository";

export type VaultPayload = {
    id: string
    name: string
    content: string
    iv: string
    tag: string
}

class VaultService {

    private cache: Map<string, string>

    constructor() {
        this.cache = new Map()
    }

    async resolve(key: string): Promise<string> {

        if (this.cache.has(key)) {
            return this.cache.get(key)!
        }

        const secret = await this.fetchSecret(key)

        if (!secret) {
            throw new Error(`Vault secret not found: ${key}`)
        }

        const value = secret.content;

        this.cache.set(key, value)

        return value
    }

    private async fetchSecret(key: string): Promise<VaultPayload | null> {

        try {
            // Fetch the full list of secrets (metadata + encrypted payloads)
            const vault = await getAllVaultSecrets();

            console.log("vault:", vault);
            if (!vault || !Array.isArray(vault)) return null;

            console.log("Attempting to resolve vault for key:", key);
            const secret = vault.find((s: VaultPayload) => s.name === key);

            return secret || null;
        } catch (error) {
            console.error("Vault fetch error:", error);
            return null;
        }
    }

}

export const vaultService = new VaultService();
