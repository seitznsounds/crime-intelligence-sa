import { redirect } from "next/navigation";

export default function ConnectionsRedirect() {
    redirect("/admin?tab=connections");
}
