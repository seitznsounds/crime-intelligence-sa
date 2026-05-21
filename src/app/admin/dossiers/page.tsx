import { redirect } from "next/navigation";

export default function DossiersRedirect() {
    redirect("/admin?tab=dossiers");
}
