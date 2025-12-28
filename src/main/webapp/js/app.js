// Configuration
const API_BASE_URL = 'http://localhost:8080/projet-rest-frontend/projet/api';
let persons = [];
let personToDelete = null;

// Initialisation
$(document).ready(function() {
    loadAllPersons();
    setupEventListeners();
});

// Configuration des événements
function setupEventListeners() {
    // Formulaire
    $('#person-form').on('submit', handleFormSubmit);
    $('#cancel-btn').on('click', resetForm);
    
    // Recherche
    $('#search-btn').on('click', handleSearch);
    $('#reset-search').on('click', loadAllPersons);
    $('#search-input').on('keypress', function(e) {
        if (e.which === 13) handleSearch();
    });
    
    // Autres boutons
    $('#load-all-btn').on('click', loadAllPersons);
    $('#confirm-delete').on('click', confirmDelete);
}

// Charger toutes les personnes
function loadAllPersons() {
    showLoading();
    
    fetch(`${API_BASE_URL}/personnes`)
        .then(response => {
            if (!response.ok) throw new Error('Erreur réseau');
            return response.json();
        })
        .then(data => {
            persons = data;
            displayPersons(data);
            showNotification('Liste actualisée avec succès', 'success');
        })
        .catch(error => {
            console.error('Erreur:', error);
            showNotification('Erreur lors du chargement des personnes', 'danger');
        })
        .finally(hideLoading);
}

// Afficher les personnes dans le tableau
function displayPersons(personsList) {
    const tbody = $('#person-table-body');
    tbody.empty();
    
    if (personsList.length === 0) {
        tbody.append(`
            <tr>
                <td colspan="4" class="text-center text-muted py-4">
                    <i class="fas fa-inbox fa-2x mb-3"></i><br>
                    Aucune personne trouvée
                </td>
            </tr>
        `);
    } else {
        personsList.forEach(person => {
            const row = `
                <tr data-id="${person.id}">
                    <td><strong>${person.id}</strong></td>
                    <td>${person.nom}</td>
                    <td>${person.prenom}</td>
                    <td>
                        <button class="btn btn-sm btn-warning btn-action btn-edit" 
                                onclick="editPerson(${person.id})">
                            <i class="fas fa-edit me-1"></i>Modifier
                        </button>
                        <button class="btn btn-sm btn-danger btn-action btn-delete" 
                                data-bs-toggle="modal" data-bs-target="#deleteModal"
                                onclick="prepareDelete(${person.id}, '${person.nom} ${person.prenom}')">
                            <i class="fas fa-trash me-1"></i>Supprimer
                        </button>
                    </td>
                </tr>
            `;
            tbody.append(row);
        });
    }
    
    $('#person-count').text(personsList.length);
}

// Gérer la soumission du formulaire
function handleFormSubmit(e) {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const person = {
        nom: $('#nom').val().trim(),
        prenom: $('#prenom').val().trim()
    };
    
    const personId = $('#person-id').val();
    const isEditMode = personId !== '';
    
    const url = isEditMode 
        ? `${API_BASE_URL}/personnes/${personId}`
        : `${API_BASE_URL}/personnes`;
    
    const method = isEditMode ? 'PUT' : 'POST';
    
    showLoading();
    
    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(person)
    })
    .then(response => response.json())
    .then(data => {
        if (data.Status === 'OK') {
            showNotification(
                isEditMode ? 'Personne modifiée avec succès' : 'Personne ajoutée avec succès',
                'success'
            );
            resetForm();
            loadAllPersons();
        } else {
            throw new Error(data.message);
        }
    })
    .catch(error => {
        console.error('Erreur:', error);
        showNotification(error.message || 'Erreur lors de l\'opération', 'danger');
    })
    .finally(hideLoading);
}

// Valider le formulaire
function validateForm() {
    const form = document.getElementById('person-form');
    
    if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return false;
    }
    
    return true;
}

// Réinitialiser le formulaire
function resetForm() {
    $('#person-form')[0].reset();
    $('#person-id').val('');
    $('#form-title').text('Ajouter une Personne');
    $('#cancel-btn').addClass('d-none');
    $('#person-form').removeClass('was-validated');
    $('#nom').focus();
}

// Éditer une personne
function editPerson(id) {
    const person = persons.find(p => p.id === id);
    if (!person) return;
    
    $('#person-id').val(person.id);
    $('#nom').val(person.nom);
    $('#prenom').val(person.prenom);
    $('#form-title').text('Modifier une Personne');
    $('#cancel-btn').removeClass('d-none');
    $('#nom').focus();
    
    // Scroll vers le formulaire
    $('html, body').animate({
        scrollTop: $('.card-header').offset().top - 20
    }, 500);
}

// Préparer la suppression
function prepareDelete(id, name) {
    personToDelete = id;
    $('.modal-body').html(`
        Êtes-vous sûr de vouloir supprimer la personne :<br>
        <strong>${name}</strong> ?
    `);
}

// Confirmer la suppression
function confirmDelete() {
    if (!personToDelete) return;
    
    showLoading();
    
    fetch(`${API_BASE_URL}/personnes/${personToDelete}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        if (data.Status === 'OK') {
            showNotification('Personne supprimée avec succès', 'success');
            $('#deleteModal').modal('hide');
            loadAllPersons();
        } else {
            throw new Error(data.message);
        }
    })
    .catch(error => {
        console.error('Erreur:', error);
        showNotification(error.message || 'Erreur lors de la suppression', 'danger');
    })
    .finally(() => {
        hideLoading();
        personToDelete = null;
    });
}

// Gérer la recherche
function handleSearch() {
    const searchTerm = $('#search-input').val().trim();
    
    if (!searchTerm) {
        showNotification('Veuillez saisir un terme de recherche', 'warning');
        return;
    }
    
    showLoading();
    
    fetch(`${API_BASE_URL}/personnes/search?nom=${encodeURIComponent(searchTerm)}`)
        .then(response => response.json())
        .then(data => {
            displayPersons(data);
            if (data.length === 0) {
                showNotification('Aucun résultat trouvé', 'info');
            } else {
                showNotification(`${data.length} résultat(s) trouvé(s)`, 'success');
            }
        })
        .catch(error => {
            console.error('Erreur:', error);
            showNotification('Erreur lors de la recherche', 'danger');
        })
        .finally(hideLoading);
}

// Afficher une notification
function showNotification(message, type) {
    const notifications = $('#notifications');
    const alertClass = {
        'success': 'alert-success',
        'danger': 'alert-danger',
        'warning': 'alert-warning',
        'info': 'alert-info'
    }[type] || 'alert-info';
    
    const notificationId = 'notif-' + Date.now();
    
    const notification = $(`
        <div id="${notificationId}" class="alert ${alertClass} alert-dismissible fade show" role="alert">
            <i class="fas fa-${getIconForType(type)} me-2"></i>
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `);
    
    notifications.append(notification);
    
    // Auto-dismiss après 5 secondes
    setTimeout(() => {
        $(`#${notificationId}`).alert('close');
    }, 5000);
}

function getIconForType(type) {
    const icons = {
        'success': 'check-circle',
        'danger': 'exclamation-circle',
        'warning': 'exclamation-triangle',
        'info': 'info-circle'
    };
    return icons[type] || 'info-circle';
}

// Gestion du chargement
function showLoading() {
    $('button').prop('disabled', true);
    $('#load-all-btn').html('<i class="fas fa-spinner fa-spin me-2"></i>Chargement...');
}

function hideLoading() {
    $('button').prop('disabled', false);
    $('#load-all-btn').html('<i class="fas fa-sync me-2"></i>Actualiser la liste');
}