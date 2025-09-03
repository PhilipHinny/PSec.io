import { useState } from "react"
import "../styles/Calender.css"

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

export function Calendar({ events = [], onDateClick, onEventClick }) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const firstDayWeekday = firstDayOfMonth.getDay()
  const daysInMonth = lastDayOfMonth.getDate()

  const calendarDays = []

  // Empty cells before first day
  for (let i = 0; i < firstDayWeekday; i++) {
    calendarDays.push(null)
  }
  // Fill actual days
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day)
  }

  const navigateMonth = (direction) => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      newDate.setMonth(prev.getMonth() + (direction === "prev" ? -1 : 1))
      return newDate
    })
  }

  const formatDate = (day) => `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`

  const getEventsForDate = (day) => {
    const dateStr = formatDate(day)
    return events.filter((event) => event.date === dateStr)
  }

  const isToday = (day) => {
    const today = new Date()
    return today.getFullYear() === year && today.getMonth() === month && today.getDate() === day
  }

  return (
    <div className="calendar-container">
      {/* Header */}
      <div className="calendar-header">
        <button className="calendar-nav-button" onClick={() => navigateMonth("prev")}>◀</button>
        <h2 className="calendar-title">{MONTHS[month]} {year}</h2>
        <button className="calendar-nav-button" onClick={() => navigateMonth("next")}>▶</button>
      </div>

      {/* Days of Week */}
      <div className="days-header">
        {DAYS_OF_WEEK.map((day) => (
          <div key={day} className="day-header">{day}</div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="calendar-grid">
        {calendarDays.map((day, index) => (
          <div
            key={index}
            className={`calendar-day ${day ? "calendar-day-active" : "calendar-day-inactive"}`}
            onClick={() => day && onDateClick(formatDate(day))}
          >
            {day && (
              <>
                <div className={`day-number ${isToday(day) ? "day-number-today" : ""}`}>{day}</div>
                <div className="events-container">
                  {getEventsForDate(day).slice(0, 3).map((event) => (
                    <div
                      key={event.id}
                      className={`event-item event-${event.type}`}
                      onClick={(e) => {
                        e.stopPropagation()
                        onEventClick(event)
                      }}
                    >
                      {event.title}
                    </div>
                  ))}
                  {getEventsForDate(day).length > 3 && (
                    <div className="events-more">+{getEventsForDate(day).length - 3} more</div>
                  )}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
