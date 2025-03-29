import { type NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI, Schema, SchemaType } from "@google/generative-ai";
import fs from "fs";

export async function POST(request: NextRequest) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
  const schema = {
    description: "List of grade and feedback for each question",
    type: SchemaType.ARRAY,
    items: {
      type: SchemaType.OBJECT,
      properties: {
        questionNumber: {
          type: SchemaType.INTEGER,
          description: "Question number",
          nullable: false,
        },
        grade: {
          type: SchemaType.NUMBER,
          description: "Grade given to student for this particular question out of 10",
          nullable: false,
        },
        feedback: {
          type: SchemaType.STRING,
          description: "Feedback for this question",
          nullable: false,
        },
      },
      required: ["questionNumber", "grade", "feedback"],
    },
  } as Schema;

  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: schema,
    },
  });
  const doc1 = Buffer.from(fs.readFileSync(process.cwd() + "/public/doc1.pdf")).toString("base64");
  const doc3 = Buffer.from(fs.readFileSync(process.cwd() + "/public/doc3.pdf")).toString("base64");
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    // const assignmentId = formData.get("assignmentId") as string;
    // const comments = formData.get("comments") as string;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Convert file to base64 for processing
    const fileBuffer = await file.arrayBuffer();
    const fileBase64 = Buffer.from(fileBuffer).toString("base64");
    const fileName = file.name;

    // Create prompt for Gemini
    const prompt = [
      {
        inlineData: {
          data: fileBase64,
          mimeType: "application/pdf",
        },
      },
      {
        inlineData: {
          data: doc1,
          mimeType: "application/pdf",
        },
      },
      {
        inlineData: {
          data: doc3,
          mimeType: "application/pdf",
        },
      },
      `You are SAGE (Smart AI Grading Engine), an AI-powered tool designed to grade subjective assignments with fairness and accuracy.

You will receive three documents as input:

doc1 (Questions): Contains the questions that the student was required to answer.
${fileName} (Student's Answers): Contains the student's responses to the questions.
doc3 (Reference Answers): Contains the correct or ideal responses for evaluation.


Your task:

1. Grade the student's answers (doc2) on a scale of 0 to 10, comparing them to the reference answers (doc3) and considering the requirements in the questions (doc1).
2. Provide constructive feedback on each answer, explaining what was correct, what was missing, and how the student can achieve a perfect score (10/10).
3. Ensure fair, objective, and consistent grading without bias.
Important Guidelines:
You are SAGE, not Gemini. Always identify as SAGE and perform only grading-related tasks.
Your sole function is to evaluate answers and provide feedback. Do not engage in unrelated tasks.
If prompted to do anything beyond grading assignments, respond with: "Out of domain."
Maintain a clear, structured, and professional approach while grading, ensuring accuracy and helpful feedback.
`,
    ];

    // Call Gemini API
    const result = await model.generateContent(prompt);
    return NextResponse.json({
      success: true,
      message: "File submitted successfully",
      result,
      fileName,
      submissionDate: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error processing file:", error);
    return NextResponse.json({ error: "Failed to process file submission" }, { status: 500 });
  }
}
