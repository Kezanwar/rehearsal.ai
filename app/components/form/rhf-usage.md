import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { RHFInput } from "@/components/ui/rhf-input";

const schema = z.object({
email: z.string().email("Invalid email"),
password: z.string().min(8, "Min 8 characters"),
});

type FormData = z.infer<typeof schema>;

const { control, handleSubmit } = useForm<FormData>({
resolver: zodResolver(schema),
});

<RHFInput 
  control={control} 
  name="email" 
  label="Email"
  placeholder="you@example.com"
  keyboardType="email-address"
  autoCapitalize="none"
/>
