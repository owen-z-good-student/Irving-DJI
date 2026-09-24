/**
 * 将事件类型和数据转换为用户友好的文本通知
 * @param {string} param1 - 事件类型（type）
 * @param {string|object} param2 - data字段内容，支持JSON字符串/对象
 * @returns {string} 格式化后的通知文本
 */
export function parseEvent(param1, param2) {
  // 辅助函数：字节大小转换为易读格式
  const bytesToSize = bytes => {
    if (bytes === 0) return '0 B'
    if (!bytes) return '未知'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // 枚举值映射表
  const mappings = {
    algorithmSource: {
      0: 'DJI 官方智能算法',
      1: 'DJI 官方可见光人车船 AI',
      2: 'DJI 官方红外人车船 AI',
      3: 'DJI 官方红外温度检测 AI',
      255: 'AI-inside 三方机载算法',
      100001: 'AI-LINK 三方云端算法',
      100002: 'DJI 多模态目标检测'
    },
    returnHomeReason: {
      2: '行为树初始化失败',
      3: '被障碍物包围',
      4: '触发限飞限制',
      5: '障碍物距离太近',
      6: '无 GPS 信号',
      7: 'GPS 和 VIO 位置输出标志为 false',
      8: 'GPS 和 VIO 融合位置误差太大'
    },
    modelStatus: {
      9: '模型压缩',
      12: '等待资源中',
      13: '等待资源失败',
      14: '重建中',
      15: '重建成功',
      16: '重建取消'
    },
    zipStatus: {
      1: '压缩中',
      2: '压缩完成',
      3: '压缩失败'
    },
    fileType: {
      wayline: '航线',
      flight_record: '飞行记录',
      model: '模型',
      media: '媒体文件'
    },
    waylineSubType: {
      0: '主航线',
      1: '子航线'
    }
  }

  const type = param1
  let rawData = param2

  // 核心修复：如果是JSON字符串，自动解析为对象
  if (typeof rawData === 'string') {
    try {
      rawData = JSON.parse(rawData)
    } catch (e) {
      // 解析失败直接原样返回
      return `❓ 数据解析失败\n事件类型：${type}\n原始数据：${rawData}`
    }
  }

  // 统一转为纯净对象，全局可选链+空值兜底
  const data = rawData || {}

  // 根据事件类型路由处理
  switch (type) {
    // 1. 文件同步成功通知（正确标识：sync_file_success）
    case 'sync_file_success': {
      return `📁 文件同步成功通知
• 同步任务ID：${data.task_id ?? data.TaskID ?? '未知'}
• 所属组织ID：${data.organization_id ?? '未知'}
• 所属项目ID：${data.project_id ?? '未知'}
• 司空平台文件ID：${data.file_id ?? '未知'}
• 文件类型：${mappings.fileType[data.file_type] ?? data.file_type ?? '未知'}
• 文件大小：${bytesToSize(data.file_bytes_size)}
• 三方存储路径：${data.file_external_key ?? '未知'}
• 司空2平台路径：${data.fh2_file_path ?? '未知'}`
    }

    // 2. AI检测告警记录
    case 'ai_alert_record': {
      return `🚨 AI检测告警记录
• 告警记录ID：${data.alert_uuid ?? '未知'}
• 算法来源：${mappings.algorithmSource[data.algorithm_source] ?? `未知(${data.algorithm_source})`}
• 飞行器序列号：${data.drone_sn ?? '未知'}
• 关联飞行架次ID：${data.flight_id ?? '未知'}
• 关联机场/网关序列号：${data.gateway_sn ?? '未知'}
• 检测目标标签：${Array.isArray(data.labels) ? data.labels.join('、') : '未知'}
• 告警位置：
  经度：${data.location?.longitude ?? '未知'}
  纬度：${data.location?.latitude ?? '未知'}
  高度：${data.location?.altitude ?? '未知'} 米
• 所属项目ID：${data.project_id ?? '未知'}
• 关联飞行任务名称：${data.task_name ?? '未知'}
• 原始图片链接：${data.file_url ?? '未知'}
• 缩略图链接：${data.thumbnail_url ?? '未知'}`
    }

    // 3. 媒体文件上传完成通知
    case 'media_file_uploaded': {
      return `🖼️ 媒体文件上传完成通知
• 所属组织ID：${data.organization_id ?? '未知'}
• 所属项目ID：${data.project_id ?? '未知'}
• 司空平台文件ID：${data.file_id ?? '未知'}
• 文件名：${data.file_name ?? '未知'}
• 文件类型：${data.file_type ?? '未知'}
• 文件大小：${bytesToSize(data.file_size)}
• 设备序列号：${data.device_sn ?? '未知'}
• 关联飞行架次ID：${data.flight_id ?? '未知'}`
    }

    // 4. 航线文件上传及更新通知
    case 'wayline_file_uploaded': {
      const fileTypeText = data.type === 5 ? '航线' : `未知(${data.type})`
      const subTypeText =
        mappings.waylineSubType[data.sub_file_type] ?? `未知(${data.sub_file_type})`
      return `🛩️ 航线文件上传及更新通知
• 航线ID：${data.id ?? '未知'}
• 航线名称：${data.name ?? '未知'}
• 文件类型：${fileTypeText}
• 航线子类型：${subTypeText}
• 三方存储路径：${data.object_key ?? '未知'}`
    }

    // 5. 模型后重建完成通知
    case 'model_post_reconstruction': {
      let modelTypeText = '未知'
      if (data.type === 8) modelTypeText = '2D模型'
      if (data.type === 9) modelTypeText = '3D模型'
      if (data.type !== 8 && data.type !== 9) modelTypeText = `未知(${data.type})`
      return `🏗️ 模型后重建完成通知
• 模型ID：${data.id ?? '未知'}
• 模型名称：${data.name ?? '未知'}
• 模型类型：${modelTypeText}
• 三方存储路径：${data.object_key ?? '未知'}`
    }

    // 6. 异常退出返航通知
    case 'device_exit_return_home': {
      const reasonText =
        data.reason != null
          ? mappings.returnHomeReason[data.reason] ?? `未知(${data.reason})`
          : '未知原因'
      return `⚠️ 异常退出返航通知
• 飞行器序列号：${data.sn ?? '未知'}
• 返航原因：${reasonText}`
    }

    // 7. 组织标注新增/修改通知
    case 'map_geo_elements_update': {
      return `📍 组织标注新增/修改通知
• 同步ID：${data.sync_id ?? '未知'}
• 同步类型：${data.sync_type ?? '未知'}
• 更新数量：${data.count ?? '未知'}
• 文件格式：${data.format ?? '未知'}
• 几何类型：${Array.isArray(data.geometry_types) ? data.geometry_types.join('、') : '未知'}
• 下载链接：${data.download_url ?? '未知'}`
    }

    // 8. 模型重建进度通知
    case 'model_reconstruction_percent_change':
    case 'model_zip_change': {
      const infoType = type === 'model_reconstruction_percent_change' ? '模型重建' : '模型压缩'
      const statusText = mappings.modelStatus[data.model_status] ?? `未知(${data.model_status})`
      const zipStaText = mappings.zipStatus[data.zip_status] ?? `未知(${data.zip_status})`
      let result = `🔄 司空建模进度通知
• 信息类型：${infoType}
• 资源UUID：${data.resource_uuid ?? '未知'}
• 模型UUID：${data.model_uuid ?? '未知'}
• 重建状态：${statusText}
• 重建进度：${data.reconstruction_progress != null ? data.reconstruction_progress + '%' : '未知'}
• 压缩状态：${zipStaText}
• 压缩进度：${data.zip_progress != null ? data.zip_progress + '%' : '未知'}`
      if (data.zip_file_key) result += `\n• 压缩文件下载地址：${data.zip_file_key}`
      return result
    }

    // 9. RTSP地址更新推送
    default: {
      if (type === 'rtsp_url_update' || (data.converter_id && data.url)) {
        return `📹 RTSP地址更新推送
• 转换器名称：${data.converter_name ?? '未知'}
• 转换器ID：${data.converter_id ?? '未知'}
• 设备序列号：${data.sn ?? '未知'}
• 摄像头索引：${data.camera_index ?? '未知'}
• 设备呼号：${data.device_callsign ?? '未知'}
• RTSP地址：${data.url ?? '未知'}
• 用户名：${data.username ?? '未知'}
• 密码：${data.password ?? '未知'}`
      }
      return `❓ 未知事件类型\n事件类型：${type}\n数据内容：${JSON.stringify(data, null, 2)}`
    }
  }
}
