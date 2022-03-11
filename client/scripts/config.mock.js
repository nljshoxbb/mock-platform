/** 对于 openapi中的 type映射和替换，规则为 response schema.field.field.field....  */

const TaskType = `@pick(["keyword","keyword_audio"])`;
const CallType = `@pick(["ORIGIN","RELATE"])`;

const generateAsrList = (time = 500) => {
  const res = [];
  for (let i = 0; i <= 500; i = i + 5) {
    res.push({
      text: `${i}-${
        i + 5
      } 主叫句子银行主叫句子主叫句广场子主叫句子电影院主叫句子主叫句子主叫句子主叫句子主叫句子主叫句子主叫句子主叫句子`,
      begin_time: i,
      end_time: i + 5,
    });
  }
  return res;
};

module.exports = {
  'AlarmListTaskResponse.task_list|10': JSON.stringify({
    task_id: '@increment(1,20)',
    task_name: `任务名称@increment(20)`,
    user_id: '@string(20)',
    task_type: TaskType,
    keyword_list: ['热词1', '银行', '银行1'],
    audio_list: ['111111', '2222'],
    start_time: 1641797338000,
    end_time: 1641883738000,
    call_type: CallType,
    phone_list: ['15677172352'],
    case_list: ['111111', '222222'],
    area_list: ['310000', '440300', '410400'],
    cancel: true,
    task_status: `@pick(["after","before","start"])`,
  }),
  'AlarmListAlarmResponse.alarm_list|10': JSON.stringify({
    alarm_id: 'b&h2u@&A5QCsht44%RG*',
    phone_no: 'qbIPriF0GIY!]r7NmkVZ',
    task_type: TaskType,
    keyword: [11, 22, 33],
    call_type: CallType,
    case_no: 'i^6v(FZ9MMTIDx&xr5w6',
    case_name: 'eNI4Mxqj5PA37fENrnyq',
    phone_city: 'sNIt0yrlFqkKDr4ZW^si',
    call_time: '7u7*Czt9NM2VR[d80j&c',
    alarm_time: 1641883738000,
  }),
  'CallRecordListCallRecordRsp.call_record_list|10': JSON.stringify({
    call_serial: 1111111,
    origin_info: {
      number: 1111111,
      attribution: '归属地归属地',
      gender: `@pick(["FEMALE","MALE","UNKNOWN"])`,
      language: `@pick(["FEMALE","MALE","UNKNOWN"])`,
      is_transferred: '@boolean',
    },
    relate_info: {
      number: 1111111,
      attribution: '归属地归属地',
      gender: `@pick(["FEMALE","MALE","UNKNOWN"])`,
      language: `@pick(["FEMALE","MALE","UNKNOWN"])`,
      is_transferred: '@boolean',
    },
    case_info: {
      case_no: 1111111,
      case_name: '案件名称',
      call_time: 1641883738000,
    },
    /** 辩听状态 */
    status: '@boolean',
  }),
  // 'CallRecordDetailCallRecordRsp.origin_info': JSON.stringify({
  //   number: '@string(20)',
  //   attribution: '广东,深圳,南山',
  //   gender: '男',
  //   language: '粤语',
  //   is_transferred: '@boolean',
  //   transfer_error: '@string(20)',
  //   file_id: '@string(20)',
  //   file_name: '@string(20)',
  //   dialogue_asr_list: generateAsrList(),
  //   translation_language: '普通话',
  //   'dialogue_translation_list|10': [
  //     {
  //       text: '@string(20)',
  //       begin_time: '@increment',
  //       end_time: '@increment',
  //     },
  //   ],
  //   entity_list: [
  //     {
  //       entity_id: '@string(20)',
  //       entity: `地名`,
  //       text: `@county`,
  //     },
  //     {
  //       entity_id: '@string(20)',
  //       entity: `人名`,
  //       text: `@cname`,
  //     },
  //     {
  //       entity_id: '@string(20)',
  //       entity: `人名`,
  //       text: `@cname`,
  //     },
  //     {
  //       entity_id: '@string(20)',
  //       entity: `人名`,
  //       text: `@cname`,
  //     },
  //   ],
  //   keyword_list: ['银行', '超市', '广场', '电影院'],
  // }),
  // 'CallRecordDetailCallRecordRsp.relate_info': JSON.stringify({
  //   number: '@string(20)',
  //   attribution: '广东,深圳,南山',
  //   gender: '男',
  //   language: '维语',
  //   is_transferred: '@boolean',
  //   transfer_error: '@string(20)',
  //   file_id: '@string(20)',
  //   file_name: '@string(20)',
  //   dialogue_asr_list: [
  //     {
  //       text: '0-5 主叫句子银行被叫句子被叫句广场子被叫句子电影院被叫句子被叫句子被叫句子被叫句子被叫句子被叫句子被叫句子被叫句子',
  //       begin_time: 0,
  //       end_time: 5,
  //     },
  //     {
  //       text: '6-10 被叫句子银行被叫句子被叫句广场子被叫句子电影院被叫句子被叫句子被叫句子被叫句子被叫句子被叫句子被叫句子被叫句子',
  //       begin_time: 6,
  //       end_time: 10,
  //     },
  //     {
  //       text: '11-15 被叫句子银行被叫句子被叫句广场子被叫句子电影院被叫句子被叫句子被叫句子被叫句子被叫句子被叫句子被叫句子被叫句子',
  //       begin_time: 11,
  //       end_time: 15,
  //     },
  //     {
  //       text: '16-20 被叫句子银行被叫句子被叫句广场子被叫句子电影院被叫句子被叫句子被叫句子被叫句子被叫句子被叫句子被叫句子被叫句子',
  //       begin_time: 16,
  //       end_time: 20,
  //     },
  //     {
  //       text: '21-30 被叫句子银行被叫句子被叫句广场子被叫句子电影院被叫句子被叫句子被叫句子被叫句子被叫句子被叫句子被叫句子被叫句子',
  //       begin_time: 21,
  //       end_time: 30,
  //     },
  //   ],
  //   translation_language: '普通话',
  //   'dialogue_translation_list|10': [
  //     {
  //       text: '@string(20)',
  //       begin_time: '@increment',
  //       end_time: '@increment',
  //     },
  //   ],
  //   entity_list: [
  //     {
  //       entity_id: '@string(20)',
  //       entity: `县级`,
  //       text: `@county`,
  //     },
  //     {
  //       entity_id: '@string(20)',
  //       entity: `市级`,
  //       text: `@city`,
  //     },
  //     {
  //       entity_id: '@string(20)',
  //       entity: `人名`,
  //       text: `@cname`,
  //     },
  //   ],
  //   keyword_list: ['银行', '超市', '广场', '电影院'],
  // }),
  'AlarmDetailAlarmResponse.case_remark': '@cparagraph()',
  'AlarmDetailAlarmResponse.alarm_remark': '@cparagraph()',
  'VoiceDetailVoiceRsp.relate_info': '{}',
  'UserLoginRsp.role_info': JSON.stringify({
    create_time: 1642406606550,
    permission_list: [
      'DataCenterAccessPermission',
      'SysCenterAccessPermission',
      'AlarmCenterAccessPermission',
      'AudioCenterAccessPermission',
      'ToolCenterAccessPermission',
    ],
    role_id: '61e522ceff5ed939d78a21a8',
    role_name: '超级管理员',
    super: true,
    update_time: 1642406606550,
  }),

  // 'AlarmDetailAlarmResponse.detail': JSON.stringify([
  //   {
  //     audio_type: '本地',
  //     audio_file_id: '@string(20)',
  //     file_name: '本地1',
  //     time_dura: [
  //       {
  //         Score: '90',
  //         Start: '0',
  //         End: '5',
  //       },
  //       {
  //         Score: '90',
  //         Start: '10',
  //         End: '15',
  //       },
  //     ],
  //     count: '4',
  //     keyword: '关键词1',
  //     language: '@string(20)',
  //     audio_case_no: '@string(20)',
  //     audio_sex: '@string(20)',
  //     audio_city: '@string(20)',
  //     audio_phone_no: '@string(20)',
  //     update_time: '@increment',
  //   },
  //   {
  //     audio_type: '本地',
  //     audio_file_id: '@string(20)',
  //     file_name: '本地2',
  //     time_dura: [
  //       {
  //         Score: '80',
  //         Start: '20',
  //         End: '25',
  //       },
  //       {
  //         Score: '90',
  //         Start: '30',
  //         End: '35',
  //       },
  //       {
  //         Score: '90',
  //         Start: '40',
  //         End: '45',
  //       },
  //     ],
  //     count: '4',
  //     keyword: '关键词2',
  //     language: '@string(20)',
  //     audio_case_no: '@string(20)',
  //     audio_sex: '@string(20)',
  //     audio_city: '@string(20)',
  //     audio_phone_no: '@string(20)',
  //     update_time: '@increment',
  //   },
  //   {
  //     audio_type: '本地',
  //     audio_file_id: '@string(20)',
  //     file_name: '本地1',
  //     time_dura: [
  //       {
  //         Score: '80',
  //         Start: '50',
  //         End: '55',
  //       },
  //       {
  //         Score: '90',
  //         Start: '60',
  //         End: '65',
  //       },
  //       {
  //         Score: '90',
  //         Start: '70',
  //         End: '75',
  //       },
  //     ],
  //     count: '4',
  //     keyword: '关键词3',
  //     language: '@string(20)',
  //     audio_case_no: '@string(20)',
  //     audio_sex: '@string(20)',
  //     audio_city: '@string(20)',
  //     audio_phone_no: '@string(20)',
  //     update_time: '@increment',
  //   },
  // ]),
};
