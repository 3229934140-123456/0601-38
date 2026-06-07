import { Message } from '@/types';

export const messages: Message[] = [
  {
    id: 'msg_001',
    type: 'private',
    title: '上单霸主',
    content: '今晚训练赛我可能晚点到，大概8点10分',
    sender: '上单霸主',
    senderAvatar: 'https://picsum.photos/id/91/200/200',
    time: '10分钟前',
    unread: true
  },
  {
    id: 'msg_002',
    type: 'system',
    title: '系统通知',
    content: '您的约战请求已被【雷霆战队】接受，请按时参加比赛',
    time: '1小时前',
    unread: true
  },
  {
    id: 'msg_003',
    type: 'team',
    title: '队内公告',
    content: '队长发布新公告：今晚8点训练赛，请大家准时上线！',
    time: '2小时前',
    unread: false
  },
  {
    id: 'msg_004',
    type: 'private',
    title: '野区之王',
    content: '明天的训练赛对面什么段位？',
    sender: '野区之王',
    senderAvatar: 'https://picsum.photos/id/177/200/200',
    time: '昨天',
    unread: false
  },
  {
    id: 'msg_005',
    type: 'system',
    title: '赛季更新',
    content: 'S14新赛季已开启，快来参与定位赛吧！',
    time: '3天前',
    unread: false
  },
  {
    id: 'msg_006',
    type: 'team',
    title: '队内公告',
    content: '周末杯报名已截止，我们队被分到A组',
    time: '5天前',
    unread: false
  }
];
