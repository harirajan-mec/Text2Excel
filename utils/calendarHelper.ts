import { CalendarEvent } from '../types';

/**
 * Formats a date string into the Google Calendar required format (YYYYMMDDTHHMMSSZ)
 */
const formatGoogleCalendarDate = (dateStr: string): string => {
  try {
    const date = new Date(dateStr);
    // Check if valid date
    if (isNaN(date.getTime())) {
      throw new Error("Invalid date");
    }
    return date.toISOString().replace(/-|:|\.\d\d\d/g, "");
  } catch (e) {
    // Fallback to current time + 1 hour if parsing fails
    const now = new Date();
    now.setHours(now.getHours() + 1);
    return now.toISOString().replace(/-|:|\.\d\d\d/g, "");
  }
};

export const getGoogleCalendarUrl = (event: CalendarEvent | undefined, fallbackTitle: string): string => {
  let title = "";
  let details = "";
  let location = "";
  let start = "";
  let end = "";

  if (event) {
    title = event.title;
    details = event.description;
    location = event.location || "";
    start = formatGoogleCalendarDate(event.startDate);
    end = formatGoogleCalendarDate(event.endDate);
  } else {
    // Fallback: Create a generic reminder for 1 hour from now
    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
    const twoHoursLater = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    
    title = `Review: ${fallbackTitle}`;
    details = "Review the extracted Excel data.";
    start = formatGoogleCalendarDate(oneHourLater.toISOString());
    end = formatGoogleCalendarDate(twoHoursLater.toISOString());
  }

  const baseUrl = "https://calendar.google.com/calendar/render";
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${start}/${end}`,
    details: details,
    location: location,
  });

  return `${baseUrl}?${params.toString()}`;
};