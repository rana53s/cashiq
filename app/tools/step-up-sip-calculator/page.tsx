import StepUpSIPCalculator from "@/components/tools/step-up-sip-calculator/main";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "CashIQ | Step Up SIP Calculator",
  description:
    "Plan your investments wisely with the CashIQ Step Up SIP Calculator. Calculate your Step Up SIP returns instantly with accurate projections and interactive charts. Make informed financial decisions with ease!",
};

export default function StepUpSIPCalculatorPage() {
  return <StepUpSIPCalculator />;
}
