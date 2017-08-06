<template>
    <div id="overlay" v-show="showModal">
        <div class="splash">
            <div class="cropit-wrapper">
                <div class="preview-wrapper">
                    <div class="cropit-preview"></div>
                    <div class="controls-wrapper">
                        <div class="rotation-btns">
                            <span class="s7-back-2 icon" @click="rotateCounterClockwise"></span>
                            <span class="s7-next-2 icon" @click="rotateClockwise"></span>
                        </div>
                        <div class="slider-wrapper">
                            <span class="s7-photo small-icon"></span>
                            <input type="range" class="cropit-image-zoom-input custom">
                            <span class="s7-photo large-icon"></span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="btns-wrapper">
                <div class="btns">
                    <input name="image" type="file" class="cropit-image-input custom" accept=".jpg" @change="onFileChange">
                    <button class="btn btn-primary" @click="saveImg">Save</button>
                    <button class="btn btn-primary" @click="triggerFileChange">Select new image</button>
                    <button class="btn btn-danger" @click="hideModal">Close</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                showModal: false,
                img: '',
                name: '',
                width: 0,
                height: 0
            };
        },
        created() {
            let vm = this;

            EventBus.$on('show_modal', function($event) {
                vm.showModal = true;
                vm.img = $event.img;
                vm.name = $event.name;
                vm.width = $event.width;
                vm.height = $event.height;
                vm.updateCropper();
            });
        },
        mounted() {
            this.initCropper();
        },
        methods: {
            initCropper() {
                let $overlay = $('#overlay');

                $overlay.cropit({
                    imageBackground: true,
                    maxZoom: 1.5
                });
            },
            updateCropper() {
                let $overlay = $('#overlay');

                $overlay.cropit('imageSrc', this.img);
                $overlay.cropit('previewSize', {
                    width: this.width, height: this.height 
                });
            },
            hideModal(e) {
                e.preventDefault();
                this.reset();
            },
            triggerFileChange(e) {
                e.preventDefault();
                $('input[name="image"]').trigger('click');
            },
            onFileChange(e) {
                const data = e.currentTarget.dataset;
                const files = e.target.files || e.dataTransfer.files;
                if (!files.length) return;
                this.createImage(files[0], e.currentTarget.name, parseInt(data.width), parseInt(data.height));
                e.currentTarget.value = '';
            },
            createImage(file, name, width, height) {
                const reader = new FileReader();
                let vm = this;

                reader.onload = (e) => {
                    vm.img = e.target.result;
                    vm.updateCropper();
                };

                reader.readAsDataURL(file);
            },
            saveImg(e) {
                e.preventDefault();
                this.img = $('#overlay').cropit('export', {
                    type: 'image/jpeg',
                    quality: 1
                });
                
                this.putImg();
            },
            putImg() {
                return axios.post('/api/profile/updateImage', {
                    image: this.img,
                    name: this.name
                })
                .then(this.putSucess)
                .catch(this.putError);
            },
            putSucess(response) {
                EventBus.$emit('setting_updated', {
                    setting: this.name,
                    value: this.img
                });

                this.reset();
            },
            putError(error) {
                Notification.addMessage('', 'Something went wrong. The image could not be updated.', 'danger');
            },
            reset() {
                this.showModal = false;
                $('#overlay').cropit('imageSrc', '/assets/img/reset.jpg');
            },
            rotateClockwise(e) {
                e.preventDefault();
                $('#overlay').cropit('rotateCW');
            },
            rotateCounterClockwise(e) {
                e.preventDefault();
                $('#overlay').cropit('rotateCCW');
            }
        }
    }
</script>
