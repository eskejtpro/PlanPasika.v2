package com.planpasika.v2.ui.screens.calendar

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.planpasika.v2.data.local.entities.CalendarEventEntity
import com.planpasika.v2.data.local.entities.SubstanceLogEntity
import com.planpasika.v2.data.local.entities.WorkoutNoteEntity
import com.planpasika.v2.data.repository.PlanPasikaRepository
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

class CalendarViewModel(application: Application) : AndroidViewModel(application) {

    private val repository = PlanPasikaRepository(application.applicationContext, viewModelScope)

    val events: StateFlow<List<CalendarEventEntity>> = repository.allEventsFlow
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val notes: StateFlow<List<WorkoutNoteEntity>> = repository.allNotesFlow
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    fun addEvent(title: String, date: String, time: String?, category: String, description: String?) {
        viewModelScope.launch {
            val event = CalendarEventEntity(
                id = "ev_${System.currentTimeMillis()}",
                title = title,
                date = date,
                time = time,
                category = category,
                description = description
            )
            repository.addCalendarEvent(event)
        }
    }

    fun deleteEvent(event: CalendarEventEntity) {
        viewModelScope.launch {
            repository.deleteCalendarEvent(event)
        }
    }

    fun addNote(title: String, date: String, content: String, category: String) {
        viewModelScope.launch {
            val note = WorkoutNoteEntity(
                id = "n_${System.currentTimeMillis()}",
                date = date,
                title = title,
                content = content,
                category = category
            )
            repository.addNote(note)
        }
    }

    fun deleteNote(note: WorkoutNoteEntity) {
        viewModelScope.launch {
            repository.deleteNote(note)
        }
    }

    fun addSubstance(name: String, dose: String, unit: String, date: String, details: String?) {
        viewModelScope.launch {
            val log = SubstanceLogEntity(
                id = "sub_${System.currentTimeMillis()}",
                name = name,
                dose = dose,
                unit = unit,
                date = date,
                details = details
            )
            repository.addSubstanceLog(log)
        }
    }
}
