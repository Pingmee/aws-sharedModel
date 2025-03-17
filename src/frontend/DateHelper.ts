export function determineTimestampDate(timestamp: number) {
  // This is the timestamp for January 1, 2000 in seconds
  const threshold = 946684800
  let date

  if (timestamp > threshold * 1000) {
    // The timestamp is in milliseconds
    date = new Date(timestamp)
  } else {
    // The timestamp is in seconds
    date = new Date(timestamp * 1000)
  }

  return date
}

export function determineTimestampUnit(timestamp: number) {
  const threshold = 946684800
  if (timestamp < threshold * 1000) {
    // The timestamp is in milliseconds
    return (timestamp * 1000)
  }
  return timestamp
}

export function formatTimestampToTime(timestamp: number) {
  // Create a Date object from the timestamp
  const date = new Date(determineTimestampDate(timestamp))

  // Get hours and minutes from the Date object
  const hours = date.getHours()
  const minutes = date.getMinutes()

  // Format hours and minutes to ensure they are always two digits
  const formattedHours = hours.toString().padStart(2, '0')
  const formattedMinutes = minutes.toString().padStart(2, '0')

  // Return the formatted time string
  return `${ formattedHours }:${ formattedMinutes }`
}

export function formatTimestampToDateTime(timestamp: number) {
  // Create a Date object from the timestamp
  const date = new Date(determineTimestampDate(timestamp))

  // Create a Date object for the current day (today)
  const today = new Date()

  // Compare the date from the timestamp with today's date
  const isToday =
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()

  if (isToday) {
    // Get hours and minutes from the Date object if it's today
    const hours = date.getHours()
    const minutes = date.getMinutes()

    // Format hours and minutes to ensure they are always two digits
    const formattedHours = hours.toString().padStart(2, '0')
    const formattedMinutes = minutes.toString().padStart(2, '0')

    // Return the formatted time string (hh:mm)
    return `${ formattedHours }:${ formattedMinutes }`
  } else {
    // Format the date as dd/mm/yyyy if it's not today
    return formatDateToString(date)
  }
}
export function formatDateToString(date: Date) {
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0') // Months are zero-indexed
  const year = date.getFullYear()

  // Return the formatted date string (dd/mm/yyyy)
  return `${ day }/${ month }/${ year }`
}

export function formatTimestampToFullTime(timestamp: number) {
  // Create a Date object from the timestamp
  const date = new Date(determineTimestampDate(timestamp))

  // Format hours and minutes to ensure they are always two digits
  const formattedHours = date.getHours().toString().padStart(2, '0')
  const formattedMinutes = date.getMinutes().toString().padStart(2, '0')
  const formattedSeconds = date.getSeconds().toString().padStart(2, '0')

  // Return the formatted date string (dd/mm/yyyy)
  return `${ formattedHours }:${ formattedMinutes }:${ formattedSeconds }`
}

export function formatTimestampToParsedFullTime(totalSeconds: number) {
  // Convert timestamp to seconds

  // Calculate hours, minutes, and seconds
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  // Construct the formatted time string
  const parts = [];
  if (hours > 0) parts.push(`${hours} Hour${hours > 1 ? 's' : ''}`);
  if (minutes > 0) parts.push(`${minutes} Min`);
  if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`);

  // Join the parts with commas
  return parts.join(', ');
}

export function formatTimestampToDayMonth(timestamp: number) {
  // Create a Date object from the timestamp
  const date = new Date(determineTimestampDate(timestamp))

  // Format hours and minutes to ensure they are always two digits
  const formattedHours = date.getHours().toString().padStart(2, '0')
  const formattedMinutes = date.getMinutes().toString().padStart(2, '0')
  const formattedSeconds = date.getSeconds().toString().padStart(2, '0')

  // Format the date as dd/mm/yyyy if it's not today
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0') // Months are zero-indexed

  // Return the formatted date string (dd/mm/yyyy)
  return `${ day }/${ month }`
}

export enum DateFormat {
  DayMonthYear = 'DayMonthYear', // e.g., 17 May 2024
  MonthDayYear = 'MonthDayYear', // e.g., May 17, 2024
  ShortDate = 'ShortDate'        // e.g., 17/05/2024
}

const daysOfWeekEnglish: string[] = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
]

const daysOfWeekHebrew: string[] = [
  'יום ראשון',
  'יום שני',
  'יום שלישי',
  'יום רביעי',
  'יום חמישי',
  'יום שישי',
  'יום שבת'
]

const getDayName = (date: Date, language: 'english' | 'hebrew'): string => {
  const dayIndex = date.getDay() // getDay() returns 0 for Sunday, 1 for Monday, etc.
  if (language === 'english') {
    return daysOfWeekEnglish[dayIndex]
  } else {
    return daysOfWeekHebrew[dayIndex]
  }
}

export function formatTimestampToDay(timestamp: number, format: DateFormat) {
  // Create a Date object from the timestamp
  const date = new Date(determineTimestampDate(timestamp))
  const now = new Date()

  const day = date.getDate()
  const month = date.toLocaleString('default', {month: 'long'})
  const shortMonth = date.getMonth() + 1 // getMonth() returns 0-based month index
  const year = date.getFullYear()
  const currentYear = now.getFullYear()

  let formattedDate: string

  if (isToday(date)) {
    formattedDate = 'היום'
  } else if (isYesterday(date)) {
    formattedDate = 'אתמול'
  } else if (isDateInCurrentWeek(date)) {
    formattedDate = getDayName(date, 'hebrew')
  } else {
    switch (format) {
      case DateFormat.DayMonthYear:
        formattedDate = `${ day } ${ month }`
        break
      case DateFormat.MonthDayYear:
        formattedDate = `${ month } ${ day }`
        break
      case DateFormat.ShortDate:
        formattedDate = `${ day }/${ shortMonth }`
        break
      default:
        formattedDate = `${ day } ${ month }`
    }

    formattedDate += `,  ${ getDayName(date, 'hebrew') }`
    // Include year if it's different from the current year
    if (year !== currentYear) {
      formattedDate += ` ${ year }`
    }
  }

  return formattedDate
}

const isDateInCurrentWeek = (date: Date): boolean => {
  const now = new Date()
  const startOfWeek = new Date(now)
  startOfWeek.setDate(now.getDate() - now.getDay())
  startOfWeek.setHours(0, 0, 0, 0)

  const endOfWeek = new Date(startOfWeek)
  endOfWeek.setDate(startOfWeek.getDate() + 6)
  endOfWeek.setHours(23, 59, 59, 999)

  return date >= startOfWeek && date <= endOfWeek
}

const isToday = (date: Date): boolean => {
  const today = new Date()
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  )
}

const isYesterday = (date: Date): boolean => {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  return (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  )
}

export const areSameDay = (timestamp1: number, timestamp2: number): boolean => {
  const date1 = new Date(determineTimestampDate(timestamp1))
  const date2 = new Date(determineTimestampDate(timestamp2))

  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

export function isWithin24Hours(timestamp: number): boolean {
  const now = Date.now() // Current time in milliseconds since Unix epoch
  const twentyFourHoursAgo = now - determineTimestampUnit(24 * 60 * 60) // Time 24 hours ago in milliseconds
  const correctedTimestamp = determineTimestampUnit(timestamp)
  return correctedTimestamp <= twentyFourHoursAgo && correctedTimestamp <= now
}