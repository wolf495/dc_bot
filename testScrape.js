// Node 20+ (no extra modules needed)
function isToday(date) {
  today = new Date();
  //const today = new Date("10/07/2025");
  //console.log(`${date.getFullYear()} === ${today.getFullYear()}`)
  //console.log(`${date.getMonth()} === ${today.getMonth()}`)
  //console.log(`${date.getDate()} === ${today.getDate()}`)
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

function parseDateRange(str) {
  // Remove suffixes like "st", "nd", "rd", "th" and extra spaces/dashes
  str = str.replace(/(\d+)(st|nd|rd|th)/gi, '$1').replace(/\s*–\s*/g, '-');

  // Split into start and end parts
  [startStr, endStr] = str.split('-').map(s => s.trim());

  //console.log(`${startStr} AND ${endStr}`)

  if (!endStr){
    endStr = startStr
  }
  // Get possible months and days
  const monthNames = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December'
  ];

  function parsePart(part, fallbackMonth) {
    // Find month name in the part
    const month = monthNames.find(m => part.startsWith(m)) || fallbackMonth;
    const day = parseInt(part.match(/\d+/)?.[0] || '1', 10);
    return { month, day };
  }

  const startPart = parsePart(startStr);
  const endPart = parsePart(endStr, startPart.month);

  // Use current year (or adjust logic if you want dynamic year handling)
  const currentYear = new Date().getFullYear();

  // Construct Date objects
  const startDate = new Date(`${startPart.month} ${startPart.day}, ${currentYear}`);
  const endDate = new Date(`${endPart.month} ${endPart.day}, ${currentYear}`);

  // Handle year rollover (e.g., December–January)
  if (endDate < startDate) {
    endDate.setFullYear(currentYear + 1);
  }

  return { startDate, endDate };
}

// Example usage:
//const range = "September 30th–October 6th";
//const parsed = parseDateRange(range);
//console.log(parsed.startDate, parsed.endDate);




(async () => {
  const res = await fetch("https://www.wizard101.com/game/monthly-events-calendar");
  const html = await res.text();

  // Match everything between <strong>...</strong>
  const regex = /<strong>(.*?)<\/strong>/gi;
  const regex2 = /<h2><center>(.*?)<\/center><\/h2>/gi;
  const regex3 = /<a href="(.*?)" target=_blank>See Details/gi;
  const matches = [];
  const matches2 = [];
  const matches3 = [];
  let match;
  let match2;
  let match3;

  while ((match = regex.exec(html)) !== null) {
    const text = match[1]
      .replace(/<[^>]+>/g, '') // remove any nested HTML
      .trim();
    if (text && !text.includes("Welcome") ) matches.push(text);
  }

  while ((match2 = regex2.exec(html)) !== null) {
    const text = match2[1]
      .replace(/<[^>]+>/g, '') // remove any nested HTML
      .replace(/event runs through /gi, "")
      .trim();

    if (text) matches2.push(text);
  }

  while ((match3 = regex3.exec(html)) !== null) {
    const text = match3[1]
      .replace(/<[^>]+>/g, '') // remove any nested HTML
      .trim();

    if (text) matches3.push(text);
  }
  const combined = matches.map((_, i) => [matches[i], matches2[i]]);
  //console.log(combined);
  newCombined = []
  for (const event of combined) {
    eventName=event[0]
    eventDateRange=event[1]
    eventDateRange.replace(/event runs through /gi, "");
    parsed = parseDateRange(eventDateRange);
    //console.log(`Event: ${eventName} [${parsed.startDate.toLocaleDateString()} - ${parsed.endDate.toLocaleDateString()}]`)
    if(isToday(parsed.startDate)){
        console.log(`Event: ${eventName} [${parsed.startDate.toLocaleDateString()} - ${parsed.endDate.toLocaleDateString()}]`)
    }
    }


  
  //console.log(matches2);
  //console.log(matches3);


 //<a href="https://www.wizard101.com/game/beastmoon-hunt-begins" target=_blank>See Details
})();
