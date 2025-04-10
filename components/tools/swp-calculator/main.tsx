"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { IndianRupee } from "lucide-react";

// SEO metadata component
export const metadata = {
  title: "SWP Calculator | Calculate Your Systematic Withdrawal Plan",
  description:
    "Calculate your Systematic Withdrawal Plan (SWP) for Indian salaried employees with our easy-to-use calculator tool.",
  keywords:
    "SWP, Systematic Withdrawal Plan, investment calculator, mutual funds, Indian investments",
};

export default function SWPCalculator() {
  // State variables for calculator inputs
  const [investment, setInvestment] = useState(1000000);
  const [withdrawal, setWithdrawal] = useState(10000);
  const [returns, setReturns] = useState(12);
  const [tenure, setTenure] = useState(10);

  // State variables for results
  const [totalInvestment, setTotalInvestment] = useState(0);
  const [totalWithdrawal, setTotalWithdrawal] = useState(0);
  const [finalValue, setFinalValue] = useState(0);

  // Format large numbers with commas and prefix ₹ for currency
  const formatCurrency = (value: number) => {
    return "₹" + value.toLocaleString("en-IN");
  };

  // Calculate SWP results
  useEffect(() => {
    // Convert percentage to decimal
    const monthlyRate = returns / 12 / 100;
    const months = tenure * 12;

    // Set total investment
    setTotalInvestment(investment);

    // Calculate total withdrawal
    const totalWithdrawalAmount = withdrawal * months;
    setTotalWithdrawal(totalWithdrawalAmount);

    // Calculate final value using SWP formula
    // Correct SWP formula calculation:
    // FV = P * (1 + r)^n - w * [(1 + r)^n - 1] / r
    // Where:
    // FV = Final Value
    // P = Principal (Initial Investment)
    // r = Monthly Interest Rate (decimal)
    // n = Number of Months
    // w = Monthly Withdrawal Amount

    // Calculate (1 + r)^n
    const powerTerm = Math.pow(1 + monthlyRate, months);

    // Calculate first part: P * (1 + r)^n
    const growthComponent = investment * powerTerm;

    // Calculate second part: w * [(1 + r)^n - 1] / r
    // This represents the future value of all withdrawals
    const withdrawalComponent = (withdrawal * (powerTerm - 1)) / monthlyRate;

    // Final value = Growth component - Future value of withdrawals
    const calculatedFinalValue = growthComponent - withdrawalComponent;

    // Ensure final value is not negative
    setFinalValue(Math.max(0, calculatedFinalValue));
  }, [investment, withdrawal, returns, tenure]);

  // Handle input changes with validation
  const handleInvestmentChange = (value: any) => {
    const parsedValue = parseFloat(value.replace(/[^0-9.]/g, ""));
    setInvestment(
      isNaN(parsedValue) ? 0 : Math.min(Math.max(parsedValue, 0), 100000000)
    );
  };

  const handleWithdrawalChange = (value: any) => {
    const parsedValue = parseFloat(value.replace(/[^0-9.]/g, ""));
    setWithdrawal(
      isNaN(parsedValue) ? 0 : Math.min(Math.max(parsedValue, 0), 1000000)
    );
  };

  const handleReturnsChange = (value: any) => {
    const parsedValue = parseFloat(value.replace(/[^0-9.]/g, ""));
    setReturns(isNaN(parsedValue) ? 0 : Math.min(Math.max(parsedValue, 0), 30));
  };

  const handleTenureChange = (value: any) => {
    const parsedValue = parseFloat(value.replace(/[^0-9.]/g, ""));
    setTenure(isNaN(parsedValue) ? 0 : Math.min(Math.max(parsedValue, 1), 30));
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <h1 className="text-2xl md:text-3xl font-bold text-center mb-6">
        Systematic Withdrawal Plan Calculator
      </h1>
      <p className="text-center text-muted-foreground mb-8">
        Calculate your SWP investment returns based on your investment amount,
        monthly withdrawal, expected returns, and investment tenure.
      </p>

      <Card className="mb-8 shadow-md">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl">
            Input Parameters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Total Investment Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="investment"
                className="text-sm md:text-base font-medium"
              >
                Total Investment
              </Label>
              <div className="relative">
                <span className="absolute left-2 top-2.5 text-muted-foreground">
                  ₹
                </span>
                <Input
                  id="investment"
                  type="text"
                  value={investment.toLocaleString("en-IN")}
                  onChange={(e) => handleInvestmentChange(e.target.value)}
                  className="pl-6 w-28 md:w-36 text-right"
                />
              </div>
            </div>
            <Slider
              id="investment-slider"
              min={100000}
              max={10000000}
              step={10000}
              value={[investment]}
              onValueChange={(value) => setInvestment(value[0])}
              className="cursor-pointer"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>₹1 Lakh</span>
              <span>₹1 Crore</span>
            </div>
          </div>

          {/* Monthly Withdrawal Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="withdrawal"
                className="text-sm md:text-base font-medium"
              >
                Monthly Withdrawal
              </Label>
              <div className="relative">
                <span className="absolute left-2 top-2.5 text-muted-foreground">
                  ₹
                </span>
                <Input
                  id="withdrawal"
                  type="text"
                  value={withdrawal.toLocaleString("en-IN")}
                  onChange={(e) => handleWithdrawalChange(e.target.value)}
                  className="pl-6 w-28 md:w-36 text-right"
                />
              </div>
            </div>
            <Slider
              id="withdrawal-slider"
              min={1000}
              max={100000}
              step={1000}
              value={[withdrawal]}
              onValueChange={(value) => setWithdrawal(value[0])}
              className="cursor-pointer"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>₹1,000</span>
              <span>₹1,00,000</span>
            </div>
          </div>

          {/* Expected Returns & Tenure in 2 columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Expected Returns Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="returns"
                  className="text-sm md:text-base font-medium"
                >
                  Expected Returns
                </Label>
                <div className="relative">
                  <Input
                    id="returns"
                    type="text"
                    value={returns}
                    onChange={(e) => handleReturnsChange(e.target.value)}
                    className="w-16 md:w-20 text-right pr-6"
                  />
                  <span className="absolute right-2 top-2.5 text-muted-foreground">
                    %
                  </span>
                </div>
              </div>
              <Slider
                id="returns-slider"
                min={1}
                max={30}
                step={0.5}
                value={[returns]}
                onValueChange={(value) => setReturns(value[0])}
                className="cursor-pointer"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1%</span>
                <span>30%</span>
              </div>
            </div>

            {/* Tenure Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="tenure"
                  className="text-sm md:text-base font-medium"
                >
                  Tenure
                </Label>
                <div className="relative">
                  <Input
                    id="tenure"
                    type="text"
                    value={tenure}
                    onChange={(e) => handleTenureChange(e.target.value)}
                    className="w-16 md:w-20 text-right pr-7"
                  />
                  <span className="absolute right-2 top-2.5 text-muted-foreground">
                    yr
                  </span>
                </div>
              </div>
              <Slider
                id="tenure-slider"
                min={1}
                max={30}
                step={1}
                value={[tenure]}
                onValueChange={(value) => setTenure(value[0])}
                className="cursor-pointer"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1 yr</span>
                <span>30 yrs</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      <div className="mt-8">
        <Card className="bg-primary/5 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-center text-xl">
              Projected Investment Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* Results Blocks - Take 3 columns on large screens */}
              <div className="lg:col-span-3 flex flex-col space-y-4">
                {/* Total Investment Block */}
                <div className="bg-card p-6 rounded-lg shadow-sm border border-border/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Total Investment
                      </p>
                      <p className="text-2xl md:text-3xl font-bold flex items-center gap-1">
                        <IndianRupee className="h-5 w-5" />
                        {totalInvestment.toLocaleString("en-IN")}
                      </p>
                    </div>
                    <div className="bg-primary/10 p-3 rounded-full">
                      <IndianRupee className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </div>

                {/* Total Withdrawal Block */}
                <div className="bg-card p-6 rounded-lg shadow-sm border border-orange-200 dark:border-orange-900/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Total Withdrawal
                      </p>
                      <p className="text-2xl md:text-3xl font-bold text-orange-600 dark:text-orange-400 flex items-center gap-1">
                        <IndianRupee className="h-5 w-5" />
                        {totalWithdrawal.toLocaleString("en-IN")}
                      </p>
                    </div>
                    <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-full">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-orange-600 dark:text-orange-400"
                      >
                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Final Value Block */}
                <div className="bg-card p-6 rounded-lg shadow-sm border border-primary/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Final Value
                      </p>
                      <p className="text-2xl md:text-3xl font-bold text-primary flex items-center gap-1">
                        <IndianRupee className="h-5 w-5" />
                        {finalValue.toLocaleString("en-IN")}
                      </p>
                    </div>
                    <div className="bg-primary/10 p-3 rounded-full">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-primary"
                      >
                        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                        <polyline points="17 6 23 6 23 12" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chart - Take 2 columns on large screens */}
              <div className="lg:col-span-2 bg-card p-4 rounded-lg shadow-sm border border-border/50 flex flex-col">
                <h3 className="text-sm font-medium text-center mb-4">
                  Investment Overview
                </h3>
                <div className="flex-1 flex items-center justify-center">
                  <InvestmentPieChart
                    totalInvestment={totalInvestment}
                    totalWithdrawal={totalWithdrawal}
                    finalValue={finalValue}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Info (for SEO) */}
      <div className="mt-8 prose prose-sm max-w-none dark:prose-invert">
        <h2 className="text-lg font-medium">
          About Systematic Withdrawal Plan (SWP)
        </h2>
        <p>
          A Systematic Withdrawal Plan (SWP) allows investors to withdraw a
          fixed amount from their mutual fund investments at regular intervals.
          This calculator helps Indian salaried employees plan their SWP
          strategy by estimating the final value of their investments based on
          the initial investment amount, monthly withdrawal, expected returns,
          and investment tenure.
        </p>
      </div>
    </div>
  );
}

