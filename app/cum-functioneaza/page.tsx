import type { Metadata } from "next";
import App from "../../App";

export const metadata: Metadata = {
  title: "Cum funcționează CEFILM? | AI Cinema Adviser",
  description:
    "Află cum CEFILM? folosește un quiz psihologic și un model AI pentru a recomanda filmul perfect. Vezi pașii, procesul și de ce algoritmul elimină indecizia înainte de următoarea ta vizionare.",
  alternates: {
    canonical: "/cum-functioneaza"
  }
};

export default function HowItWorksPage() {
  return <App initialState="how-it-works" />;
}
