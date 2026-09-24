<template>
  <el-form class="action-form" label-position="top" size="small">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="目标经度">
          <el-input :value="targetLon" readonly></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="目标纬度">
          <el-input :value="targetLat" readonly></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item label="告警等级">
      <el-radio-group v-model="formData.level">
        <el-radio :label="1">1级</el-radio>
        <el-radio :label="2">2级</el-radio>
        <el-radio :label="3">3级</el-radio>
        <el-radio :label="4">4级</el-radio>
        <el-radio :label="5">5级</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="任务描述">
      <el-input type="textarea" v-model="formData.desc" rows="3"></el-input>
    </el-form-item>
    <el-form-item class="form-actions">
      <el-button type="primary" class="execute-btn" @click="handleExecute" :loading="loading">
        <i class="fa-solid fa-rocket"></i> 确认并派遣无人机
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'ActionForm',
  props: {
    targetLon: String,
    targetLat: String,
    loading: Boolean
  },
  data() {
    return {
      formData: {
        level: 1,
        desc: '发现异常情况，请立即前往核查。'
      }
    }
  },
  methods: {
    handleExecute() {
      this.$emit('execute', this.formData)
    }
  }
}
</script>

<style scoped>
.action-form ::v-deep .el-form-item__label {
  color: var(--text-muted);
  line-height: 1.5;
  padding-bottom: 5px;
}
.action-form ::v-deep .el-input__inner,
.action-form ::v-deep .el-textarea__inner {
  border-color: var(--border-color);
  color: var(--text-color);
}
.action-form ::v-deep .el-radio {
  color: var(--text-color);
  margin-right: 15px;
}
.execute-btn {
  width: 100%;
  font-weight: bold;
}
.form-actions {
  margin-bottom: 0;
  margin-top: 10px;
}
@media (max-width: 768px) {
  .action-form {
    padding: 10px 20px 20px 20px;
  }
  .action-form ::v-deep .el-radio {
    margin-right: 10px;
    margin-bottom: 10px;
  }
}
</style>
