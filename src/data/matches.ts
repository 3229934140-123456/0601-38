import { MatchRequest, ScheduleItem } from '@/types';

export const matchRequests: MatchRequest[] = [
  {
    id: 'match_001',
    teamId: 'team_002',
    teamName: '雷霆战队',
    teamLogo: 'https://picsum.photos/id/2/200/200',
    game: 'lol',
    rank: 'diamond',
    mode: '5v5',
    map: '召唤师峡谷',
    time: '今晚 20:00',
    dateIndex: 0,
    description: '找实力相当的队伍练手，要求守时，不喷人',
    status: 'looking',
    createTime: '2024-06-08 14:30'
  },
  {
    id: 'match_002',
    teamId: 'team_003',
    teamName: '幻影军团',
    teamLogo: 'https://picsum.photos/id/3/200/200',
    game: 'valorant',
    rank: 'platinum',
    mode: '5v5',
    map: 'Bind',
    time: '今晚 21:00',
    dateIndex: 0,
    description: '铂金段位训练赛，互相学习进步',
    status: 'looking',
    createTime: '2024-06-08 15:00'
  },
  {
    id: 'match_003',
    teamId: 'team_004',
    teamName: '银河战舰',
    teamLogo: 'https://picsum.photos/id/6/200/200',
    game: 'lol',
    rank: 'master',
    mode: '5v5',
    map: '召唤师峡谷',
    time: '明天 19:00',
    dateIndex: 1,
    description: '大师以上战队来，打BO3',
    status: 'looking',
    createTime: '2024-06-08 12:00'
  },
  {
    id: 'match_004',
    teamId: 'team_005',
    teamName: '铁血军团',
    teamLogo: 'https://picsum.photos/id/8/200/200',
    game: 'csgo',
    rank: 'gold',
    mode: '5v5',
    map: 'Mirage',
    time: '今晚 22:00',
    dateIndex: 0,
    description: '黄金段位娱乐局，开心就好',
    status: 'looking',
    createTime: '2024-06-08 16:20'
  },
  {
    id: 'match_005',
    teamId: 'team_006',
    teamName: '星辰大海',
    teamLogo: 'https://picsum.photos/id/9/200/200',
    game: 'lol',
    rank: 'gold',
    mode: '5v5',
    map: '召唤师峡谷',
    time: '周六 14:00',
    dateIndex: 5,
    description: '周末训练赛，欢迎新人队伍',
    status: 'looking',
    createTime: '2024-06-07 20:00'
  },
  {
    id: 'match_006',
    teamId: 'team_007',
    teamName: '烈焰战队',
    teamLogo: 'https://picsum.photos/id/119/200/200',
    game: 'dota2',
    rank: 'platinum',
    mode: '5v5',
    map: '天辉夜魇',
    time: '周日 15:00',
    dateIndex: 6,
    description: 'DOTA2 铂金局，来硬实力队伍',
    status: 'looking',
    createTime: '2024-06-08 10:00'
  }
];

export const myMatches: MatchRequest[] = [
  {
    id: 'my_match_001',
    teamId: 'team_001',
    teamName: '暗夜猎手',
    teamLogo: 'https://picsum.photos/id/1/200/200',
    game: 'lol',
    rank: 'diamond',
    mode: '5v5',
    map: '召唤师峡谷',
    time: '今天 20:00',
    description: '钻石段位训练赛',
    status: 'confirmed',
    opponentTeam: {
      id: 'team_002',
      name: '雷霆战队',
      logo: 'https://picsum.photos/id/2/200/200',
      game: 'lol',
      members: [],
      memberCount: 5,
      maxMembers: 7,
      rank: '钻石',
      winRate: 62.3,
      totalMatches: 124,
      createTime: '2023-11-20'
    },
    createTime: '2024-06-08 10:00'
  }
];

export const scheduleList: ScheduleItem[] = [
  {
    id: 'sched_001',
    title: '训练赛 vs 雷霆战队',
    time: '20:00',
    date: '今天',
    game: 'lol',
    opponent: '雷霆战队',
    status: 'confirmed',
    type: 'scrim'
  },
  {
    id: 'sched_002',
    title: '队内训练',
    time: '19:00',
    date: '明天',
    game: 'lol',
    opponent: '队内',
    status: 'pending',
    type: 'training'
  },
  {
    id: 'sched_003',
    title: '周末杯小组赛',
    time: '14:00',
    date: '周六',
    game: 'lol',
    opponent: 'TBD',
    status: 'pending',
    type: 'tournament'
  },
  {
    id: 'sched_004',
    title: '训练赛 vs 银河战舰',
    time: '19:00',
    date: '下周一',
    game: 'lol',
    opponent: '银河战舰',
    status: 'pending',
    type: 'scrim'
  }
];
