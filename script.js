document.addEventListener('DOMContentLoaded', () => {
    const calendarElement = document.getElementById('calendar');
    const currentMonthYearElement = document.getElementById('currentMonthYear');
    const eventForm = document.getElementById('eventForm');
    const eventTitleInput = document.getElementById('eventTitle');
    const eventTimeInput = document.getElementById('eventTime');
    const popup = document.getElementById('popup');
    const popupDate = document.getElementById('popupDate');
    const popupEventList = document.getElementById('popupEventList');
    const closePopupButton = document.getElementById('closePopup');

    const prevMonthButton = document.getElementById('prevMonth');
    const nextMonthButton = document.getElementById('nextMonth');

    let currentDate = new Date();
    let selectedDate = null;
    const events = {}; // { "YYYY-M-D": [ {title:..., time:...}, ... ] }

    function generateCalendar(year, month) {
        calendarElement.innerHTML = '';
        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);
        const daysInMonth = lastDayOfMonth.getDate();
        
        const firstDayWeekday = firstDayOfMonth.getDay(); 
        const startOffset = (firstDayWeekday === 0 ? 6 : firstDayWeekday - 1);

        currentMonthYearElement.textContent = `${getMonthName(month)} ${year}`;

        // Jours vides avant le début du mois
        for (let i = 0; i < startOffset; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.classList.add('day', 'disabled');
            calendarElement.appendChild(emptyCell);
        }

        // Jours du mois
        for (let day = 1; day <= daysInMonth; day++) {
            const dayCell = document.createElement('div');
            dayCell.classList.add('day');
            dayCell.textContent = day;

            const badge = document.createElement('span');
            badge.classList.add('badge');
            dayCell.appendChild(badge);

            const dateKey = `${year}-${month + 1}-${day}`;
            if (events[dateKey]) {
                dayCell.classList.add('has-event');
                badge.textContent = events[dateKey].length;
                badge.addEventListener('click', (e) => {
                    e.stopPropagation();
                    showPopup(dateKey);
                });
            }

            dayCell.addEventListener('click', () => handleDayClick(day, year, month));
            calendarElement.appendChild(dayCell);
        }

        updateCalendarSelection();
    }

    function getMonthName(month) {
        const months = [
            'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
            'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
        ];
        return months[month];
    }

    function handleDayClick(day, year, month) {
        selectedDate = new Date(year, month, day);
        updateCalendarSelection();
    }

    function updateCalendarSelection() {
        const allDays = calendarElement.querySelectorAll('.day');
        allDays.forEach((dayCell) => {
            const dayNumber = parseInt(dayCell.textContent, 10);
            if (selectedDate && dayNumber === selectedDate.getDate()) {
                dayCell.classList.add('selected');
            } else {
                dayCell.classList.remove('selected');
            }

        });
    }

    eventForm.addEventListener('submit', (e) => {
        e.preventDefault();

        if (!selectedDate) {
            alert('Veuillez sélectionner une date.');
            return;
        }

        const newEvent = {
            title: eventTitleInput.value.trim(),
            time: eventTimeInput.value
        };

        if (!newEvent.title || !newEvent.time) {
            alert("Veuillez remplir tous les champs.");
            return;
        }

        const dateKey = `${selectedDate.getFullYear()}-${selectedDate.getMonth() + 1}-${selectedDate.getDate()}`;
        if (!events[dateKey]) {
            events[dateKey] = [];
        }
        events[dateKey].push(newEvent);

        generateCalendar(selectedDate.getFullYear(), selectedDate.getMonth());

        eventTitleInput.value = '';
        eventTimeInput.value = '';
        selectedDate = null;
    });

    prevMonthButton.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
    });

    nextMonthButton.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
    });

    function showPopup(dateKey) {
        const eventList = events[dateKey] || [];
        popupDate.textContent = formatDateKey(dateKey);
        popupEventList.innerHTML = '';

        if (eventList.length > 0) {
            eventList.forEach((event, index) => {
                const li = document.createElement('li');
                li.textContent = `${event.time} - ${event.title}`;

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Supprimer';
                deleteButton.classList.add('delete-button');
                deleteButton.addEventListener('click', () => deleteEvent(dateKey, index));

                li.appendChild(deleteButton);
                popupEventList.appendChild(li);
            });
        } else {
            const li = document.createElement('li');
            li.textContent = 'Aucun événement.';
            popupEventList.appendChild(li);
        }

        popup.classList.remove('hidden');
    }

    function deleteEvent(dateKey, index) {
        if (events[dateKey]) {
            events[dateKey].splice(index, 1); // Supprime l'événement à l'index donné

            // Si aucun événement ne reste, supprimer la clé de l'objet
            if (events[dateKey].length === 0) {
                delete events[dateKey];
            }

            // Mettre à jour l'affichage
            generateCalendar(selectedDate.getFullYear(), selectedDate.getMonth());
            showPopup(dateKey); // Mettre à jour la liste dans le popup
        }
    }


    function formatDateKey(dateKey) {
        const [year, month, day] = dateKey.split('-');
        return `${day}/${month}/${year}`;
    }

    closePopupButton.addEventListener('click', () => {
        popup.classList.add('hidden');
    });

    // Initialisation
    generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
});


