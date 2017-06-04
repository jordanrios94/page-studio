const data = window.Page ? Page.data : {};
const page = data.page || {};
const version = data.version || {};

module.exports = {
    state: {
        id: page.id || '',
        title: page.title || '',
        description: page.description || '',
        html: version.html ? atob(version.html) : '',
        css: version.css ? atob(version.css) : '',
        js: version.js ? atob(version.js) : '',
        settings: page.settings ? JSON.parse(page.settings) : [],
        scripts: page.scripts ? JSON.parse(page.scripts) : [],
        styles: page.styles ? JSON.parse(page.styles) : []
    },
    mutations: {
        update(state, payload) {
            state[payload.setting] = payload.value;
        },
        addSource(state, payload) {
            state[payload.setting].push({
                value: payload.value
            });
        },
        updateSource(state, payload) {
            state[payload.setting][payload.index].value = payload.value;
        },
        removeSource(state, payload) {
            state[payload.setting].splice(payload.index, 1);
        }
    },
    actions: {
        reorderSources({ commit, state }, payload) {
            return new Promise((resolve, reject) => {
                let clone = _.clone(state[payload.setting]);
                const movedItem = clone.splice(payload.oldIndex, 1)[0];

                commit('update', {
                    setting: payload.setting,
                    value: []
                });

                setTimeout(() => {
                    clone.splice(payload.newIndex, 0, movedItem);
                    commit('update', {
                        setting: payload.setting,
                        value: clone
                    });
                    resolve();
                }, 1);
            });
        }
    }
};