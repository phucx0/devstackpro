import { getDashboardDataAction } from "@/services/author.actions";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const data = await getDashboardDataAction();
  return <DashboardClient data={data} />;
}
