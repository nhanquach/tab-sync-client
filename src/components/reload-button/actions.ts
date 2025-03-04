"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const refresh = async () => {
  try {
    revalidatePath("/dashboard", "page");
    redirect("/dashboard");
  } catch (error) {
    console.error(error);
  }
};

export default refresh;
