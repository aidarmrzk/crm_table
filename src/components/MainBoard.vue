<template>
<div class="wrapper">
    <div class="sidebar"></div>
        <div class="container">
          <h1>Проведение ТО и мелкий ремонт</h1>
          <div class="nav">
            <ul>
              <li>Общее</li>
              <li class="selected">Товар списания</li>
              <li>Доп. расходы</li>
            </ul>
            <div class="setting">
              <img src="@/assets/images/constructor.svg" alt="" @click="handleSetting">
              <div class="setting-box" v-if="showSetting">
                <div class="setting-box-header" @click="handleSettingHeader">
                  <img v-if="showSettingHeader" class="setting-box-img" src="@/assets/images/arrow.svg" alt="">
                  <span>Отображение столбцов</span>
                  <img v-if="!showSettingHeader" src="@/assets/images/arrow.svg" alt="">
                </div>
                <ul v-if="showSettingHeader">
                  <li v-for="(head, index) in header" :key="index">
                    <input type="checkbox" :checked="head.status" @change="handleStatus(head.id_name)">
                    {{ head.name }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="add_row">
          <button @click="addPosition">
            <img src="@/assets/images/combined-shape.svg" alt="" />Добавить строку
          </button>
          </div>
          <div class="table-block">
            <table class="table">
              
              <thead>
                <tr>

                  <th
                    v-for="(head, index) in visibleHeader" :key="head.id_name"
                    :style="{maxWidth: head.width + 'px', width: head.width + 'px'}"
                    draggable="true"
                    @dragstart="dragColumnStart(head)"
                    @dragover.prevent="dragColumnOver($event, index, head)"
                    @dragleave = "dragColumnLeave"
                    @drop="dropColumn"
                    :class="{dragging: head.dragging}"
                  >
                    <span class="column">
                      {{ head.name }}
                      <div
                        class="resize"
                        @mousedown.prevent="createResize($event, head.id_name)"
                        @mouseover="changeBorder(head.id_name)"
                        @mouseout="changeBorder(head.id_name)"
                      ></div>
                    </span>
                  </th>

                </tr>
              </thead>

              <tbody>
                <tr
                  class="drag"
                  v-for="(material, index) in materials"
                  :key="material.id"
                  :class="{dragging: material.dragging}"
                >

                  <template v-for="(head, indx) in visibleHeader" :key="indx">

                    <td v-if="head.id_name === 'index'" class="cell cell-drag" :class="{ border: head.border, dragging: head.dragging }"
                      @dragstart="dragStart(material)"
                      @dragover.prevent="dragOver(index, material)"
                      @dragleave="dragLeave"
                      @drop="drop"
                    >
                      <span class="label">{{ head.name }}</span>
                      <div class="cell-container">
                        <img class="grab" src="@/assets/images/move.svg" alt="" /><span>{{index + 1}}</span>
                      </div>
                    </td>

                    <td v-if="head.id_name === 'action'" class="cell cell-delete" :class="{ border: head.border, dragging: head.dragging }">
                      <span class="label">{{ head.name }}</span>
                      <div class="cell-container">
                        <img src="@/assets/images/three_dots.svg" alt="" @click="showDelete(material)"/>
                        <div v-if="material.delete" class="delete" @click="deteleItem(material)">
                          Удалить
                        </div>
                      </div>
                    </td>

                    <td v-if="head.id_name === 'name_unit'" class="cell" :class="{ border: head.border, dragging: head.dragging }">
                      <span class="label">{{ head.name }}</span>
                      <input type="text" v-model="material.name_unit"/>
                    </td>

                    <td v-if="head.id_name === 'price'"  class="cell" :class="{ border: head.border, dragging: head.dragging }">
                      <span class="label">{{ head.name }}</span>
                      <input type="text" v-model="material.price"/>
                    </td>

                    <td v-if="head.id_name === 'count'" class="cell" :class="{ border: head.border, dragging: head.dragging }">
                      <span class="label">{{ head.name }}</span>
                      <input type="text" v-model="material.count"/>
                    </td>

                    <td v-if="head.id_name === 'name_product'" class="cell" :class="{ border: head.border, dragging: head.dragging }">
                      <span class="label">{{ head.name }}</span>
                      <input type="text" v-model="material.name_product"/>
                    </td>

                    <td v-if="head.id_name === 'total'" class="cell" :class="{ border: head.border, dragging: head.dragging }">
                      <span class="label">{{ head.name }}</span>
                      <input type="text" v-model="material.total"/>
                    </td>
                  </template>
                </tr>
              </tbody>

            </table>
          </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex';

const store = useStore();

const materials = computed(() => store.state.materials);
const header = computed(() => store.state.header);
const visibleHeader = computed(() => store.getters.getVisibleHeader());

const draggingData = ref({
  item: null,
  dragging: false,
  overIndex: null
});
const showSetting = ref(false);
const showSettingHeader = ref(false);

const handleSetting = () => {
  if (showSetting.value) {
    showSettingHeader.value = false;
  }
  showSetting.value = !showSetting.value;
}
const handleSettingHeader = () => {
  showSettingHeader.value = !showSettingHeader.value;
}
const handleStatus = (idName) => {
  store.commit('CHANGE_STATUS', idName);
}

const addPosition = () => {
  const newPosition = {
    id: generateId(),
    name_product: '',
    name_unit: '',
    price: '',
    count: '',
    total: '',
  }
  store.commit('ADD_POSITION', newPosition);
}

const showDelete = (item) => {
  store.commit('SET_DELETE', item);
}
const deteleItem = (item) => {
  store.commit('DELETE_POSITION', item);
}

const generateId = () => {
  const timestamp = new Date().getTime();
  const random = Math.floor(Math.random() * 1000);

  return `${timestamp}-${random}`;
}

// Drag row
const dragRowFlag = ref(false);
const bigScreen = window.innerWidth > 550;

const dragStart = (item) => {
  dragRowFlag.value = true;

  if (bigScreen) {
    draggingData.value['item'] = item;
    draggingData.value['dragging'] = true;

    store.commit('SET_DRAGGING_ROW', draggingData.value);

    console.log('dragStart')
  }
}
const dragOver = (index, item) => {
  if (bigScreen && dragRowFlag.value) {
    if (draggingData.value.item.id && draggingData.value.item.id !== item.id) {
      draggingData.value['overIndex'] = index;

      store.commit('SET_DRAGGING_ROW', draggingData.value);
      store.commit('DELETE_POSITION', draggingData.value.item);
      store.commit('INSERT_POSITION', draggingData.value);
      
      console.log('dragOver')
    }
  }
}
const dragLeave = (event) => {
  const target = event.relatedTarget;

  if (!target.closest('.cell-drag')) {
    restDragRow();
    console.log('dragLeave')
  }
}
const drop = () => {
  restDragRow();
  console.log('drop')
}
const restDragRow = () => {
  if (bigScreen && draggingData.value.item.id && dragRowFlag.value) {
    draggingData.value['dragging'] = false;
    store.commit('SET_DRAGGING_ROW', draggingData.value);
  
    dragRowFlag.value = false;
    console.log('restDragRow')
  }
}

//Resize column
const createResize = (e, idName) => {
  let mPos = 0;

  const startResize = () => {
    mPos = e.x;

    document.addEventListener("mousemove", resize);
    document.addEventListener("mouseup", stopResize);
  };

  const resize = (e) => {
    const dx = e.x - mPos;
    mPos = e.x;

    const data = {
      id_name: idName,
      dx: dx
    }

    store.commit('SET_WIDTH', data);
  };

  const stopResize = () => {
    document.removeEventListener("mousemove", resize);
    document.removeEventListener("mouseup", stopResize);

    mPos = 0;
  };

  startResize();
};

const changeBorder = (idName) => {
  store.commit('SET_BORDER', idName);
}

// Drag column
const dragColumn = ref(false);

const dragColumnStart = (item) => {
  dragColumn.value = true;
  draggingData.value['item'] = item;
  draggingData.value['dragging'] = true;

  store.commit('SET_DRAGGING_COLUMN', draggingData.value);

  console.log('dragColumnStart')
}
const dragColumnOver = (event, index, item) => {
  if (dragColumn.value) {
    if (!event.target.classList.contains('resize')
      && draggingData.value.item.id_name
      && draggingData.value.item.id_name !== item.id_name)
    {
      const targetRect = event.target.getBoundingClientRect();
      const center = targetRect.left + targetRect.width / 2;
      const isNearCenter = Math.abs(event.clientX - center) < targetRect.width / 50;
  
      if (isNearCenter) {
        draggingData.value['overIndex'] = index;

        store.commit('DELETE_COLUMN', draggingData.value.item);
        store.commit('INSERT_COLUMN', draggingData.value);
  
        console.log('dragColumnOver')
      }
    }
  }
}
const dragColumnLeave = (event) => {
  const target = event.relatedTarget;

  if (!target.closest('thead')) {
    restDragColumn();
    console.log('dragColumnLeave');
  }
}
const dropColumn = () => {
  restDragColumn();
  console.log('dropColumn')
}
const restDragColumn = () => {
  if (dragColumn.value) {
    draggingData.value['dragging'] = false;
    store.commit('SET_DRAGGING_COLUMN', draggingData.value);
  
    dragColumn.value = false;
    console.log('restDragColumn')
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  display: flex;
  justify-content: space-between;
  background-color: #fbfcfd;
  .sidebar {
    width: 230px;
    min-width: 230px;
    height: 100vh;
    background-image: radial-gradient(circle at 29% 0, #000, #1c2734 103%);
    @media (max-width: 1200px) {
      display: none;
    }
  }
  .container {
    display: flex;
    flex-direction: column;
    gap: 25px;
    padding: 25px;
    width: calc(100% - 230px);
    @media (max-width: 1200px) {
      padding: 10px;
      width: 100%;
    }
    h1 {
      font-size: 30px;
      font-weight: normal;
      color: #000;
    }
    .nav {
      display: flex;
      justify-content: space-between;
      align-items: center;
      ul {
        display: flex;
        list-style: none;
        gap: 20px;
        font-size: 16px;
        font-weight: 600;
        color: #1253a2;
        .selected {
          color: #000;
        }
      }
      .setting {
        position: relative;
        img {
          cursor: pointer;
        }
        .setting-box {
          position: absolute;
          top: calc(100% + 5px);
          right: 0;
          z-index: 1;
          display: flex;
          flex-direction: column;
          white-space: nowrap;
          border-radius: 5px;
          cursor: pointer;
          box-shadow: 0 0 3px 0 #000, inset 0 1px 2px 0 rgba(255, 255, 255, 0.5);
          background-color: #fff;
          font-size: 14px;
          .setting-box-header {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 7px 7px 7px 10px;
            border-radius: 5px;
            background-color: #fff;
            transition: all 0.3s;
            .setting-box-img {
              transform: scale(-1, -1);
            }
            &:hover {
              background-color: #eef3f8;
            }
          }
          ul {
            flex-direction: column;
            gap: 0;
            color: #000;
            font-size: 14px;
            font-weight: 400;
            background-color: #fff;
            li {
              display: flex;
              align-items: center;
              gap: 5px;
              padding: 7px 7px 7px 10px;
              transition: all 0.3s;
              &:hover {
                background-color: #eef3f8;
              }
            }
          }
        }
      }
    }
    .add_row {
      padding: 20px 25px;
      border-radius: 10px;
      box-shadow: 0 5px 20px 0 rgba(0, 0, 0, 0.07);
      border: solid 1px #eeeff1;
      background-color: #fff;
      button {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 7px;
        padding: 10px 15px 10px 10px;
        border-radius: 5px;
        color: #ffffff;
        background-color: #2f8cff;
        border: 1px solid #2f8cff;
        cursor: pointer;
        transition: all 0.3s;
        &:hover {
          background-color: #ffffff;
          color: #2f8cff;
        }
      }
    }
    .table-block {
      padding: 0 0 25px 0;
      border-radius: 10px;
      box-shadow: 0 5px 20px 0 rgba(0, 0, 0, 0.07);
      border: solid 1px #eeeff1;
      background-color: #fff;
      overflow-x: auto;
      &::-webkit-scrollbar {
        width: 3px; /* толщина ползунка */
        height: 3px;
      }
      &::-webkit-scrollbar-thumb {
        background-color: #2f8cff; /* цвет ползунка */
        border-radius: 2px;
      }
      &::-webkit-scrollbar-track {
        margin: 0 5px;
      }
      .table {
        border-collapse: collapse;
        width: max-content;
        th {
          border: 1px solid #eeeff1;
          &.dragging {
            background-color: #a6b7d480;
          }
          .column {
            position: relative;
            display: block;
            padding: 14px 0 14px 10px;
            font-size: 16px;
            font-weight: 600;
            white-space: nowrap;
            overflow: hidden;
            cursor: grab;
            &:first-child {
              border-left: none;
            }
            div {
              position: absolute;
              top: 0;
              right: 0;
              width: 5px;
              height: 100%;
              cursor: w-resize;
            }
          }
        }
        tr {
          td {
            .label {
              display: none;
            }
            &.dragging {
              background-color: #a6b7d480;
            }
            &.cell {
              padding: 5px 10px;
              font-size: 16px;
              color: #000;
              overflow: hidden;
              .cell-container {
                display: flex;
                align-items: center;
                gap: 5px;
              }
              &.border {
                border-right: 1px solid #eeeff1;
              }
              &.cell-drag {
                padding: 5px 10px 5px 0px;
                img {
                  padding-left: 10px;
                }
              }
              img {
                margin: 0 0 0 -5px;
                cursor: pointer;
                &.grab {
                  margin: 0;
                  cursor: grab;
                }
              }
              input {
                font-size: 16px;
                width: 100%;
                border-radius: 5px;
                border: solid 1px #ccc;
                padding: 10px 0 10px 15px;
              }
              &.cell-delete {
                position: relative;
                overflow: initial;
                .delete {
                  position: absolute;
                  top: 9px;
                  left: 28px;
                  z-index: 1;
                  padding: 7px 10px;
                  width: 180px;
                  font-size: 14px;
                  border-radius: 5px;
                  color: #ae0a0a;
                  border-radius: 5px;
                  box-shadow: 0 0 3px 0 #000, inset 0 1px 2px 0 rgba(255, 255, 255, 0.5);
                  border: solid 1px #ccc;
                  background-color: #fff;
                  transition: all 0.3s;
                  cursor: pointer;
                  &:hover {
                    background-color: #f0cdcd;
                  }
                }
              }
            }
          }
          &.dragging {
            border: 2px dashed #a6b7d4;
            border-radius: 5px;
            td {
              opacity: 0;
            }
          }
        }
      }
      @media (max-width: 550px) {
        padding: 0;
        border-radius: 0;
        background-color: transparent;
        box-shadow: none;
        border: none;
        .table {
          width: 100%;
          thead {
            display: none;
          }
          tbody {
            display: flex;
            flex-direction: column;
            gap: 5px;
            tr {
              display: flex;
              flex-direction: column;
              padding: 7.5px 0;
              border-radius: 10px;
              box-shadow: 0 5px 20px 0 rgba(0, 0, 0, 0.07);
              border: solid 1px #eeeff1;
              background-color: #fff;
              td {
                &.cell {
                  padding: 7.5px 15px;
                  &.cell-drag {
                    padding: 7.5px 15px;
                    -webkit-touch-callout: none;
                    -webkit-user-select: none;
                    -khtml-user-select: none;
                    -moz-user-select: none;
                    -ms-user-select: none;
                    user-select: none; 
                  }
                  .label {
                    display: block;
                    margin: 0 0 5px;
                    font-size: 10px;
                    color: #8f8f8f;
                  }
                  img {
                    &.grab {
                      margin: 0;
                      padding: 0;
                    }
                  }
                }
              }
            }
          }
        }
      }
    } 
  }
}
</style>