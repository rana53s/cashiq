import SWPCalculator from "@/components/tools/swp-calculator/main";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "CashIQ | SWP Calculator",
  description:
    "Plan your investments wisely with the CashIQ SWP Calculator. Calculate your monthly or lumpsum SIP returns instantly with accurate projections and interactive charts. Make informed financial decisions with ease!",
};

export default function SIPCalculatorPage() {
  return <SWPCalculator />;
}
