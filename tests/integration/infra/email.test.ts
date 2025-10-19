import emailService from "../../../src/api/v1/email/email-service";
import { deleteAllEmails, getLastEmail, waitForAllServices } from "../../orchestrator";

beforeAll(async () => {
  await waitForAllServices();
});

describe("email-service", () => {
  test("Send verification email", async () => {
    await deleteAllEmails();

    await emailService.sendVerificationEmail({
      username: "testuser",
      code: "123456",
      toEmail: "test@example.com",
    });

    const lastEmail = await getLastEmail();

    expect(lastEmail).not.toBeNull();
    expect(lastEmail?.subject).toContain("Código de Verificação - MarkIt Done");
    expect(lastEmail?.text).toContain("123456");
    expect(lastEmail?.text).toContain("testuser");
  });
});
