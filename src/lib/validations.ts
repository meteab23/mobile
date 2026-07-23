import { z } from "zod";

export const payoutTermSchema = z.union([
  z.literal(30),
  z.literal(60),
  z.literal(90),
]);

export const feeCalculationSchema = z.object({
  amount: z.number().min(1000).max(100000),
  payoutTerm: payoutTermSchema,
});

export const newsletterSchema = z.object({
  email: z.string().email("Enter a valid work email"),
  company: z.string().min(2).max(120).optional(),
});

export const demoRequestSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  company: z.string().min(2).max(120),
  message: z.string().max(500).optional(),
});

export type FeeCalculationPayload = z.infer<typeof feeCalculationSchema>;
export type NewsletterPayload = z.infer<typeof newsletterSchema>;
export type DemoRequestPayload = z.infer<typeof demoRequestSchema>;
