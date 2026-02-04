import { z } from "zod";

const signupSchema = z
  .object({
    username: z
      .string()
      .min(1, "이메일을 입력해야합니다.")
      .email({ message: "이메일 형식이 올바르지 않습니다." }),

    name: z
      .string()
      .min(2, "2글자 이상 입력해야합니다.")
      .regex(/^[\p{L}\p{N}\s]+$/u, "특수문자는 사용할 수 없습니다."),

    password: z
      .string()
      .min(8, "비밀번호는 8자 이상이어야 합니다.")
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!%*#?&])[A-Za-z\d!%*#?&]+$/,
        "비밀번호는 영문자, 숫자, 특수문자(!%*#?&)를 모두 포함해야 합니다.",
      ),

    confirmPassword: z.string().min(1, "비밀번호 확인을 입력해야합니다."),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: "custom",
        message: "비밀번호가 서로 다릅니다.",
        path: ["confirmPassword"],
      });
      return;
    }
  });

export default signupSchema;

export type SignupFormValues = z.infer<typeof signupSchema>;
