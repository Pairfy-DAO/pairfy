import { Resend } from "resend";
import { generateRegistrationEmail } from "./template-register.js";
import { generateRecoveryEmail } from "./template-recovery.js";

const resend = new Resend(process.env.RESEND_API_KEY as string);

export async function sendEmail(type: string, to: string, payload: any) {
  let subject: string = "";
  let template: string = "";

  switch (type) {
    case "register:seller":
      subject = "Pairfy email confirmation.";
      template = generateRegistrationEmail({
        name: payload.username,
        verifyUrl: `${process.env.HANDLER_SELLER_URL}/entry?m=verify&t=${payload.token}`,
      });
      break;
  
    case "recovery:seller":
      subject = "Pairfy account recovery.";
      template = generateRecoveryEmail({
        name: payload.username,
        verifyUrl: `${process.env.HANDLER_SELLER_URL}/entry?m=recovery&t=${payload.token}`,
      });
      break;
  
    default:
      throw new Error("sendEmailError: wrong case.");
  }
  
  const { data, error } = await resend.emails.send({
    from: "Pairfy <noreply@pairfy.io>",
    to: [to],
    subject: subject,
    html: template,
  });

  console.log({ data });

  if (error) {
    throw new Error("sendEmailError: " + error);
  }
}
