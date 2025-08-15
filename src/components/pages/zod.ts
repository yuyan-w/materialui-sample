import { z } from "zod";

// Crockford Base32の正規表現（大文字のみ、I/L/O/Uは含まない）
const ULID_REGEX = /^[0-9A-HJKMNP-TV-Z]{26}$/;

export const ulidSchema = z.string().refine((val) => ULID_REGEX.test(val), {
  message:
    "Invalid ULID format. Must be 26 chars of Crockford Base32 (no I, L, O, U).",
});

const schema = z.object({
  ids: z.array(ulidSchema).nonempty("required"),
});

type IdsInput = z.infer<typeof schema>;
