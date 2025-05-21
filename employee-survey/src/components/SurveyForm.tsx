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

  const onSubmit = async (data: z.infer<typeof surveySchema>) => {
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
          <div className="space-y-2">
            <Label htmlFor="employeeName">Full Name</Label>
            <Input 
              id="employeeName" 
              {...register("employeeName")} 
              placeholder="John Doe" 
            />
            {errors.employeeName && (
              <span className="text-red-500 text-sm">Minimum 2 characters required</span>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="employeeEmail">Email</Label>
            <Input
              id="employeeEmail"
              type="email"
              {...register("employeeEmail")}
              placeholder="john@company.com"
            />
            {errors.employeeEmail && (
              <span className="text-red-500 text-sm">Valid email required</span>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Input
              id="department"
              {...register("department")}
              placeholder="Engineering"
            />
            {errors.department && (
              <span className="text-red-500 text-sm">Department required</span>
            )}
          </div>

          <div className="space-y-2">
            <Label>Work-Life Balance Rating (1-5)</Label>
            <Input
              type="number"
              {...register("workLifeBalance", { valueAsNumber: true })}
              min="1"
              max="5"
            />
            {errors.workLifeBalance && (
              <span className="text-red-500 text-sm">Rating between 1-5 required</span>
            )}
          </div>

          <div className="space-y-2">
            <Label>Job Satisfaction Rating (1-5)</Label>
            <Input
              type="number"
              {...register("jobSatisfaction", { valueAsNumber: true })}
              min="1"
              max="5"
            />
            {errors.jobSatisfaction && (
              <span className="text-red-500 text-sm">Rating between 1-5 required</span>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="feedback">Additional Feedback</Label>
            <Input
              id="feedback"
              {...register("feedback")}
              placeholder="Optional comments..."
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">
            Submit Survey
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}