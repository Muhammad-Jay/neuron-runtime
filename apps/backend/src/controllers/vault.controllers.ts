import { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import {vaultSecrets} from "../schemas";
import {db} from "../db/client";
import {encrypt, decrypt} from "../utils/secrets";
import {getAllVaultSecrets} from "../services/repository/vault.repository";

export const listSecrets = async (req: Request, res: Response) => {
    try {
        // Only return metadata for security
        console.log("loading secrets from DB...");
        const results = await getAllVaultSecrets();

        res.json(results);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch secrets' });
    }
};

export const createSecret = async (req: Request, res: Response) => {
    try {
        const { name, value } = req.body;
        if (!name || !value) {
            return res.status(400).json({ error: 'Name and value are required' });
        }

        console.log("Creating secret...");

        // TODO: Encrypt value.
        const encrypted = value;

        const [newSecret] = await db.insert(vaultSecrets).values({
            name,
            content: encrypted,
            iv: "82683837",
            tag: "37376",
            // iv: encrypted.iv,
            // tag: encrypted.tag,
        }).returning({ id: vaultSecrets.id, name: vaultSecrets.name });

        res.status(201).json(newSecret);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create secret' });
    }
};

export const deleteSecret = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as any;

        console.log(`Deleting secret ${id}...`);

        await db.delete(vaultSecrets).where(eq(vaultSecrets.id, id));
        res.json({ message: 'Secret deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete secret' });
    }
};

export const getDecryptedSecret = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as any;
        const [secret] = await db.select().from(vaultSecrets).where(eq(vaultSecrets.id, id));

        if (!secret) return res.status(404).json({ error: 'Not found' });

        const plainValue = decrypt({
            content: secret.content,
            iv: secret.iv,
            tag: secret.tag,
        });

        res.json({ name: secret.name, value: plainValue });
    } catch (error) {
        res.status(500).json({ error: 'Decryption failed' });
    }
};