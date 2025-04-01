'use client';
import React, { useState, useEffect, useCallback } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

// Define types for results
interface HRACalculationResults {
  monthly: {
    actualHRA: number;
    salaryPercent: number;
    rentExcess: number;
    exemptedHRA: number;
    taxableHRA: number;
  };
  yearly: {
    actualHRA: number;
    salaryPercent: number;
    rentExcess: number;
    exemptedHRA: number;
    taxableHRA: number;
  };
  chartData: { name: string; value: number }[];
}

export default function HRACalculator() {
  // State for form inputs
  const [basicSalaryMonth, setBasicSalaryMonth] = useState<string>('');
  const [basicSalaryYear, setBasicSalaryYear] = useState<string>('');
  const [daMonth, setDaMonth] = useState<string>('');
  const [daYear, setDaYear] = useState<string>('');
  const [hraMonth, setHraMonth] = useState<string>('');
  const [hraYear, setHraYear] = useState<string>('');
  const [rentMonth, setRentMonth] = useState<string>('');
  const [rentYear, setRentYear] = useState<string>('');
  const [metroCity, setMetroCity] = useState<string>('no');

  // State for calculation results
  const [results, setResults] = useState<HRACalculationResults | null>(null);

  // Calculate values when inputs change
  useEffect(() => {
    calculateHRA();
  }, [
    basicSalaryMonth,
    basicSalaryYear,
    daMonth,
    daYear,
    hraMonth,
    hraYear,
    rentMonth,
    rentYear,
    metroCity,
  ]);

  // Handle monthly to yearly and yearly to monthly conversions
  const handleMonthlyInput = useCallback(
    (
      value: string,
      setMonthly: React.Dispatch<React.SetStateAction<string>>,
      setYearly: React.Dispatch<React.SetStateAction<string>>
    ) => {
      setMonthly(value);
      const yearly = value ? (parseFloat(value) * 12).toFixed(2) : '';
      setYearly(yearly);
    },
    []
  );

  const handleYearlyInput = useCallback(
    (
      value: string,
      setMonthly: React.Dispatch<React.SetStateAction<string>>,
      setYearly: React.Dispatch<React.SetStateAction<string>>
    ) => {
      setYearly(value);
      const monthly = value ? (parseFloat(value) / 12).toFixed(2) : '';
      setMonthly(monthly);
    },
    []
  );

  // Calculate HRA exemption
  const calculateHRA = () => {
    if (!basicSalaryMonth || !hraMonth || !rentMonth) {
      setResults(null);
      return;
    }

    // Convert string inputs to numbers
    const basicSalary = parseFloat(basicSalaryMonth);
    const da = daMonth ? parseFloat(daMonth) : 0;
    const hraReceived = parseFloat(hraMonth);
    const rentPaid = parseFloat(rentMonth);

    // Calculate salary for HRA purposes
    const salary = basicSalary + da;

    // Calculate 3 conditions for HRA exemption
    const actualHRA = hraReceived;
    const salaryPercent = metroCity === 'yes' ? salary * 0.5 : salary * 0.4;
    const rentExcess = rentPaid - salary * 0.1;

    // Get exempted amount (minimum of the 3 conditions)
    let exemptedHRA = Math.min(
      actualHRA,
      salaryPercent,
      rentExcess > 0 ? rentExcess : 0
    );

    // Ensure exemptedHRA is not negative
    exemptedHRA = Math.max(0, exemptedHRA);

    // Calculate taxable HRA
    const taxableHRA = hraReceived - exemptedHRA;

    // Set results
    setResults({
      monthly: {
        actualHRA,
        salaryPercent,
        rentExcess: rentExcess > 0 ? rentExcess : 0,
        exemptedHRA,
        taxableHRA,
      },
      yearly: {
        actualHRA: actualHRA * 12,
        salaryPercent: salaryPercent * 12,
        rentExcess: (rentExcess > 0 ? rentExcess : 0) * 12,
        exemptedHRA: exemptedHRA * 12,
        taxableHRA: taxableHRA * 12,
      },
      chartData: [
        { name: 'Exempted HRA', value: exemptedHRA },
        { name: 'Taxable HRA', value: taxableHRA > 0 ? taxableHRA : 0 },
      ],
    });
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className='container mx-auto lg:px-4 py-4'>
      <div className='text-center mb-4'>
        <h1 className='text-3xl font-bold'>HRA Tax Exemption Calculator</h1>
        <p className='text-lg text-gray-600 mt-2'>
          Calculate your tax exempted and taxable HRA amount
        </p>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        {/* Input Form */}
        <Card className='shadow-lg'>
          <CardHeader>
            <CardTitle>Enter Your Details</CardTitle>
            <CardDescription>
              Provide your salary and rent details to calculate HRA exemption
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-6'>
            {/* Basic Salary */}
            <div className='space-y-2'>
              <Label htmlFor='basicSalary'>Basic Salary</Label>
              <div className='grid grid-cols-2 gap-2 lg:gap-4'>
                <div>
                  <Input
                    id='basicSalaryMonth'
                    type='number'
                    placeholder='Per Month'
                    value={basicSalaryMonth}
                    onChange={(e) =>
                      handleMonthlyInput(
                        e.target.value,
                        setBasicSalaryMonth,
                        setBasicSalaryYear
                      )
                    }
                  />
                  <p className='text-xs text-gray-500 mt-1'>Per Month</p>
                </div>
                <div>
                  <Input
                    id='basicSalaryYear'
                    type='number'
                    placeholder='Per Year'
                    value={basicSalaryYear}
                    onChange={(e) =>
                      handleYearlyInput(
                        e.target.value,
                        setBasicSalaryMonth,
                        setBasicSalaryYear
                      )
                    }
                  />
                  <p className='text-xs text-gray-500 mt-1'>Per Year</p>
                </div>
              </div>
            </div>

            {/* Dearness Allowance */}
            <div className='space-y-2'>
              <Label htmlFor='da'>Dearness Allowance (DA)</Label>
              <div className='grid grid-cols-2 gap-2 lg:gap-4'>
                <div>
                  <Input
                    id='daMonth'
                    type='number'
                    placeholder='Per Month'
                    value={daMonth}
                    onChange={(e) =>
                      handleMonthlyInput(e.target.value, setDaMonth, setDaYear)
                    }
                  />
                  <p className='text-xs text-gray-500 mt-1'>Per Month</p>
                </div>
                <div>
                  <Input
                    id='daYear'
                    type='number'
                    placeholder='Per Year'
                    value={daYear}
                    onChange={(e) =>
                      handleYearlyInput(e.target.value, setDaMonth, setDaYear)
                    }
                  />
                  <p className='text-xs text-gray-500 mt-1'>Per Year</p>
                </div>
              </div>
              <p className='text-xs text-gray-500 italic'>
                DA - This allowance is given to government and public sector
                employees and pensioners
              </p>
            </div>

            {/* HRA Received */}
            <div className='space-y-2'>
              <Label htmlFor='hra'>HRA Received</Label>
              <div className='grid grid-cols-2 gap-2 lg:gap-4'>
                <div>
                  <Input
                    id='hraMonth'
                    type='number'
                    placeholder='Per Month'
                    value={hraMonth}
                    onChange={(e) =>
                      handleMonthlyInput(
                        e.target.value,
                        setHraMonth,
                        setHraYear
                      )
                    }
                  />
                  <p className='text-xs text-gray-500 mt-1'>Per Month</p>
                </div>
                <div>
                  <Input
                    id='hraYear'
                    type='number'
                    placeholder='Per Year'
                    value={hraYear}
                    onChange={(e) =>
                      handleYearlyInput(e.target.value, setHraMonth, setHraYear)
                    }
                  />
                  <p className='text-xs text-gray-500 mt-1'>Per Year</p>
                </div>
              </div>
            </div>

            {/* Rent Paid */}
            <div className='space-y-2'>
              <Label htmlFor='rent'>Rent Paid</Label>
              <div className='grid grid-cols-2 gap-2 lg:gap-4'>
                <div>
                  <Input
                    id='rentMonth'
                    type='number'
                    placeholder='Per Month'
                    value={rentMonth}
                    onChange={(e) =>
                      handleMonthlyInput(
                        e.target.value,
                        setRentMonth,
                        setRentYear
                      )
                    }
                  />
                  <p className='text-xs text-gray-500 mt-1'>Per Month</p>
                </div>
                <div>
                  <Input
                    id='rentYear'
                    type='number'
                    placeholder='Per Year'
                    value={rentYear}
                    onChange={(e) =>
                      handleYearlyInput(
                        e.target.value,
                        setRentMonth,
                        setRentYear
                      )
                    }
                  />
                  <p className='text-xs text-gray-500 mt-1'>Per Year</p>
                </div>
              </div>
            </div>

            {/* Metro City */}
            <div className='space-y-2'>
              <Label>Do you live in Delhi, Mumbai, Kolkata or Chennai?</Label>
              <RadioGroup
                value={metroCity}
                onValueChange={setMetroCity}
                className='flex flex-row space-x-4'
              >
                <div className='flex items-center space-x-2'>
                  <RadioGroupItem value='yes' id='metro-yes' />
                  <Label htmlFor='metro-yes'>Yes</Label>
                </div>
                <div className='flex items-center space-x-2'>
                  <RadioGroupItem value='no' id='metro-no' />
                  <Label htmlFor='metro-no'>No</Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <Card className='shadow-lg'>
          <CardHeader>
            <CardTitle>HRA Exemption Results</CardTitle>
            <CardDescription>
              Your calculated HRA exemption details
            </CardDescription>
          </CardHeader>
          <CardContent>
            {results ? (
              <div className='space-y-8'>
                {/* Pie Chart */}
                <div className='h-64'>
                  <ResponsiveContainer width='100%' height='100%'>
                    <PieChart>
                      <Pie
                        data={results.chartData}
                        cx='50%'
                        cy='50%'
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey='value'
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        <Cell fill='#4ade80' /> {/* Green for exempted */}
                        <Cell fill='#ef4444' /> {/* Red for taxable */}
                      </Pie>
                      <Tooltip
                        formatter={(value) => formatCurrency(value as number)}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Summary Cards */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='bg-green-100 rounded-lg p-4 text-center'>
                    <p className='text-sm font-semibold text-green-800'>
                      Exempted HRA
                    </p>
                    <p className='text-xl font-bold text-green-800'>
                      {formatCurrency(results.monthly.exemptedHRA)}/month
                    </p>
                    <p className='text-sm text-green-700'>
                      {formatCurrency(results.yearly.exemptedHRA)}/year
                    </p>
                  </div>
                  <div className='bg-red-100 rounded-lg p-4 text-center'>
                    <p className='text-sm font-semibold text-red-800'>
                      Taxable HRA
                    </p>
                    <p className='text-xl font-bold text-red-800'>
                      {formatCurrency(results.monthly.taxableHRA)}/month
                    </p>
                    <p className='text-sm text-red-700'>
                      {formatCurrency(results.yearly.taxableHRA)}/year
                    </p>
                  </div>
                </div>

                {/* Details for Mobile */}
                <div className='lg:hidden space-y-4'>
                  <h3 className='text-lg font-semibold'>Calculation Details</h3>
                  <div className='space-y-2'>
                    <div className='flex justify-between'>
                      <span className='text-sm'>Actual HRA received:</span>
                      <span className='font-medium'>
                        {formatCurrency(results.monthly.actualHRA)}/month
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-sm'>
                        {metroCity === 'yes' ? '50%' : '40%'} of Basic Salary:
                      </span>
                      <span className='font-medium'>
                        {formatCurrency(results.monthly.salaryPercent)}/month
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-sm'>
                        Rent Paid - 10% of Salary:
                      </span>
                      <span className='font-medium'>
                        {formatCurrency(results.monthly.rentExcess)}/month
                      </span>
                    </div>
                    <div className='flex justify-between border-t pt-2'>
                      <span className='text-sm font-semibold'>
                        Exempted HRA:
                      </span>
                      <span className='font-semibold text-green-600'>
                        {formatCurrency(results.monthly.exemptedHRA)}/month
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-sm font-semibold'>
                        Taxable HRA:
                      </span>
                      <span className='font-semibold text-red-600'>
                        {formatCurrency(results.monthly.taxableHRA)}/month
                      </span>
                    </div>
                  </div>
                </div>

                {/* Details Table for Desktop */}
                <div className='hidden lg:block'>
                  <h3 className='text-lg font-semibold mb-4'>
                    Calculation Details
                  </h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Particulars</TableHead>
                        <TableHead className='text-right'>Monthly</TableHead>
                        <TableHead className='text-right'>Yearly</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Actual HRA received</TableCell>
                        <TableCell className='text-right'>
                          {formatCurrency(results.monthly.actualHRA)}
                        </TableCell>
                        <TableCell className='text-right'>
                          {formatCurrency(results.yearly.actualHRA)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          {metroCity === 'yes' ? '50%' : '40%'} of Basic Salary
                        </TableCell>
                        <TableCell className='text-right'>
                          {formatCurrency(results.monthly.salaryPercent)}
                        </TableCell>
                        <TableCell className='text-right'>
                          {formatCurrency(results.yearly.salaryPercent)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Rent Paid - 10% of Salary</TableCell>
                        <TableCell className='text-right'>
                          {formatCurrency(results.monthly.rentExcess)}
                        </TableCell>
                        <TableCell className='text-right'>
                          {formatCurrency(results.yearly.rentExcess)}
                        </TableCell>
                      </TableRow>
                      <TableRow className='text-green-300'>
                        <TableCell className='font-medium'>
                          Exempted HRA
                        </TableCell>
                        <TableCell className='text-right font-medium text-green-600'>
                          {formatCurrency(results.monthly.exemptedHRA)}
                        </TableCell>
                        <TableCell className='text-right font-medium text-green-600'>
                          {formatCurrency(results.yearly.exemptedHRA)}
                        </TableCell>
                      </TableRow>
                      <TableRow className='text-red-300'>
                        <TableCell className='font-medium'>
                          Taxable HRA
                        </TableCell>
                        <TableCell className='text-right font-medium text-red-600'>
                          {formatCurrency(results.monthly.taxableHRA)}
                        </TableCell>
                        <TableCell className='text-right font-medium text-red-600'>
                          {formatCurrency(results.yearly.taxableHRA)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            ) : (
              <div className='text-center py-8'>
                <p className='text-lg text-gray-500'>
                  Enter your details to see the HRA calculation results
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter className='flex flex-col text-sm text-gray-500'>
            <p className='mb-2'>
              Note: HRA exemption is calculated based on the minimum of the
              following three:
            </p>
            <ol className='list-decimal list-inside'>
              <li>Actual HRA received</li>
              <li>
                {metroCity === 'yes' ? '50%' : '40%'} of (Basic Salary + DA)
              </li>
              <li>Rent paid minus 10% of (Basic Salary + DA)</li>
            </ol>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
