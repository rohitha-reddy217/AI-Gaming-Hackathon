import { z } from "zod";

export const otpSchema = z.object({
  email: z.string().email(),
  code: z.string().length(6),
  name: z.string().min(2),
  role: z.enum(["student", "professional", "startup"]),
  mobile: z.string().optional()
});

export const teamSchema = z.object({
  teamName: z.string().min(2),
  category: z.enum(["student", "professional", "startup"]),
  projectDetails: z.object({
    title: z.string().min(2),
    theme: z.string().min(2),
    techStack: z.array(z.string().min(2)),
    description: z.string().min(10)
  })
});
