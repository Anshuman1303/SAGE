"use server";

import { revalidatePath } from "next/cache";

export async function submitAssignment(formData: FormData) {
  try {
    // In a real app, you would validate the form data here
    const assignmentId = formData.get("assignmentId");

    // Send the file to the Gemini API route
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/gemini`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to submit assignment");
    }

    const result = await response.json();

    // In a real app, you would save the submission to a database here

    // Revalidate the assignments page to show the updated status
    revalidatePath("/");
    revalidatePath(`/assignments/${assignmentId}`);

    return { success: true, data: result };
  } catch (error) {
    console.error("Error submitting assignment:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to submit assignment",
    };
  }
}
