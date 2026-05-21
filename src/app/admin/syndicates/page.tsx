import { redirect } from "next/navigation";

export default function SyndicatesRedirect() {
    redirect("/admin?tab=syndicates");
}
