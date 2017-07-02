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
        styles: version.styles ? JSON.parse(version.styles) : [],
        scripts: version.scripts ? JSON.parse(version.scripts) : [],
        settings: page.settings ? JSON.parse(page.settings) : []
    },
    mutations: {
        update(state, { setting, value }) {
            state[setting] = value;
        },
        addSource(state, { setting, value }) {
            state[setting].push({
                value: value
            });
        },
        updateSource(state, { setting, value, index }) {
            state[setting][index].value = value;
        },
        removeSource(state, { setting, index }) {
            state[setting].splice(index, 1);
        }
    },
    actions: {
        reorderSources({ commit, state }, { setting, oldIndex, newIndex }) {
            return new Promise((resolve, reject) => {
                let clone = _.clone(state[setting]);
                const movedItem = clone.splice(oldIndex, 1)[0];

                commit('update', {
                    setting: setting,
                    value: []
                });

                setTimeout(() => {
                    clone.splice(newIndex, 0, movedItem);
                    commit('update', {
                        setting: setting,
                        value: clone
                    });
                    resolve();
                }, 1);
            });
        },
        updateHtml: _.debounce(({ commit }, { value }) => {
            commit('update', {
                setting: 'html',
                value: value
            });
        }, 100, this)
    }
};
