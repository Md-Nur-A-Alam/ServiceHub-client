"use server";

export async function submitContactForm(data: any) {
  console.log("Contact action received:", data);
  return { success: true };
}
