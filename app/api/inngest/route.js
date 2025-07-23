import { serve } from "inngest/next";
import { inngest, syncUserCreation, syncUserdeletion, syncUserUpdation } from "@/config/ingest";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    syncUserCreation,
    syncUserUpdation,
    syncUserdeletion
  ],
});