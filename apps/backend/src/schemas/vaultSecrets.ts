import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";

export const vaultSecrets = pgTable("secrets", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    // Fields to store the encrypted payload
    content: text("content").notNull(),
    iv: text("iv").notNull(),
    tag: text("tag").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});