import {db} from "../../db/client";
import {vaultSecrets} from "../../schemas";

export async function getAllVaultSecrets() {

    return db
        .select({
            id: vaultSecrets.id,
            name: vaultSecrets.name,
            iv: vaultSecrets.iv,
            tag: vaultSecrets.tag,
            content: vaultSecrets.content,
            createdAt: vaultSecrets.createdAt,
        })
        .from(vaultSecrets);
}