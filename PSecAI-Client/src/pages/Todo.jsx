import { useState, useEffect } from "react";
import "../styles/Main.css"; // Plain CSS file

export function Todo({ isOpen, onClose, onSave, onDelete, selectedDate, editingEvent }) {
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    description: "",
    type: "personal",
  });

  useEffect(() => {
    if (editingEvent) {
      setFormData({
        title: editingEvent.title,
        date: editingEvent.date,
        time: editingEvent.time,
        description: editingEvent.description,
        type: editingEvent.type,
      });
    } else {
      setFormData({
        title: "",
        date: selectedDate || new Date().toISOString().split("T")[0],
        time: "",
        description: "",
        type: "personal",
      });
    }
  }, [editingEvent, selectedDate, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.date) return;
    onSave(formData);
  };

  const handleDelete = () => {
    if (editingEvent) {
      onDelete(editingEvent.id);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{editingEvent ? "Edit Event" : "Create New Event"}</h2>
        <form onSubmit={handleSubmit} className="modal-form">
          <label>
            Title
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Event title"
              required
            />
          </label>

          <label>
            Date
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </label>

          <label>
            Time
            <input
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            />
          </label>

          <label>
            Type
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              <option value="personal">Personal</option>
              <option value="work">Work</option>
              <option value="meeting">Meeting</option>
            </select>
          </label>

          <label>
            Description
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Event description (optional)"
              rows={3}
            />
          </label>

          <div className="modal-buttons">
            {editingEvent && (
              <button type="button" className="delete-button" onClick={handleDelete}>
                Delete
              </button>
            )}
            <div className="right-buttons">
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
  );
}
