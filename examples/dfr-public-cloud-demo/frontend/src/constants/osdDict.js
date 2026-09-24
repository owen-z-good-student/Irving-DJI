// 自动生成自 OSD 数据字典
export const fieldDict = {
  home_position_is_valid: 'home点有效性',
  heading: '机场朝向角',
  rtcm_info: '机场RTK标定源',
  'rtcm_info.mount_point': '网络RTK挂载点信息',
  'rtcm_info.port': '网络端口信息',
  'rtcm_info.host': '网络host信息',
  'rtcm_info.rtcm_device_type': '设备类型',
  'rtcm_info.source_type': '标定类型',
  wireless_link_topo: '图传连接拓扑',
  'wireless_link_topo.secret_code': '加密编码',
  'wireless_link_topo.center_node': '飞行器对频信息',
  'wireless_link_topo.center_node.sdr_id': '扰码信息',
  'wireless_link_topo.center_node.sn': '设备sn',
  'wireless_link_topo.leaf_nodes': '当前连接的机场或遥控器对频信息',
  'wireless_link_topo.leaf_nodes.sdr_id': '扰码信息',
  'wireless_link_topo.leaf_nodes.sn': '设备sn',
  'wireless_link_topo.leaf_nodes.control_source_index': '控制源序号',
  air_conditioner: '机场空调工作状态信息',
  'air_conditioner.air_conditioner_state': '机场空调状态',
  'air_conditioner.switch_time': '剩余等待可切换时间',
  air_transfer_enable: '空中回传',
  silent_mode: '机场静音模式',
  user_experience_improvement: '用户体验改善计划',
  dongle_infos: '4G Dongle信息',
  'dongle_infos.imei': 'dongle imei',
  'dongle_infos.dongle_type': 'Dongle 类型',
  'dongle_infos.eid': 'dongle eid',
  'dongle_infos.esim_activate_state': 'eSIM 激活状态',
  'dongle_infos.sim_card_state': 'SIM 卡状态',
  'dongle_infos.sim_slot': 'SIM 卡槽使能状态',
  'dongle_infos.esim_infos': 'eSIM 信息',
  'dongle_infos.esim_infos.telecom_operator': '支持的运营商',
  'dongle_infos.esim_infos.enabled': 'eSIM 使能状态',
  'dongle_infos.esim_infos.iccid': 'sim iccid',
  'dongle_infos.sim_info': 'SIM 卡信息',
  'dongle_infos.sim_info.telecom_operator': '支持的运营商',
  'dongle_infos.sim_info.sim_type': 'SIM 卡类型',
  'dongle_infos.sim_info.iccid': 'sim iccid',
  drone_battery_maintenance_info: '飞行器电池保养信息',
  'drone_battery_maintenance_info.maintenance_state': '保养状态',
  'drone_battery_maintenance_info.maintenance_time_left': '电池保养剩余时间',
  'drone_battery_maintenance_info.heat_state': '电池加热保温状态',
  'drone_battery_maintenance_info.batteries': '电池详细信息',
  'drone_battery_maintenance_info.batteries.capacity_percent': '电池剩余电量',
  'drone_battery_maintenance_info.batteries.index': '电池序号',
  'drone_battery_maintenance_info.batteries.voltage': '电压',
  'drone_battery_maintenance_info.batteries.temperature': '温度',
  maintain_status: '保养信息',
  'maintain_status.maintain_status_array': '保养信息数组',
  'maintain_status.maintain_status_array.state': '保养状态',
  'maintain_status.maintain_status_array.last_maintain_type': '上一次保养类型',
  'maintain_status.maintain_status_array.last_maintain_time': '上一次保养时间',
  'maintain_status.maintain_status_array.last_maintain_work_sorties': '上一次保养时作业架次',
  position_state: '搜星状态',
  'position_state.is_calibration': '是否标定',
  'position_state.is_fixed': '是否收敛',
  'position_state.quality': '搜星档位',
  'position_state.gps_number': 'GPS 搜星数量',
  'position_state.rtk_number': 'RTK 搜星数量',
  emergency_stop_state: '紧急停止按钮状态',
  drone_charge_state: '飞行器充电状态',
  'drone_charge_state.capacity_percent': '电量百分比',
  'drone_charge_state.state': '充电状态',
  backup_battery: '机场备用电池信息',
  'backup_battery.switch': '备用电池开关',
  'backup_battery.voltage': '备用电池电压',
  'backup_battery.temperature': '备用电池温度',
  alarm_state: '机场声光报警状态',
  battery_store_mode: '电池运行模式',
  activation_time: '飞行器激活时间(unix 时间戳)',
  height: '绝对高度',
  alternate_land_point: '备降点',
  'alternate_land_point.longitude': '经度',
  'alternate_land_point.latitude': '纬度',
  'alternate_land_point.safe_land_height': '安全高度(备降转移高)',
  'alternate_land_point.is_configured': '是否设置备降点',
  'alternate_land_point.height': '椭球高度',
  compatible_status: '固件一致性',
  acc_time: '机场累计运行时长',
  first_power_on: '首次上电时间',
  storage: '存储容量',
  'storage.total': '总容量',
  'storage.used': '已使用容量',
  working_current: '工作电流',
  working_voltage: '工作电压',
  humidity: '舱内湿度',
  temperature: '舱内温度',
  environment_temperature: '环境温度',
  wind_speed: '风速',
  rainfall: '降雨量',
  live_capacity: '网关设备直播能力',
  'live_capacity.available_video_number': '可选择推流的码流数量',
  'live_capacity.coexist_video_number_max': '可同时推流的最大码流数量',
  'live_capacity.device_list': '可选择的视频设备源',
  'live_capacity.device_list.sn': '飞行器等视频源设备序列号（SN）',
  'live_capacity.device_list.available_video_number': '该序列号设备可以被选择推流的码流数',
  'live_capacity.device_list.coexist_video_number_max': '该序列号设备可以同时被推流的码流数',
  'live_capacity.device_list.camera_list': '该序列号设备上的相机列表',
  'live_capacity.device_list.camera_list.camera_index': '相机索引',
  'live_capacity.device_list.camera_list.available_video_number':
    '该相机级别的视频源可以被选择推流的码流数',
  'live_capacity.device_list.camera_list.coexist_video_number_max':
    '该相机级别的视频源可以同时被推流的码流数',
  'live_capacity.device_list.camera_list.video_list': '该相机级别的视频源可以选择的码流列表',
  'live_capacity.device_list.camera_list.video_list.video_index':
    '该相机级别的视频源可以选择的码流索引',
  'live_capacity.device_list.camera_list.video_list.video_type':
    '该相机级别的视频源可以选择的码流类型',
  'live_capacity.device_list.camera_list.video_list.switchable_video_types':
    '该视频流支持切换的视频镜头类型',
  live_status: '网关当前整体直播状态推送',
  'live_status.video_id': '直播码流标识符',
  'live_status.video_type': '视频类型',
  'live_status.video_quality': '直播码流的质量',
  'live_status.status': '直播状态',
  'live_status.error_status': '错误码',
  wireless_link: '图传链路',
  'wireless_link.dongle_number': '飞行器上 Dongle 数量',
  'wireless_link.4g_link_state': '4G 链路连接状态',
  'wireless_link.sdr_link_state': 'SDR 链路连接状态',
  'wireless_link.link_workmode': '机场的图传链路模式',
  'wireless_link.sdr_quality': 'SDR 信号质量',
  'wireless_link.4g_quality': '总体 4G 信号质量',
  'wireless_link.4g_uav_quality': '天端 4G 信号质量',
  'wireless_link.4g_gnd_quality': '地端 4G 信号质量',
  'wireless_link.sdr_freq_band': 'SDR 频段',
  'wireless_link.4g_freq_band': '4G 频段',
  media_file_detail: '媒体文件上传细节',
  'media_file_detail.remain_upload': '待上传数量',
  job_number: '机场累计作业次数',
  drone_in_dock: '飞行器是否在舱',
  network_state: '网络状态',
  'network_state.type': '网络类型',
  'network_state.quality': '网络质量',
  'network_state.rate': '网络速率',
  supplement_light_state: '补光灯状态',
  cover_state: '舱盖状态',
  sub_device: '子设备状态',
  'sub_device.device_sn': '子设备序列号（SN）',
  'sub_device.device_model_key': '子设备枚举值',
  'sub_device.device_online_status': '机场停机坪上的飞行器开机状态',
  'sub_device.device_paired': '机场停机坪上的飞行器是否与机场对频',
  flighttask_step_code: '机场任务状态',
  mode_code: '飞行器状态',
  firmware_upgrade_status: '固件升级状态',
  firmware_version: '固件版本',
  latitude: '纬度',
  longitude: '经度',
  drc_state: 'DRC 链路的状态',
  self_converge_coordinate: '自收敛坐标',
  'self_converge_coordinate.latitude': '纬度',
  'self_converge_coordinate.longitude': '经度',
  'self_converge_coordinate.height': '椭球高度',
  best_link_gateway: '飞行器图传连接质量最好的网关SN',
  cameras: '飞行器相机信息',
  'cameras.remain_photo_num': '剩余拍照张数',
  'cameras.remain_record_duration': '剩余录像时间',
  'cameras.record_time': '视频录制时长',
  'cameras.payload_index': '负载编号',
  'cameras.camera_mode': '相机模式',
  'cameras.photo_state': '拍照状态',
  'cameras.screen_split_enable': '分屏是否使能',
  'cameras.recording_state': '录像状态',
  'cameras.zoom_factor': '变焦倍数',
  'cameras.ir_zoom_factor': '红外变焦倍数',
  'cameras.liveview_world_region': '视场角（FOV）在 liveview 中的区域',
  'cameras.liveview_world_region.left': '左上角的 x 轴起始点',
  'cameras.liveview_world_region.top': '左上角的 y 轴起始点',
  'cameras.liveview_world_region.right': '右下角的 x 轴起始点',
  'cameras.liveview_world_region.bottom': '右下角的 y 轴起始点',
  'cameras.photo_storage_settings': '照片存储设置集合',
  'cameras.video_storage_settings': '视频存储设置集合',
  'cameras.wide_exposure_mode': '广角镜头曝光模式',
  'cameras.wide_iso': '广角镜头感光度',
  'cameras.wide_shutter_speed': '广角镜头快门速度',
  'cameras.wide_exposure_value': '广角镜头曝光值',
  'cameras.zoom_exposure_mode': '变焦镜头曝光模式',
  'cameras.zoom_iso': '变焦镜头感光度',
  'cameras.zoom_shutter_speed': '变焦镜头快门速度',
  'cameras.zoom_exposure_value': '变焦镜头曝光值',
  'cameras.zoom_focus_mode': '变焦镜头对焦模式',
  'cameras.zoom_focus_value': '变焦镜头对焦值',
  'cameras.zoom_max_focus_value': '变焦镜头最大对焦值',
  'cameras.zoom_min_focus_value': '变焦镜头最小对焦值',
  'cameras.zoom_calibrate_farthest_focus_value': '变焦镜头标定的最远对焦值',
  'cameras.zoom_calibrate_nearest_focus_value': '变焦镜头标定的最近对焦值',
  'cameras.zoom_focus_state': '变焦镜头对焦状态',
  'cameras.ir_metering_mode': '红外测温模式',
  'cameras.ir_metering_point': '红外测温点',
  'cameras.ir_metering_point.x': '测温点坐标 x',
  'cameras.ir_metering_point.y': '测温点坐标 y',
  'cameras.ir_metering_point.temperature': '测温点的温度',
  'cameras.ir_metering_area': '红外测温区域',
  'cameras.ir_metering_area.x': '测温区域左上角点坐标 x',
  'cameras.ir_metering_area.y': '测温区域左上角点坐标 y',
  'cameras.ir_metering_area.width': '测温区域宽度',
  'cameras.ir_metering_area.height': '测温区域高度',
  'cameras.ir_metering_area.aver_temperature': '测温区域平均温度',
  'cameras.ir_metering_area.min_temperature_point': '测温区域最低温度点',
  'cameras.ir_metering_area.min_temperature_point.x': '最低温度点坐标 x',
  'cameras.ir_metering_area.min_temperature_point.y': '最低温度点坐标 y',
  'cameras.ir_metering_area.min_temperature_point.temperature': '最低温度点的温度',
  'cameras.ir_metering_area.max_temperature_point': '测温区域最高温度点',
  'cameras.ir_metering_area.max_temperature_point.x': '最高温度点坐标 x',
  'cameras.ir_metering_area.max_temperature_point.y': '最高温度点坐标 y',
  'cameras.ir_metering_area.max_temperature_point.temperature': '最高温度点的温度',
  flysafe_database_version: '飞行安全数据库版本',
  offline_map_enable: '离线地图开关',
  current_rth_mode: '返航高度模式当前值',
  rth_mode: '返航高度模式设置值',
  obstacle_avoidance: '飞行器避障状态',
  'obstacle_avoidance.horizon': '水平避障状态',
  'obstacle_avoidance.upside': '上视避障状态',
  'obstacle_avoidance.downside': '下视避障状态',
  is_near_area_limit: '是否接近限飞区',
  is_near_height_limit: '是否接近设定的限制高度',
  height_limit: '飞行器限高',
  night_lights_state: '飞行器夜航灯状态',
  'maintain_status.maintain_status_array.last_maintain_flight_time': '上一次保养时飞行航时',
  'maintain_status.maintain_status_array.last_maintain_flight_sorties': '上一次保养时飞行架次',
  total_flight_sorties: '飞行器累计飞行总架次',
  type_subtype_gimbalindex: '负载编号',
  'type_subtype_gimbalindex.gimbal_pitch': '云台俯仰轴角度',
  'type_subtype_gimbalindex.gimbal_roll': '云台横滚轴角度',
  'type_subtype_gimbalindex.gimbal_yaw': '云台偏航轴角度',
  'type_subtype_gimbalindex.measure_target_longitude': '激光测距目标经度',
  'type_subtype_gimbalindex.measure_target_latitude': '激光测距目标纬度',
  'type_subtype_gimbalindex.measure_target_altitude': '激光测距目标海拔',
  'type_subtype_gimbalindex.measure_target_distance': '激光测距距离',
  'type_subtype_gimbalindex.measure_target_error_state': '激光测距状态',
  'type_subtype_gimbalindex.payload_index': '负载索引，格式为 {type-subtype-gimbalindex}',
  'type_subtype_gimbalindex.zoom_factor': '变焦倍数',
  'type_subtype_gimbalindex.thermal_current_palette_style': '调色盘样式',
  'type_subtype_gimbalindex.thermal_supported_palette_styles': '设备支持的调色盘样式集合',
  'type_subtype_gimbalindex.thermal_gain_mode': '增益模式',
  'type_subtype_gimbalindex.thermal_isotherm_state': '是否开启等温线',
  'type_subtype_gimbalindex.thermal_isotherm_upper_limit': '测温区间上限',
  'type_subtype_gimbalindex.thermal_isotherm_lower_limit': '测温区间下限',
  'type_subtype_gimbalindex.thermal_global_temperature_min': '全局画面中测量的最低温度',
  'type_subtype_gimbalindex.thermal_global_temperature_max': '全局画面中测量的最高温度',
  track_id: '航迹 ID',
  battery: '飞行器电池信息',
  'battery.capacity_percent': '电池的总剩余电量',
  'battery.remain_flight_time': '剩余飞行时间',
  'battery.return_home_power': '返航所需电量百分比',
  'battery.landing_power': '强制降落电量百分比',
  'battery.batteries': '电池详细信息',
  'battery.batteries.capacity_percent': '电池剩余电量',
  'battery.batteries.index': '电池序号',
  'battery.batteries.sn': '电池序列号（SN）',
  'battery.batteries.type': '电池类型',
  'battery.batteries.sub_type': '电池子类型',
  'battery.batteries.firmware_version': '固件版本',
  'battery.batteries.loop_times': '电池循环次数',
  'battery.batteries.voltage': '电压',
  'battery.batteries.temperature': '温度',
  'battery.batteries.high_voltage_storage_days': '高电压存储天数',
  total_flight_distance: '飞行器累计飞行总里程',
  total_flight_time: '飞行器累计飞行航时',
  serious_low_battery_warning_threshold: '严重低电量告警',
  low_battery_warning_threshold: '低电量告警',
  control_source: '当前控制源',
  wind_direction: '当前风向',
  home_distance: '距离 Home 点的距离',
  home_latitude: 'Home 点纬度',
  home_longitude: 'Home 点经度',
  attitude_head: '偏航轴角度',
  attitude_roll: '横滚轴角度',
  attitude_pitch: '俯仰轴角度',
  elevation: '相对起飞点高度',
  vertical_speed: '垂直速度',
  horizontal_speed: '水平速度',
  gear: '档位',
  mode_code_reason: '飞行器进入当前状态的原因',
  commander_flight_height: '指点飞行高度',
  commander_flight_mode: '指点飞行模式设置值',
  commander_mode_lost_action: '指点飞行失控动作',
  camera_watermark_settings: '相机水印设置',
  'camera_watermark_settings.global_enable': '水印显示全局开关',
  'camera_watermark_settings.drone_type_enable': '机型显示开关',
  'camera_watermark_settings.drone_sn_enable': '飞行器序列号显示开关',
  'camera_watermark_settings.datetime_enable': '日期时间显示开关',
  'camera_watermark_settings.gps_enable': '经纬度&海拔高显示开关',
  'camera_watermark_settings.user_custom_string_enable': '自定义文案显示开关',
  'camera_watermark_settings.user_custom_string': '自定义文案内容',
  'camera_watermark_settings.layout': '水印在画面中位置',
  distance_limit_status: '飞行器限远状态',
  'distance_limit_status.state': '是否开启限远',
  'distance_limit_status.distance_limit': '限远距离',
  'distance_limit_status.is_near_distance_limit': '是否接近设定的限制距离',
  rth_altitude: '返航高度',
  psdk_ui_resource: 'psdk ui 资源包',
  'psdk_ui_resource.psdk_index': 'psdk 负载设备索引',
  'psdk_ui_resource.psdk_ready': 'psdk 就绪状态',
  'psdk_ui_resource.object_key': 'oss 对象',
  psdk_widget_values: 'psdk 负载设备属性值',
  'psdk_widget_values.psdk_index': 'psdk 负载设备索引',
  'psdk_widget_values.psdk_name': '设备名称',
  'psdk_widget_values.psdk_sn': '设备序号',
  'psdk_widget_values.psdk_version': '设备固件版本',
  'psdk_widget_values.psdk_lib_version': 'psdk lib 版本',
  'psdk_widget_values.speaker': '喊话器状态',
  'psdk_widget_values.speaker.work_mode': '喊话器工作模式',
  'psdk_widget_values.speaker.play_mode': '喊话器播放模式',
  'psdk_widget_values.speaker.play_volume': '喊话器音量',
  'psdk_widget_values.speaker.system_state': '喊话器状态',
  'psdk_widget_values.speaker.play_file_name': '喊话器最近一次播放的文件名称',
  'psdk_widget_values.speaker.play_file_md5': '喊话器最近一次播放的文件md5校验和',
  'psdk_widget_values.values': 'psdk 控件值列表',
  'psdk_widget_values.values.index': '控件编号',
  'psdk_widget_values.values.value': '控件值',
  remaining_power_for_return_home: '返航预留电量'
}
export const enumDict = {
  home_position_is_valid: {
    0: '航向和经纬度坐标都无效',
    1: '航向和经纬度坐标都有效',
    2: '航向有效，经纬度无效',
    3: '经纬度有效，航向无效'
  },
  'rtcm_info.rtcm_device_type': {
    1: '机场'
  },
  'rtcm_info.source_type': {
    0: '未标定',
    1: '自收敛标定',
    2: '手动标定',
    3: '网络RTK标定'
  },
  air_transfer_enable: {
    false: '关闭',
    true: '开启'
  },
  silent_mode: {
    0: '非静音模式',
    1: '静音模式'
  },
  user_experience_improvement: {
    0: '初始状态',
    1: '拒绝加入用户体验改善计划',
    2: '同意加入用户体验改善计划'
  },
  'dongle_infos.dongle_type': {
    6: '旧 Dongle',
    10: '支持 eSIM 的新 Dongle'
  },
  'dongle_infos.esim_activate_state': {
    0: '未知',
    1: '未激活',
    2: '已激活'
  },
  'dongle_infos.sim_card_state': {
    0: '未插入',
    1: '已插入'
  },
  'dongle_infos.sim_slot': {
    0: '未知',
    1: '实体 SIM 卡',
    2: 'eSIM'
  },
  'dongle_infos.esim_infos.telecom_operator': {
    0: '未知',
    1: '移动',
    2: '联通',
    3: '电信'
  },
  'dongle_infos.esim_infos.enabled': {
    false: '未使用',
    true: '使用中'
  },
  'dongle_infos.sim_info.telecom_operator': {
    0: '未知',
    1: '移动',
    2: '联通',
    3: '电信'
  },
  'dongle_infos.sim_info.sim_type': {
    0: '未知',
    1: '其他普通 SIM 卡',
    2: '三网卡'
  },
  'drone_battery_maintenance_info.maintenance_state': {
    0: '无需保养',
    1: '待保养',
    2: '正在保养'
  },
  'drone_battery_maintenance_info.heat_state': {
    0: '电池未开启加热或保温',
    1: '电池在加热中',
    2: '电池在保温中'
  },
  'drone_battery_maintenance_info.batteries.index': {
    0: '左电池',
    1: '右电池'
  },
  'maintain_status.maintain_status_array.state': {
    0: '无保养',
    1: '有保养'
  },
  'maintain_status.maintain_status_array.last_maintain_type': {
    1: '飞行器基础保养',
    2: '飞行器常规保养',
    3: '飞行器深度保养'
  },
  'position_state.is_calibration': {
    0: '未标定',
    1: '已标定'
  },
  'position_state.is_fixed': {
    0: '未开始',
    1: '收敛中',
    2: '收敛成功',
    3: '收敛失败'
  },
  'position_state.quality': {
    1: '1档',
    2: '2档',
    3: '3档',
    4: '4档',
    5: '5档',
    10: 'RTK fixed'
  },
  emergency_stop_state: {
    0: '关闭',
    1: '开启'
  },
  'drone_charge_state.state': {
    0: '空闲',
    1: '充电中'
  },
  'backup_battery.switch': {
    0: '关闭',
    1: '开启'
  },
  alarm_state: {
    0: '关闭',
    1: '开启'
  },
  battery_store_mode: {
    1: '计划模式',
    2: '待命模式'
  },
  'alternate_land_point.is_configured': {
    0: '未设置',
    1: '已设置'
  },
  compatible_status: {
    0: '不需要一致性升级',
    1: '需要一致性升级'
  },
  rainfall: {
    0: '无雨',
    1: '小雨',
    2: '中雨',
    3: '大雨'
  },
  'live_status.video_quality': {
    0: '自适应',
    1: '流畅',
    2: '标清',
    3: '高清',
    4: '超清'
  },
  'live_status.status': {
    0: '未直播',
    1: '在直播'
  },
  'wireless_link.4g_link_state': {
    0: '断开',
    1: '连接'
  },
  'wireless_link.sdr_link_state': {
    0: '断开',
    1: '连接'
  },
  'wireless_link.link_workmode': {
    0: 'SDR 模式',
    1: '4G 融合模式'
  },
  drone_in_dock: {
    0: '舱外',
    1: '舱内'
  },
  'network_state.type': {
    1: '4G',
    2: '以太网'
  },
  'network_state.quality': {
    0: '无信号',
    1: '差',
    2: '较差',
    3: '一般',
    4: '较好',
    5: '好'
  },
  supplement_light_state: {
    0: '关闭',
    1: '打开'
  },
  cover_state: {
    0: '关闭',
    1: '打开',
    2: '半开',
    3: '舱盖状态异常'
  },
  'sub_device.device_online_status': {
    0: '关机',
    1: '开机'
  },
  'sub_device.device_paired': {
    0: '未对频',
    1: '已对频'
  },
  flighttask_step_code: {
    0: '作业准备中',
    1: '飞行作业中',
    2: '作业后状态恢复',
    3: '自定义飞行区更新中',
    4: '地形障碍物更新中',
    5: '任务空闲',
    255: '飞行器异常',
    256: '未知状态'
  },
  mode_code: {
    0: '待机',
    1: '起飞准备',
    2: '起飞准备完毕',
    3: '手动飞行',
    4: '自动起飞',
    5: '航线飞行',
    6: '全景拍照',
    7: '智能跟随',
    8: 'ADS-B 躲避',
    9: '自动返航',
    10: '自动降落',
    11: '强制降落',
    12: '三桨叶降落',
    13: '升级中',
    14: '未连接',
    15: 'APAS',
    16: '虚拟摇杆状态',
    17: '指令飞行',
    18: '空中 RTK 收敛模式',
    19: '机场选址中',
    20: 'POI环绕',
    21: '进离场航线飞行过程中'
  },
  firmware_upgrade_status: {
    0: '未升级',
    1: '升级中'
  },
  drc_state: {
    0: '未连接',
    1: '连接中',
    2: '已连接'
  },
  'cameras.camera_mode': {
    0: '拍照',
    1: '录像',
    2: '智能低光',
    3: '全景拍照'
  },
  'cameras.photo_state': {
    0: '空闲',
    1: '拍照中'
  },
  'cameras.screen_split_enable': {
    0: '分屏使能关闭',
    1: '分屏使能开启'
  },
  'cameras.recording_state': {
    0: '空闲',
    1: '录像中'
  },
  'cameras.wide_exposure_mode': {
    1: '自动',
    2: '快门优先曝光',
    3: '光圈优先曝光',
    4: '手动曝光'
  },
  'cameras.wide_iso': {
    0: 'Auto',
    1: 'Auto(High Sense)',
    2: '50',
    3: '100',
    4: '200',
    5: '400',
    6: '800',
    7: '1600',
    8: '3200',
    9: '6400',
    10: '12800',
    11: '25600',
    255: 'FIXED'
  },
  'cameras.wide_shutter_speed': {
    0: '1/8000 s',
    1: '1/6400 s',
    2: '1/6000 s',
    3: '1/5000 s',
    4: '1/4000 s',
    5: '1/3200 s',
    6: '1/3000 s',
    7: '1/2500 s',
    8: '1/2000 s',
    9: '1/1600 s',
    10: '1/1500 s',
    11: '1/1250 s',
    12: '1/1000 s',
    13: '1/800 s',
    14: '1/725 s',
    15: '1/640 s',
    16: '1/500 s',
    17: '1/400 s',
    18: '1/350 s',
    19: '1/320 s',
    20: '1/250 s',
    21: '1/240 s',
    22: '1/200 s',
    23: '1/180 s',
    24: '1/160 s',
    25: '1/125 s',
    26: '1/120 s',
    27: '1/100 s',
    28: '1/90 s',
    29: '1/80 s',
    30: '1/60 s',
    31: '1/50 s',
    32: '1/40 s',
    33: '1/30 s',
    34: '1/25 s',
    35: '1/20 s',
    36: '1/15 s',
    37: '1/12.5 s',
    38: '1/10 s',
    39: '1/8 s',
    40: '1/6.25 s',
    41: '1/5 s',
    42: '1/4 s',
    43: '1/3 s',
    44: '1/2.5 s',
    45: '1/2 s',
    46: '1/1.67 s',
    47: '1/1.25 s',
    48: '1.0 s',
    49: '1.3 s',
    50: '1.6 s',
    51: '2.0 s',
    52: '2.5 s',
    53: '3.0 s',
    54: '3.2 s',
    55: '4.0 s',
    56: '5.0 s',
    57: '6.0 s',
    58: '7.0 s',
    59: '8.0 s',
    65534: 'Auto'
  },
  'cameras.wide_exposure_value': {
    1: '-5.0EV',
    2: '-4.7EV',
    3: '-4.3EV',
    4: '-4.0EV',
    5: '-3.7EV',
    6: '-3.3EV',
    7: '-3.0EV',
    8: '-2.7EV',
    9: '-2.3EV',
    10: '-2.0EV',
    11: '-1.7EV',
    12: '-1.3EV',
    13: '-1.0EV',
    14: '-0.7EV',
    15: '-0.3EV',
    16: '0EV',
    17: '0.3EV',
    18: '0.7EV',
    19: '1.0EV',
    20: '1.3EV',
    21: '1.7EV',
    22: '2.0EV',
    23: '2.3EV',
    24: '2.7EV',
    25: '3.0EV',
    26: '3.3EV',
    27: '3.7EV',
    28: '4.0EV',
    29: '4.3EV',
    30: '4.7EV',
    31: '5.0EV',
    255: 'FIXED'
  },
  'cameras.zoom_exposure_mode': {
    1: '自动',
    2: '快门优先曝光',
    3: '光圈优先曝光',
    4: '手动曝光'
  },
  'cameras.zoom_iso': {
    0: 'Auto',
    1: 'Auto(High Sense)',
    2: '50',
    3: '100',
    4: '200',
    5: '400',
    6: '800',
    7: '1600',
    8: '3200',
    9: '6400',
    10: '12800',
    11: '25600',
    255: 'FIXED'
  },
  'cameras.zoom_shutter_speed': {
    0: '1/8000 s',
    1: '1/6400 s',
    2: '1/6000 s',
    3: '1/5000 s',
    4: '1/4000 s',
    5: '1/3200 s',
    6: '1/3000 s',
    7: '1/2500 s',
    8: '1/2000 s',
    9: '1/1600 s',
    10: '1/1500 s',
    11: '1/1250 s',
    12: '1/1000 s',
    13: '1/800 s',
    14: '1/725 s',
    15: '1/640 s',
    16: '1/500 s',
    17: '1/400 s',
    18: '1/350 s',
    19: '1/320 s',
    20: '1/250 s',
    21: '1/240 s',
    22: '1/200 s',
    23: '1/180 s',
    24: '1/160 s',
    25: '1/125 s',
    26: '1/120 s',
    27: '1/100 s',
    28: '1/90 s',
    29: '1/80 s',
    30: '1/60 s',
    31: '1/50 s',
    32: '1/40 s',
    33: '1/30 s',
    34: '1/25 s',
    35: '1/20 s',
    36: '1/15 s',
    37: '1/12.5 s',
    38: '1/10 s',
    39: '1/8 s',
    40: '1/6.25 s',
    41: '1/5 s',
    42: '1/4 s',
    43: '1/3 s',
    44: '1/2.5 s',
    45: '1/2 s',
    46: '1/1.67 s',
    47: '1/1.25 s',
    48: '1.0 s',
    49: '1.3 s',
    50: '1.6 s',
    51: '2.0 s',
    52: '2.5 s',
    53: '3.0 s',
    54: '3.2 s',
    55: '4.0 s',
    56: '5.0 s',
    57: '6.0 s',
    58: '7.0 s',
    59: '8.0 s',
    65534: 'Auto'
  },
  'cameras.zoom_exposure_value': {
    1: '-5.0EV',
    2: '-4.7EV',
    3: '-4.3EV',
    4: '-4.0EV',
    5: '-3.7EV',
    6: '-3.3EV',
    7: '-3.0EV',
    8: '-2.7EV',
    9: '-2.3EV',
    10: '-2.0EV',
    11: '-1.7EV',
    12: '-1.3EV',
    13: '-1.0EV',
    14: '-0.7EV',
    15: '-0.3EV',
    16: '0EV',
    17: '0.3EV',
    18: '0.7EV',
    19: '1.0EV',
    20: '1.3EV',
    21: '1.7EV',
    22: '2.0EV',
    23: '2.3EV',
    24: '2.7EV',
    25: '3.0EV',
    26: '3.3EV',
    27: '3.7EV',
    28: '4.0EV',
    29: '4.3EV',
    30: '4.7EV',
    31: '5.0EV',
    255: 'FIXED'
  },
  'cameras.zoom_focus_mode': {
    0: 'MF',
    1: 'AFS',
    2: 'AFC'
  },
  'cameras.zoom_focus_state': {
    0: '空闲',
    1: '对焦中',
    2: '对焦成功',
    3: '对焦失败'
  },
  'cameras.ir_metering_mode': {
    0: '关闭测温',
    1: '点测温',
    2: '区域测温'
  },
  offline_map_enable: {
    0: '关闭',
    1: '开启'
  },
  current_rth_mode: {
    0: '智能高度',
    1: '设定高度'
  },
  rth_mode: {
    0: '智能高度',
    1: '设定高度'
  },
  'obstacle_avoidance.horizon': {
    0: '关闭',
    1: '开启'
  },
  'obstacle_avoidance.upside': {
    0: '关闭',
    1: '开启'
  },
  'obstacle_avoidance.downside': {
    0: '关闭',
    1: '开启'
  },
  is_near_area_limit: {
    0: '未达到限飞区',
    1: '接近限飞区'
  },
  is_near_height_limit: {
    0: '未达到设定的限制高度',
    1: '接近设定的限制高度'
  },
  night_lights_state: {
    0: '关闭',
    1: '打开'
  },
  'type_subtype_gimbalindex.measure_target_error_state': {
    0: 'NORMAL',
    1: 'TOO_CLOSE',
    2: 'TOO_FAR',
    3: 'NO_SIGNAL'
  },
  'type_subtype_gimbalindex.thermal_current_palette_style': {
    0: '白热',
    1: '黑热',
    2: '描红',
    3: '医疗',
    5: '彩虹 1',
    6: '铁红',
    8: '北极',
    11: '熔岩',
    12: '热铁',
    13: '彩虹 2'
  },
  'type_subtype_gimbalindex.thermal_gain_mode': {
    0: '自动',
    1: '低增益, 测温范围0°C-500°C',
    2: '高增益, 测温范围-20°C-150°C'
  },
  'type_subtype_gimbalindex.thermal_isotherm_state': {
    0: '关闭',
    1: '开启'
  },
  wind_direction: {
    1: '正北',
    2: '东北',
    3: '东',
    4: '东南',
    5: '南',
    6: '西南',
    7: '西',
    8: '西北'
  },
  gear: {
    0: 'A',
    1: 'P',
    2: 'NAV',
    3: 'FPV',
    4: 'FARM',
    5: 'S',
    6: 'F',
    7: 'M',
    8: 'G',
    9: 'T'
  },
  mode_code_reason: {
    0: '无意义',
    1: '电池电量不足（返航、降落）',
    2: '电池电压不足（返航、降落）',
    3: '电压严重过低（返航、降落）',
    4: '遥控器按键请求（起飞、返航、降落）',
    5: 'App 请求（起飞、返航、降落）',
    6: '遥控信号丢失（返航、降落、悬停）',
    7: '导航、SDK 等外部设备触发（起飞、返航、降落）',
    8: '进入机场限飞区（降落）',
    9: '虽然触发了返航但是因为距离 Home 点距离太近（降落）',
    10: '虽然触发了返航但是因为距离 Home 点距离太远（降落）',
    11: '执行航点任务时请求（起飞）',
    12: '返航阶段到达 Home 点上方后请求（降落）',
    13: '飞行器高度下降，距地面 0.7m（二段降落限低）时，继续下降导致（降落）',
    14: 'App、SDK 等设备强制突破限低保护进行（降落）',
    15: '因为周围有航班经过而请求（返航、降落）',
    16: '因为高度控制失败请求（返航、降落）',
    17: '智能低电量返航后进入（降落）',
    18: 'AP控制飞行模式（手动飞行）',
    19: '硬件异常（返航、降落）',
    20: '防触地保护结束（降落）',
    21: '返航取消 (悬停)',
    22: '返航时遇到障碍物（降落）',
    23: '机场场景下大风触发（返航）'
  },
  commander_flight_mode: {
    0: '智能高度飞行',
    1: '设定高度飞行'
  },
  commander_mode_lost_action: {
    0: '继续执行指点飞行任务',
    1: '退出指点飞行任务，执行普通失控行为'
  },
  'camera_watermark_settings.global_enable': {
    0: '关闭',
    1: '开启'
  },
  'camera_watermark_settings.drone_type_enable': {
    0: '关闭',
    1: '开启'
  },
  'camera_watermark_settings.drone_sn_enable': {
    0: '关闭',
    1: '开启'
  },
  'camera_watermark_settings.datetime_enable': {
    0: '关闭',
    1: '开启'
  },
  'camera_watermark_settings.gps_enable': {
    0: '关闭',
    1: '开启'
  },
  'camera_watermark_settings.user_custom_string_enable': {
    0: '关闭',
    1: '开启'
  },
  'camera_watermark_settings.layout': {
    0: '左上',
    1: '左下',
    2: '右上',
    3: '右下'
  },
  'distance_limit_status.state': {
    0: '未设置',
    1: '已设置'
  },
  'distance_limit_status.is_near_distance_limit': {
    0: '未达到设定的限制距离',
    1: '接近设定的限制距离'
  },
  'psdk_ui_resource.psdk_ready': {
    0: '未就绪',
    1: '已就绪'
  },
  'psdk_widget_values.speaker.work_mode': {
    0: 'TTS 负载模式',
    1: '录音喊话'
  },
  'psdk_widget_values.speaker.play_mode': {
    0: '单次播放',
    1: '循环播放(单曲)'
  },
  'psdk_widget_values.speaker.system_state': {
    0: '空闲中',
    1: '传输中(机场到飞行器)',
    2: '播放中',
    3: '异常中',
    4: 'TTS 文本转换中',
    99: '下载中(机场从云端下载)'
  }
}
export const airportTree = [
  {
    key: 'home_position_is_valid',
    name: 'home点有效性',
    type: 'enum_int',
    depth: 0
  },
  {
    key: 'heading',
    name: '机场朝向角',
    type: 'double',
    depth: 0
  },
  {
    key: 'rtcm_info',
    name: '机场RTK标定源',
    type: 'struct',
    depth: 0,
    children: [
      {
        key: 'rtcm_info.mount_point',
        name: '网络RTK挂载点信息',
        type: 'text',
        depth: 1
      },
      {
        key: 'rtcm_info.port',
        name: '网络端口信息',
        type: 'text',
        depth: 1
      },
      {
        key: 'rtcm_info.host',
        name: '网络host信息',
        type: 'text',
        depth: 1
      },
      {
        key: 'rtcm_info.rtcm_device_type',
        name: '设备类型',
        type: 'enum_int',
        depth: 1
      },
      {
        key: 'rtcm_info.source_type',
        name: '标定类型',
        type: 'enum_int',
        depth: 1
      }
    ]
  },
  {
    key: 'wireless_link_topo',
    name: '图传连接拓扑',
    type: 'struct',
    depth: 0,
    children: [
      {
        key: 'wireless_link_topo.secret_code',
        name: '加密编码',
        type: 'array',
        depth: 1
      },
      {
        key: 'wireless_link_topo.center_node',
        name: '飞行器对频信息',
        type: 'struct',
        depth: 1,
        children: [
          {
            key: 'wireless_link_topo.center_node.sdr_id',
            name: '扰码信息',
            type: 'int',
            depth: 2
          },
          {
            key: 'wireless_link_topo.center_node.sn',
            name: '设备sn',
            type: 'text',
            depth: 2
          }
        ]
      },
      {
        key: 'wireless_link_topo.leaf_nodes',
        name: '机场或遥控器对频信息',
        type: 'array',
        depth: 1,
        children: [
          {
            key: 'wireless_link_topo.leaf_nodes.sdr_id',
            name: '扰码信息',
            type: 'int',
            depth: 2
          },
          {
            key: 'wireless_link_topo.leaf_nodes.sn',
            name: '设备sn',
            type: 'text',
            depth: 2
          },
          {
            key: 'wireless_link_topo.leaf_nodes.control_source_index',
            name: '控制源序号',
            type: 'int',
            depth: 2
          }
        ]
      }
    ]
  },
  {
    key: 'air_conditioner',
    name: '机场空调工作状态信息',
    type: 'struct',
    depth: 0,
    children: [
      {
        key: 'air_conditioner.air_conditioner_state',
        name: '机场空调状态',
        type: 'enum_int',
        depth: 1
      },
      {
        key: 'air_conditioner.switch_time',
        name: '剩余等待可切换时间',
        type: 'int',
        depth: 1
      }
    ]
  },
  {
    key: 'air_transfer_enable',
    name: '空中回传',
    type: 'bool',
    depth: 0
  },
  {
    key: 'silent_mode',
    name: '机场静音模式',
    type: 'enum_int',
    depth: 0
  },
  {
    key: 'user_experience_improvement',
    name: '用户体验改善计划',
    type: 'enum_int',
    depth: 0
  },
  {
    key: 'dongle_infos',
    name: '4G Dongle信息',
    type: 'array',
    depth: 0,
    children: [
      {
        key: 'dongle_infos.imei',
        name: 'dongle imei',
        type: 'text',
        depth: 1
      },
      {
        key: 'dongle_infos.dongle_type',
        name: 'Dongle 类型',
        type: 'enum_int',
        depth: 1
      },
      {
        key: 'dongle_infos.eid',
        name: 'dongle eid',
        type: 'text',
        depth: 1
      },
      {
        key: 'dongle_infos.esim_activate_state',
        name: 'eSIM 激活状态',
        type: 'enum_int',
        depth: 1
      },
      {
        key: 'dongle_infos.sim_card_state',
        name: 'SIM 卡状态',
        type: 'enum_int',
        depth: 1
      },
      {
        key: 'dongle_infos.sim_slot',
        name: 'SIM 卡槽使能状态',
        type: 'enum_int',
        depth: 1
      },
      {
        key: 'dongle_infos.esim_infos',
        name: 'eSIM 信息',
        type: 'array',
        depth: 1,
        children: [
          {
            key: 'dongle_infos.esim_infos.telecom_operator',
            name: '支持的运营商',
            type: 'enum_int',
            depth: 2
          },
          {
            key: 'dongle_infos.esim_infos.enabled',
            name: 'eSIM 使能状态',
            type: 'bool',
            depth: 2
          },
          {
            key: 'dongle_infos.esim_infos.iccid',
            name: 'sim iccid',
            type: 'text',
            depth: 2
          }
        ]
      },
      {
        key: 'dongle_infos.sim_info',
        name: 'SIM 卡信息',
        type: 'struct',
        depth: 1,
        children: [
          {
            key: 'dongle_infos.sim_info.telecom_operator',
            name: '支持的运营商',
            type: 'enum_int',
            depth: 2
          },
          {
            key: 'dongle_infos.sim_info.sim_type',
            name: 'SIM 卡类型',
            type: 'enum_int',
            depth: 2
          },
          {
            key: 'dongle_infos.sim_info.iccid',
            name: 'sim iccid',
            type: 'text',
            depth: 2
          }
        ]
      }
    ]
  },
  {
    key: 'drone_battery_maintenance_info',
    name: '飞行器电池保养信息',
    type: 'struct',
    depth: 0,
    children: [
      {
        key: 'drone_battery_maintenance_info.maintenance_state',
        name: '保养状态',
        type: 'enum_int',
        depth: 1
      },
      {
        key: 'drone_battery_maintenance_info.maintenance_time_left',
        name: '电池保养剩余时间',
        type: 'int',
        depth: 1
      },
      {
        key: 'drone_battery_maintenance_info.heat_state',
        name: '电池加热保温状态',
        type: 'enum_int',
        depth: 1
      },
      {
        key: 'drone_battery_maintenance_info.batteries',
        name: '电池详细信息',
        type: 'array',
        depth: 1,
        children: [
          {
            key: 'drone_battery_maintenance_info.batteries.capacity_percent',
            name: '电池剩余电量',
            type: 'int',
            depth: 2
          },
          {
            key: 'drone_battery_maintenance_info.batteries.index',
            name: '电池序号',
            type: 'enum_int',
            depth: 2
          },
          {
            key: 'drone_battery_maintenance_info.batteries.voltage',
            name: '电压',
            type: 'int',
            depth: 2
          },
          {
            key: 'drone_battery_maintenance_info.batteries.temperature',
            name: '温度',
            type: 'float',
            depth: 2
          }
        ]
      }
    ]
  },
  {
    key: 'maintain_status',
    name: '保养信息',
    type: 'struct',
    depth: 0,
    children: [
      {
        key: 'maintain_status.maintain_status_array',
        name: '保养信息数组',
        type: 'array',
        depth: 1,
        children: [
          {
            key: 'maintain_status.maintain_status_array.state',
            name: '保养状态',
            type: 'enum_int',
            depth: 2
          },
          {
            key: 'maintain_status.maintain_status_array.last_maintain_type',
            name: '上一次保养类型',
            type: 'enum_int',
            depth: 2
          },
          {
            key: 'maintain_status.maintain_status_array.last_maintain_time',
            name: '上一次保养时间',
            type: 'date',
            depth: 2
          },
          {
            key: 'maintain_status.maintain_status_array.last_maintain_work_sorties',
            name: '上一次保养时作业架次',
            type: 'int',
            depth: 2
          }
        ]
      }
    ]
  },
  {
    key: 'position_state',
    name: '搜星状态',
    type: 'struct',
    depth: 0,
    children: [
      {
        key: 'position_state.is_calibration',
        name: '是否标定',
        type: 'enum_int',
        depth: 1
      },
      {
        key: 'position_state.is_fixed',
        name: '是否收敛',
        type: 'enum_int',
        depth: 1
      },
      {
        key: 'position_state.quality',
        name: '搜星档位',
        type: 'enum_int',
        depth: 1
      },
      {
        key: 'position_state.gps_number',
        name: 'GPS 搜星数量',
        type: 'int',
        depth: 1
      },
      {
        key: 'position_state.rtk_number',
        name: 'RTK 搜星数量',
        type: 'int',
        depth: 1
      }
    ]
  },
  {
    key: 'emergency_stop_state',
    name: '紧急停止按钮状态',
    type: 'enum_int',
    depth: 0
  },
  {
    key: 'drone_charge_state',
    name: '飞行器充电状态',
    type: 'struct',
    depth: 0,
    children: [
      {
        key: 'drone_charge_state.capacity_percent',
        name: '电量百分比',
        type: 'int',
        depth: 1
      },
      {
        key: 'drone_charge_state.state',
        name: '充电状态',
        type: 'enum_int',
        depth: 1
      }
    ]
  },
  {
    key: 'backup_battery',
    name: '机场备用电池信息',
    type: 'struct',
    depth: 0,
    children: [
      {
        key: 'backup_battery.switch',
        name: '备用电池开关',
        type: 'enum_int',
        depth: 1
      },
      {
        key: 'backup_battery.voltage',
        name: '备用电池电压',
        type: 'int',
        depth: 1
      },
      {
        key: 'backup_battery.temperature',
        name: '备用电池温度',
        type: 'float',
        depth: 1
      }
    ]
  },
  {
    key: 'alarm_state',
    name: '机场声光报警状态',
    type: 'enum_int',
    depth: 0
  },
  {
    key: 'battery_store_mode',
    name: '电池运行模式',
    type: 'enum_int',
    depth: 0
  },
  {
    key: 'activation_time',
    name: '机场激活时间(unix 时间戳)',
    type: 'int',
    depth: 0
  },
  {
    key: 'height',
    name: '椭球高度',
    type: 'double',
    depth: 0
  },
  {
    key: 'alternate_land_point',
    name: '备降点',
    type: 'struct',
    depth: 0,
    children: [
      {
        key: 'alternate_land_point.longitude',
        name: '经度',
        type: 'float',
        depth: 1
      },
      {
        key: 'alternate_land_point.latitude',
        name: '纬度',
        type: 'float',
        depth: 1
      },
      {
        key: 'alternate_land_point.safe_land_height',
        name: '安全高度(备降转移高)',
        type: 'float',
        depth: 1
      },
      {
        key: 'alternate_land_point.is_configured',
        name: '是否设置备降点',
        type: 'enum_int',
        depth: 1
      },
      {
        key: 'alternate_land_point.height',
        name: '椭球高度',
        type: 'float',
        depth: 1
      }
    ]
  },
  {
    key: 'compatible_status',
    name: '固件一致性',
    type: 'enum_int',
    depth: 0
  },
  {
    key: 'acc_time',
    name: '机场累计运行时长',
    type: 'int',
    depth: 0
  },
  {
    key: 'first_power_on',
    name: '首次上电时间',
    type: 'int',
    depth: 0
  },
  {
    key: 'storage',
    name: '存储容量',
    type: 'struct',
    depth: 0,
    children: [
      {
        key: 'storage.total',
        name: '总容量',
        type: 'int',
        depth: 1
      },
      {
        key: 'storage.used',
        name: '已使用容量',
        type: 'int',
        depth: 1
      }
    ]
  },
  {
    key: 'working_current',
    name: '工作电流',
    type: 'float',
    depth: 0
  },
  {
    key: 'working_voltage',
    name: '工作电压',
    type: 'int',
    depth: 0
  },
  {
    key: 'humidity',
    name: '舱内湿度',
    type: 'float',
    depth: 0
  },
  {
    key: 'temperature',
    name: '舱内温度',
    type: 'float',
    depth: 0
  },
  {
    key: 'environment_temperature',
    name: '环境温度',
    type: 'float',
    depth: 0
  },
  {
    key: 'wind_speed',
    name: '风速',
    type: 'float',
    depth: 0
  },
  {
    key: 'rainfall',
    name: '降雨量',
    type: 'enum_int',
    depth: 0
  },
  {
    key: 'live_capacity',
    name: '网关设备直播能力',
    type: 'struct',
    depth: 0,
    children: [
      {
        key: 'live_capacity.available_video_number',
        name: '可选择推流的码流数量',
        type: 'int',
        depth: 1
      },
      {
        key: 'live_capacity.coexist_video_number_max',
        name: '可同时推流的最大码流数量',
        type: 'int',
        depth: 1
      },
      {
        key: 'live_capacity.device_list',
        name: '可选择的视频设备源',
        type: 'array',
        depth: 1,
        children: [
          {
            key: 'live_capacity.device_list.sn',
            name: '飞行器等视频源设备序列号（SN）',
            type: 'text',
            depth: 2
          },
          {
            key: 'live_capacity.device_list.available_video_number',
            name: '该序列号设备可以被选择推流的码流数',
            type: 'int',
            depth: 2
          },
          {
            key: 'live_capacity.device_list.coexist_video_number_max',
            name: '该序列号设备可以同时被推流的码流数',
            type: 'int',
            depth: 2
          },
          {
            key: 'live_capacity.device_list.camera_list',
            name: '该序列号设备上的相机列表',
            type: 'array',
            depth: 2,
            children: [
              {
                key: 'live_capacity.device_list.camera_list.camera_index',
                name: '相机索引',
                type: 'text',
                depth: 3
              },
              {
                key: 'live_capacity.device_list.camera_list.available_video_number',
                name: '该相机级别的视频源可以被选择推流的码流数',
                type: 'int',
                depth: 3
              },
              {
                key: 'live_capacity.device_list.camera_list.coexist_video_number_max',
                name: '该相机级别的视频源可以同时被推流的码流数',
                type: 'int',
                depth: 3
              },
              {
                key: 'live_capacity.device_list.camera_list.video_list',
                name: '该相机级别的视频源可以选择的码流列表',
                type: 'array',
                depth: 3,
                children: [
                  {
                    key: 'live_capacity.device_list.camera_list.video_list.video_index',
                    name: '该相机级别的视频源可以选择的码流索引',
                    type: 'text',
                    depth: 4
                  },
                  {
                    key: 'live_capacity.device_list.camera_list.video_list.video_type',
                    name: '该相机级别的视频源可以选择的码流类型',
                    type: 'text',
                    depth: 4
                  },
                  {
                    key: 'live_capacity.device_list.camera_list.video_list.switchable_video_types',
                    name: '该视频流支持切换的视频镜头类型',
                    type: 'array',
                    depth: 4
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    key: 'live_status',
    name: '网关当前整体直播状态推送',
    type: 'array',
    depth: 0,
    children: [
      {
        key: 'live_status.video_id',
        name: '直播码流标识符',
        type: 'text',
        depth: 1
      },
      {
        key: 'live_status.video_type',
        name: '视频类型',
        type: 'text',
        depth: 1
      },
      {
        key: 'live_status.video_quality',
        name: '直播码流的质量',
        type: 'enum_int',
        depth: 1
      },
      {
        key: 'live_status.status',
        name: '直播状态',
        type: 'enum_int',
        depth: 1
      },
      {
        key: 'live_status.error_status',
        name: '错误码',
        type: 'int',
        depth: 1
      }
    ]
  },
  {
    key: 'wireless_link',
    name: '图传链路',
    type: 'struct',
    depth: 0,
    children: [
      {
        key: 'wireless_link.dongle_number',
        name: '飞行器上 Dongle 数量',
        type: 'int',
        depth: 1
      },
      {
        key: 'wireless_link.4g_link_state',
        name: '4G 链路连接状态',
        type: 'enum_int',
        depth: 1
      },
      {
        key: 'wireless_link.sdr_link_state',
        name: 'SDR 链路连接状态',
        type: 'enum_int',
        depth: 1
      },
      {
        key: 'wireless_link.link_workmode',
        name: '机场的图传链路模式',
        type: 'enum_int',
        depth: 1
      },
      {
        key: 'wireless_link.sdr_quality',
        name: 'SDR 信号质量',
        type: 'int',
        depth: 1
      },
      {
        key: 'wireless_link.4g_quality',
        name: '总体 4G 信号质量',
        type: 'int',
        depth: 1
      },
      {
        key: 'wireless_link.4g_uav_quality',
        name: '天端 4G 信号质量',
        type: 'int',
        depth: 1
      },
      {
        key: 'wireless_link.4g_gnd_quality',
        name: '地端 4G 信号质量',
        type: 'int',
        depth: 1
      },
      {
        key: 'wireless_link.sdr_freq_band',
        name: 'SDR 频段',
        type: 'float',
        depth: 1
      },
      {
        key: 'wireless_link.4g_freq_band',
        name: '4G 频段',
        type: 'float',
        depth: 1
      }
    ]
  },
  {
    key: 'media_file_detail',
    name: '媒体文件上传细节',
    type: 'struct',
    depth: 0,
    children: [
      {
        key: 'media_file_detail.remain_upload',
        name: '待上传数量',
        type: 'int',
        depth: 1
      }
    ]
  },
  {
    key: 'job_number',
    name: '机场累计作业次数',
    type: 'int',
    depth: 0
  },
  {
    key: 'drone_in_dock',
    name: '飞行器是否在舱',
    type: 'enum_int',
    depth: 0
  },
  {
    key: 'network_state',
    name: '网络状态',
    type: 'struct',
    depth: 0,
    children: [
      {
        key: 'network_state.type',
        name: '网络类型',
        type: 'enum_int',
        depth: 1
      },
      {
        key: 'network_state.quality',
        name: '网络质量',
        type: 'enum_int',
        depth: 1
      },
      {
        key: 'network_state.rate',
        name: '网络速率',
        type: 'float',
        depth: 1
      }
    ]
  },
  {
    key: 'supplement_light_state',
    name: '补光灯状态',
    type: 'enum_int',
    depth: 0
  },
  {
    key: 'cover_state',
    name: '舱盖状态',
    type: 'enum_int',
    depth: 0
  },
  {
    key: 'sub_device',
    name: '子设备状态',
    type: 'struct',
    depth: 0,
    children: [
      {
        key: 'sub_device.device_sn',
        name: '子设备序列号（SN）',
        type: 'text',
        depth: 1
      },
      {
        key: 'sub_device.device_model_key',
        name: '子设备枚举值',
        type: 'text',
        depth: 1
      },
      {
        key: 'sub_device.device_online_status',
        name: '机场停机坪上的飞行器开机状态',
        type: 'enum_int',
        depth: 1
      },
      {
        key: 'sub_device.device_paired',
        name: '机场停机坪上的飞行器是否与机场对频',
        type: 'enum_int',
        depth: 1
      }
    ]
  },
  {
    key: 'flighttask_step_code',
    name: '机场任务状态',
    type: 'enum_int',
    depth: 0
  },
  {
    key: 'mode_code',
    name: '机场状态',
    type: 'enum_int',
    depth: 0
  },
  {
    key: 'firmware_upgrade_status',
    name: '固件升级状态',
    type: 'enum_int',
    depth: 0
  },
  {
    key: 'firmware_version',
    name: '固件版本',
    type: 'text',
    depth: 0
  },
  {
    key: 'latitude',
    name: '纬度',
    type: 'double',
    depth: 0
  },
  {
    key: 'longitude',
    name: '经度',
    type: 'double',
    depth: 0
  },
  {
    key: 'drc_state',
    name: 'DRC 链路的状态',
    type: 'enum_int',
    depth: 0
  },
  {
    key: 'self_converge_coordinate',
    name: '自收敛坐标',
    type: 'struct',
    depth: 0,
    children: [
      {
        key: 'self_converge_coordinate.latitude',
        name: '纬度',
        type: 'double',
        depth: 1
      },
      {
        key: 'self_converge_coordinate.longitude',
        name: '经度',
        type: 'double',
        depth: 1
      },
      {
        key: 'self_converge_coordinate.height',
        name: '椭球高度',
        type: 'double',
        depth: 1
      }
    ]
  }
]
export const droneTree = [
  {
    key: 'best_link_gateway',
    name: '飞行器图传连接质量最好的网关SN',
    type: 'text',
    depth: 0
  },
  {
    key: 'wireless_link_topo',
    name: '图传连接拓扑',
    type: 'struct',
    depth: 0,
    children: [
      {
        key: 'wireless_link_topo.secret_code',
        name: '加密编码',
        type: 'array',
        depth: 1
      },
      {
        key: 'wireless_link_topo.center_node',
        name: '飞行器对频信息',
        type: 'struct',
        depth: 1,
        children: [
          {
            key: 'wireless_link_topo.center_node.sdr_id',
            name: '扰码信息',
            type: 'int',
            depth: 2
          },
          {
            key: 'wireless_link_topo.center_node.sn',
            name: '设备sn',
            type: 'text',
            depth: 2
          }
        ]
      },
      {
        key: 'wireless_link_topo.leaf_nodes',
        name: '当前连接的机场或遥控器对频信息',
        type: 'array',
        depth: 1,
        children: [
          {
            key: 'wireless_link_topo.leaf_nodes.sdr_id',
            name: '扰码信息',
            type: 'int',
            depth: 2
          },
          {
            key: 'wireless_link_topo.leaf_nodes.sn',
            name: '设备sn',
            type: 'text',
            depth: 2
          },
          {
            key: 'wireless_link_topo.leaf_nodes.control_source_index',
            name: '控制源序号',
            type: 'int',
            depth: 2
          }
        ]
      }
    ]
  },
  {
    key: 'cameras',
    name: '飞行器相机信息',
    type: 'array',
    depth: 0,
    children: [
      {
        key: 'cameras.remain_photo_num',
        name: '剩余拍照张数',
        type: 'int',
        depth: 1
      },
      {
        key: 'cameras.remain_record_duration',
        name: '剩余录像时间',
        type: 'int',
        depth: 1
      },
      {
        key: 'cameras.record_time',
        name: '视频录制时长',
        type: 'int',
        depth: 1
      },
      {
        key: 'cameras.payload_index',
        name: '负载编号',
        type: 'text',
        depth: 1
      },
      {
        key: 'cameras.camera_mode',
        name: '相机模式',
        type: 'enum_int',
        depth: 1
      },
      {
        key: 'cameras.photo_state',
        name: '拍照状态',
        type: 'enum_int',
        depth: 1
      },
      {
        key: 'cameras.screen_split_enable',
        name: '分屏是否使能',
        type: 'bool',
        depth: 1
      },
      {
        key: 'cameras.recording_state',
        name: '录像状态',
        type: 'enum_int',
        depth: 1
      },
      {
        key: 'cameras.zoom_factor',
        name: '变焦倍数',
        type: 'float',
        depth: 1
      },
      {
        key: 'cameras.ir_zoom_factor',
        name: '红外变焦倍数',
        type: 'float',
        depth: 1
      },
      {
        key: 'cameras.liveview_world_region',
        name: '视场角（FOV）在 liveview 中的区域',
        type: 'struct',
        depth: 1,
        children: [
          {
            key: 'cameras.liveview_world_region.left',
            name: '左上角的 x 轴起始点',
            type: 'float',
            depth: 2
          },
          {
            key: 'cameras.liveview_world_region.top',
            name: '左上角的 y 轴起始点',
            type: 'float',
            depth: 2
          },
          {
            key: 'cameras.liveview_world_region.right',
            name: '右下角的 x 轴起始点',
            type: 'float',
            depth: 2
          },
          {
            key: 'cameras.liveview_world_region.bottom',
            name: '右下角的 y 轴起始点',
            type: 'float',
            depth: 2
          }
        ]
      },
      {
        key: 'cameras.photo_storage_settings',
        name: '照片存储设置集合',
        type: 'array',
        depth: 1
      },
      {
        key: 'cameras.video_storage_settings',
        name: '视频存储设置集合',
        type: 'array',
        depth: 1
      },
      {
        key: 'cameras.wide_exposure_mode',
        name: '广角镜头曝光模式',
        type: 'enum_int',
        depth: 1
      },
      {
        key: 'cameras.wide_iso',
        name: '广角镜头感光度',
        type: 'enum_int',
        depth: 1
      },
      {
        key: 'cameras.wide_shutter_speed',
        name: '广角镜头快门速度',
        type: 'enum_int',
        depth: 1
      },
      {
        key: 'cameras.wide_exposure_value',
        name: '广角镜头曝光值',
        type: 'enum_int',
        depth: 1
      },
      {
        key: 'cameras.zoom_exposure_mode',
        name: '变焦镜头曝光模式',
        type: 'enum_int',
        depth: 1
      },
      {
        key: 'cameras.zoom_iso',
        name: '变焦镜头感光度',
        type: 'enum_int',
        depth: 1
      },
      {
        key: 'cameras.zoom_shutter_speed',
        name: '变焦镜头快门速度',
        type: 'enum_int',
        depth: 1
      },
      {
        key: 'cameras.zoom_exposure_value',
        name: '变焦镜头曝光值',
        type: 'enum_int',
        depth: 1
      },
      {
        key: 'cameras.zoom_focus_mode',
        name: '变焦镜头对焦模式',
        type: 'enum_int',
        depth: 1
      },
      {
        key: 'cameras.zoom_focus_value',
        name: '变焦镜头对焦值',
        type: 'int',
        depth: 1
      },
      {
        key: 'cameras.zoom_max_focus_value',
        name: '变焦镜头最大对焦值',
        type: 'int',
        depth: 1
      },
      {
        key: 'cameras.zoom_min_focus_value',
        name: '变焦镜头最小对焦值',
        type: 'int',
        depth: 1
      },
      {
        key: 'cameras.zoom_calibrate_farthest_focus_value',
        name: '变焦镜头标定的最远对焦值',
        type: 'int',
        depth: 1
      },
      {
        key: 'cameras.zoom_calibrate_nearest_focus_value',
        name: '变焦镜头标定的最近对焦值',
        type: 'int',
        depth: 1
      },
      {
        key: 'cameras.zoom_focus_state',
        name: '变焦镜头对焦状态',
        type: 'enum_int',
        depth: 1
      },
      {
        key: 'cameras.ir_metering_mode',
        name: '红外测温模式',
        type: 'enum_int',
        depth: 1
      },
      {
        key: 'cameras.ir_metering_point',
        name: '红外测温点',
        type: 'struct',
        depth: 1,
        children: [
          {
            key: 'cameras.ir_metering_point.x',
            name: '测温点坐标 x',
            type: 'double',
            depth: 2
          },
          {
            key: 'cameras.ir_metering_point.y',
            name: '测温点坐标 y',
            type: 'double',
            depth: 2
          },
          {
            key: 'cameras.ir_metering_point.temperature',
            name: '测温点的温度',
            type: 'double',
            depth: 2
          }
        ]
      },
      {
        key: 'cameras.ir_metering_area',
        name: '红外测温区域',
        type: 'struct',
        depth: 1,
        children: [
          {
            key: 'cameras.ir_metering_area.x',
            name: '测温区域左上角点坐标 x',
            type: 'double',
            depth: 2
          },
          {
            key: 'cameras.ir_metering_area.y',
            name: '测温区域左上角点坐标 y',
            type: 'double',
            depth: 2
          },
          {
            key: 'cameras.ir_metering_area.width',
            name: '测温区域宽度',
            type: 'double',
            depth: 2
          },
          {
            key: 'cameras.ir_metering_area.height',
            name: '测温区域高度',
            type: 'double',
            depth: 2
          },
          {
            key: 'cameras.ir_metering_area.aver_temperature',
            name: '测温区域平均温度',
            type: 'double',
            depth: 2
          },
          {
            key: 'cameras.ir_metering_area.min_temperature_point',
            name: '测温区域最低温度点',
            type: 'struct',
            depth: 2,
            children: [
              {
                key: 'cameras.ir_metering_area.min_temperature_point.x',
                name: '最低温度点坐标 x',
                type: 'double',
                depth: 3
              },
              {
                key: 'cameras.ir_metering_area.min_temperature_point.y',
                name: '最低温度点坐标 y',
                type: 'double',
                depth: 3
              },
              {
                key: 'cameras.ir_metering_area.min_temperature_point.temperature',
                name: '最低温度点的温度',
                type: 'double',
                depth: 3
              }
            ]
          },
          {
            key: 'cameras.ir_metering_area.max_temperature_point',
            name: '测温区域最高温度点',
            type: 'struct',
            depth: 2,
            children: [
              {
                key: 'cameras.ir_metering_area.max_temperature_point.x',
                name: '最高温度点坐标 x',
                type: 'double',
                depth: 3
              },
              {
                key: 'cameras.ir_metering_area.max_temperature_point.y',
                name: '最高温度点坐标 y',
                type: 'double',
                depth: 3
              },
              {
                key: 'cameras.ir_metering_area.max_temperature_point.temperature',
                name: '最高温度点的温度',
                type: 'double',
                depth: 3
              }
            ]
          }
        ]
      }
    ]
  },
  {
    key: 'flysafe_database_version',
    name: '飞行安全数据库版本',
    type: 'text',
    depth: 0
  },
  {
    key: 'offline_map_enable',
    name: '离线地图开关',
    type: 'bool',
    depth: 0
  },
  {
    key: 'dongle_infos',
    name: '4G Dongle信息',
    type: 'array',
    depth: 0,
    children: [
      {
        key: 'dongle_infos.imei',
        name: 'dongle imei',
        type: 'text',
        depth: 1
      },
      {
        key: 'dongle_infos.dongle_type',
        name: 'Dongle 类型',
        type: 'enum_int',
        depth: 1
      },
      {
        key: 'dongle_infos.eid',
        name: 'dongle eid',
        type: 'text',
        depth: 1
      },
      {
        key: 'dongle_infos.esim_activate_state',
        name: 'eSIM 激活状态',
        type: 'enum_int',
        depth: 1
      },
      {
        key: 'dongle_infos.sim_card_state',
        name: 'SIM 卡状态',
        type: 'enum_int',
        depth: 1
      },
      {
        key: 'dongle_infos.sim_slot',
        name: 'SIM 卡槽使能状态',
        type: 'enum_int',
        depth: 1
      },
      {
        key: 'dongle_infos.esim_infos',
        name: 'eSIM 信息',
        type: 'array',
        depth: 1,
        children: [
          {
            key: 'dongle_infos.esim_infos.telecom_operator',
            name: '支持的运营商',
            type: 'enum_int',
            depth: 2
          },
          {
            key: 'dongle_infos.esim_infos.enabled',
            name: 'eSIM 使能状态',
            type: 'bool',
            depth: 2
          },
          {
            key: 'dongle_infos.esim_infos.iccid',
            name: 'sim iccid',
            type: 'text',
            depth: 2
          }
        ]
      },
      {
        key: 'dongle_infos.sim_info',
        name: 'SIM 卡信息',
        type: 'struct',
        depth: 1,
        children: [
          {
            key: 'dongle_infos.sim_info.telecom_operator',
            name: '支持的运营商',
            type: 'enum_int',
            depth: 2
          },
          {
            key: 'dongle_infos.sim_info.sim_type',
            name: 'SIM 卡类型',
            type: 'enum_int',
            depth: 2
          },
          {
            key: 'dongle_infos.sim_info.iccid',
            name: 'sim iccid',
            type: 'text',
            depth: 2
          }
        ]
      }
    ]
  },
  {
    key: 'current_rth_mode',
    name: '返航高度模式当前值',
    type: 'enum_int',
    depth: 0
  },
  {
    key: 'rth_mode',
    name: '返航高度模式设置值',
    type: 'enum_int',
    depth: 0
  },
  {
    key: 'obstacle_avoidance',
    name: '飞行器避障状态',
    type: 'struct',
    depth: 0,
    children: [
      {
        key: 'obstacle_avoidance.horizon',
        name: '水平避障状态',
        type: 'enum_int',
        depth: 1
      },
      {
        key: 'obstacle_avoidance.upside',
        name: '上视避障状态',
        type: 'enum_int',
        depth: 1
      },
      {
        key: 'obstacle_avoidance.downside',
        name: '下视避障状态',
        type: 'enum_int',
        depth: 1
      }
    ]
  },
  {
    key: 'is_near_area_limit',
    name: '是否接近限飞区',
    type: 'enum_int',
    depth: 0
  },
  {
    key: 'is_near_height_limit',
    name: '是否接近设定的限制高度',
    type: 'enum_int',
    depth: 0
  },
  {
    key: 'height_limit',
    name: '飞行器限高',
    type: 'int',
    depth: 0
  },
  {
    key: 'night_lights_state',
    name: '飞行器夜航灯状态',
    type: 'enum_int',
    depth: 0
  },
  {
    key: 'activation_time',
    name: '飞行器激活时间(unix 时间戳)',
    type: 'int',
    depth: 0
  },
  {
    key: 'maintain_status',
    name: '保养信息',
    type: 'struct',
    depth: 0,
    children: [
      {
        key: 'maintain_status.maintain_status_array',
        name: '保养信息数组',
        type: 'array',
        depth: 1,
        children: [
          {
            key: 'maintain_status.maintain_status_array.state',
            name: '保养状态',
            type: 'enum_int',
            depth: 2
          },
          {
            key: 'maintain_status.maintain_status_array.last_maintain_type',
            name: '上一次保养类型',
            type: 'enum_int',
            depth: 2
          },
          {
            key: 'maintain_status.maintain_status_array.last_maintain_time',
            name: '上一次保养时间',
            type: 'date',
            depth: 2
          },
          {
            key: 'maintain_status.maintain_status_array.last_maintain_flight_time',
            name: '上一次保养时飞行航时',
            type: 'int',
            depth: 2
          },
          {
            key: 'maintain_status.maintain_status_array.last_maintain_flight_sorties',
            name: '上一次保养时飞行架次',
            type: 'int',
            depth: 2
          }
        ]
      }
    ]
  },
  {
    key: 'total_flight_sorties',
    name: '飞行器累计飞行总架次',
    type: 'int',
    depth: 0
  },
  {
    key: 'type_subtype_gimbalindex',
    name: '负载编号',
    type: 'struct',
    depth: 0,
    children: [
      {
        key: 'type_subtype_gimbalindex.gimbal_pitch',
        name: '云台俯仰轴角度',
        type: 'double',
        depth: 1
      },
      {
        key: 'type_subtype_gimbalindex.gimbal_roll',
        name: '云台横滚轴角度',
        type: 'double',
        depth: 1
      },
      {
        key: 'type_subtype_gimbalindex.gimbal_yaw',
        name: '云台偏航轴角度',
        type: 'double',
        depth: 1
      },
      {
        key: 'type_subtype_gimbalindex.measure_target_longitude',
        name: '激光测距目标经度',
        type: 'double',
        depth: 1
      },
      {
        key: 'type_subtype_gimbalindex.measure_target_latitude',
        name: '激光测距目标纬度',
        type: 'double',
        depth: 1
      },
      {
        key: 'type_subtype_gimbalindex.measure_target_altitude',
        name: '激光测距目标海拔',
        type: 'double',
        depth: 1
      },
      {
        key: 'type_subtype_gimbalindex.measure_target_distance',
        name: '激光测距距离',
        type: 'double',
        depth: 1
      },
      {
        key: 'type_subtype_gimbalindex.measure_target_error_state',
        name: '激光测距状态',
        type: 'enum_int',
        depth: 1
      },
      {
        key: 'type_subtype_gimbalindex.payload_index',
        name: '负载索引，格式为 {type-subtype-gimbalindex}',
        type: 'text',
        depth: 1
      },
      {
        key: 'type_subtype_gimbalindex.zoom_factor',
        name: '变焦倍数',
        type: 'double',
        depth: 1
      },
      {
        key: 'type_subtype_gimbalindex.thermal_current_palette_style',
        name: '调色盘样式',
        type: 'enum_int',
        depth: 1
      },
      {
        key: 'type_subtype_gimbalindex.thermal_supported_palette_styles',
        name: '设备支持的调色盘样式集合',
        type: 'array',
        depth: 1
      },
      {
        key: 'type_subtype_gimbalindex.thermal_gain_mode',
        name: '增益模式',
        type: 'enum_int',
        depth: 1
      },
      {
        key: 'type_subtype_gimbalindex.thermal_isotherm_state',
        name: '是否开启等温线',
        type: 'enum_int',
        depth: 1
      },
      {
        key: 'type_subtype_gimbalindex.thermal_isotherm_upper_limit',
        name: '测温区间上限',
        type: 'int',
        depth: 1
      },
      {
        key: 'type_subtype_gimbalindex.thermal_isotherm_lower_limit',
        name: '测温区间下限',
        type: 'int',
        depth: 1
      },
      {
        key: 'type_subtype_gimbalindex.thermal_global_temperature_min',
        name: '全局画面中测量的最低温度',
        type: 'float',
        depth: 1
      },
      {
        key: 'type_subtype_gimbalindex.thermal_global_temperature_max',
        name: '全局画面中测量的最高温度',
        type: 'float',
        depth: 1
      }
    ]
  },
  {
    key: 'track_id',
    name: '航迹 ID',
    type: 'text',
    depth: 0
  },
  {
    key: 'position_state',
    name: '搜星状态',
    type: 'struct',
    depth: 0,
    children: [
      {
        key: 'position_state.is_fixed',
        name: '是否收敛',
        type: 'enum_int',
        depth: 1
      },
      {
        key: 'position_state.quality',
        name: '搜星档位',
        type: 'enum_int',
        depth: 1
      },
      {
        key: 'position_state.gps_number',
        name: 'GPS 搜星数量',
        type: 'int',
        depth: 1
      },
      {
        key: 'position_state.rtk_number',
        name: 'RTK 搜星数量',
        type: 'int',
        depth: 1
      }
    ]
  },
  {
    key: 'storage',
    name: '存储容量',
    type: 'struct',
    depth: 0,
    children: [
      {
        key: 'storage.total',
        name: '总容量',
        type: 'int',
        depth: 1
      },
      {
        key: 'storage.used',
        name: '已使用容量',
        type: 'int',
        depth: 1
      }
    ]
  },
  {
    key: 'battery',
    name: '飞行器电池信息',
    type: 'struct',
    depth: 0,
    children: [
      {
        key: 'battery.capacity_percent',
        name: '电池的总剩余电量',
        type: 'int',
        depth: 1
      },
      {
        key: 'battery.remain_flight_time',
        name: '剩余飞行时间',
        type: 'int',
        depth: 1
      },
      {
        key: 'battery.return_home_power',
        name: '返航所需电量百分比',
        type: 'int',
        depth: 1
      },
      {
        key: 'battery.landing_power',
        name: '强制降落电量百分比',
        type: 'int',
        depth: 1
      },
      {
        key: 'battery.batteries',
        name: '电池详细信息',
        type: 'array',
        depth: 1,
        children: [
          {
            key: 'battery.batteries.capacity_percent',
            name: '电池剩余电量',
            type: 'int',
            depth: 2
          },
          {
            key: 'battery.batteries.index',
            name: '电池序号',
            type: 'int',
            depth: 2
          },
          {
            key: 'battery.batteries.sn',
            name: '电池序列号（SN）',
            type: 'text',
            depth: 2
          },
          {
            key: 'battery.batteries.type',
            name: '电池类型',
            type: 'enum_int',
            depth: 2
          },
          {
            key: 'battery.batteries.sub_type',
            name: '电池子类型',
            type: 'enum_int',
            depth: 2
          },
          {
            key: 'battery.batteries.firmware_version',
            name: '固件版本',
            type: 'text',
            depth: 2
          },
          {
            key: 'battery.batteries.loop_times',
            name: '电池循环次数',
            type: 'int',
            depth: 2
          },
          {
            key: 'battery.batteries.voltage',
            name: '电压',
            type: 'int',
            depth: 2
          },
          {
            key: 'battery.batteries.temperature',
            name: '温度',
            type: 'float',
            depth: 2
          },
          {
            key: 'battery.batteries.high_voltage_storage_days',
            name: '高电压存储天数',
            type: 'int',
            depth: 2
          }
        ]
      }
    ]
  },
  {
    key: 'total_flight_distance',
    name: '飞行器累计飞行总里程',
    type: 'float',
    depth: 0
  },
  {
    key: 'total_flight_time',
    name: '飞行器累计飞行航时',
    type: 'float',
    depth: 0
  },
  {
    key: 'serious_low_battery_warning_threshold',
    name: '严重低电量告警',
    type: 'int',
    depth: 0
  },
  {
    key: 'low_battery_warning_threshold',
    name: '低电量告警',
    type: 'int',
    depth: 0
  },
  {
    key: 'control_source',
    name: '当前控制源',
    type: 'text',
    depth: 0
  },
  {
    key: 'wind_direction',
    name: '当前风向',
    type: 'enum_int',
    depth: 0
  },
  {
    key: 'wind_speed',
    name: '风速',
    type: 'float',
    depth: 0
  },
  {
    key: 'home_distance',
    name: '距离 Home 点的距离',
    type: 'float',
    depth: 0
  },
  {
    key: 'home_latitude',
    name: 'Home 点纬度',
    type: 'double',
    depth: 0
  },
  {
    key: 'home_longitude',
    name: 'Home 点经度',
    type: 'double',
    depth: 0
  },
  {
    key: 'attitude_head',
    name: '偏航轴角度',
    type: 'int',
    depth: 0
  },
  {
    key: 'attitude_roll',
    name: '横滚轴角度',
    type: 'float',
    depth: 0
  },
  {
    key: 'attitude_pitch',
    name: '俯仰轴角度',
    type: 'float',
    depth: 0
  },
  {
    key: 'elevation',
    name: '相对起飞点高度',
    type: 'float',
    depth: 0
  },
  {
    key: 'height',
    name: '绝对高度',
    type: 'double',
    depth: 0
  },
  {
    key: 'latitude',
    name: '当前位置纬度',
    type: 'double',
    depth: 0
  },
  {
    key: 'longitude',
    name: '当前位置经度',
    type: 'double',
    depth: 0
  },
  {
    key: 'vertical_speed',
    name: '垂直速度',
    type: 'float',
    depth: 0
  },
  {
    key: 'horizontal_speed',
    name: '水平速度',
    type: 'float',
    depth: 0
  },
  {
    key: 'firmware_upgrade_status',
    name: '固件升级状态',
    type: 'enum_int',
    depth: 0
  },
  {
    key: 'compatible_status',
    name: '固件一致性',
    type: 'enum_int',
    depth: 0
  },
  {
    key: 'firmware_version',
    name: '固件版本',
    type: 'text',
    depth: 0
  },
  {
    key: 'gear',
    name: '档位',
    type: 'enum_int',
    depth: 0
  },
  {
    key: 'mode_code_reason',
    name: '飞行器进入当前状态的原因',
    type: 'enum_int',
    depth: 0
  },
  {
    key: 'commander_flight_height',
    name: '指点飞行高度',
    type: 'float',
    depth: 0
  },
  {
    key: 'commander_flight_mode',
    name: '指点飞行模式设置值',
    type: 'enum_int',
    depth: 0
  },
  {
    key: 'commander_mode_lost_action',
    name: '指点飞行失控动作',
    type: 'enum_int',
    depth: 0
  },
  {
    key: 'camera_watermark_settings',
    name: '相机水印设置',
    type: 'struct',
    depth: 0,
    children: [
      {
        key: 'camera_watermark_settings.global_enable',
        name: '水印显示全局开关',
        type: 'enum_int',
        depth: 1
      },
      {
        key: 'camera_watermark_settings.drone_type_enable',
        name: '机型显示开关',
        type: 'enum_int',
        depth: 1
      },
      {
        key: 'camera_watermark_settings.drone_sn_enable',
        name: '飞行器序列号显示开关',
        type: 'enum_int',
        depth: 1
      },
      {
        key: 'camera_watermark_settings.datetime_enable',
        name: '日期时间显示开关',
        type: 'enum_int',
        depth: 1
      },
      {
        key: 'camera_watermark_settings.gps_enable',
        name: '经纬度&海拔高显示开关',
        type: 'enum_int',
        depth: 1
      },
      {
        key: 'camera_watermark_settings.user_custom_string_enable',
        name: '自定义文案显示开关',
        type: 'enum_int',
        depth: 1
      },
      {
        key: 'camera_watermark_settings.user_custom_string',
        name: '自定义文案内容',
        type: 'text',
        depth: 1
      },
      {
        key: 'camera_watermark_settings.layout',
        name: '水印在画面中位置',
        type: 'enum_int',
        depth: 1
      }
    ]
  },
  {
    key: 'mode_code',
    name: '飞行器状态',
    type: 'enum_int',
    depth: 0
  },
  {
    key: 'distance_limit_status',
    name: '飞行器限远状态',
    type: 'struct',
    depth: 0,
    children: [
      {
        key: 'distance_limit_status.state',
        name: '是否开启限远',
        type: 'enum_int',
        depth: 1
      },
      {
        key: 'distance_limit_status.distance_limit',
        name: '限远距离',
        type: 'int',
        depth: 1
      },
      {
        key: 'distance_limit_status.is_near_distance_limit',
        name: '是否接近设定的限制距离',
        type: 'enum_int',
        depth: 1
      }
    ]
  },
  {
    key: 'rth_altitude',
    name: '返航高度',
    type: 'int',
    depth: 0
  },
  {
    key: 'psdk_ui_resource',
    name: 'psdk ui 资源包',
    type: 'array',
    depth: 0,
    children: [
      {
        key: 'psdk_ui_resource.psdk_index',
        name: 'psdk 负载设备索引',
        type: 'int',
        depth: 1
      },
      {
        key: 'psdk_ui_resource.psdk_ready',
        name: 'psdk 就绪状态',
        type: 'enum_int',
        depth: 1
      },
      {
        key: 'psdk_ui_resource.object_key',
        name: 'oss 对象',
        type: 'text',
        depth: 1
      }
    ]
  },
  {
    key: 'psdk_widget_values',
    name: 'psdk 负载设备属性值',
    type: 'array',
    depth: 0,
    children: [
      {
        key: 'psdk_widget_values.psdk_index',
        name: 'psdk 负载设备索引',
        type: 'int',
        depth: 1
      },
      {
        key: 'psdk_widget_values.psdk_name',
        name: '设备名称',
        type: 'text',
        depth: 1
      },
      {
        key: 'psdk_widget_values.psdk_sn',
        name: '设备序号',
        type: 'text',
        depth: 1
      },
      {
        key: 'psdk_widget_values.psdk_version',
        name: '设备固件版本',
        type: 'text',
        depth: 1
      },
      {
        key: 'psdk_widget_values.psdk_lib_version',
        name: 'psdk lib 版本',
        type: 'text',
        depth: 1
      },
      {
        key: 'psdk_widget_values.speaker',
        name: '喊话器状态',
        type: 'struct',
        depth: 1,
        children: [
          {
            key: 'psdk_widget_values.speaker.work_mode',
            name: '喊话器工作模式',
            type: 'enum_int',
            depth: 2
          },
          {
            key: 'psdk_widget_values.speaker.play_mode',
            name: '喊话器播放模式',
            type: 'enum_int',
            depth: 2
          },
          {
            key: 'psdk_widget_values.speaker.play_volume',
            name: '喊话器音量',
            type: 'int',
            depth: 2
          },
          {
            key: 'psdk_widget_values.speaker.system_state',
            name: '喊话器状态',
            type: 'enum_int',
            depth: 2
          },
          {
            key: 'psdk_widget_values.speaker.play_file_name',
            name: '喊话器最近一次播放的文件名称',
            type: 'text',
            depth: 2
          },
          {
            key: 'psdk_widget_values.speaker.play_file_md5',
            name: '喊话器最近一次播放的文件md5校验和',
            type: 'text',
            depth: 2
          }
        ]
      },
      {
        key: 'psdk_widget_values.values',
        name: 'psdk 控件值列表',
        type: 'array',
        depth: 1,
        children: [
          {
            key: 'psdk_widget_values.values.index',
            name: '控件编号',
            type: 'int',
            depth: 2
          },
          {
            key: 'psdk_widget_values.values.value',
            name: '控件值',
            type: 'int',
            depth: 2
          }
        ]
      }
    ]
  },
  {
    key: 'remaining_power_for_return_home',
    name: '返航预留电量',
    type: 'int',
    depth: 0
  }
]
export const airportFields = [
  {
    key: 'home_position_is_valid',
    name: 'home点有效性',
    type: 'enum_int',
    depth: 0
  },
  {
    key: 'heading',
    name: '机场朝向角',
    type: 'double',
    depth: 0
  },
  {
    key: 'rtcm_info',
    name: '机场RTK标定源',
    type: 'struct',
    depth: 0
  },
  {
    key: 'rtcm_info.mount_point',
    name: '网络RTK挂载点信息',
    type: 'text',
    depth: 1
  },
  {
    key: 'rtcm_info.port',
    name: '网络端口信息',
    type: 'text',
    depth: 1
  },
  {
    key: 'rtcm_info.host',
    name: '网络host信息',
    type: 'text',
    depth: 1
  },
  {
    key: 'rtcm_info.rtcm_device_type',
    name: '设备类型',
    type: 'enum_int',
    depth: 1
  },
  {
    key: 'rtcm_info.source_type',
    name: '标定类型',
    type: 'enum_int',
    depth: 1
  },
  {
    key: 'wireless_link_topo',
    name: '图传连接拓扑',
    type: 'struct',
    depth: 0
  },
  {
    key: 'wireless_link_topo.secret_code',
    name: '加密编码',
    type: 'array',
    depth: 1
  },
  {
    key: 'wireless_link_topo.center_node',
    name: '飞行器对频信息',
    type: 'struct',
    depth: 1
  },
  {
    key: 'wireless_link_topo.center_node.sdr_id',
    name: '扰码信息',
    type: 'int',
    depth: 2
  },
  {
    key: 'wireless_link_topo.center_node.sn',
    name: '设备sn',
    type: 'text',
    depth: 2
  },
  {
    key: 'wireless_link_topo.leaf_nodes',
    name: '机场或遥控器对频信息',
    type: 'array',
    depth: 1
  },
  {
    key: 'wireless_link_topo.leaf_nodes.sdr_id',
    name: '扰码信息',
    type: 'int',
    depth: 2
  },
  {
    key: 'wireless_link_topo.leaf_nodes.sn',
    name: '设备sn',
    type: 'text',
    depth: 2
  },
  {
    key: 'wireless_link_topo.leaf_nodes.control_source_index',
    name: '控制源序号',
    type: 'int',
    depth: 2
  },
  {
    key: 'air_conditioner',
    name: '机场空调工作状态信息',
    type: 'struct',
    depth: 0
  },
  {
    key: 'air_conditioner.air_conditioner_state',
    name: '机场空调状态',
    type: 'enum_int',
    depth: 1
  },
  {
    key: 'air_conditioner.switch_time',
    name: '剩余等待可切换时间',
    type: 'int',
    depth: 1
  },
  {
    key: 'air_transfer_enable',
    name: '空中回传',
    type: 'bool',
    depth: 0
  },
  {
    key: 'silent_mode',
    name: '机场静音模式',
    type: 'enum_int',
    depth: 0
  },
  {
    key: 'user_experience_improvement',
    name: '用户体验改善计划',
    type: 'enum_int',
    depth: 0
  },
  {
    key: 'dongle_infos',
    name: '4G Dongle信息',
    type: 'array',
    depth: 0
  },
  {
    key: 'dongle_infos.imei',
    name: 'dongle imei',
    type: 'text',
    depth: 1
  },
  {
    key: 'dongle_infos.dongle_type',
    name: 'Dongle 类型',
    type: 'enum_int',
    depth: 1
  },
  {
    key: 'dongle_infos.eid',
    name: 'dongle eid',
    type: 'text',
    depth: 1
  },
  {
    key: 'dongle_infos.esim_activate_state',
    name: 'eSIM 激活状态',
    type: 'enum_int',
    depth: 1
  },
  {
    key: 'dongle_infos.sim_card_state',
    name: 'SIM 卡状态',
    type: 'enum_int',
    depth: 1
  },
  {
    key: 'dongle_infos.sim_slot',
    name: 'SIM 卡槽使能状态',
    type: 'enum_int',
    depth: 1
  },
  {
    key: 'dongle_infos.esim_infos',
    name: 'eSIM 信息',
    type: 'array',
    depth: 1
  },
  {
    key: 'dongle_infos.esim_infos.telecom_operator',
    name: '支持的运营商',
    type: 'enum_int',
    depth: 2
  },
  {
    key: 'dongle_infos.esim_infos.enabled',
    name: 'eSIM 使能状态',
    type: 'bool',
    depth: 2
  },
  {
    key: 'dongle_infos.esim_infos.iccid',
    name: 'sim iccid',
    type: 'text',
    depth: 2
  },
  {
    key: 'dongle_infos.sim_info',
    name: 'SIM 卡信息',
    type: 'struct',
    depth: 1
  },
  {
    key: 'dongle_infos.sim_info.telecom_operator',
    name: '支持的运营商',
    type: 'enum_int',
    depth: 2
  },
  {
    key: 'dongle_infos.sim_info.sim_type',
    name: 'SIM 卡类型',
    type: 'enum_int',
    depth: 2
  },
  {
    key: 'dongle_infos.sim_info.iccid',
    name: 'sim iccid',
    type: 'text',
    depth: 2
  },
  {
    key: 'drone_battery_maintenance_info',
    name: '飞行器电池保养信息',
    type: 'struct',
    depth: 0
  },
  {
    key: 'drone_battery_maintenance_info.maintenance_state',
    name: '保养状态',
    type: 'enum_int',
    depth: 1
  },
  {
    key: 'drone_battery_maintenance_info.maintenance_time_left',
    name: '电池保养剩余时间',
    type: 'int',
    depth: 1
  },
  {
    key: 'drone_battery_maintenance_info.heat_state',
    name: '电池加热保温状态',
    type: 'enum_int',
    depth: 1
  },
  {
    key: 'drone_battery_maintenance_info.batteries',
    name: '电池详细信息',
    type: 'array',
    depth: 1
  },
  {
    key: 'drone_battery_maintenance_info.batteries.capacity_percent',
    name: '电池剩余电量',
    type: 'int',
    depth: 2
  },
  {
    key: 'drone_battery_maintenance_info.batteries.index',
    name: '电池序号',
    type: 'enum_int',
    depth: 2
  },
  {
    key: 'drone_battery_maintenance_info.batteries.voltage',
    name: '电压',
    type: 'int',
    depth: 2
  },
  {
    key: 'drone_battery_maintenance_info.batteries.temperature',
    name: '温度',
    type: 'float',
    depth: 2
  },
  {
    key: 'maintain_status',
    name: '保养信息',
    type: 'struct',
    depth: 0
  },
  {
    key: 'maintain_status.maintain_status_array',
    name: '保养信息数组',
    type: 'array',
    depth: 1
  },
  {
    key: 'maintain_status.maintain_status_array.state',
    name: '保养状态',
    type: 'enum_int',
    depth: 2
  },
  {
    key: 'maintain_status.maintain_status_array.last_maintain_type',
    name: '上一次保养类型',
    type: 'enum_int',
    depth: 2
  },
  {
    key: 'maintain_status.maintain_status_array.last_maintain_time',
    name: '上一次保养时间',
    type: 'date',
    depth: 2
  },
  {
    key: 'maintain_status.maintain_status_array.last_maintain_work_sorties',
    name: '上一次保养时作业架次',
    type: 'int',
    depth: 2
  },
  {
    key: 'position_state',
    name: '搜星状态',
    type: 'struct',
    depth: 0
  },
  {
    key: 'position_state.is_calibration',
    name: '是否标定',
    type: 'enum_int',
    depth: 1
  },
  {
    key: 'position_state.is_fixed',
    name: '是否收敛',
    type: 'enum_int',
    depth: 1
  },
  {
    key: 'position_state.quality',
    name: '搜星档位',
    type: 'enum_int',
    depth: 1
  },
  {
    key: 'position_state.gps_number',
    name: 'GPS 搜星数量',
    type: 'int',
    depth: 1
  },
  {
    key: 'position_state.rtk_number',
    name: 'RTK 搜星数量',
    type: 'int',
    depth: 1
  },
  {
    key: 'emergency_stop_state',
    name: '紧急停止按钮状态',
    type: 'enum_int',
    depth: 0
  },
  {
    key: 'drone_charge_state',
    name: '飞行器充电状态',
    type: 'struct',
    depth: 0
  },
  {
    key: 'drone_charge_state.capacity_percent',
    name: '电量百分比',
    type: 'int',
    depth: 1
  },
  {
    key: 'drone_charge_state.state',
    name: '充电状态',
    type: 'enum_int',
    depth: 1
  },
  {
    key: 'backup_battery',
    name: '机场备用电池信息',
    type: 'struct',
    depth: 0
  },
  {
    key: 'backup_battery.switch',
    name: '备用电池开关',
    type: 'enum_int',
    depth: 1
  },
  {
    key: 'backup_battery.voltage',
    name: '备用电池电压',
    type: 'int',
    depth: 1
  },
  {
    key: 'backup_battery.temperature',
    name: '备用电池温度',
    type: 'float',
    depth: 1
  },
  {
    key: 'alarm_state',
    name: '机场声光报警状态',
    type: 'enum_int',
    depth: 0
  },
  {
    key: 'battery_store_mode',
    name: '电池运行模式',
    type: 'enum_int',
    depth: 0
  },
  {
    key: 'activation_time',
    name: '机场激活时间(unix 时间戳)',
    type: 'int',
    depth: 0
  },
  {
    key: 'height',
    name: '椭球高度',
    type: 'double',
    depth: 0
  },
  {
    key: 'alternate_land_point',
    name: '备降点',
    type: 'struct',
    depth: 0
  },
  {
    key: 'alternate_land_point.longitude',
    name: '经度',
    type: 'float',
    depth: 1
  },
  {
    key: 'alternate_land_point.latitude',
    name: '纬度',
    type: 'float',
    depth: 1
  },
  {
    key: 'alternate_land_point.safe_land_height',
    name: '安全高度(备降转移高)',
    type: 'float',
    depth: 1
  },
  {
    key: 'alternate_land_point.is_configured',
    name: '是否设置备降点',
    type: 'enum_int',
    depth: 1
  },
  {
    key: 'alternate_land_point.height',
    name: '椭球高度',
    type: 'float',
    depth: 1
  },
  {
    key: 'compatible_status',
    name: '固件一致性',
    type: 'enum_int',
    depth: 0
  },
  {
    key: 'acc_time',
    name: '机场累计运行时长',
    type: 'int',
    depth: 0
  },
  {
    key: 'first_power_on',
    name: '首次上电时间',
    type: 'int',
    depth: 0
  },
  {
    key: 'storage',
    name: '存储容量',
    type: 'struct',
    depth: 0
  },
  {
    key: 'storage.total',
    name: '总容量',
    type: 'int',
    depth: 1
  },
  {
    key: 'storage.used',
    name: '已使用容量',
    type: 'int',
    depth: 1
  },
  {
    key: 'working_current',
    name: '工作电流',
    type: 'float',
    depth: 0
  },
  {
    key: 'working_voltage',
    name: '工作电压',
    type: 'int',
    depth: 0
  },
  {
    key: 'humidity',
    name: '舱内湿度',
    type: 'float',
    depth: 0
  },
  {
    key: 'temperature',
    name: '舱内温度',
    type: 'float',
    depth: 0
  },
  {
    key: 'environment_temperature',
    name: '环境温度',
    type: 'float',
    depth: 0
  },
  {
    key: 'wind_speed',
    name: '风速',
    type: 'float',
    depth: 0
  },
  {
    key: 'rainfall',
    name: '降雨量',
    type: 'enum_int',
    depth: 0
  },
  {
    key: 'live_capacity',
    name: '网关设备直播能力',
    type: 'struct',
    depth: 0
  },
  {
    key: 'live_capacity.available_video_number',
    name: '可选择推流的码流数量',
    type: 'int',
    depth: 1
  },
  {
    key: 'live_capacity.coexist_video_number_max',
    name: '可同时推流的最大码流数量',
    type: 'int',
    depth: 1
  },
  {
    key: 'live_capacity.device_list',
    name: '可选择的视频设备源',
    type: 'array',
    depth: 1
  },
  {
    key: 'live_capacity.device_list.sn',
    name: '飞行器等视频源设备序列号（SN）',
    type: 'text',
    depth: 2
  },
  {
    key: 'live_capacity.device_list.available_video_number',
    name: '该序列号设备可以被选择推流的码流数',
    type: 'int',
    depth: 2
  },
  {
    key: 'live_capacity.device_list.coexist_video_number_max',
    name: '该序列号设备可以同时被推流的码流数',
    type: 'int',
    depth: 2
  },
  {
    key: 'live_capacity.device_list.camera_list',
    name: '该序列号设备上的相机列表',
    type: 'array',
    depth: 2
  },
  {
    key: 'live_capacity.device_list.camera_list.camera_index',
    name: '相机索引',
    type: 'text',
    depth: 3
  },
  {
    key: 'live_capacity.device_list.camera_list.available_video_number',
    name: '该相机级别的视频源可以被选择推流的码流数',
    type: 'int',
    depth: 3
  },
  {
    key: 'live_capacity.device_list.camera_list.coexist_video_number_max',
    name: '该相机级别的视频源可以同时被推流的码流数',
    type: 'int',
    depth: 3
  },
  {
    key: 'live_capacity.device_list.camera_list.video_list',
    name: '该相机级别的视频源可以选择的码流列表',
    type: 'array',
    depth: 3
  },
  {
    key: 'live_capacity.device_list.camera_list.video_list.video_index',
    name: '该相机级别的视频源可以选择的码流索引',
    type: 'text',
    depth: 4
  },
  {
    key: 'live_capacity.device_list.camera_list.video_list.video_type',
    name: '该相机级别的视频源可以选择的码流类型',
    type: 'text',
    depth: 4
  },
  {
    key: 'live_capacity.device_list.camera_list.video_list.switchable_video_types',
    name: '该视频流支持切换的视频镜头类型',
    type: 'array',
    depth: 4
  },
  {
    key: 'live_status',
    name: '网关当前整体直播状态推送',
    type: 'array',
    depth: 0
  },
  {
    key: 'live_status.video_id',
    name: '直播码流标识符',
    type: 'text',
    depth: 1
  },
  {
    key: 'live_status.video_type',
    name: '视频类型',
    type: 'text',
    depth: 1
  },
  {
    key: 'live_status.video_quality',
    name: '直播码流的质量',
    type: 'enum_int',
    depth: 1
  },
  {
    key: 'live_status.status',
    name: '直播状态',
    type: 'enum_int',
    depth: 1
  },
  {
    key: 'live_status.error_status',
    name: '错误码',
    type: 'int',
    depth: 1
  },
  {
    key: 'wireless_link',
    name: '图传链路',
    type: 'struct',
    depth: 0
  },
  {
    key: 'wireless_link.dongle_number',
    name: '飞行器上 Dongle 数量',
    type: 'int',
    depth: 1
  },
  {
    key: 'wireless_link.4g_link_state',
    name: '4G 链路连接状态',
    type: 'enum_int',
    depth: 1
  },
  {
    key: 'wireless_link.sdr_link_state',
    name: 'SDR 链路连接状态',
    type: 'enum_int',
    depth: 1
  },
  {
    key: 'wireless_link.link_workmode',
    name: '机场的图传链路模式',
    type: 'enum_int',
    depth: 1
  },
  {
    key: 'wireless_link.sdr_quality',
    name: 'SDR 信号质量',
    type: 'int',
    depth: 1
  },
  {
    key: 'wireless_link.4g_quality',
    name: '总体 4G 信号质量',
    type: 'int',
    depth: 1
  },
  {
    key: 'wireless_link.4g_uav_quality',
    name: '天端 4G 信号质量',
    type: 'int',
    depth: 1
  },
  {
    key: 'wireless_link.4g_gnd_quality',
    name: '地端 4G 信号质量',
    type: 'int',
    depth: 1
  },
  {
    key: 'wireless_link.sdr_freq_band',
    name: 'SDR 频段',
    type: 'float',
    depth: 1
  },
  {
    key: 'wireless_link.4g_freq_band',
    name: '4G 频段',
    type: 'float',
    depth: 1
  },
  {
    key: 'media_file_detail',
    name: '媒体文件上传细节',
    type: 'struct',
    depth: 0
  },
  {
    key: 'media_file_detail.remain_upload',
    name: '待上传数量',
    type: 'int',
    depth: 1
  },
  {
    key: 'job_number',
    name: '机场累计作业次数',
    type: 'int',
    depth: 0
  },
  {
    key: 'drone_in_dock',
    name: '飞行器是否在舱',
    type: 'enum_int',
    depth: 0
  },
  {
    key: 'network_state',
    name: '网络状态',
    type: 'struct',
    depth: 0
  },
  {
    key: 'network_state.type',
    name: '网络类型',
    type: 'enum_int',
    depth: 1
  },
  {
    key: 'network_state.quality',
    name: '网络质量',
    type: 'enum_int',
    depth: 1
  },
  {
    key: 'network_state.rate',
    name: '网络速率',
    type: 'float',
    depth: 1
  },
  {
    key: 'supplement_light_state',
    name: '补光灯状态',
    type: 'enum_int',
    depth: 0
  },
  {
    key: 'cover_state',
    name: '舱盖状态',
    type: 'enum_int',
    depth: 0
  },
  {
    key: 'sub_device',
    name: '子设备状态',
    type: 'struct',
    depth: 0
  },
  {
    key: 'sub_device.device_sn',
    name: '子设备序列号（SN）',
    type: 'text',
    depth: 1
  },
  {
    key: 'sub_device.device_model_key',
    name: '子设备枚举值',
    type: 'text',
    depth: 1
  },
  {
    key: 'sub_device.device_online_status',
    name: '机场停机坪上的飞行器开机状态',
    type: 'enum_int',
    depth: 1
  },
  {
    key: 'sub_device.device_paired',
    name: '机场停机坪上的飞行器是否与机场对频',
    type: 'enum_int',
    depth: 1
  },
  {
    key: 'flighttask_step_code',
    name: '机场任务状态',
    type: 'enum_int',
    depth: 0
  },
  {
    key: 'mode_code',
    name: '机场状态',
    type: 'enum_int',
    depth: 0
  },
  {
    key: 'firmware_upgrade_status',
    name: '固件升级状态',
    type: 'enum_int',
    depth: 0
  },
  {
    key: 'firmware_version',
    name: '固件版本',
    type: 'text',
    depth: 0
  },
  {
    key: 'latitude',
    name: '纬度',
    type: 'double',
    depth: 0
  },
  {
    key: 'longitude',
    name: '经度',
    type: 'double',
    depth: 0
  },
  {
    key: 'drc_state',
    name: 'DRC 链路的状态',
    type: 'enum_int',
    depth: 0
  },
  {
    key: 'self_converge_coordinate',
    name: '自收敛坐标',
    type: 'struct',
    depth: 0
  },
  {
    key: 'self_converge_coordinate.latitude',
    name: '纬度',
    type: 'double',
    depth: 1
  },
  {
    key: 'self_converge_coordinate.longitude',
    name: '经度',
    type: 'double',
    depth: 1
  },
  {
    key: 'self_converge_coordinate.height',
    name: '椭球高度',
    type: 'double',
    depth: 1
  }
]
export const droneFields = [
  {
    key: 'best_link_gateway',
    name: '飞行器图传连接质量最好的网关SN',
    type: 'text',
    depth: 0
  },
  {
    key: 'wireless_link_topo',
    name: '图传连接拓扑',
    type: 'struct',
    depth: 0
  },
  {
    key: 'wireless_link_topo.secret_code',
    name: '加密编码',
    type: 'array',
    depth: 1
  },
  {
    key: 'wireless_link_topo.center_node',
    name: '飞行器对频信息',
    type: 'struct',
    depth: 1
  },
  {
    key: 'wireless_link_topo.center_node.sdr_id',
    name: '扰码信息',
    type: 'int',
    depth: 2
  },
  {
    key: 'wireless_link_topo.center_node.sn',
    name: '设备sn',
    type: 'text',
    depth: 2
  },
  {
    key: 'wireless_link_topo.leaf_nodes',
    name: '当前连接的机场或遥控器对频信息',
    type: 'array',
    depth: 1
  },
  {
    key: 'wireless_link_topo.leaf_nodes.sdr_id',
    name: '扰码信息',
    type: 'int',
    depth: 2
  },
  {
    key: 'wireless_link_topo.leaf_nodes.sn',
    name: '设备sn',
    type: 'text',
    depth: 2
  },
  {
    key: 'wireless_link_topo.leaf_nodes.control_source_index',
    name: '控制源序号',
    type: 'int',
    depth: 2
  },
  {
    key: 'cameras',
    name: '飞行器相机信息',
    type: 'array',
    depth: 0
  },
  {
    key: 'cameras.remain_photo_num',
    name: '剩余拍照张数',
    type: 'int',
    depth: 1
  },
  {
    key: 'cameras.remain_record_duration',
    name: '剩余录像时间',
    type: 'int',
    depth: 1
  },
  {
    key: 'cameras.record_time',
    name: '视频录制时长',
    type: 'int',
    depth: 1
  },
  {
    key: 'cameras.payload_index',
    name: '负载编号',
    type: 'text',
    depth: 1
  },
  {
    key: 'cameras.camera_mode',
    name: '相机模式',
    type: 'enum_int',
    depth: 1
  },
  {
    key: 'cameras.photo_state',
    name: '拍照状态',
    type: 'enum_int',
    depth: 1
  },
  {
    key: 'cameras.screen_split_enable',
    name: '分屏是否使能',
    type: 'bool',
    depth: 1
  },
  {
    key: 'cameras.recording_state',
    name: '录像状态',
    type: 'enum_int',
    depth: 1
  },
  {
    key: 'cameras.zoom_factor',
    name: '变焦倍数',
    type: 'float',
    depth: 1
  },
  {
    key: 'cameras.ir_zoom_factor',
    name: '红外变焦倍数',
    type: 'float',
    depth: 1
  },
  {
    key: 'cameras.liveview_world_region',
    name: '视场角（FOV）在 liveview 中的区域',
    type: 'struct',
    depth: 1
  },
  {
    key: 'cameras.liveview_world_region.left',
    name: '左上角的 x 轴起始点',
    type: 'float',
    depth: 2
  },
  {
    key: 'cameras.liveview_world_region.top',
    name: '左上角的 y 轴起始点',
    type: 'float',
    depth: 2
  },
  {
    key: 'cameras.liveview_world_region.right',
    name: '右下角的 x 轴起始点',
    type: 'float',
    depth: 2
  },
  {
    key: 'cameras.liveview_world_region.bottom',
    name: '右下角的 y 轴起始点',
    type: 'float',
    depth: 2
  },
  {
    key: 'cameras.photo_storage_settings',
    name: '照片存储设置集合',
    type: 'array',
    depth: 1
  },
  {
    key: 'cameras.video_storage_settings',
    name: '视频存储设置集合',
    type: 'array',
    depth: 1
  },
  {
    key: 'cameras.wide_exposure_mode',
    name: '广角镜头曝光模式',
    type: 'enum_int',
    depth: 1
  },
  {
    key: 'cameras.wide_iso',
    name: '广角镜头感光度',
    type: 'enum_int',
    depth: 1
  },
  {
    key: 'cameras.wide_shutter_speed',
    name: '广角镜头快门速度',
    type: 'enum_int',
    depth: 1
  },
  {
    key: 'cameras.wide_exposure_value',
    name: '广角镜头曝光值',
    type: 'enum_int',
    depth: 1
  },
  {
    key: 'cameras.zoom_exposure_mode',
    name: '变焦镜头曝光模式',
    type: 'enum_int',
    depth: 1
  },
  {
    key: 'cameras.zoom_iso',
    name: '变焦镜头感光度',
    type: 'enum_int',
    depth: 1
  },
  {
    key: 'cameras.zoom_shutter_speed',
    name: '变焦镜头快门速度',
    type: 'enum_int',
    depth: 1
  },
  {
    key: 'cameras.zoom_exposure_value',
    name: '变焦镜头曝光值',
    type: 'enum_int',
    depth: 1
  },
  {
    key: 'cameras.zoom_focus_mode',
    name: '变焦镜头对焦模式',
    type: 'enum_int',
    depth: 1
  },
  {
    key: 'cameras.zoom_focus_value',
    name: '变焦镜头对焦值',
    type: 'int',
    depth: 1
  },
  {
    key: 'cameras.zoom_max_focus_value',
    name: '变焦镜头最大对焦值',
    type: 'int',
    depth: 1
  },
  {
    key: 'cameras.zoom_min_focus_value',
    name: '变焦镜头最小对焦值',
    type: 'int',
    depth: 1
  },
  {
    key: 'cameras.zoom_calibrate_farthest_focus_value',
    name: '变焦镜头标定的最远对焦值',
    type: 'int',
    depth: 1
  },
  {
    key: 'cameras.zoom_calibrate_nearest_focus_value',
    name: '变焦镜头标定的最近对焦值',
    type: 'int',
    depth: 1
  },
  {
    key: 'cameras.zoom_focus_state',
    name: '变焦镜头对焦状态',
    type: 'enum_int',
    depth: 1
  },
  {
    key: 'cameras.ir_metering_mode',
    name: '红外测温模式',
    type: 'enum_int',
    depth: 1
  },
  {
    key: 'cameras.ir_metering_point',
    name: '红外测温点',
    type: 'struct',
    depth: 1
  },
  {
    key: 'cameras.ir_metering_point.x',
    name: '测温点坐标 x',
    type: 'double',
    depth: 2
  },
  {
    key: 'cameras.ir_metering_point.y',
    name: '测温点坐标 y',
    type: 'double',
    depth: 2
  },
  {
    key: 'cameras.ir_metering_point.temperature',
    name: '测温点的温度',
    type: 'double',
    depth: 2
  },
  {
    key: 'cameras.ir_metering_area',
    name: '红外测温区域',
    type: 'struct',
    depth: 1
  },
  {
    key: 'cameras.ir_metering_area.x',
    name: '测温区域左上角点坐标 x',
    type: 'double',
    depth: 2
  },
  {
    key: 'cameras.ir_metering_area.y',
    name: '测温区域左上角点坐标 y',
    type: 'double',
    depth: 2
  },
  {
    key: 'cameras.ir_metering_area.width',
    name: '测温区域宽度',
    type: 'double',
    depth: 2
  },
  {
    key: 'cameras.ir_metering_area.height',
    name: '测温区域高度',
    type: 'double',
    depth: 2
  },
  {
    key: 'cameras.ir_metering_area.aver_temperature',
    name: '测温区域平均温度',
    type: 'double',
    depth: 2
  },
  {
    key: 'cameras.ir_metering_area.min_temperature_point',
    name: '测温区域最低温度点',
    type: 'struct',
    depth: 2
  },
  {
    key: 'cameras.ir_metering_area.min_temperature_point.x',
    name: '最低温度点坐标 x',
    type: 'double',
    depth: 3
  },
  {
    key: 'cameras.ir_metering_area.min_temperature_point.y',
    name: '最低温度点坐标 y',
    type: 'double',
    depth: 3
  },
  {
    key: 'cameras.ir_metering_area.min_temperature_point.temperature',
    name: '最低温度点的温度',
    type: 'double',
    depth: 3
  },
  {
    key: 'cameras.ir_metering_area.max_temperature_point',
    name: '测温区域最高温度点',
    type: 'struct',
    depth: 2
  },
  {
    key: 'cameras.ir_metering_area.max_temperature_point.x',
    name: '最高温度点坐标 x',
    type: 'double',
    depth: 3
  },
  {
    key: 'cameras.ir_metering_area.max_temperature_point.y',
    name: '最高温度点坐标 y',
    type: 'double',
    depth: 3
  },
  {
    key: 'cameras.ir_metering_area.max_temperature_point.temperature',
    name: '最高温度点的温度',
    type: 'double',
    depth: 3
  },
  {
    key: 'flysafe_database_version',
    name: '飞行安全数据库版本',
    type: 'text',
    depth: 0
  },
  {
    key: 'offline_map_enable',
    name: '离线地图开关',
    type: 'bool',
    depth: 0
  },
  {
    key: 'dongle_infos',
    name: '4G Dongle信息',
    type: 'array',
    depth: 0
  },
  {
    key: 'dongle_infos.imei',
    name: 'dongle imei',
    type: 'text',
    depth: 1
  },
  {
    key: 'dongle_infos.dongle_type',
    name: 'Dongle 类型',
    type: 'enum_int',
    depth: 1
  },
  {
    key: 'dongle_infos.eid',
    name: 'dongle eid',
    type: 'text',
    depth: 1
  },
  {
    key: 'dongle_infos.esim_activate_state',
    name: 'eSIM 激活状态',
    type: 'enum_int',
    depth: 1
  },
  {
    key: 'dongle_infos.sim_card_state',
    name: 'SIM 卡状态',
    type: 'enum_int',
    depth: 1
  },
  {
    key: 'dongle_infos.sim_slot',
    name: 'SIM 卡槽使能状态',
    type: 'enum_int',
    depth: 1
  },
  {
    key: 'dongle_infos.esim_infos',
    name: 'eSIM 信息',
    type: 'array',
    depth: 1
  },
  {
    key: 'dongle_infos.esim_infos.telecom_operator',
    name: '支持的运营商',
    type: 'enum_int',
    depth: 2
  },
  {
    key: 'dongle_infos.esim_infos.enabled',
    name: 'eSIM 使能状态',
    type: 'bool',
    depth: 2
  },
  {
    key: 'dongle_infos.esim_infos.iccid',
    name: 'sim iccid',
    type: 'text',
    depth: 2
  },
  {
    key: 'dongle_infos.sim_info',
    name: 'SIM 卡信息',
    type: 'struct',
    depth: 1
  },
  {
    key: 'dongle_infos.sim_info.telecom_operator',
    name: '支持的运营商',
    type: 'enum_int',
    depth: 2
  },
  {
    key: 'dongle_infos.sim_info.sim_type',
    name: 'SIM 卡类型',
    type: 'enum_int',
    depth: 2
  },
  {
    key: 'dongle_infos.sim_info.iccid',
    name: 'sim iccid',
    type: 'text',
    depth: 2
  },
  {
    key: 'current_rth_mode',
    name: '返航高度模式当前值',
    type: 'enum_int',
    depth: 0
  },
  {
    key: 'rth_mode',
    name: '返航高度模式设置值',
    type: 'enum_int',
    depth: 0
  },
  {
    key: 'obstacle_avoidance',
    name: '飞行器避障状态',
    type: 'struct',
    depth: 0
  },
  {
    key: 'obstacle_avoidance.horizon',
    name: '水平避障状态',
    type: 'enum_int',
    depth: 1
  },
  {
    key: 'obstacle_avoidance.upside',
    name: '上视避障状态',
    type: 'enum_int',
    depth: 1
  },
  {
    key: 'obstacle_avoidance.downside',
    name: '下视避障状态',
    type: 'enum_int',
    depth: 1
  },
  {
    key: 'is_near_area_limit',
    name: '是否接近限飞区',
    type: 'enum_int',
    depth: 0
  },
  {
    key: 'is_near_height_limit',
    name: '是否接近设定的限制高度',
    type: 'enum_int',
    depth: 0
  },
  {
    key: 'height_limit',
    name: '飞行器限高',
    type: 'int',
    depth: 0
  },
  {
    key: 'night_lights_state',
    name: '飞行器夜航灯状态',
    type: 'enum_int',
    depth: 0
  },
  {
    key: 'activation_time',
    name: '飞行器激活时间(unix 时间戳)',
    type: 'int',
    depth: 0
  },
  {
    key: 'maintain_status',
    name: '保养信息',
    type: 'struct',
    depth: 0
  },
  {
    key: 'maintain_status.maintain_status_array',
    name: '保养信息数组',
    type: 'array',
    depth: 1
  },
  {
    key: 'maintain_status.maintain_status_array.state',
    name: '保养状态',
    type: 'enum_int',
    depth: 2
  },
  {
    key: 'maintain_status.maintain_status_array.last_maintain_type',
    name: '上一次保养类型',
    type: 'enum_int',
    depth: 2
  },
  {
    key: 'maintain_status.maintain_status_array.last_maintain_time',
    name: '上一次保养时间',
    type: 'date',
    depth: 2
  },
  {
    key: 'maintain_status.maintain_status_array.last_maintain_flight_time',
    name: '上一次保养时飞行航时',
    type: 'int',
    depth: 2
  },
  {
    key: 'maintain_status.maintain_status_array.last_maintain_flight_sorties',
    name: '上一次保养时飞行架次',
    type: 'int',
    depth: 2
  },
  {
    key: 'total_flight_sorties',
    name: '飞行器累计飞行总架次',
    type: 'int',
    depth: 0
  },
  {
    key: 'type_subtype_gimbalindex',
    name: '负载编号',
    type: 'struct',
    depth: 0
  },
  {
    key: 'type_subtype_gimbalindex.gimbal_pitch',
    name: '云台俯仰轴角度',
    type: 'double',
    depth: 1
  },
  {
    key: 'type_subtype_gimbalindex.gimbal_roll',
    name: '云台横滚轴角度',
    type: 'double',
    depth: 1
  },
  {
    key: 'type_subtype_gimbalindex.gimbal_yaw',
    name: '云台偏航轴角度',
    type: 'double',
    depth: 1
  },
  {
    key: 'type_subtype_gimbalindex.measure_target_longitude',
    name: '激光测距目标经度',
    type: 'double',
    depth: 1
  },
  {
    key: 'type_subtype_gimbalindex.measure_target_latitude',
    name: '激光测距目标纬度',
    type: 'double',
    depth: 1
  },
  {
    key: 'type_subtype_gimbalindex.measure_target_altitude',
    name: '激光测距目标海拔',
    type: 'double',
    depth: 1
  },
  {
    key: 'type_subtype_gimbalindex.measure_target_distance',
    name: '激光测距距离',
    type: 'double',
    depth: 1
  },
  {
    key: 'type_subtype_gimbalindex.measure_target_error_state',
    name: '激光测距状态',
    type: 'enum_int',
    depth: 1
  },
  {
    key: 'type_subtype_gimbalindex.payload_index',
    name: '负载索引，格式为 {type-subtype-gimbalindex}',
    type: 'text',
    depth: 1
  },
  {
    key: 'type_subtype_gimbalindex.zoom_factor',
    name: '变焦倍数',
    type: 'double',
    depth: 1
  },
  {
    key: 'type_subtype_gimbalindex.thermal_current_palette_style',
    name: '调色盘样式',
    type: 'enum_int',
    depth: 1
  },
  {
    key: 'type_subtype_gimbalindex.thermal_supported_palette_styles',
    name: '设备支持的调色盘样式集合',
    type: 'array',
    depth: 1
  },
  {
    key: 'type_subtype_gimbalindex.thermal_gain_mode',
    name: '增益模式',
    type: 'enum_int',
    depth: 1
  },
  {
    key: 'type_subtype_gimbalindex.thermal_isotherm_state',
    name: '是否开启等温线',
    type: 'enum_int',
    depth: 1
  },
  {
    key: 'type_subtype_gimbalindex.thermal_isotherm_upper_limit',
    name: '测温区间上限',
    type: 'int',
    depth: 1
  },
  {
    key: 'type_subtype_gimbalindex.thermal_isotherm_lower_limit',
    name: '测温区间下限',
    type: 'int',
    depth: 1
  },
  {
    key: 'type_subtype_gimbalindex.thermal_global_temperature_min',
    name: '全局画面中测量的最低温度',
    type: 'float',
    depth: 1
  },
  {
    key: 'type_subtype_gimbalindex.thermal_global_temperature_max',
    name: '全局画面中测量的最高温度',
    type: 'float',
    depth: 1
  },
  {
    key: 'track_id',
    name: '航迹 ID',
    type: 'text',
    depth: 0
  },
  {
    key: 'position_state',
    name: '搜星状态',
    type: 'struct',
    depth: 0
  },
  {
    key: 'position_state.is_fixed',
    name: '是否收敛',
    type: 'enum_int',
    depth: 1
  },
  {
    key: 'position_state.quality',
    name: '搜星档位',
    type: 'enum_int',
    depth: 1
  },
  {
    key: 'position_state.gps_number',
    name: 'GPS 搜星数量',
    type: 'int',
    depth: 1
  },
  {
    key: 'position_state.rtk_number',
    name: 'RTK 搜星数量',
    type: 'int',
    depth: 1
  },
  {
    key: 'storage',
    name: '存储容量',
    type: 'struct',
    depth: 0
  },
  {
    key: 'storage.total',
    name: '总容量',
    type: 'int',
    depth: 1
  },
  {
    key: 'storage.used',
    name: '已使用容量',
    type: 'int',
    depth: 1
  },
  {
    key: 'battery',
    name: '飞行器电池信息',
    type: 'struct',
    depth: 0
  },
  {
    key: 'battery.capacity_percent',
    name: '电池的总剩余电量',
    type: 'int',
    depth: 1
  },
  {
    key: 'battery.remain_flight_time',
    name: '剩余飞行时间',
    type: 'int',
    depth: 1
  },
  {
    key: 'battery.return_home_power',
    name: '返航所需电量百分比',
    type: 'int',
    depth: 1
  },
  {
    key: 'battery.landing_power',
    name: '强制降落电量百分比',
    type: 'int',
    depth: 1
  },
  {
    key: 'battery.batteries',
    name: '电池详细信息',
    type: 'array',
    depth: 1
  },
  {
    key: 'battery.batteries.capacity_percent',
    name: '电池剩余电量',
    type: 'int',
    depth: 2
  },
  {
    key: 'battery.batteries.index',
    name: '电池序号',
    type: 'int',
    depth: 2
  },
  {
    key: 'battery.batteries.sn',
    name: '电池序列号（SN）',
    type: 'text',
    depth: 2
  },
  {
    key: 'battery.batteries.type',
    name: '电池类型',
    type: 'enum_int',
    depth: 2
  },
  {
    key: 'battery.batteries.sub_type',
    name: '电池子类型',
    type: 'enum_int',
    depth: 2
  },
  {
    key: 'battery.batteries.firmware_version',
    name: '固件版本',
    type: 'text',
    depth: 2
  },
  {
    key: 'battery.batteries.loop_times',
    name: '电池循环次数',
    type: 'int',
    depth: 2
  },
  {
    key: 'battery.batteries.voltage',
    name: '电压',
    type: 'int',
    depth: 2
  },
  {
    key: 'battery.batteries.temperature',
    name: '温度',
    type: 'float',
    depth: 2
  },
  {
    key: 'battery.batteries.high_voltage_storage_days',
    name: '高电压存储天数',
    type: 'int',
    depth: 2
  },
  {
    key: 'total_flight_distance',
    name: '飞行器累计飞行总里程',
    type: 'float',
    depth: 0
  },
  {
    key: 'total_flight_time',
    name: '飞行器累计飞行航时',
    type: 'float',
    depth: 0
  },
  {
    key: 'serious_low_battery_warning_threshold',
    name: '严重低电量告警',
    type: 'int',
    depth: 0
  },
  {
    key: 'low_battery_warning_threshold',
    name: '低电量告警',
    type: 'int',
    depth: 0
  },
  {
    key: 'control_source',
    name: '当前控制源',
    type: 'text',
    depth: 0
  },
  {
    key: 'wind_direction',
    name: '当前风向',
    type: 'enum_int',
    depth: 0
  },
  {
    key: 'wind_speed',
    name: '风速',
    type: 'float',
    depth: 0
  },
  {
    key: 'home_distance',
    name: '距离 Home 点的距离',
    type: 'float',
    depth: 0
  },
  {
    key: 'home_latitude',
    name: 'Home 点纬度',
    type: 'double',
    depth: 0
  },
  {
    key: 'home_longitude',
    name: 'Home 点经度',
    type: 'double',
    depth: 0
  },
  {
    key: 'attitude_head',
    name: '偏航轴角度',
    type: 'int',
    depth: 0
  },
  {
    key: 'attitude_roll',
    name: '横滚轴角度',
    type: 'float',
    depth: 0
  },
  {
    key: 'attitude_pitch',
    name: '俯仰轴角度',
    type: 'float',
    depth: 0
  },
  {
    key: 'elevation',
    name: '相对起飞点高度',
    type: 'float',
    depth: 0
  },
  {
    key: 'height',
    name: '绝对高度',
    type: 'double',
    depth: 0
  },
  {
    key: 'latitude',
    name: '当前位置纬度',
    type: 'double',
    depth: 0
  },
  {
    key: 'longitude',
    name: '当前位置经度',
    type: 'double',
    depth: 0
  },
  {
    key: 'vertical_speed',
    name: '垂直速度',
    type: 'float',
    depth: 0
  },
  {
    key: 'horizontal_speed',
    name: '水平速度',
    type: 'float',
    depth: 0
  },
  {
    key: 'firmware_upgrade_status',
    name: '固件升级状态',
    type: 'enum_int',
    depth: 0
  },
  {
    key: 'compatible_status',
    name: '固件一致性',
    type: 'enum_int',
    depth: 0
  },
  {
    key: 'firmware_version',
    name: '固件版本',
    type: 'text',
    depth: 0
  },
  {
    key: 'gear',
    name: '档位',
    type: 'enum_int',
    depth: 0
  },
  {
    key: 'mode_code_reason',
    name: '飞行器进入当前状态的原因',
    type: 'enum_int',
    depth: 0
  },
  {
    key: 'commander_flight_height',
    name: '指点飞行高度',
    type: 'float',
    depth: 0
  },
  {
    key: 'commander_flight_mode',
    name: '指点飞行模式设置值',
    type: 'enum_int',
    depth: 0
  },
  {
    key: 'commander_mode_lost_action',
    name: '指点飞行失控动作',
    type: 'enum_int',
    depth: 0
  },
  {
    key: 'camera_watermark_settings',
    name: '相机水印设置',
    type: 'struct',
    depth: 0
  },
  {
    key: 'camera_watermark_settings.global_enable',
    name: '水印显示全局开关',
    type: 'enum_int',
    depth: 1
  },
  {
    key: 'camera_watermark_settings.drone_type_enable',
    name: '机型显示开关',
    type: 'enum_int',
    depth: 1
  },
  {
    key: 'camera_watermark_settings.drone_sn_enable',
    name: '飞行器序列号显示开关',
    type: 'enum_int',
    depth: 1
  },
  {
    key: 'camera_watermark_settings.datetime_enable',
    name: '日期时间显示开关',
    type: 'enum_int',
    depth: 1
  },
  {
    key: 'camera_watermark_settings.gps_enable',
    name: '经纬度&海拔高显示开关',
    type: 'enum_int',
    depth: 1
  },
  {
    key: 'camera_watermark_settings.user_custom_string_enable',
    name: '自定义文案显示开关',
    type: 'enum_int',
    depth: 1
  },
  {
    key: 'camera_watermark_settings.user_custom_string',
    name: '自定义文案内容',
    type: 'text',
    depth: 1
  },
  {
    key: 'camera_watermark_settings.layout',
    name: '水印在画面中位置',
    type: 'enum_int',
    depth: 1
  },
  {
    key: 'mode_code',
    name: '飞行器状态',
    type: 'enum_int',
    depth: 0
  },
  {
    key: 'distance_limit_status',
    name: '飞行器限远状态',
    type: 'struct',
    depth: 0
  },
  {
    key: 'distance_limit_status.state',
    name: '是否开启限远',
    type: 'enum_int',
    depth: 1
  },
  {
    key: 'distance_limit_status.distance_limit',
    name: '限远距离',
    type: 'int',
    depth: 1
  },
  {
    key: 'distance_limit_status.is_near_distance_limit',
    name: '是否接近设定的限制距离',
    type: 'enum_int',
    depth: 1
  },
  {
    key: 'rth_altitude',
    name: '返航高度',
    type: 'int',
    depth: 0
  },
  {
    key: 'psdk_ui_resource',
    name: 'psdk ui 资源包',
    type: 'array',
    depth: 0
  },
  {
    key: 'psdk_ui_resource.psdk_index',
    name: 'psdk 负载设备索引',
    type: 'int',
    depth: 1
  },
  {
    key: 'psdk_ui_resource.psdk_ready',
    name: 'psdk 就绪状态',
    type: 'enum_int',
    depth: 1
  },
  {
    key: 'psdk_ui_resource.object_key',
    name: 'oss 对象',
    type: 'text',
    depth: 1
  },
  {
    key: 'psdk_widget_values',
    name: 'psdk 负载设备属性值',
    type: 'array',
    depth: 0
  },
  {
    key: 'psdk_widget_values.psdk_index',
    name: 'psdk 负载设备索引',
    type: 'int',
    depth: 1
  },
  {
    key: 'psdk_widget_values.psdk_name',
    name: '设备名称',
    type: 'text',
    depth: 1
  },
  {
    key: 'psdk_widget_values.psdk_sn',
    name: '设备序号',
    type: 'text',
    depth: 1
  },
  {
    key: 'psdk_widget_values.psdk_version',
    name: '设备固件版本',
    type: 'text',
    depth: 1
  },
  {
    key: 'psdk_widget_values.psdk_lib_version',
    name: 'psdk lib 版本',
    type: 'text',
    depth: 1
  },
  {
    key: 'psdk_widget_values.speaker',
    name: '喊话器状态',
    type: 'struct',
    depth: 1
  },
  {
    key: 'psdk_widget_values.speaker.work_mode',
    name: '喊话器工作模式',
    type: 'enum_int',
    depth: 2
  },
  {
    key: 'psdk_widget_values.speaker.play_mode',
    name: '喊话器播放模式',
    type: 'enum_int',
    depth: 2
  },
  {
    key: 'psdk_widget_values.speaker.play_volume',
    name: '喊话器音量',
    type: 'int',
    depth: 2
  },
  {
    key: 'psdk_widget_values.speaker.system_state',
    name: '喊话器状态',
    type: 'enum_int',
    depth: 2
  },
  {
    key: 'psdk_widget_values.speaker.play_file_name',
    name: '喊话器最近一次播放的文件名称',
    type: 'text',
    depth: 2
  },
  {
    key: 'psdk_widget_values.speaker.play_file_md5',
    name: '喊话器最近一次播放的文件md5校验和',
    type: 'text',
    depth: 2
  },
  {
    key: 'psdk_widget_values.values',
    name: 'psdk 控件值列表',
    type: 'array',
    depth: 1
  },
  {
    key: 'psdk_widget_values.values.index',
    name: '控件编号',
    type: 'int',
    depth: 2
  },
  {
    key: 'psdk_widget_values.values.value',
    name: '控件值',
    type: 'int',
    depth: 2
  },
  {
    key: 'remaining_power_for_return_home',
    name: '返航预留电量',
    type: 'int',
    depth: 0
  }
]
