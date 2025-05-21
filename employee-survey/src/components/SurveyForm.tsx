"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

const surveySchema = z.object({
  employeeName: z.string().min(2),
  employeeEmail: z.string().email(),
  department: z.string().min(2),
  workLifeBalance: z.number().min(1).max(5),
  jobSatisfaction: z.number().min(1).max(5),
  feedback: z.string().optional(),
});

export function SurveyForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(surveySchema),
  });

  const onSubmit = async (data: any) => {
    try {
      const response = await fetch("/api/submit-survey", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        alert("Survey submitted successfully!");
      }
    } catch (error) {
      console.error("Submission failed:", error);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto my-8">
      <CardHeader>
        <CardTitle>Employee Satisfaction Survey</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {/* Form fields here */}
          <div>
            <Label htmlFor="employeeName">Name</Label>
            <Input {...register("employeeName")} />
            {errors.employeeName && <span className="text-red-500">Required</span>}
          </div>
          {/* Add other fields following same pattern */}
        </CardContent>
        <CardFooter>
          <Button type="submit">Submit Survey</Button>
        </CardFooter>
      </form>
    </Card>
  );
}