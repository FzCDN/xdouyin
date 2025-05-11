import { z } from "zod";

// Re-export types from schema
export * from "@shared/schema";

// Add any additional frontend-specific types here
export type VideoRef = React.RefObject<HTMLVideoElement>;
