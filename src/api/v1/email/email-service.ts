import nodemailer from "nodemailer";

interface VerificationEmailData {
  username: string;
  code: string;
  toEmail: string;
}

function createTransporter() {
  const emailProvider = process.env.EMAIL_PROVIDER || "mailcatcher";

  console.log("🔧 Email Debug:", {
    EMAIL_PROVIDER: emailProvider,
    NODE_ENV: process.env.NODE_ENV || "development",
  });

  if (emailProvider === "gmail") {
    if (!process.env.GMAIL_USERNAME || !process.env.GMAIL_APP_PASSWORD) {
      throw new Error(
        "Gmail credentials not configured. Check GMAIL_USERNAME and GMAIL_APP_PASSWORD environment variables."
      );
    }

    console.log("📧 Using Gmail SMTP");
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USERNAME,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });
  } else {
    console.log("📧 Using MailCatcher SMTP");
    return nodemailer.createTransport({
      host: process.env.MAILCATCHER_HOST || "localhost",
      port: Number(process.env.MAILCATCHER_PORT) || 1025,
      secure: false,
      auth: undefined,
    });
  }
}

function getVerificationEmailTemplate(username: string, code: string): string {
  return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Código de Verificação</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        line-height: 1.6;
        margin: 0;
        padding: 20px;
        background-color: #f4f4f4;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        background-color: white;
        padding: 30px;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      }
      .header {
        text-align: center;
        margin-bottom: 30px;
      }
      .logo {
        font-size: 24px;
        font-weight: bold;
        color: #c2410c;
        margin-bottom: 10px;
      }
      .code-container {
        text-align: center;
        margin: 30px 0;
        padding: 20px;
        background-color: #f8fafc;
        border-radius: 6px;
        border: 2px dashed #e2e8f0;
      }
      .code {
        font-size: 32px;
        font-weight: bold;
        color: #1e293b;
        letter-spacing: 4px;
        font-family: 'Courier New', monospace;
      }
      .warning {
        background-color: #fef3c7;
        border: 1px solid #f59e0b;
        border-radius: 6px;
        padding: 15px;
        margin: 20px 0;
        color: #92400e;
      }
      .footer {
        text-align: center;
        margin-top: 30px;
        color: #64748b;
        font-size: 14px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <div class="logo">MarkIt Done</div>
        <h1>Código de Verificação</h1>
      </div>

      <p>Olá, <strong>${username}</strong>!</p>

      <p>Recebemos uma tentativa de login em sua conta. Para concluir o acesso, use o código de verificação abaixo:</p>

      <div class="code-container">
        <div class="code">${code}</div>
      </div>

      <div class="warning">
        <strong>⚠️ Importante:</strong><br>
        • Este código expira em <strong>5 minutos</strong><br>
        • Não compartilhe este código com ninguém<br>
        • Se você não tentou fazer login, ignore este email
      </div>

      <p>Se você não conseguir usar o código, você pode solicitar um novo código na tela de login.</p>

      <div class="footer">
        <p>Este é um email automático. Por favor, não responda.</p>
        <p>MarkIt Done - Seu Sistema de Gerenciamento De Compras</p>
      </div>
    </div>
  </body>
</html>`;
}

async function sendVerificationEmail({ username, code, toEmail }: VerificationEmailData): Promise<void> {
  const transporter = createTransporter();
  const htmlContent = getVerificationEmailTemplate(username, code);

  const emailProvider = process.env.EMAIL_PROVIDER || "mailcatcher";
  const fromAddress = emailProvider === "gmail" ? process.env.GMAIL_USERNAME : "noreply@markitdone.local";

  const mailOptions = {
    from: {
      name: "MarkIt Done",
      address: fromAddress || "noreply@markitdone.com",
    },
    to: toEmail,
    subject: "Código de Verificação - MarkIt Done",
    html: htmlContent,
    text: `Olá ${username}! Seu código de verificação é: ${code}. Este código expira em 5 minutos.`,
  };

  await transporter.sendMail(mailOptions);
}

async function testConnection(): Promise<boolean> {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    return true;
  } catch (error) {
    console.error("Erro na conexão SMTP:", error);
    return false;
  }
}

const emailService = {
  sendVerificationEmail,
  testConnection,
};

export default emailService;
