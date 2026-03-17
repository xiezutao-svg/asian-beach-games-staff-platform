import type { Notice } from '../../types/notice'

export const mockNotices: Notice[] = [
  {
    id: '1',
    title: '亚沙会开幕式彩排通知',
    content: '各位工作人员请注意，开幕式将于 2026年3月20日 进行彩排，请所有工作人员提前 2 小时到达现场。彩排时间为上午 9:00-12:00，地点在主体育场。请携带工作证，并着统一工作服。',
    type: 'notification',
    date: '2026-03-17',
    author: '组委会办公室',
    read: false,
    attachment: 'opening-ceremony-notice.pdf'
  },
  {
    id: '2',
    title: '志愿者培训安排',
    content: '志愿者培训将于本周六开始，分为基础培训和专项培训两个阶段。基础培训包括亚沙会概况、服务礼仪等内容；专项培训针对不同岗位进行专业指导。请各岗位志愿者按时参加。',
    type: 'announcement',
    date: '2026-03-16',
    author: '志愿者部',
    read: false,
    attachment: 'volunteer-training.pdf'
  },
  {
    id: '3',
    title: '篮球比赛场地布置完成',
    content: '经过连续多日的努力，所有篮球比赛场地的布置工作已经完成。包括场地画线、器材安装、安全设施配备等均已通过验收。感谢各相关部门的辛勤付出！',
    type: 'event',
    date: '2026-03-15',
    author: '场馆部',
    read: true
  },
  {
    id: '4',
    title: '媒体中心开放公告',
    content: '亚沙会媒体中心将于 2026年3月18日 正式开放，为国内外媒体记者提供工作场地、网络设施、采访协调等服务。请需要使用媒体中心的媒体人员提前预约。',
    type: 'announcement',
    date: '2026-03-14',
    author: '媒体部',
    read: false,
    attachment: 'media-center-guide.pdf'
  },
  {
    id: '5',
    title: '安保工作会议纪要',
    content: '2026年3月13日召开了亚沙会安保工作会议，讨论了赛事期间的安全保障方案。会议强调了场馆安全、人员管控、应急预案等重要工作。各安保小组需落实具体措施。',
    type: 'notification',
    date: '2026-03-13',
    author: '安保部',
    read: true,
    attachment: 'security-meeting-summary.pdf'
  },
  {
    id: '6',
    title: '国际代表团欢迎仪式',
    content: '欢迎仪式将于 2026年3月22日 举行，届时将有来自 20 个国家和地区的代表团出席。仪式包括欢迎致辞、文化交流、友谊赛等环节。欢迎各位工作人员参与组织工作。',
    type: 'event',
    date: '2026-03-12',
    author: '外联部',
    read: true
  },
  {
    id: '7',
    title: '交通管制时间表',
    content: '为确保赛事顺利进行，比赛期间将实施交通管制。管制范围包括主体育场周边 2 公里区域。详细管制时段和绕行路线请查看附件。请各部门提前做好出行安排。',
    type: 'notification',
    date: '2026-03-11',
    author: '交通部',
    read: false,
    attachment: 'traffic-control-schedule.pdf'
  },
  {
    id: '8',
    title: '医疗救护点分布',
    content: '赛事期间将在各场馆设置医疗救护点，配备专业医护人员和急救设备。每个救护点覆盖 500 米范围。紧急情况可直接拨打急救热线：120。所有医疗人员已准备就绪。',
    type: 'announcement',
    date: '2026-03-10',
    author: '医疗部',
    read: true
  }
]
