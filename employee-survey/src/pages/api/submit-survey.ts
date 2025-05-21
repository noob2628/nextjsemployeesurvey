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
      const parsedData = JSON.parse(req.body);
      const validatedData = surveySchema.parse(parsedData);

      // Database operation
      const survey = await prisma.survey.create({
        data: validatedData,
      });

      res.status(200).json({ 
        message: "Survey submitted successfully",
        data: survey 
      });
    } catch (error: any) {
      console.error("Error:", error);
      res.status(400).json({ 
        error: "Invalid survey data",
        details: error.errors || error.message 
      });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}