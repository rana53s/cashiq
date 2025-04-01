import HRACalculator from '@/components/tools/hra-calculator/main';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CashIQ | HRA Calculator',
  description:
    'Use CashIQ HRA Calculator to easily calculate your House Rent Allowance and maximize your tax savings. Get accurate results in seconds with our user-friendly tool. Perfect for employees in India.',
};

export default function HRACalculatorPage() {
  return <HRACalculator />;
}