{
  /* Pie Chart Component */
}
interface ChartDataItem {
  name: string;
  value: number;
  color: string;
}

interface InvestmentPieChartProps {
  totalInvestment: number;
  totalWithdrawal: number;
  finalValue: number;
}

const InvestmentPieChart = ({
  totalInvestment,
  totalWithdrawal,
  finalValue,
}: InvestmentPieChartProps) => {
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);

  useEffect(() => {
    // Calculate the data for the pie chart
    const data: ChartDataItem[] = [
      {
        name: "Final Value",
        value: finalValue,
        color: "rgb(34, 139, 230)", // Blue that works in both light/dark modes
      },
      {
        name: "Withdrawn",
        value: totalWithdrawal,
        color: "rgb(234, 88, 12)", // orange-600
      },
    ];

    setChartData(data);
  }, [totalInvestment, totalWithdrawal, finalValue]);

  // Calculate total amount for percentages
  const totalAmount = finalValue + totalWithdrawal;

  // Calculate percentages for the pie chart
  const finalValuePercentage =
    totalAmount > 0 ? (finalValue / totalAmount) * 100 : 0;
  const withdrawalPercentage =
    totalAmount > 0 ? (totalWithdrawal / totalAmount) * 100 : 0;

  // Calculate the circumference of the circle
  const radius = 70;
  const circumference = 2 * Math.PI * radius;

  // Calculate stroke-dasharray values
  const finalValueDash = (finalValuePercentage / 100) * circumference;
  const withdrawalDash = (withdrawalPercentage / 100) * circumference;

  // Calculate the return percentage
  const returnPercentage =
    totalInvestment > 0 ? Math.round((finalValue / totalInvestment) * 100) : 0;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="relative w-40 h-40 md:w-48 md:h-48">
        {/* Chart SVG */}
        <svg
          viewBox="0 0 200 200"
          width="100%"
          height="100%"
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="#e5e7eb" // Light gray background
            strokeWidth="30"
          />

          {/* Main segments */}
          {totalAmount > 0 && (
            <>
              {/* Withdrawal segment */}
              <circle
                cx="100"
                cy="100"
                r={radius}
                fill="none"
                stroke={chartData[1]?.color || "rgb(234, 88, 12)"}
                strokeWidth="30"
                strokeDasharray={`${withdrawalDash} ${circumference}`}
                strokeDashoffset="0"
              />

              {/* Final value segment */}
              <circle
                cx="100"
                cy="100"
                r={radius}
                fill="none"
                stroke={chartData[0]?.color || "rgb(34, 139, 230)"}
                strokeWidth="30"
                strokeDasharray={`${finalValueDash} ${circumference}`}
                strokeDashoffset={-withdrawalDash}
              />
            </>
          )}
        </svg>

        {/* Center text - Using a separate div for better text control */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {/* No transform rotation applied here */}
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold">
              {returnPercentage}%
            </div>
            <div className="text-xs">Return</div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-col space-y-2 w-full">
        {chartData.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between text-sm"
          >
            <div className="flex items-center">
              <div
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: item.color }}
              ></div>
              <span>{item.name}</span>
            </div>
            <span className="font-medium">
              ₹{item.value.toLocaleString("en-IN")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
