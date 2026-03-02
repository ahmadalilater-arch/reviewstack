export type ContactMethod = "email" | "sms";

export interface Contact {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  status: "pending" | "sent" | "positive" | "negative" | "unopened";
  sentAt?: string;
  feedback?: string;
}

export interface Campaign {
  id: string;
  businessName: string;
  googleMapsUrl: string;
  contactMethod: ContactMethod;
  messageTemplate: string;
  contacts: Contact[];
  createdAt: string;
  status: "draft" | "running" | "completed";
}

export type AppView = "landing" | "dashboard" | "new-campaign" | "campaign-detail" | "demo" | "login" | "signup" | "terms" | "privacy";
