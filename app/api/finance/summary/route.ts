import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Finance from '@/models/Finance';

export async function GET() {
  try {
    await connectToDatabase();
    
    // Calculate total income
    const totalIncome = await Finance.aggregate([
      { $match: { category: 'income' } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    
    // Calculate total expenses
    const totalExpenses = await Finance.aggregate([
      { $match: { category: 'expense' } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    
    // Monthly statistics for the current year
    const currentYear = new Date().getFullYear();
    const monthlyStats = await Finance.aggregate([
      {
        $match: {
          date: {
            $gte: new Date(`${currentYear}-01-01`),
            $lte: new Date(`${currentYear}-12-31`)
          }
        }
      },
      {
        $group: {
          _id: {
            month: { $month: "$date" },
            category: "$category"
          },
          total: { $sum: "$amount" }
        }
      },
      {
        $sort: { "_id.month": 1 }
      }
    ]);
    
    // Organize monthly data by month
    const monthlyData = Array.from({ length: 12 }, (_, i) => {
      const month = i + 1;
      const income = monthlyStats.find(stat => 
        stat._id.month === month && stat._id.category === 'income'
      )?.total || 0;
      
      const expense = monthlyStats.find(stat => 
        stat._id.month === month && stat._id.category === 'expense'
      )?.total || 0;
      
      return {
        month,
        income,
        expense,
        balance: income - expense
      };
    });
    
    return NextResponse.json({
      totalIncome: totalIncome.length > 0 ? totalIncome[0].total : 0,
      totalExpenses: totalExpenses.length > 0 ? totalExpenses[0].total : 0,
      balance: (totalIncome.length > 0 ? totalIncome[0].total : 0) - 
               (totalExpenses.length > 0 ? totalExpenses[0].total : 0),
      monthlyData
    });
  } catch (error) {
    console.error('Error calculating finance summary:', error);
    return NextResponse.json({ error: 'Failed to calculate finance summary' }, { status: 500 });
  }
}
