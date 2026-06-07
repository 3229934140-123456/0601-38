import { Team, TeamMember } from '@/types';

export const myTeam: Team = {
  id: 'team_001',
  name: '暗夜猎手',
  logo: 'https://picsum.photos/id/1/200/200',
  game: 'lol',
  members: [
    { id: 'm1', userId: 'user_001', nickname: '电竞小王子', avatar: 'https://picsum.photos/id/64/200/200', position: 'mid', rank: 'diamond', isCaptain: true },
    { id: 'm2', userId: 'user_002', nickname: '上单霸主', avatar: 'https://picsum.photos/id/91/200/200', position: 'top', rank: 'platinum', isCaptain: false },
    { id: 'm3', userId: 'user_003', nickname: '野区之王', avatar: 'https://picsum.photos/id/177/200/200', position: 'jungle', rank: 'diamond', isCaptain: false },
    { id: 'm4', userId: 'user_004', nickname: 'ADcarry', avatar: 'https://picsum.photos/id/338/200/200', position: 'adc', rank: 'platinum', isCaptain: false },
    { id: 'm5', userId: 'user_005', nickname: '辅助小能手', avatar: 'https://picsum.photos/id/1027/200/200', position: 'support', rank: 'gold', isCaptain: false }
  ],
  memberCount: 5,
  maxMembers: 7,
  rank: '钻石',
  winRate: 58.5,
  totalMatches: 86,
  announcement: '今晚8点训练赛，请大家准时上线！',
  createTime: '2024-01-15'
};

export const recommendTeams: Team[] = [
  {
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
  {
    id: 'team_003',
    name: '幻影军团',
    logo: 'https://picsum.photos/id/3/200/200',
    game: 'valorant',
    members: [],
    memberCount: 4,
    maxMembers: 6,
    rank: '不朽',
    winRate: 55.8,
    totalMatches: 67,
    createTime: '2024-02-10'
  },
  {
    id: 'team_004',
    name: '银河战舰',
    logo: 'https://picsum.photos/id/6/200/200',
    game: 'lol',
    members: [],
    memberCount: 6,
    maxMembers: 8,
    rank: '大师',
    winRate: 71.2,
    totalMatches: 156,
    createTime: '2023-09-01'
  }
];
