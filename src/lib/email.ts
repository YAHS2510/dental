import { Resend } from "resend";
import { env } from "@/lib/env";

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
}

export interface SendEmailResult {
  success: boolean;
  id?: string;
  error?: string;
  simulated?: boolean;
}

const resendApiKey = env.RESEND_API_KEY || process.env.EMAIL_API_KEY;
const isLiveKey =
  Boolean(resendApiKey) &&
  !resendApiKey?.startsWith("re_mock_") &&
  resendApiKey !== "mock_email_api_key_for_notifications";

// Initialize Resend instance if live key is available
const resend = isLiveKey ? new Resend(resendApiKey) : null;

export async function sendEmail(
  options: SendEmailOptions
): Promise<SendEmailResult> {
  const fromAddress =
    options.from ||
    env.EMAIL_FROM ||
    "HealthSphere Clinic <notifications@healthsphere.example.com>";

  const toAddress = Array.isArray(options.to) ? options.to : [options.to];

  if (resend) {
    try {
      const response = await resend.emails.send({
        from: fromAddress,
        to: toAddress,
        subject: options.subject,
        html: options.html,
        text: options.text,
      });

      if (response.error) {
        return {
          success: false,
          error: response.error.message,
        };
      }

      return {
        success: true,
        id: response.data?.id,
        simulated: false,
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || "Failed to deliver email via Resend",
      };
    }
  }

  // Fallback Simulation Logger in Dev/Mock Mode
  const simulatedId = `sim-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

  return {
    success: true,
    id: simulatedId,
    simulated: true,
  };
}
