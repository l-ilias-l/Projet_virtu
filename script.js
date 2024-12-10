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
    const events = {}; // Objet : "YYYY-M-D" => [{title, time}, ...]

    /**
     * Génère le calendrier pour le mois et l'année donnés.
     */
    function generateCalendar(year, month) {
        calendarElement.innerHTML = '';
        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);
        const daysInMonth = lastDayOfMonth.getDate();

        // getDay() renvoie 0 pour Dimanche, on ajuste pour commencer la semaine le Lundi
        const firstDayWeekday = firstDayOfMonth.getDay();
        const startOffset = (firstDayWeekday === 0 ? 6 : firstDayWeekday - 1);

        currentMonthYearElement.textContent = `${getMonthName(month)} ${year}`;

        // Ajout des cases vides avant le début du mois
        for (let i = 0; i < startOffset; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.classList.add('day', 'disabled');
            calendarElement.appendChild(emptyCell);
        }

        // Ajout des jours du mois
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

    /**
     * Retourne le nom du mois en français.
     */
    function getMonthName(month) {
        const months = [
            'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
            'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
        ];
        return months[month];
    }

    /**
     * Gère le clic sur un jour donné.
     */
    function handleDayClick(day, year, month) {
        selectedDate = new Date(year, month, day);
        updateCalendarSelection();
    }

    /**
     * Met à jour la sélection visuelle du jour sélectionné.
     */
    function updateCalendarSelection() {
        const allDays = calendarElement.querySelectorAll('.day');
        allDays.forEach((dayCell) => {
            const dayNumber = parseInt(dayCell.textContent, 10);
            if (selectedDate &&
                dayNumber === selectedDate.getDate() &&
                selectedDate.getMonth() === currentDate.getMonth() &&
                selectedDate.getFullYear() === currentDate.getFullYear()) {
                dayCell.classList.add('selected');
            } else {
                dayCell.classList.remove('selected');
            }
        });
    }

    /**
     * Soumission du formulaire d'ajout d'événement.
     */
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

        // On met à jour currentDate pour qu'il corresponde à selectedDate,
        // afin de conserver l'affichage du même mois et année.
        currentDate = new Date(selectedDate.getTime());
        generateCalendar(currentDate.getFullYear(), currentDate.getMonth());

        // On ne remet pas selectedDate à null, ainsi la date reste sélectionnée.
        eventTitleInput.value = '';
        eventTimeInput.value = '';
    });

    /**
     * Navigation mois précédent.
     */
    prevMonthButton.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
        // Si selectedDate est défini, on vérifie si elle est dans le mois affiché.
        updateCalendarSelection();
    });

    /**
     * Navigation mois suivant.
     */
    nextMonthButton.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
        // Si selectedDate est défini, on vérifie si elle est dans le mois affiché.
        updateCalendarSelection();
    });

    /**
     * Affiche le popup des événements pour une date donnée.
     */
    function showPopup(dateKey) {
        const eventList = events[dateKey] || [];
        popupDate.textContent = formatDateKey(dateKey);
        popupEventList.innerHTML = '';

        if (eventList.length > 0) {
            eventList.forEach((event) => {
                const li = document.createElement('li');
                li.textContent = `${event.time} - ${event.title}`;
                popupEventList.appendChild(li);
            });
        } else {
            const li = document.createElement('li');
            li.textContent = 'Aucun événement.';
            popupEventList.appendChild(li);
        }

        popup.classList.remove('hidden');
    }

    /**
     * Formate le dateKey en JJ/MM/AAAA.
     */
    function formatDateKey(dateKey) {
        const [year, month, day] = dateKey.split('-');
        return `${day}/${month}/${year}`;
    }

    /**
     * Ferme le popup.
     */
    closePopupButton.addEventListener('click', () => {
        popup.classList.add('hidden');
    });

    // Initialisation
    generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
});
