export interface User {
  id: string;
  nickname: string;
  avatar: string;
  level: number;
  signature?: string;
}

export interface TeamMember {
  id: string;
  userId: string;
  nickname: string;
  avatar: string;
  position: string;
  rank: string;
  isCaptain: boolean;
}

export interface Team {
  id: string;
  name: string;
  logo: string;
  game: string;
  members: TeamMember[];
  memberCount: number;
  maxMembers: number;
  rank: string;
  winRate: number;
  totalMatches: number;
  announcement?: string;
  createTime: string;
}

export interface MatchRequest {
  id: string;
  teamId: string;
  teamName: string;
  teamLogo: string;
  game: string;
  rank: string;
  mode: string;
  map: string;
  time: string;
  dateIndex?: number;
  description?: string;
  status: 'looking' | 'matched' | 'confirmed' | 'finished' | 'cancelled';
  opponentTeam?: Team;
  isMine?: boolean;
  createTime: string;
}

export interface GameRecord {
  id: string;
  game: string;
  mode: string;
  map: string;
  ourTeam: string;
  opponentTeam: string;
  ourScore: number;
  opponentScore: number;
  result: 'win' | 'lose' | 'draw';
  time: string;
  duration: string;
  myHero?: string;
  myKda?: string;
  screenshots?: string[];
  reviewNote?: string;
  keyMistakes?: string[];
  opponentPunctuality?: number;
}

export interface Message {
  id: string;
  type: 'private' | 'system' | 'team';
  title: string;
  content: string;
  sender?: string;
  senderAvatar?: string;
  time: string;
  unread: boolean;
}

export interface ScheduleItem {
  id: string;
  title: string;
  time: string;
  date: string;
  dateIndex: number;
  game: string;
  mode?: string;
  map?: string;
  opponent: string;
  opponentLogo?: string;
  status: 'pending' | 'confirmed' | 'finished';
  type: 'scrim' | 'tournament' | 'training';
  members?: TeamMember[];
  matchRequestId?: string;
  recordId?: string;
}

export interface HeroStats {
  name: string;
  games: number;
  winRate: number;
  kda: string;
}

export interface SeasonStats {
  totalGames: number;
  wins: number;
  losses: number;
  winRate: number;
  currentStreak: number;
  bestStreak: number;
  mvpCount: number;
  avgKda: string;
}

export type GameType = 'lol' | 'valorant' | 'csgo' | 'dota2' | 'overwatch';

export type RankType = 'iron' | 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | 'master' | 'grandmaster' | 'challenger';

export const GAME_NAMES: Record<GameType, string> = {
  lol: '英雄联盟',
  valorant: 'VALORANT',
  csgo: 'CS2',
  dota2: 'DOTA2',
  overwatch: '守望先锋2'
};

export const RANK_NAMES: Record<RankType, string> = {
  iron: '黑铁',
  bronze: '青铜',
  silver: '白银',
  gold: '黄金',
  platinum: '铂金',
  diamond: '钻石',
  master: '大师',
  grandmaster: '宗师',
  challenger: '王者'
};

export const POSITION_NAMES: Record<string, string> = {
  top: '上单',
  jungle: '打野',
  mid: '中单',
  adc: 'ADC',
  support: '辅助'
};
