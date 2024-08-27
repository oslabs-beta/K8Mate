// function to format the standard time
export function convertToPSTMilitaryTime(utcTimestamp, request) {
     // Create a Date object from the UTC timestamp
     const date = new Date(utcTimestamp);

     // Get the PST hours, minutes, seconds, and milliseconds separately
     const options = { timeZone: 'America/Los_Angeles', hour12: false };
     const pstHours = date.toLocaleString('en-US', { timeZone: 'America/Los_Angeles', hour: '2-digit', hour12: false }).slice(0, 2);
     const pstMinutes = date.toLocaleString('en-US', { timeZone: 'America/Los_Angeles', minute: '2-digit', hour12: false }).slice(-2);
     const pstSeconds = date.toLocaleString('en-US', { timeZone: 'America/Los_Angeles', second: '2-digit', hour12: false }).slice(-2);
     const pstMilliseconds = date.getMilliseconds().toString().padStart(3, '0'); // Ensure three digits for milliseconds
 
     // Combine the time components into military time format with milliseconds
     const pstTime = `${pstHours}:${pstMinutes}:${pstSeconds}.${pstMilliseconds}`;
 
     // Format the date part separately
     const pstDate = date.toLocaleDateString('en-US', { timeZone: 'America/Los_Angeles' });
 
     // Return the final formatted date and time string
     if (request === 'date') {
        return `${pstDate}`
     }

    if (request === 'timestamp') {
        return `${pstTime}`
    }
}

export function findDate(utcTimestamp) {

}