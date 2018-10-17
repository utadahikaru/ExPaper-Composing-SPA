<template>
  <div class="cus-radio">
    <span class="el-form-item__label">{{title}}</span>
    <div class="radio-group">
      <el-radio-group v-model="curValue" @change="valueChanged">
        <el-radio v-if="defaultRadio != ''" class="radio" :label="0">{{defaultRadio}}</el-radio>
        <el-radio class="radio" v-for="(item, index) in values" :key="index" :label="item.id">{{item.name}}</el-radio>
      </el-radio-group>
    </div>
  </div>
</template>

<script>
export default {
  name: "cus-radio",
  data() {
    return {
      curValue: this.value
    };
  },
  props: {
    title: String,
    value: [String, Number],
    defaultRadio: {
      type: String,
      default: ''
    },
    values: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  watch: {
    value() {
      this.curValue = this.value;
    }
  },
  mounted() {
    this.curValue = this.value;
  },
  methods: {
    valueChanged() {
      this.$emit("input", this.curValue);
    }
  }
};
</script>

<style lang="scss" scoped>
.cus-radio {
  display: flex;

  align-items: center;
}

.radio-group {
  flex: 1;
}

.radio {
  margin: 6px;
}
</style>

