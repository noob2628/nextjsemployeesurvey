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
      // Remove JSON.parse() since Next.js already parses the body
      const validatedData = surveySchema.parse(req.body);

      // Database operation
      const survey = await prisma.survey.create({
        data: validatedData,
      });

      res.status(200).json({ 
        message: "Survey submitted successfully",
        data: survey 
      });
    } catch (error: unknown) {
      console.error("Error:", error);
      let details = "Unknown error";
      if (error && typeof error === "object") {
        if ("errors" in error) {
          details = JSON.stringify((error as z.ZodError).errors);
        } else if ("message" in error) {
          details = (error as Error).message;
        }
      }
      res.status(400).json({ 
        error: "Invalid survey data",
        details
      });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}