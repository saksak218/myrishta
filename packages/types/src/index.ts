export type EntityId = string & { readonly __brand: "EntityId" };

export interface VersionedEntity {
  id: EntityId;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export type Loadable<T> =
  | { status: "loading" }
  | { status: "empty" }
  | { status: "offline"; cached?: T }
  | { status: "error"; message: string }
  | { status: "ready"; data: T };
