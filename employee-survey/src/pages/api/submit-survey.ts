import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const surveySchema = z.object({
  employeeName: z.string().min(2),
  employeeEmail: z.string().email(),
  department: z.string().min(2),
  workLifeBalance: z.number().min(1).max(5),
  jobSatisfaction: z.number().min(1).max(5),
  feedback: z.string().optional(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const validatedData = surveySchema.parse(req.body);

      // Check if email already exists
      const existingSurvey = await prisma.survey.findUnique({
        where: { employeeEmail: validatedData.employeeEmail }
      });

      if (existingSurvey) {
        return res.status(400).json({ 
          error: "This email has already submitted a survey",
        });
      }

      // Create new survey if email doesn't exist
      const survey = await prisma.survey.create({
        data: validatedData,
      });

      res.status(200).json({ 
        message: "Survey submitted successfully",
        data: survey 
      });
    } catch (error: unknown) {
      // Handle Prisma errors
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        (error as { code?: string }).code === "P2002"
      ) {
        return res.status(400).json({
          error: "This email has already submitted a survey",
        });
      }
      
      // Other errors
      res.status(400).json({ 
        error: "Invalid survey data",
        details:
          typeof error === "object" && error !== null && "errors" in error
            ? (error as { errors?: unknown }).errors
            : typeof error === "object" && error !== null && "message" in error
            ? (error as { message?: string }).message
            : String(error),
      });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}