import { z } from 'zod'

export const reviewSubmissionSchema = z.object({
  token: z.string().min(20).max(200),
  review_type: z.enum(['product', 'company']),
  product_rating: z.coerce.number().int().min(1).max(5).nullable().optional(),
  service_rating: z.coerce.number().int().min(1).max(5).nullable().optional(),
  title: z.string().trim().min(3).max(160),
  body: z.string().trim().min(10).max(4000),
  display_name: z.string().trim().min(1).max(120),
  country: z.string().trim().min(2).max(100),
  company_name: z.string().trim().max(200).nullable().optional(),
  allow_public_name: z.boolean().default(false),
  allow_public_company: z.boolean().default(false),
  allow_public_image: z.boolean().default(false),
  locale: z.string().trim().max(10).default('en'),
}).superRefine((value, context) => {
  if (value.review_type === 'product' && !value.product_rating) context.addIssue({ code: 'custom', path: ['product_rating'], message: 'Product rating is required' })
  if (value.review_type === 'company' && !value.service_rating) context.addIssue({ code: 'custom', path: ['service_rating'], message: 'Service rating is required' })
})

export type ReviewSubmissionInput = z.infer<typeof reviewSubmissionSchema>
