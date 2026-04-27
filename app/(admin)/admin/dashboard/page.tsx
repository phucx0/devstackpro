import { getDashboardDataAction } from "@/server/articles/articles.private.action";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const data = await getDashboardDataAction();
  return <DashboardClient data={data} />;
}
