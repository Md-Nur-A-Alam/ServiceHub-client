"use server";

export async function subscribeToNewsletter(email: string) {
  console.log("Newsletter subscription:", email);
  return { success: true };
}
