const baseTemplate = (title: string, body: string) => `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
  </head>
  <body style="margin:0;background:#0B1020;color:#FFFFFF;font-family:Arial,Helvetica,sans-serif;">
    <div style="max-width:640px;margin:0 auto;padding:32px;">
      <div style="background:rgba(255,255,255,0.06);border:1px solid rgba(0,229,255,0.2);border-radius:16px;padding:28px;">
        <h1 style="font-size:22px;margin:0 0 12px;color:#00E5FF;">${title}</h1>
        ${body}
        <p style="margin-top:24px;font-size:12px;opacity:0.7;">IncuXai Team • India&apos;s Ultimate AI Gaming Hackathon</p>
      </div>
    </div>
  </body>
</html>`;

export const registrationSuccessTemplate = (name: string, teamId: string) =>
  baseTemplate(
    "Registration Confirmed",
    `<p style="font-size:16px;">Hi ${name},</p>
     <p style="font-size:15px;">You are officially registered for IncuXai. Your team ID is <strong>${teamId}</strong>.</p>
     <p style="font-size:15px;">Keep this ID for all future communication.</p>`
  );

export const paymentSuccessTemplate = (amount: number, teamId: string) =>
  baseTemplate(
    "Payment Successful",
    `<p style="font-size:15px;">We have received your payment of <strong>INR ${amount}</strong>.</p>
     <p style="font-size:15px;">Team ID: <strong>${teamId}</strong></p>`
  );

export const paymentFailureTemplate = (teamId: string) =>
  baseTemplate(
    "Payment Failed",
    `<p style="font-size:15px;">Your payment for team <strong>${teamId}</strong> did not complete.</p>
     <p style="font-size:15px;">Please retry from your dashboard.</p>`
  );

export const deadlineReminderTemplate = (deadline: string) =>
  baseTemplate(
    "Submission Deadline Reminder",
    `<p style="font-size:15px;">Reminder: the submission deadline is <strong>${deadline}</strong>.</p>
     <p style="font-size:15px;">Upload your project assets on the portal.</p>`
  );

export const eventReminderTemplate = (date: string) =>
  baseTemplate(
    "Event Reminder",
    `<p style="font-size:15px;">IncuXai starts on <strong>${date}</strong>.</p>
     <p style="font-size:15px;">Join the Discord for updates and schedules.</p>`
  );

export const certificateTemplate = (name: string) =>
  baseTemplate(
    "Certificate of Participation",
    `<p style="font-size:15px;">Congratulations ${name}! Your certificate is ready.</p>
     <p style="font-size:15px;">Download it from your dashboard.</p>`
  );

export const otpTemplate = (code: string) =>
  baseTemplate(
    "Your IncuXai Login Code",
    `<p style="font-size:16px;">Use this code to finish your login:</p>
     <p style="font-size:22px;letter-spacing:4px;color:#22C55E;"><strong>${code}</strong></p>
     <p style="font-size:13px;opacity:0.8;">This code expires in 10 minutes.</p>`
  );

export const broadcastTemplate = (title: string, message: string) =>
  baseTemplate(
    title,
    `<p style="font-size:15px;">${message}</p>`
  );
