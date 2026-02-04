import { z } from "zod";

const signinSchema = z.object({
  username: z
    .string()
    .min(1, "이메일을 입력해야합니다.")
    .email({ message: "이메일 형식이 올바르지 않습니다." }),

  password: z.string().min(8, "비밀번호는 8자 이상이어야 합니다."),
});

export default signinSchema;

export type SigninFormValues = z.infer<typeof signinSchema>;
