import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'

const store = createStore({
    plugins: [createPersistedState()],
    state: {
        header: [
            {
                id_name: 'index',
                name: 'Номер',
                status: true,
                width: 100,
                border: false,
                dragging: false
            },
            {
                id_name: 'action',
                name: 'Действие',
                status: true,
                width: 100,
                border: false,
                dragging: false
            },
            {
                id_name: 'name_unit',
                name: 'Наименование единицы',
                status: true,
                width: 500,
                border: false,
                dragging: false
            },
            {
                id_name: 'price',
                name: 'Цена',
                status: true,
                width: 100,
                border: false,
                dragging: false
            },
            {
                id_name: 'count',
                name: 'Кол-во',
                status: true,
                width: 100,
                border: false,
                dragging: false
            },
            {
                id_name: 'name_product',
                name: 'Название товара',
                status: true,
                width: 300,
                border: false,
                dragging: false
            },
            {
                id_name: 'total',
                name: 'Итого',
                status: true,
                width: 100,
                border: false,
                dragging: false
            }, 
        ],
        materials: [
            {
                id: 7864,
                name_product: 'Мраморный щебень',
                name_unit: 'Мраморный щебень фр. 2-5 мм, 25кг',
                price: 1000,
                count: 1,
                total: 5000,
                dragging: false,
                delete: false
            },
            {
                id: 5466,
                name_product: 'Мраморный щебень',
                name_unit: 'Мраморный щебень фр. 5-10 мм, 50кг',
                price: 2000,
                count: 2,
                total: 20000,
                dragging: false,
                delete: false
            },
            {
                id: 7894,
                name_product: 'Мраморный щебень',
                name_unit: 'Мраморный щебень фр. 2-5 мм, 25кг (белый)',
                price: 2000,
                count: 3,
                total: 20000,
                dragging: false,
                delete: false
            },
            {
                id: 6523,
                name_product: 'Мраморный щебень',
                name_unit: 'Мраморный щебень фр. 2-5 мм, 25кг (вайт)',
                price: 2000,
                count: 4,
                total: 20000,
                dragging: false,
                delete: false
            },
            {
                id: 1279,
                name_product: 'Мраморный щебень',
                name_unit: 'Мраморный щебень фр. 2-5 мм, 25кг, возврат',
                price: 2000,
                count: 5,
                total: 20000,
                dragging: false,
                delete: false
            }
        ],
    },
    getters: {
        getVisibleHeader: (state) => () => {
            return state.header.filter(head => head.status);
        },
    },
    mutations: {
        ADD_POSITION(state, newPosition) {
            state.materials.push(newPosition);
        },
        CHANGE_STATUS(state, idName) {
            const item = state.header.find((head) => head.id_name === idName);
            item.status = !item.status;
        },

        SET_DELETE(state, position) {
            const index = state.materials.findIndex(item => item.id === position.id);
            if (index !== -1) {
                state.materials[index].delete = !state.materials[index].delete;
            }
        },

        // Drag row
        SET_DRAGGING_ROW(state, data) {
            const item = state.materials.find(item => item.id === data.item['id']);
            item.dragging = data['dragging'];
        },
        DELETE_POSITION(state, position) {
            const indexToDelete = state.materials.findIndex(item => item.id === position.id);
    
            if (indexToDelete !== -1) {
                state.materials.splice(indexToDelete, 1);
            }
        },
        INSERT_POSITION(state, data) {
            state.materials.splice(data.overIndex, 0, data.item);
        },

        // Resize column
        SET_WIDTH(state, data) {
            const item = state.header.find((head) => head.id_name === data['id_name']);
            item.width += data['dx'];
        },
        SET_BORDER(state, idName) {
            const item = state.header.find((head) => head.id_name === idName);
            item.border = !item.border;
        },

        // Drag column
        SET_DRAGGING_COLUMN(state, data) {
            const item = state.header.find(head => head.id_name === data.item['id_name']);
            item.dragging = data['dragging'];
        },
        DELETE_COLUMN(state, position) {
            const indexToDelete = state.header.findIndex(head => head.id_name === position.id_name);
    
            if (indexToDelete !== -1) {
                state.header.splice(indexToDelete, 1);
            }
        },
        INSERT_COLUMN(state, data) {
            state.header.splice(data.overIndex, 0, data.item);
        }
    },
});

export default store;