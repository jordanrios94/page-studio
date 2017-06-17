module.exports = {
    methods: {
        save(e) {
            e.preventDefault();
            const endpoint = window.User ? '/api/page/create' : '/api/page/create/anon';

            return axios.post(endpoint, this.$store.state.page)
            .then(function (response) {
                window.location.href = '/page/' + response.data.page_id;
            })
            .catch(function (error) {
                Notification.addMessage('Error!', 'Page could not be saved.', 'danger');
            });
        },
        update(e) {
            e.preventDefault();
            const endpoint = window.User ? '/api/page/update' : '/api/page/update/anon';

            return axios.post(endpoint, this.$store.state.page)
            .then(function (response) {
                Notification.addMessage('Success', 'Page has been successfully updated.', 'success');
            })
            .catch(function (error) {
                Notification.addMessage('Error!', 'Page could not be updated.', 'danger');
            });
        }
    }
};
