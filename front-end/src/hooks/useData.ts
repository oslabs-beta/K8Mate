import { DateTime } from 'luxon'

// Function to format the standard time with a dynamic timezone
export function convertToMilitaryTime(
    utcTimestamp: string | number,
    timeZone: string,
    request?: 'date' | 'timestamp'
): string {
    // Create a Date object from the UTC timestamp
    const date = new Date(utcTimestamp);

    // Get the time components (hours, minutes, seconds, milliseconds) in the specified timezone
    const options = { timeZone, hour12: false };

    const hours = date.toLocaleString('en-US', { timeZone, hour: '2-digit', hour12: false }).slice(0, 2);
    const minutes = date.toLocaleString('en-US', { timeZone, minute: '2-digit', hour12: false }).slice(-2);
    const seconds = date.toLocaleString('en-US', { timeZone, second: '2-digit', hour12: false }).slice(-2);
    const milliseconds = date.getMilliseconds().toString().padStart(3, '0'); // Ensure three digits for milliseconds

    // Combine the time components into military time format with milliseconds
    const time = `${hours}:${minutes}:${seconds}.${milliseconds}`;

    // Format the date part separately in the specified timezone
    const formattedDate = date.toLocaleDateString('en-US', { timeZone });

    // Return the final formatted date and time string based on the request
    if (request === 'date') return formattedDate;
    if (request === 'timestamp') return time;

    // Optionally, return both date and time if request is not specified or needs both
    return `${formattedDate} ${time}`;
}


// funcion to get the UTC offset of a timezone
export function getTimezoneOffset (zone) {
    const dt = DateTime.now().setZone(zone);
    const offset = dt.offset; // Offset in minutes
    const hours = Math.floor(Math.abs(offset) / 60);
    const minutes = Math.abs(offset) % 60;
    const sign = offset >= 0 ? '+' : '-';
    return `UTC${sign}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};


