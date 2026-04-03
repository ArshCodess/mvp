"use server"
import { revalidatePath } from "next/cache";

export async function EventsRevalidation() {
    revalidatePath("/admin/events");
    return null;
}