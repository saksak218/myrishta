import { z } from "zod";

export const DeploymentEnvironmentSchema = z.enum(["local", "staging", "production"]);
export type DeploymentEnvironment = z.infer<typeof DeploymentEnvironmentSchema>;

export const PublicRuntimeConfigSchema = z.object({
  environment: DeploymentEnvironmentSchema,
  apiUrl: z.string().url(),
  clerkPublishableKey: z.string().startsWith("pk_"),
});

export const ServerRuntimeConfigSchema = PublicRuntimeConfigSchema.extend({
  databaseUrl: z.string().startsWith("postgresql://"),
  clerkSecretKey: z.string().startsWith("sk_"),
  mediaPrivateKey: z.string().min(1),
  pushAccessToken: z.string().min(1),
});

export const parsePublicRuntimeConfig = (input: unknown) => PublicRuntimeConfigSchema.parse(input);
export const parseServerRuntimeConfig = (input: unknown) => ServerRuntimeConfigSchema.parse(input);
