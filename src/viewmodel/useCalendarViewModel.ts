import { useState, useEffect } from 'react';
import { PlanDay, SubstanceEntry, CalendarNote, CalendarEvent, EventCategory } from '../domain/types';
import { LocalStorageRepo } from '../data/localStorageRepo';

export function useCalendarViewModel() {
  const [selectedDate, setSelectedDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [currentYear, setCurrentYear] = useState<number>(() => new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(() => new Date().getMonth()); // 0-indexed

  const [plans, setPlans] = useState<PlanDay[]>([]);
  const [substances, setSubstances] = useState<SubstanceEntry[]>([]);
  const [notes, setNotes] = useState<CalendarNote[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  // Modals for adding entries
  const [isAddNoteModalOpen, setIsAddNoteModalOpen] = useState<boolean>(false);
  const [isAddSubstanceModalOpen, setIsAddSubstanceModalOpen] = useState<boolean>(false);
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState<boolean>(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);

  // New Note state
  const [noteContent, setNoteContent] = useState<string>('');

  // New Substance state
  const [substanceName, setSubstanceName] = useState<string>('');
  const [substanceTime, setSubstanceTime] = useState<string>('08:00');
  const [substanceDetails, setSubstanceDetails] = useState<string>('');

  // New Event state
  const [eventTitle, setEventTitle] = useState<string>('');
  const [eventTime, setEventTime] = useState<string>('12:00');
  const [eventCategory, setEventCategory] = useState<EventCategory>('TRENING');
  const [eventDescription, setEventDescription] = useState<string>('');

  const loadData = () => {
    setPlans(LocalStorageRepo.getPlans());
    setSubstances(LocalStorageRepo.getSubstances());
    setNotes(LocalStorageRepo.getNotes());
    setEvents(LocalStorageRepo.getEvents());
  };

  useEffect(() => {
    loadData();
    const unsubscribe = LocalStorageRepo.subscribe(() => {
      loadData();
    });
    return () => unsubscribe();
  }, []);

  // Selected day items
  const dayPlan = plans.find((p) => p.date === selectedDate);
  const daySubstances = substances.filter((s) => s.date === selectedDate);
  const dayNotes = notes.filter((n) => n.date === selectedDate);
  const dayEvents = events.filter((e) => e.date === selectedDate);

  // Month navigation
  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  // Month grid calculation
  const getDaysInMonth = () => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);

    // Days in week: Mon = 1, Sun = 0 in JS Date -> map to Mon=0..Sun=6
    let startingDay = firstDay.getDay() - 1;
    if (startingDay < 0) startingDay = 6;

    const totalDays = lastDay.getDate();
    const days: Array<{
      dateStr: string;
      dayNumber: number;
      isCurrentMonth: boolean;
      hasWorkout: boolean;
      workoutStatus?: string;
      hasSubstance: boolean;
      hasNote: boolean;
      hasEvent: boolean;
      eventCount: number;
    }> = [];

    // Current month days
    for (let d = 1; d <= totalDays; d++) {
      const monthStr = (currentMonth + 1).toString().padStart(2, '0');
      const dayStr = d.toString().padStart(2, '0');
      const dateStr = `${currentYear}-${monthStr}-${dayStr}`;

      const p = plans.find((item) => item.date === dateStr);
      const sub = substances.some((item) => item.date === dateStr);
      const nt = notes.some((item) => item.date === dateStr);
      const evs = events.filter((item) => item.date === dateStr);

      days.push({
        dateStr,
        dayNumber: d,
        isCurrentMonth: true,
        hasWorkout: p?.dayType === 'WORKOUT',
        workoutStatus: p?.manualStatus,
        hasSubstance: sub,
        hasNote: nt,
        hasEvent: evs.length > 0,
        eventCount: evs.length,
      });
    }

    return { startingOffset: startingDay, days };
  };

  const handleAddNote = () => {
    if (!noteContent.trim()) return;
    LocalStorageRepo.addNote(selectedDate, noteContent.trim());
    setNoteContent('');
    setIsAddNoteModalOpen(false);
    loadData();
  };

  const handleAddSubstance = () => {
    if (!substanceName.trim()) return;
    LocalStorageRepo.addSubstance({
      date: selectedDate,
      time: substanceTime || '08:00',
      name: substanceName.trim(),
      details: substanceDetails.trim(),
    });
    setSubstanceName('');
    setSubstanceDetails('');
    setIsAddSubstanceModalOpen(false);
    loadData();
  };

  const handleDeleteNote = (id: string) => {
    LocalStorageRepo.deleteNote(id);
    loadData();
  };

  const handleDeleteSubstance = (id: string) => {
    LocalStorageRepo.deleteSubstance(id);
    loadData();
  };

  // Events management
  const openAddEventModal = () => {
    setEventTitle('');
    setEventTime('12:00');
    setEventCategory('TRENING');
    setEventDescription('');
    setEditingEvent(null);
    setIsAddEventModalOpen(true);
  };

  const openEditEventModal = (event: CalendarEvent) => {
    setEditingEvent(event);
    setEventTitle(event.title);
    setEventTime(event.time || '12:00');
    setEventCategory(event.category);
    setEventDescription(event.description || '');
    setIsAddEventModalOpen(true);
  };

  const handleSaveEvent = () => {
    if (!eventTitle.trim()) return;
    if (editingEvent) {
      LocalStorageRepo.updateEvent(editingEvent.id, {
        title: eventTitle.trim(),
        time: eventTime.trim() || undefined,
        category: eventCategory,
        description: eventDescription.trim() || undefined,
      });
    } else {
      LocalStorageRepo.addEvent({
        date: selectedDate,
        title: eventTitle.trim(),
        time: eventTime.trim() || undefined,
        category: eventCategory,
        description: eventDescription.trim() || undefined,
      });
    }
    setIsAddEventModalOpen(false);
    setEditingEvent(null);
    loadData();
  };

  const handleDeleteEvent = (id: string) => {
    LocalStorageRepo.deleteEvent(id);
    loadData();
  };

  return {
    selectedDate,
    setSelectedDate,
    currentYear,
    currentMonth,
    prevMonth,
    nextMonth,
    getDaysInMonth,
    dayPlan,
    daySubstances,
    dayNotes,
    dayEvents,
    events,
    isAddNoteModalOpen,
    setIsAddNoteModalOpen,
    noteContent,
    setNoteContent,
    handleAddNote,
    handleDeleteNote,
    isAddSubstanceModalOpen,
    setIsAddSubstanceModalOpen,
    substanceName,
    setSubstanceName,
    substanceTime,
    setSubstanceTime,
    substanceDetails,
    setSubstanceDetails,
    handleAddSubstance,
    handleDeleteSubstance,
    // Event exports
    isAddEventModalOpen,
    setIsAddEventModalOpen,
    editingEvent,
    eventTitle,
    setEventTitle,
    eventTime,
    setEventTime,
    eventCategory,
    setEventCategory,
    eventDescription,
    setEventDescription,
    openAddEventModal,
    openEditEventModal,
    handleSaveEvent,
    handleDeleteEvent,
    loadData,
  };
}
