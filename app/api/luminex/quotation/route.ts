import { NextRequest, NextResponse } from 'next/server';

// Helper function to calculate system size based on inputs
function calculateSystemSize(monthlyBill: number, area: number, propertyType: string) {
  // Basic formula: 1 kWh costs about Rs 30 (average), and 1 kW produces about 4 kWh per day
  const estimatedConsumption = monthlyBill / 30; // Estimated daily consumption in kWh
  
  // Calculate base system size
  let systemSize = estimatedConsumption / 4;
  
  // Adjust based on property type
  if (propertyType === 'commercial') {
    systemSize *= 1.2; // Commercial properties need bigger systems
  } else if (propertyType === 'industrial') {
    systemSize *= 1.5; // Industrial properties need even bigger systems
  }
  
  // Cap based on available area (1 kW needs about 100 sq ft)
  const maxSizeBasedOnArea = area / 100;
  
  return Math.min(systemSize, maxSizeBasedOnArea).toFixed(2);
}

// Calculate panel count based on system size
function calculatePanelCount(systemSize: number) {
    // Assuming 400W panels
    return Math.ceil(systemSize * 1000 / 400);
  }
  
  // Calculate inverter type based on system size
  function determineInverterType(systemSize: number) {
    if (systemSize <= 3) {
      return 'String Inverter (3kW)';
    } else if (systemSize <= 5) {
      return 'String Inverter (5kW)';
    } else if (systemSize <= 10) {
      return 'String Inverter (10kW)';
    } else {
      return 'Three Phase Inverter';
    }
  }
  
  // Determine battery storage based on usage pattern and system size
  function determineBatteryStorage(usage: string, systemSize: number) {
    if (usage === 'daytime') {
      return 'None (Grid-Tie System)';
    } else if (usage === 'evening') {
      return `${Math.ceil(systemSize * 5)}kWh Lithium Battery Storage`;
    } else {
      return `${Math.ceil(systemSize * 3)}kWh Lithium Battery Storage`;
    }
  }
  
  // Calculate costs based on system specifications
  function calculateCosts(systemSize: number, batteryStorage: string, location: string) {
    // Base system cost (excluding batteries) - approximately Rs 150,000 per kW
    let systemCost = systemSize * 150000;
    
    // Add battery costs if applicable
    if (batteryStorage !== 'None (Grid-Tie System)') {
      const batterySize = parseInt(batteryStorage.split('kWh')[0]);
      // Lithium batteries cost approximately Rs 100,000 per kWh
      systemCost += batterySize * 100000;
    }
    
    // Installation costs - approximately 15% of system cost
    const installationCost = systemCost * 0.15;
    
    // Adjust based on location (transport costs)
    let locationMultiplier = 1.0;
    if (location !== 'western') {
      locationMultiplier = 1.1; // 10% extra for other provinces
    }
    
    return {
      systemCost: Math.round(systemCost * locationMultiplier),
      installationCost: Math.round(installationCost * locationMultiplier),
      totalCost: Math.round((systemCost + installationCost) * locationMultiplier)
    };
  }
  
  // Calculate monthly savings and payback period
  function calculateFinancials(systemSize: number, monthlyBill: number, batteryStorage: string) {
    // Estimate monthly production: 1 kW produces ~120 kWh per month in Sri Lanka
    const monthlyProduction = systemSize * 120;
    
    // Current electricity cost (average in Rs per kWh)
    const electricityCost = 30;
    
    // Estimated monthly savings
    let monthlySavings = monthlyProduction * electricityCost;
    
    // Cap the savings at the current bill amount (can't save more than you spend)
    monthlySavings = Math.min(monthlySavings, Number(monthlyBill));
    
    // Calculate components list based on system configuration
    const components = [
      `${calculatePanelCount(Number(systemSize))} x 400W Tier-1 Solar Panels`,
      determineInverterType(Number(systemSize)),
      'Mounting Structure and Hardware',
      'DC & AC Protection Devices',
      'Cabling and Connection Accessories'
    ];
    
    // Add battery to components if applicable
    if (batteryStorage !== 'None (Grid-Tie System)') {
      components.push(batteryStorage);
      components.push('Hybrid Inverter Upgrade');
    }
    
    return {
      monthlyProduction,
      monthlySavings,
      components
    };
  }
  
  export async function POST(req: NextRequest) {
    try {
      const data = await req.json();
      
      // Extract values with type conversion
      const monthlyBill = Number(data.monthlyBill);
      const area = Number(data.area);
      const propertyType = data.propertyType;
      const roofType = data.roofType;
      const location = data.location;
      const usage = data.usage;
      
      // Validate inputs
      if (isNaN(monthlyBill) || isNaN(area) || !propertyType || !roofType || !location || !usage) {
        return NextResponse.json(
          { error: 'Invalid input parameters' },
          { status: 400 }
        );
      }
      
      // Calculate system specifications
      const systemSize = Number(calculateSystemSize(monthlyBill, area, propertyType));
      const panelCount = calculatePanelCount(systemSize);
      const inverterType = determineInverterType(systemSize);
      const batteryStorage = determineBatteryStorage(usage, systemSize);
      
      // Calculate costs
      const costs = calculateCosts(systemSize, batteryStorage, location);
      
      // Calculate financial metrics
      const financials = calculateFinancials(systemSize, monthlyBill, batteryStorage);
      
      // Calculate payback period in years
      const paybackPeriod = (costs.totalCost / (financials.monthlySavings * 12)).toFixed(1);
      
      // Introduce a small delay to simulate processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create quotation response
      const quotation = {
        systemSize,
        panelCount,
        inverterType,
        batteryStorage,
        monthlyProduction: financials.monthlyProduction,
        systemCost: costs.systemCost,
        installationCost: costs.installationCost,
        totalCost: costs.totalCost,
        monthlySavings: financials.monthlySavings,
        paybackPeriod,
        components: financials.components
      };
      
      return NextResponse.json({ quotation });
    } catch (error: any) {
      console.error('Error generating quotation:', error);
      return NextResponse.json(
        { error: 'Failed to generate quotation. Please try again.' },
        { status: 500 }
      );
    }
  }
  
