import ForecastClient from "./ForecastClient";
import { getForecasts } from "./actions";

export const dynamic = "force-dynamic";

export default async function ForecastPage() {
  const initialCards = await getForecasts();

  return <ForecastClient initialCards={initialCards} />;
}
