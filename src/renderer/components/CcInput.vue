<template>
  <div class="ccInput">
    <div>
      <input type="checkbox" @click="change = !change" />
      <span></span>
      <input type="text" :placeholder="placeholder||useValue" v-model="useValue" />
    </div>
  </div>
</template>

<script>
export default {
  props: ["placeholder", "value"],
  data: function () {
    return {
      change: false,
      useValue: this.value,
    };
  },
  watch: {
    value:function(after, before){
        this.useValue=after;
    },
    change: function (after, before) {
      if (before) {
        this.$emit("change", this.useValue);
      }
    },
  },
};
</script>

<style lang='scss'>
.ccInput {
  *,
  *:before,
  *:after {
    box-sizing: inherit;
  }

  div {
    --field-size: 30px;
    --field-border-color: #ccc;
    margin: 1rem auto;
    font-size: 1rem;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
      0 10px 10px -5px rgba(0, 0, 0, 0.04);
    background: #ffffff;
    border-radius: 5px;
    position: relative;
    width: 400px;
    overflow: hidden;
    display: flex;
    background: white;

    input[type="checkbox"] {
      position: absolute;
      opacity: 0;
      width: var(--field-size);
      height: var(--field-size);
      cursor: pointer;
      padding: 0;
      margin: 0;

      @mixin checked-state {
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%233fc079' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' %3E%3Crect x='3' y='11' width='18' height='11' rx='2' ry='2'%3E%3C/rect%3E%3Cpath d='M7 11V7a5 5 0 0 1 9.9-1'%3E%3C/path%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: center center;
        background-size: 50%;
      }

      &:hover + span {
        @include checked-state;
      }

      &:checked + span {
        @include checked-state;

        &::before,
        &::after {
          pointer-events: none;
        }

        &::after {
          transform: translateY(-100%);
        }

        &::before {
          transform: translateY(100%);
        }
      }

      + span {
        width: var(--field-size);
        height: var(--field-size);
        border-right: 1px solid var(--field-border-color);
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23909090' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='feather feather-lock'%3E%3Crect x='3' y='11' width='18' height='11' rx='2' ry='2'%3E%3C/rect%3E%3Cpath d='M7 11V7a5 5 0 0 1 10 0v4'%3E%3C/path%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: center center;
        background-size: 50%;
        cursor: pointer;

        &::after,
        &::before {
          content: "";
          position: absolute;
          right: 0;
          height: 50%;
          left: var(--field-size);
          transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
          background: rgba(black, 0.075);
          z-index: 2;
          cursor: not-allowed;
        }

        &::after {
          top: 0;
        }

        &::before {
          bottom: 0;
        }
      }
    }

    input[type="text"] {
      padding: 0.3em;
      border: 0;
      flex: 1;
      font-size: 1rem;
      --placeholder-color: #ababab;
      font-family: inherit;

      &::-webkit-input-placeholder {
        color: var(--placeholder-color);
      }

      &:-ms-input-placeholder {
        color: var(--placeholder-color);
      }

      &::-moz-placeholder {
        color: var(--placeholder-color);
      }

      &:-moz-placeholder {
        color: var(--placeholder-color);
      }
    }
  }
}
</style>