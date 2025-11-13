import z  from "zod";

const userSchema = z.object({
  name: z
    .string({invalid_type_error: 'Name must be a string'})
    .min(3, "Name must be at least 3 characters long.")
    .max(20, "Name must be at most 20 characters long."),
  email: z.email()
});
 
export function validateUser(object) {
  return userSchema.safeParse(object);
}

