import { serve } from "inngest/next";
import { createUserOrder, inngest, syncUserCreation, syncUserdeletion, syncUserUpdation } from "@/config/inngest";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    syncUserCreation,
    syncUserUpdation,
    syncUserdeletion,
    createUserOrder
  ],
});