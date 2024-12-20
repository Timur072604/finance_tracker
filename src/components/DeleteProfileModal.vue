<template>
    <div class="modal fade" id="deleteProfileModal" tabindex="-1" aria-labelledby="deleteProfileModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="deleteProfileModalLabel">Подтверждение удаления профиля</h5>
                </div>
                <div class="modal-body">
                    <p>Вы уверены, что хотите удалить свой профиль? Это действие необратимо.</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Отмена</button>
                    <button type="button" class="btn btn-danger" @click="confirmDeleteProfile">Удалить</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
    name: 'DeleteProfileModal',
    methods: {
        ...mapActions(['deleteProfile']),
        confirmDeleteProfile() {
            this.deleteProfile();
            this.showNotification('Ваш профиль успешно удален.', 'success');
            this.$router.push('/login');
            $('#deleteProfileModal').modal('hide');
        }
    },
    inject: ['showNotification']
};
</script>

<style scoped>
.modal-dialog {
    max-width: 400px;
    margin: 1.75rem auto;
}
.modal-content {
    border-radius: 10px;
    background-color: #f9f9f9;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 5px 15px;
    border: none;
}
.modal-header {
    border-bottom: none;
    padding: 1rem 1.5rem;
    background-color: #f0f0f0;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
}
.modal-body {
    padding: 1.5rem;
    background-color: #f9f9f9;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
}
.modal-footer {
    border-top: none;
    padding: 1rem 1.5rem;
    background-color: #f9f9f9;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    display: flex;
    justify-content: flex-end;
}
.btn-primary {
    background-color: #007bff;
    border-color: #007bff;
}
.btn-primary:hover {
    background-color: #0056b3;
    border-color: #0056b3;
}
.btn-secondary {
    background-color: #6c757d;
    border-color: #6c757d;
}
.btn-secondary:hover {
    background-color: #5a6268;
    border-color: #545b62;
}
.btn-danger {
    background-color: #dc3545;
    border-color: #dc3545;
}
.btn-danger:hover {
    background-color: #c82333;
    border-color: #bd2130;
}
</style>
