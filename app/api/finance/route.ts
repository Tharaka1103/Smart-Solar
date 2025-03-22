import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Finance from '@/models/Finance';
import Notification from '@/models/Notification';

// Get all finances
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const category = url.searchParams.get('category');
    const searchQuery = url.searchParams.get('search');

    await connectToDatabase();
    
    let query: any = {};
    
    // Filter by category if provided
    if (category && category !== 'all') {
      query.category = category;
    }
    
    // Search in title or description
    if (searchQuery) {
      query.$or = [
        { title: { $regex: searchQuery, $options: 'i' } },
        { description: { $regex: searchQuery, $options: 'i' } },
        { reference: { $regex: searchQuery, $options: 'i' } }
      ];
    }
    
    const finances = await Finance.find(query).sort({ date: -1 });
    
    return NextResponse.json(finances);
  } catch (error) {
    console.error('Error fetching finances:', error);
    return NextResponse.json({ error: 'Failed to fetch finances' }, { status: 500 });
  }
}

// Create a new finance record
export async function POST(req: Request) {
  try {
    const body = await req.json();
    await connectToDatabase();
    
    const newFinance = await Finance.create(body);
    
    // Calculate totals to check if expenses > income
    const totalIncome = await Finance.aggregate([
      { $match: { category: 'income' } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    
    const totalExpenses = await Finance.aggregate([
      { $match: { category: 'expense' } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    
    const incomeTotal = totalIncome.length > 0 ? totalIncome[0].total : 0;
    const expensesTotal = totalExpenses.length > 0 ? totalExpenses[0].total : 0;
    
    // Create a notification if expenses are higher than income
    if (expensesTotal > incomeTotal) {
      await Notification.create({
        title: 'Financial Alert',
        description: `Expenses values( LKR:${expensesTotal}/=) are currently higher than income values(LKR:${incomeTotal}/=)`,
        type: 'warning',
      });
    }
    
    return NextResponse.json(newFinance, { status: 201 });
  } catch (error) {
    console.error('Error creating finance:', error);
    return NextResponse.json({ error: 'Failed to create finance record' }, { status: 500 });
  }
}
