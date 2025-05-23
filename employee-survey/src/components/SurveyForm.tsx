"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import 'bootstrap/dist/css/bootstrap.min.css';

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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || "Submission failed");
    }
    
    alert("Survey submitted successfully!");
  } catch (error: unknown) {
    if (error instanceof Error) {
      alert(error.message); // Show error message from API
    } else {
      alert("An unknown error occurred");
    }
  }
};

  return (
    <div className="card mx-auto my-4" style={{ maxWidth: '600px' }}>
      <div className="card-header bg-primary text-white">
        <h3 className="card-title mb-0">Employee Satisfaction Survey</h3>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="card-body">
          <div className="mb-3">
            <label htmlFor="employeeName" className="form-label">Full Name</label>
            <input
              id="employeeName"
              {...register("employeeName")}
              className={`form-control ${errors.employeeName ? 'is-invalid' : ''}`}
              placeholder="John Doe"
            />
            {errors.employeeName && (
              <div className="invalid-feedback">Minimum 2 characters required</div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="employeeEmail" className="form-label">Email</label>
            <input
              id="employeeEmail"
              type="email"
              {...register("employeeEmail")}
              className={`form-control ${errors.employeeEmail ? 'is-invalid' : ''}`}
              placeholder="john@company.com"
            />
            {errors.employeeEmail && (
              <div className="invalid-feedback">Valid email required</div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="department" className="form-label">Department</label>
            <input
              id="department"
              {...register("department")}
              className={`form-control ${errors.department ? 'is-invalid' : ''}`}
              placeholder="Engineering"
            />
            {errors.department && (
              <div className="invalid-feedback">Department required</div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">Work-Life Balance Rating (1-5)</label>
            <input
              type="number"
              {...register("workLifeBalance", { valueAsNumber: true })}
              className={`form-control ${errors.workLifeBalance ? 'is-invalid' : ''}`}
              min="1"
              max="5"
            />
            {errors.workLifeBalance && (
              <div className="invalid-feedback">Rating between 1-5 required</div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">Job Satisfaction Rating (1-5)</label>
            <input
              type="number"
              {...register("jobSatisfaction", { valueAsNumber: true })}
              className={`form-control ${errors.jobSatisfaction ? 'is-invalid' : ''}`}
              min="1"
              max="5"
            />
            {errors.jobSatisfaction && (
              <div className="invalid-feedback">Rating between 1-5 required</div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="feedback" className="form-label">Additional Feedback</label>
            <textarea
              id="feedback"
              {...register("feedback")}
              className="form-control"
              placeholder="Optional comments..."
              rows={3}
            />
          </div>
        </div>
        <div className="card-footer">
          <button type="submit" className="btn btn-primary w-100">
            Submit Survey
          </button>
        </div>
      </form>
    </div>
  );
}