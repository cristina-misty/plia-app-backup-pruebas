import { LoginForm } from "@/components/login-form";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-20 items-center justify-center rounded-xl">
            <Image
              src="/assets/PLIA_isotipo5.png"
              alt="PLIA"
              width={100}
              height={100}
            />
          </div>
        </a>
        <LoginForm />
      </div>
    </div>
  );
}
