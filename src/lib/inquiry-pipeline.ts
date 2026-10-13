import { z } from "zod";

export const inquiryStatuses = ["pending", "contacted", "quoted", "negotiating", "converted", "rejected"] as const;
export const inquiryChannels = ["website", "email", "whatsapp", "manual"] as const;
export const statusLabels: Record<string, string> = { pending: "待处理", new: "待处理", contacted: "已联系", quoted: "已报价", negotiating: "谈判中", converted: "已成交", rejected: "已失单" };
export const channelLabels: Record<string, string> = { website: "网站", email: "邮件", whatsapp: "WhatsApp", manual: "人工录入" };

export const inquiryUpdateSchema = z.object({
  id: z.string().uuid(),
  expected_version: z.number().int().min(0),
  status: z.enum(inquiryStatuses).optional(),
  assigned_to: z.string().uuid().nullable().optional(),
  next_follow_up_at: z.string().datetime({ offset: true }).nullable().optional(),
  reply: z.string().max(10000).optional(),
  channel: z.enum(inquiryChannels).optional(),
}).strict().refine((value) => Object.keys(value).some((key) => !["id", "expected_version"].includes(key)));

export interface InquiryOwner {
  id: string;
  name: string;
}

export interface PipelineFields {
  id: string;
  status: string;
  assigned_to?: string | null;
  next_follow_up_at?: string | null;
  reply?: string | null;
  channel?: string;
  workflow_version?: number;
}

export function canManageInquiries(user: { role: string; permissions: string[] | null; is_active: boolean }) {
  return user.is_active && (user.role === "admin" || (Array.isArray(user.permissions) && (user.permissions.includes("all") || user.permissions.includes("inquiries"))));
}

export function toShanghaiInput(iso?: string | null) {
  return iso ? new Date(new Date(iso).getTime() + 8 * 3600000).toISOString().slice(0, 16) : "";
}

export function fromShanghaiInput(value: string) {
  return value ? new Date(`${value}:00+08:00`).toISOString() : null;
}
