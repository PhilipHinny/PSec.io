import { useState, useEffect } from "react"
import { Trash2 } from "lucide-react"
import "../styles/Event-modal.css"

const EventModal = ({ isOpen, onClose, onSave, onDelete, selectedDate, editingEvent }) => {
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    description: "",
    type: "personal",
  })

  useEffect(() => {
    if (editingEvent) {
      setFormData({
        title: editingEvent.title,
        date: editingEvent.date,
        time: editingEvent.time,
        description: editingEvent.description,
        type: editingEvent.type,
      })
    } else {
      setFormData({
        title: "",
        date: selectedDate || new Date().toISOString().split("T")[0],
        time: "",
        description: "",
        type: "personal",
      })
    }
  }, [editingEvent, selectedDate, isOpen])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.title.trim() || !formData.date) return
    onSave(formData)
  }

  const handleDelete = () => {
    if (editingEvent) {
      onDelete(editingEvent.id)
    }
  }

  if (!isOpen) return null // Don't render if modal is closed

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{editingEvent ? "Edit Event" : "Create New Event"}</h2>

        <form onSubmit={handleSubmit} className="modal-form">
          {/* Event Title */}
          <div className="form-group">
            <label htmlFor="title">Event Title</label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Enter event title"
              required
            />
          </div>

          {/* Date and Time */}
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="date">Date</label>
              <input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="time">Time</label>
              <input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData((prev) => ({ ...prev, time: e.target.value }))}
              />
            </div>
          </div>

          {/* Event Type */}
          <div className="form-group">
            <label htmlFor="type">Event Type</label>
            <select
              id="type"
              value={formData.type}
              onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value }))}
            >
              <option value="personal">Personal</option>
              <option value="work">Work</option>
              <option value="meeting">Meeting</option>
            </select>
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Enter event description (optional)"
              rows={3}
            />
          </div>

          {/* Action Buttons */}
          <div className="form-actions">
            {editingEvent && (
              <button type="button" className="delete-button" onClick={handleDelete}>
                <Trash2 className="icon-small" />
                Delete
              </button>
            )}
            <div className="form-actions-right">
              <button type="button" className="cancel-button" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="save-button">
                {editingEvent ? "Update Event" : "Create Event"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export { EventModal }
