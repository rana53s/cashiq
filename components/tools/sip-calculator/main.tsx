"use client";

import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

export default function SIPCalculator() {
  // States for SIP inputs
  const [investmentAmount, setInvestmentAmount] = useState(5000);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [timePeriod, setTimePeriod] = useState(10);
  const [calculationType, setCalculationType] = useState("monthly");

  // States for results
  const [totalInvestment, setTotalInvestment] = useState(0);
  const [estimatedReturn, setEstimatedReturn] = useState(0);
  const [totalValue, setTotalValue] = useState(0);
  const [yearlyData, setYearlyData] = useState<
    {
      year: string;
      investment: number;
      value: number;
      returns: number;
    }[]
  >([]);

  // Colors for pie chart
  const COLORS = ["#0088FE", "#00C49F"];

  // Calculate SIP returns
  useEffect(() => {
    if (calculationType === "monthly") {
      calculateMonthlySIP();
    } else {
      calculateLumpsum();
    }
  }, [investmentAmount, expectedReturn, timePeriod, calculationType]);

  const calculateMonthlySIP = () => {
    const monthlyRate = expectedReturn / (12 * 100);
    const months = timePeriod * 12;
    const invested = investmentAmount * months;

    // Formula: P × ({[1 + i]^n - 1} / i) × (1 + i)
    const futureValue =
      investmentAmount *
      ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) *
      (1 + monthlyRate);

    setTotalInvestment(invested);
    setTotalValue(futureValue);
    setEstimatedReturn(futureValue - invested);

    // Generate yearly data for chart
    const yearlyDataPoints = [];
    for (let year = 1; year <= timePeriod; year++) {
      const yearMonths = year * 12;
      const yearlyInvestment = investmentAmount * yearMonths;
      const yearlyValue =
        investmentAmount *
        ((Math.pow(1 + monthlyRate, yearMonths) - 1) / monthlyRate) *
        (1 + monthlyRate);

      yearlyDataPoints.push({
        year: `Year ${year}`,
        investment: Math.round(yearlyInvestment),
        value: Math.round(yearlyValue),
        returns: Math.round(yearlyValue - yearlyInvestment),
      });
    }

    setYearlyData(yearlyDataPoints);
  };

  const calculateLumpsum = () => {
    const annualRate = expectedReturn / 100;
    const invested = investmentAmount;

    // Formula: P(1+r)^t
    const futureValue = invested * Math.pow(1 + annualRate, timePeriod);

    setTotalInvestment(invested);
    setTotalValue(futureValue);
    setEstimatedReturn(futureValue - invested);

    // Generate yearly data for chart
    const yearlyDataPoints = [];
    for (let year = 1; year <= timePeriod; year++) {
      const yearlyValue = invested * Math.pow(1 + annualRate, year);

      yearlyDataPoints.push({
        year: `Year ${year}`,
        investment: Math.round(invested),
        value: Math.round(yearlyValue),
        returns: Math.round(yearlyValue - invested),
      });
    }

    setYearlyData(yearlyDataPoints);
  };

  // Format number as Indian currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Scale Down Large Numbers
  const formatLargeNumber = (num: number) => {
    return num >= 1e6 ? (num / 1e6).toFixed(1) + "M" : formatCurrency(num);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            SIP Investment Calculator
          </CardTitle>
          <CardDescription className="text-center">
            Calculate your potential returns on investments
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* Main layout with flex for desktop and block for mobile */}
          <div className="flex flex-col lg:flex-row lg:space-x-6">
            {/* Left side - Calculator controls */}
            <div className="w-full lg:w-1/2">
              <Tabs
                defaultValue="monthly"
                onValueChange={setCalculationType}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2 mb-8">
                  <TabsTrigger className="cursor-pointer" value="monthly">
                    Monthly SIP
                  </TabsTrigger>
                  <TabsTrigger className="cursor-pointer" value="lumpsum">
                    Lumpsum Investment
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="monthly" className="space-y-6">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="monthlyInvestment">
                          Monthly Investment (₹)
                        </Label>
                        <span className="font-medium">
                          {formatCurrency(investmentAmount)}
                        </span>
                      </div>
                      <Input
                        id="monthlyInvestment"
                        type="number"
                        value={investmentAmount}
                        onChange={(e) =>
                          setInvestmentAmount(Number(e.target.value))
                        }
                        className="w-full"
                      />
                      <Slider
                        defaultValue={[5000]}
                        min={500}
                        max={100000}
                        step={500}
                        value={[investmentAmount]}
                        onValueChange={(value) => setInvestmentAmount(value[0])}
                        className="py-4 cursor-pointer"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>₹500</span>
                        <span>₹100,000</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="expectedReturn">
                          Expected Annual Return (%)
                        </Label>
                        <span className="font-medium">{expectedReturn}%</span>
                      </div>
                      <Input
                        id="expectedReturn"
                        type="number"
                        value={expectedReturn}
                        onChange={(e) =>
                          setExpectedReturn(Number(e.target.value))
                        }
                        className="w-full"
                      />
                      <Slider
                        defaultValue={[12]}
                        min={1}
                        max={30}
                        step={0.5}
                        value={[expectedReturn]}
                        onValueChange={(value) => setExpectedReturn(value[0])}
                        className="py-4 cursor-pointer"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>1%</span>
                        <span>30%</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="timePeriod">Time Period (Years)</Label>
                        <span className="font-medium">{timePeriod} years</span>
                      </div>
                      <Input
                        id="timePeriod"
                        type="number"
                        value={timePeriod}
                        onChange={(e) => setTimePeriod(Number(e.target.value))}
                        className="w-full"
                      />
                      <Slider
                        defaultValue={[10]}
                        min={1}
                        max={30}
                        step={1}
                        value={[timePeriod]}
                        onValueChange={(value) => setTimePeriod(value[0])}
                        className="py-4 cursor-pointer"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>1 year</span>
                        <span>30 years</span>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="lumpsum" className="space-y-6">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="lumpsumInvestment">
                          Investment Amount (₹)
                        </Label>
                        <span className="font-medium">
                          {formatCurrency(investmentAmount)}
                        </span>
                      </div>
                      <Input
                        id="lumpsumInvestment"
                        type="number"
                        value={investmentAmount}
                        onChange={(e) =>
                          setInvestmentAmount(Number(e.target.value))
                        }
                        className="w-full"
                      />
                      <Slider
                        defaultValue={[100000]}
                        min={1000}
                        max={10000000}
                        step={1000}
                        value={[investmentAmount]}
                        onValueChange={(value) => setInvestmentAmount(value[0])}
                        className="py-4"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>₹1,000</span>
                        <span>₹1,00,00,000</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="lumpsumReturn">
                          Expected Annual Return (%)
                        </Label>
                        <span className="font-medium">{expectedReturn}%</span>
                      </div>
                      <Input
                        id="lumpsumReturn"
                        type="number"
                        value={expectedReturn}
                        onChange={(e) =>
                          setExpectedReturn(Number(e.target.value))
                        }
                        className="w-full"
                      />
                      <Slider
                        defaultValue={[12]}
                        min={1}
                        max={30}
                        step={0.5}
                        value={[expectedReturn]}
                        onValueChange={(value) => setExpectedReturn(value[0])}
                        className="py-4"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>1%</span>
                        <span>30%</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="lumpsumTime">Time Period (Years)</Label>
                        <span className="font-medium">{timePeriod} years</span>
                      </div>
                      <Input
                        id="lumpsumTime"
                        type="number"
                        value={timePeriod}
                        onChange={(e) => setTimePeriod(Number(e.target.value))}
                        className="w-full"
                      />
                      <Slider
                        defaultValue={[10]}
                        min={1}
                        max={30}
                        step={1}
                        value={[timePeriod]}
                        onValueChange={(value) => setTimePeriod(value[0])}
                        className="py-4"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>1 year</span>
                        <span>30 years</span>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              {/* Results Section */}
              <div className="mt-8">
                <Card className="bg-primary/5">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-center text-xl">
                      Projected Investment Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-white p-4 rounded-lg shadow text-center">
                        <p className="text-sm text-muted-foreground">
                          Invested Amount
                        </p>
                        <p className="text-2xl font-bold">
                          {formatLargeNumber(totalInvestment)}
                        </p>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow text-center">
                        <p className="text-sm text-muted-foreground">
                          Estimated Return
                        </p>
                        <p className="text-2xl font-bold text-green-600">
                          {formatLargeNumber(estimatedReturn)}
                        </p>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow text-center">
                        <p className="text-sm text-muted-foreground">
                          Total Value
                        </p>
                        <p className="text-2xl font-bold text-primary">
                          {formatLargeNumber(totalValue)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Right side - Charts */}
            <div className="w-full lg:w-1/2 mt-8 lg:mt-0">
              <div className="space-y-20">
                {/* Pie Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-center text-lg">
                      Investment Breakup
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: "Invested Amount", value: totalInvestment },
                            {
                              name: "Estimated Returns",
                              value: estimatedReturn,
                            },
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) =>
                            `${name}: ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {[0, 1].map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Legend />
                        <Tooltip
                          formatter={(value) => formatCurrency(Number(value))}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Line Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-center text-lg">
                      Growth Projection
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={yearlyData}
                        margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis tickFormatter={(value) => `₹${value / 1000}k`} />
                        <Tooltip
                          formatter={(value) => formatCurrency(Number(value))}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="investment"
                          stroke="#0088FE"
                          name="Invested Amount"
                        />
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="#00C49F"
                          name="Total Value"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
