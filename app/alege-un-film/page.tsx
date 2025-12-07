import type { Metadata } from "next";
import App from "../../App";

export const metadata: Metadata = {
  title: "Alege un film | CEFILM? - AI Cinema Adviser",
  description:
    "Începe direct quiz-ul CEFILM? pentru a primi recomandări de filme potrivite stării tale. Selectează categoria, răspunde la câteva întrebări și obține titlul ideal în câteva secunde.",
  alternates: {
    canonical: "/alege-un-film"
  }
};

export default function PickMoviePage() {
  return <App initialState="category-select" />;
}
