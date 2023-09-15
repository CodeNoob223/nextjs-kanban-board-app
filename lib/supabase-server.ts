import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Database } from "./database.types";

const createClient = () => createServerComponentClient<Database>({cookies});

export default createClient;