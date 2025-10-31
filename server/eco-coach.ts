// Rule-based eco-coach - provides sustainability tips without requiring OpenAI API
export function getEcoCoachResponse(userMessage: string): { content: string; category?: string } {
  const messageLower = userMessage.toLowerCase();

  // Energy saving tips
  if (messageLower.includes("energy") || messageLower.includes("electricity") || messageLower.includes("power")) {
    const energyTips = [
      {
        content: "Great question about energy! Here are some effective ways to reduce your energy consumption:\n\n1. **LED Bulbs**: Replace incandescent bulbs with LED lights - they use 75% less energy and last 25 times longer.\n\n2. **Unplug Devices**: Electronics use power even when off. Unplug chargers and devices when not in use, or use a power strip you can switch off.\n\n3. **Smart Thermostat**: Adjust heating/cooling by just 1-2 degrees to save 10-15% on energy bills.\n\n4. **Energy-Efficient Appliances**: Look for ENERGY STAR rated appliances when replacing old ones.\n\n5. **Natural Light**: Open curtains during the day instead of using artificial lighting.\n\nWould you like specific tips for any of these areas?",
        category: "energy"
      },
      {
        content: "Excellent focus on energy conservation! Here are some quick wins:\n\n💡 **Lighting**: Switch to LED bulbs and use natural light when possible\n\n❄️ **Cooling**: Set AC to 78°F (26°C) in summer, use fans to circulate air\n\n🔥 **Heating**: Set thermostat to 68°F (20°C) in winter, wear layers\n\n🖥️ **Electronics**: Enable sleep mode on computers, unplug phone chargers\n\n🌊 **Water Heating**: Lower water heater temperature to 120°F (49°C)\n\nEven small changes add up to significant energy savings!",
        category: "energy"
      }
    ];
    return energyTips[Math.floor(Math.random() * energyTips.length)];
  }

  // Recycling and waste
  if (messageLower.includes("recycle") || messageLower.includes("recycling") || messageLower.includes("waste") || messageLower.includes("trash") || messageLower.includes("garbage")) {
    const wasteTips = [
      {
        content: "Recycling is crucial for sustainability! Here's a comprehensive guide:\n\n♻️ **What to Recycle**:\n- Paper, cardboard, newspapers\n- Glass bottles and jars (rinsed)\n- Metal cans (aluminum, steel)\n- Plastic bottles #1 and #2\n- Cardboard boxes (flattened)\n\n🚫 **Don't Recycle**:\n- Plastic bags (return to grocery stores)\n- Food-contaminated items\n- Styrofoam\n- Broken glass\n\n💡 **Pro Tips**:\n1. Rinse containers before recycling\n2. Keep recyclables dry\n3. Don't bag recyclables\n4. Check local guidelines - rules vary by area\n\nRemember: Reduce and Reuse come before Recycle!",
        category: "waste"
      },
      {
        content: "Great thinking about waste reduction! Here's the ultimate waste hierarchy:\n\n1️⃣ **REFUSE**: Say no to single-use items, unnecessary packaging\n\n2️⃣ **REDUCE**: Buy less, choose products with minimal packaging\n\n3️⃣ **REUSE**: Use reusable bags, bottles, containers\n\n4️⃣ **RECYCLE**: Properly sort and clean recyclables\n\n5️⃣ **ROT**: Compost food scraps and yard waste\n\n🌟 **Quick Wins**:\n- Carry a reusable water bottle\n- Bring reusable bags shopping\n- Use cloth napkins instead of paper\n- Buy in bulk to reduce packaging\n\nEvery item you don't send to landfill makes a difference!",
        category: "waste"
      }
    ];
    return wasteTips[Math.floor(Math.random() * wasteTips.length)];
  }

  // Water conservation
  if (messageLower.includes("water") || messageLower.includes("shower") || messageLower.includes("conservation")) {
    return {
      content: "Water conservation is essential! Here are practical ways to save water:\n\n🚿 **Bathroom** (biggest water use):\n- Shorten showers by 2-3 minutes (saves 10 gallons)\n- Turn off tap while brushing teeth\n- Fix leaky faucets immediately\n- Install low-flow showerhead\n\n🍽️ **Kitchen**:\n- Run dishwasher only when full\n- Don't pre-rinse dishes (modern dishwashers handle it)\n- Keep drinking water in fridge instead of running tap\n\n🌱 **Outdoors**:\n- Water plants early morning or evening\n- Use rain barrel to collect water\n- Choose drought-resistant plants\n\n💧 **Fun Fact**: A dripping faucet can waste 3,000 gallons per year!\n\nEvery drop counts in water conservation!",
      category: "water"
    };
  }

  // Carbon footprint and climate
  if (messageLower.includes("carbon") || messageLower.includes("footprint") || messageLower.includes("climate") || messageLower.includes("co2") || messageLower.includes("emission")) {
    return {
      content: "Reducing your carbon footprint is one of the most important things you can do! Here's how:\n\n🚴 **Transportation** (biggest impact):\n- Bike, walk, or use public transit when possible\n- Carpool or use ride-sharing\n- Drive efficiently: maintain tire pressure, avoid idling\n- Consider electric/hybrid for your next vehicle\n\n🏠 **Home Energy**:\n- Switch to renewable energy if available\n- Improve insulation to reduce heating/cooling needs\n- Use programmable thermostat\n\n🥗 **Food Choices**:\n- Eat more plant-based meals (huge impact!)\n- Buy local and seasonal produce\n- Reduce food waste\n\n✈️ **Travel**: Limit air travel when possible, offset when you must fly\n\n📊 **Average person**: ~4 tons CO₂/year. Goal: Under 2 tons!\n\nYou're already making a difference by tracking your actions!",
      category: "carbon"
    };
  }

  // Plastic reduction
  if (messageLower.includes("plastic")) {
    return {
      content: "Fantastic! Reducing plastic is a powerful way to help the planet:\n\n🛍️ **Shopping**:\n- Bring reusable bags (keep them in your car!)\n- Choose products in glass, metal, or cardboard\n- Buy in bulk to reduce packaging\n- Avoid individually wrapped items\n\n☕ **On the Go**:\n- Use reusable water bottle and coffee cup\n- Say no to plastic straws and utensils\n- Carry reusable cutlery set\n\n🏪 **At Home**:\n- Use glass containers for food storage\n- Choose bar soap over liquid in plastic bottles\n- Use beeswax wraps instead of plastic wrap\n- Refill containers at bulk stores\n\n♻️ **Did you know?**: Only 9% of all plastic ever made has been recycled. The best plastic is the plastic we never use!\n\nSmall swaps add up to major impact!",
      category: "waste"
    };
  }

  // Composting
  if (messageLower.includes("compost")) {
    return {
      content: "Composting is amazing for reducing waste and enriching soil! Here's how to start:\n\n✅ **GREENS (Nitrogen-rich)**:\n- Fruit and vegetable scraps\n- Coffee grounds and filters\n- Tea bags\n- Fresh grass clippings\n- Plant trimmings\n\n✅ **BROWNS (Carbon-rich)**:\n- Dry leaves\n- Shredded paper/cardboard\n- Straw or hay\n- Wood chips\n- Egg cartons\n\n❌ **NEVER Compost**:\n- Meat, fish, dairy\n- Oils and fats\n- Pet waste\n- Diseased plants\n\n🌱 **Getting Started**:\n1. Choose location (yard or countertop bin)\n2. Layer greens and browns (roughly 1:3 ratio)\n3. Keep moist but not soggy\n4. Turn weekly for faster decomposition\n\n📊 Composting can reduce household waste by 30%!\n\nYou'll have rich soil for gardening in 2-3 months!",
      category: "waste"
    };
  }

  // Transportation
  if (messageLower.includes("transport") || messageLower.includes("car") || messageLower.includes("bike") || messageLower.includes("transit")) {
    return {
      content: "Transportation choices have huge environmental impact! Here are sustainable options:\n\n🚴 **Best Options** (zero emissions):\n- Biking: Great for trips under 5 miles\n- Walking: Perfect for short distances\n- E-bikes: Extends range with minimal energy\n\n🚇 **Public Transit**:\n- Bus: 80% less CO₂ than driving alone\n- Train/Metro: Even more efficient\n- Benefits: Save money, reduce traffic, reduce stress\n\n🚗 **Smart Driving**:\n- Carpool/rideshare when possible\n- Combine errands into one trip\n- Maintain your vehicle (proper tire pressure saves fuel)\n- Drive smoothly (no rapid acceleration)\n\n⚡ **Future**: Consider electric or hybrid for next vehicle\n\n💚 **Impact**: Biking 5 miles instead of driving saves ~2.5 kg CO₂!\n\nEvery trip counts - you're making a real difference!",
      category: "transport"
    };
  }

  // Food and diet
  if (messageLower.includes("food") || messageLower.includes("plant") || messageLower.includes("meat") || messageLower.includes("diet") || messageLower.includes("vegan") || messageLower.includes("vegetarian")) {
    return {
      content: "Food choices are powerful for sustainability! Here's the impact:\n\n🌱 **Plant-Based Power**:\n- Beef production creates 10-40x more emissions than plants\n- Even replacing 1 meat meal/week saves 250 kg CO₂/year!\n- Plant proteins: beans, lentils, tofu, tempeh, nuts\n\n🥕 **Sustainable Eating**:\n- Buy local and seasonal produce\n- Reduce food waste (plan meals, use leftovers)\n- Choose organic when possible\n- Grow your own herbs/vegetables\n\n🐟 **Mindful Choices**:\n- If eating animal products, choose sustainably sourced\n- Poultry has lower impact than red meat\n- Wild-caught fish over farmed (check sustainability)\n\n📊 **Impact**: Going vegetarian 1 day/week = not driving 1,160 miles/year!\n\nYou don't have to be perfect - every plant-based meal helps!\n\nWould you like plant-based meal ideas?",
      category: "food"
    };
  }

  // Zero waste lifestyle
  if (messageLower.includes("zero waste") || messageLower.includes("minimalist") || messageLower.includes("sustainable living")) {
    return {
      content: "Zero waste living is an inspiring goal! Start with these steps:\n\n🎯 **The 5 R's**:\n1. **REFUSE**: Say no to freebies, single-use items\n2. **REDUCE**: Buy less, choose quality over quantity\n3. **REUSE**: Repair, repurpose, buy secondhand\n4. **RECYCLE**: Last resort for what you can't refuse/reduce/reuse\n5. **ROT**: Compost organic waste\n\n🛒 **Shopping**:\n- Bulk bins with your own containers\n- Farmers markets with reusable bags\n- Package-free stores\n- Secondhand for clothes, furniture, etc.\n\n🏠 **At Home**:\n- Cloth napkins, towels, handkerchiefs\n- Glass/metal containers instead of plastic\n- Natural cleaning products (vinegar, baking soda)\n- Bar soap, shampoo bars, toothpaste tablets\n\n💡 **Remember**: Progress over perfection! Start with one change at a time.\n\nWhat area would you like to focus on first?",
      category: "general"
    };
  }

  // Default response with general tips
  const generalResponses = [
    {
      content: "I'm here to help you live more sustainably! I can provide tips on:\n\n🌱 **Energy Saving** - Reduce your power consumption\n♻️ **Recycling & Waste** - Minimize landfill impact\n💧 **Water Conservation** - Save this precious resource\n🌍 **Carbon Footprint** - Understand your climate impact\n🚴 **Green Transportation** - Sustainable travel options\n🥗 **Sustainable Food** - Eco-friendly eating\n🏠 **Zero Waste Living** - Reduce, reuse, refuse\n\nWhat sustainability topic interests you most? Just ask!",
      category: "general"
    },
    {
      content: "Great to see you interested in sustainability! Here are some quick wins to start:\n\n1️⃣ **Swap to LED bulbs** - 75% energy savings\n2️⃣ **Bring reusable bags** - Avoid 500 plastic bags/year\n3️⃣ **Shorten showers** - Save 10 gallons per shower\n4️⃣ **Unplug devices** - Stop phantom power drain\n5️⃣ **Try plant-based meals** - Huge carbon reduction\n\nEvery small action counts! Which area would you like to explore more?",
      category: "tips"
    },
    {
      content: "Thank you for being environmentally conscious! 🌍\n\nRemember, sustainability is a journey, not a destination. Here are some principles to guide you:\n\n💚 **Start Small**: Don't try to change everything at once\n🎯 **Be Consistent**: Small daily actions > occasional big gestures\n📊 **Track Progress**: Use GreenMove to see your impact grow\n🤝 **Share Knowledge**: Inspire others by your example\n🌟 **Celebrate Wins**: Acknowledge your positive impact\n\nYou're already making a difference by being here! What specific sustainability question can I help with today?",
      category: "motivation"
    }
  ];

  return generalResponses[Math.floor(Math.random() * generalResponses.length)];
}
