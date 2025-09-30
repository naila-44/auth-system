import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import User, { IUser } from "@/lib/models/User";

export default async function DashboardPage() {
  const cookieStore = await cookies(); // <-- await here
  const tokenCookie = cookieStore.get("token");
  if (!tokenCookie) return redirect("/login");

  const payload = verifyToken(tokenCookie.value);
  if (!payload || !payload.sub) return redirect("/login");

  await connectDB();
  const user = (await User.findById(payload.sub).lean()) as IUser | null;
  if (!user) return redirect("/login");

  return (
    <main className="p-8">
      <h1>Welcome, {user.username}</h1>
      <p>Email: {user.email}</p>
    </main>
  );
}

