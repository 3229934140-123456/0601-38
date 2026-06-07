import { create } from 'zustand';
import { MatchRequest, GameRecord, ScheduleItem } from '@/types';
import { matchRequests as initialMatchRequests, scheduleList as initialScheduleList } from '@/data/matches';
import { gameRecords as initialGameRecords } from '@/data/records';
import { myTeam } from '@/data/teams';

interface AppState {
  matchRequests: MatchRequest[];
  gameRecords: GameRecord[];
  scheduleList: ScheduleItem[];
  remindedScheduleIds: string[];

  addMatchRequest: (match: Omit<MatchRequest, 'id' | 'createTime' | 'status'>) => void;
  updateGameRecord: (id: string, updates: Partial<GameRecord>) => void;
  getGameRecordById: (id: string) => GameRecord | undefined;
  confirmSchedule: (id: string) => void;
  toggleReminder: (id: string) => void;
  hasReminder: (id: string) => boolean;
  getSchedulesByDateIndex: (dateIndex: number) => ScheduleItem[];
}

const allSchedules: ScheduleItem[] = [
  {
    id: 'sched_001',
    title: '训练赛 vs 雷霆战队',
    time: '20:00',
    date: '今天',
    dateIndex: 0,
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
    dateIndex: 1,
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
    dateIndex: 2,
    game: 'lol',
    opponent: 'TBD',
    status: 'pending',
    type: 'tournament'
  },
  {
    id: 'sched_004',
    title: '训练赛 vs 银河战舰',
    time: '19:00',
    date: '周日',
    dateIndex: 3,
    game: 'lol',
    opponent: '银河战舰',
    status: 'pending',
    type: 'scrim'
  },
  {
    id: 'sched_005',
    title: 'VALORANT 训练赛',
    time: '21:00',
    date: '今天',
    dateIndex: 0,
    game: 'valorant',
    opponent: '幻影军团',
    status: 'pending',
    type: 'scrim'
  },
  {
    id: 'sched_006',
    title: '战队复盘会',
    time: '22:00',
    date: '明天',
    dateIndex: 1,
    game: 'lol',
    opponent: '队内',
    status: 'confirmed',
    type: 'training'
  },
  {
    id: 'sched_007',
    title: '周末杯半决赛',
    time: '19:00',
    date: '周日',
    dateIndex: 3,
    game: 'lol',
    opponent: 'TBD',
    status: 'pending',
    type: 'tournament'
  }
];

export const useAppStore = create<AppState>((set, get) => ({
  matchRequests: initialMatchRequests,
  gameRecords: initialGameRecords,
  scheduleList: allSchedules,
  remindedScheduleIds: [],

  addMatchRequest: (match) => {
    const newMatch: MatchRequest = {
      ...match,
      id: `match_${Date.now()}`,
      status: 'looking',
      createTime: new Date().toLocaleString('zh-CN')
    };
    set((state) => ({
      matchRequests: [newMatch, ...state.matchRequests]
    }));
  },

  updateGameRecord: (id, updates) => {
    set((state) => ({
      gameRecords: state.gameRecords.map((record) =>
        record.id === id ? { ...record, ...updates } : record
      )
    }));
  },

  getGameRecordById: (id) => {
    return get().gameRecords.find((record) => record.id === id);
  },

  confirmSchedule: (id) => {
    set((state) => ({
      scheduleList: state.scheduleList.map((s) =>
        s.id === id ? { ...s, status: 'confirmed' as const } : s
      )
    }));
  },

  toggleReminder: (id) => {
    set((state) => {
      const has = state.remindedScheduleIds.includes(id);
      return {
        remindedScheduleIds: has
          ? state.remindedScheduleIds.filter((x) => x !== id)
          : [...state.remindedScheduleIds, id]
      };
    });
  },

  hasReminder: (id) => {
    return get().remindedScheduleIds.includes(id);
  },

  getSchedulesByDateIndex: (dateIndex) => {
    return get().scheduleList.filter((s) => s.dateIndex === dateIndex);
  }
}));

export { myTeam };
