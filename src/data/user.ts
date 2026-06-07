import { User, SeasonStats, HeroStats } from '@/types';

export const currentUser: User = {
  id: 'user_001',
  nickname: '电竞小王子',
  avatar: 'https://picsum.photos/id/64/200/200',
  level: 42,
  signature: '热爱电竞，享受比赛'
};

export const seasonStats: SeasonStats = {
  totalGames: 128,
  wins: 72,
  losses: 56,
  winRate: 56.3,
  currentStreak: 3,
  bestStreak: 8,
  mvpCount: 23,
  avgKda: '3.2/4.1/6.8'
};

export const heroStats: HeroStats[] = [
  { name: '亚索', games: 32, winRate: 62.5, kda: '4.5/3.2/5.8' },
  { name: '劫', games: 28, winRate: 57.1, kda: '5.2/3.8/4.5' },
  { name: '盲僧', games: 24, winRate: 54.2, kda: '3.8/4.5/7.2' },
  { name: '卡莎', games: 21, winRate: 66.7, kda: '6.2/2.8/5.5' },
  { name: '锤石', games: 18, winRate: 61.1, kda: '1.2/3.5/12.3' }
];
