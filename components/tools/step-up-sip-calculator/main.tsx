"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

export default function StepUpSIPCalculator() {
  const [monthlyInvestment, setMonthlyInvestment] = useState(5000);
  const [annualStepUp, setAnnualStepUp] = useState(10);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [timePeriod] = useState(40); // Fixed at 40 years
  const [result, setResult] = useState({
    investedAmount: 0,
    estimatedReturns: 0,
    totalValue: 0,
  });

  // Recalculate whenever inputs change
  useEffect(() => {
    calculateSIP();
  }, [monthlyInvestment, annualStepUp, expectedReturn]);

  const calculateSIP = () => {
    let totalInvested = 0;
    let totalValue = 0;
    const monthlyRate = expectedReturn / 12 / 100;
    let currentMonthlyInvestment = monthlyInvestment;

    for (let year = 0; year < timePeriod; year++) {
      // For each month in the current year
      for (let month = 0; month < 12; month++) {
        totalInvested += currentMonthlyInvestment;
        totalValue =
          (totalValue + currentMonthlyInvestment) * (1 + monthlyRate);
      }

      // Increase investment for next year
      currentMonthlyInvestment +=
        currentMonthlyInvestment * (annualStepUp / 100);
    }

    setResult({
      investedAmount: Math.round(totalInvested),
      estimatedReturns: Math.round(totalValue - totalInvested),
      totalValue: Math.round(totalValue),
    });
  };

  const formatCurrency = (value: any) => {
    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(2)} Cr`;
    } else if (value >= 100000) {
      return `₹${(value / 100000).toFixed(2)} L`;
    } else {
      return `₹${value.toLocaleString()}`;
    }
  };

  const pieData = [
    { name: "Invested Amount", value: result.investedAmount, color: "#6366f1" },
    { name: "Est. Returns", value: result.estimatedReturns, color: "#10b981" },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-t-lg">
          <CardTitle className="text-xl md:text-2xl font-bold">
            Step-up SIP Calculator
          </CardTitle>
          <CardDescription className="text-gray-100">
            Calculate the power of step-up SIP investments over 40 years
          </CardDescription>
        </CardHeader>

        <CardContent className="p-4 md:p-6 space-y-6">
          {/* Monthly Investment Input */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="monthlyInv">Monthly Investment</Label>
              <span className="text-sm font-medium">
                ₹{monthlyInvestment.toLocaleString()}
              </span>
            </div>
            <div className="flex space-x-4 items-center">
              <Input
                id="monthlyInv"
                type="number"
                min="500"
                max="500000"
                value={monthlyInvestment}
                onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                className="flex-1"
              />
              <div className="flex items-center space-x-2 flex-1">
                <Slider
                  id="monthlyInvSlider"
                  min={500}
                  max={100000}
                  step={500}
                  value={[monthlyInvestment]}
                  onValueChange={(value) => setMonthlyInvestment(value[0])}
                />
              </div>
            </div>
          </div>

          {/* Annual Step-Up Input */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="stepUp">Annual Step-Up (%)</Label>
              <span className="text-sm font-medium">{annualStepUp}%</span>
            </div>
            <div className="flex space-x-4 items-center">
              <Input
                id="stepUp"
                type="number"
                min="0"
                max="100"
                value={annualStepUp}
                onChange={(e) => setAnnualStepUp(Number(e.target.value))}
                className="flex-1"
              />
              <div className="flex items-center space-x-2 flex-1">
                <Slider
                  id="stepUpSlider"
                  min={0}
                  max={25}
                  step={1}
                  value={[annualStepUp]}
                  onValueChange={(value) => setAnnualStepUp(value[0])}
                />
              </div>
            </div>
          </div>

          {/* Expected Return Rate Input */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="returnRate">Expected Return Rate (%)</Label>
              <span className="text-sm font-medium">{expectedReturn}%</span>
            </div>
            <div className="flex space-x-4 items-center">
              <Input
                id="returnRate"
                type="number"
                min="1"
                max="30"
                value={expectedReturn}
                onChange={(e) => setExpectedReturn(Number(e.target.value))}
                className="flex-1"
              />
              <div className="flex items-center space-x-2 flex-1">
                <Slider
                  id="returnRateSlider"
                  min={1}
                  max={30}
                  step={0.5}
                  value={[expectedReturn]}
                  onValueChange={(value) => setExpectedReturn(value[0])}
                />
              </div>
            </div>
          </div>

          {/* Time Period (Fixed at 40 years) */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="timePeriod">Time Period</Label>
              <span className="text-sm font-medium">{timePeriod} years</span>
            </div>
            <Input
              id="timePeriod"
              type="number"
              value={timePeriod}
              disabled
              className="bg-gray-100"
            />
          </div>

          {/* Results Section - Now in same line with pie chart */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold mb-4">
              Your Investment Summary
            </h3>

            <div className="flex flex-col md:flex-row gap-4">
              {/* Results Cards */}
              <div className="w-full md:w-1/2 space-y-4">
                <Card className="bg-indigo-50">
                  <CardContent className="p-4 text-center">
                    <p className="text-sm text-gray-600">Invested Amount</p>
                    <p className="text-xl font-bold text-indigo-600">
                      {formatCurrency(result.investedAmount)}
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-green-50">
                  <CardContent className="p-4 text-center">
                    <p className="text-sm text-gray-600">Est. Returns</p>
                    <p className="text-xl font-bold text-green-600">
                      {formatCurrency(result.estimatedReturns)}
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-purple-50">
                  <CardContent className="p-4 text-center">
                    <p className="text-sm text-gray-600">Total Value</p>
                    <p className="text-xl font-bold text-purple-600">
                      {formatCurrency(result.totalValue)}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Pie Chart */}
              <div className="w-full md:w-1/2 h-64 md:h-auto">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SEO Friendly content - Hidden visually but available for search engines */}
      <div className="sr-only">
        <h1>Step-up SIP Calculator</h1>
        <p>
          Calculate your Systematic Investment Plan (SIP) with annual step-up
          over 40 years. See how your investment grows with compound interest
          over time.
        </p>
        <p>
          Our calculator helps you plan for retirement, wealth building, and
          financial freedom through systematic investments.
        </p>
        <p>
          Visualize your invested amount and estimated returns with interactive
          charts and flexible options.
        </p>
      </div>
    </div>
  );
}
