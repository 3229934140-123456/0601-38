import { create } from 'zustand';
import { MatchRequest, GameRecord, ScheduleItem, TeamMember } from '@/types';
import { matchRequests as initialMatchRequests } from '@/data/matches';
import { gameRecords as initialGameRecords } from '@/data/records';
import { myTeam } from '@/data/teams';

const dateLabels = ['今天', '明天', '周六', '周日', '周一', '周二', '周三'];

const initialSchedules: ScheduleItem[] = [
  {
    id: 'sched_001',
    title: '训练赛 vs 雷霆战队',
    time: '20:00',
    date: '今天',
    dateIndex: 0,
    game: 'lol',
    mode: '5v5',
    map: '召唤师峡谷',
    opponent: '雷霆战队',
    opponentLogo: 'https://picsum.photos/id/2/200/200',
    status: 'confirmed',
    type: 'scrim',
    members: myTeam.members,
    matchRequestId: 'match_001'
  },
  {
    id: 'sched_002',
    title: '队内训练',
    time: '19:00',
    date: '今天',
    dateIndex: 0,
    game: 'lol',
    mode: '5v5',
    map: '召唤师峡谷',
    opponent: '队内',
    opponentLogo: '',
    status: 'confirmed',
    type: 'training',
    members: myTeam.members.slice(0, 4)
  },
  {
    id: 'sched_003',
    title: 'VALORANT 训练赛',
    time: '21:00',
    date: '今天',
    dateIndex: 0,
    game: 'valorant',
    mode: '5v5',
    map: 'Bind',
    opponent: '幻影军团',
    opponentLogo: 'https://picsum.photos/id/3/200/200',
    status: 'pending',
    type: 'scrim'
  },
  {
    id: 'sched_004',
    title: '战队复盘会',
    time: '22:00',
    date: '明天',
    dateIndex: 1,
    game: 'lol',
    mode: '5v5',
    map: '召唤师峡谷',
    opponent: '队内',
    opponentLogo: '',
    status: 'confirmed',
    type: 'training',
    members: myTeam.members
  },
  {
    id: 'sched_005',
    title: '周末杯小组赛',
    time: '14:00',
    date: '周六',
    dateIndex: 2,
    game: 'lol',
    mode: '5v5',
    map: '召唤师峡谷',
    opponent: 'TBD',
    opponentLogo: '',
    status: 'pending',
    type: 'tournament'
  },
  {
    id: 'sched_006',
    title: '训练赛 vs 银河战舰',
    time: '19:00',
    date: '周日',
    dateIndex: 3,
    game: 'lol',
    mode: '5v5',
    map: '召唤师峡谷',
    opponent: '银河战舰',
    opponentLogo: 'https://picsum.photos/id/6/200/200',
    status: 'pending',
    type: 'scrim'
  },
  {
    id: 'sched_007',
    title: '周末杯半决赛',
    time: '19:00',
    date: '周日',
    dateIndex: 3,
    game: 'lol',
    mode: '5v5',
    map: '召唤师峡谷',
    opponent: 'TBD',
    opponentLogo: '',
    status: 'pending',
    type: 'tournament'
  },
  {
    id: 'sched_008',
    title: 'CS2 娱乐局',
    time: '20:00',
    date: '周一',
    dateIndex: 4,
    game: 'csgo',
    mode: '5v5',
    map: 'Mirage',
    opponent: '铁血军团',
    opponentLogo: 'https://picsum.photos/id/8/200/200',
    status: 'confirmed',
    type: 'scrim',
    status: 'finished',
    recordId: 'record_005'
  }
];

interface AppState {
  matchRequests: MatchRequest[];
  gameRecords: GameRecord[];
  scheduleList: ScheduleItem[];
  remindedScheduleIds: string[];

  addMatchRequest: (match: Omit<MatchRequest, 'id' | 'createTime' | 'status' | 'isMine'> & { dateIndex?: number }) => void;
  updateGameRecord: (id: string, updates: Partial<GameRecord>) => void;
  getGameRecordById: (id: string) => GameRecord | undefined;

  acceptMatchRequest: (matchId: string) => void;

  confirmSchedule: (id: string) => void;
  finishSchedule: (id: string) => void;
  toggleReminder: (id: string) => void;
  hasReminder: (id: string) => boolean;
  getScheduleById: (id: string) => ScheduleItem | undefined;
  getSchedulesByDateIndex: (dateIndex: number) => ScheduleItem[];

  addGameRecordFromSchedule: (scheduleId: string, record: Omit<GameRecord, 'id' | 'game' | 'mode' | 'map' | 'ourTeam' | 'opponentTeam' | 'time'>) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  matchRequests: initialMatchRequests,
  gameRecords: initialGameRecords,
  scheduleList: initialSchedules,
  remindedScheduleIds: [],

  addMatchRequest: (match) => {
    const newMatch: MatchRequest = {
      ...match,
      id: `match_${Date.now()}`,
      status: 'looking',
      isMine: true,
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

  acceptMatchRequest: (matchId) => {
    const match = get().matchRequests.find((m) => m.id === matchId);
    if (!match) return;

    set((state) => ({
      matchRequests: state.matchRequests.map((m) =>
        m.id === matchId ? { ...m, status: 'matched', opponentTeam: myTeam } : m
      )
    }));

    const newSchedule: ScheduleItem = {
      id: `sched_${Date.now()}`,
      title: `训练赛 vs ${match.teamName}`,
      time: match.time,
      date: dateLabels[match.dateIndex ?? 0] || '今天',
      dateIndex: match.dateIndex ?? 0,
      game: match.game,
      mode: match.mode,
      map: match.map,
      opponent: match.teamName,
      opponentLogo: match.teamLogo,
      status: 'pending',
      type: 'scrim',
      matchRequestId: matchId
    };

    set((state) => ({
      scheduleList: [...state.scheduleList, newSchedule]
    }));
  },

  confirmSchedule: (id) => {
    set((state) => ({
      scheduleList: state.scheduleList.map((s) =>
        s.id === id ? { ...s, status: 'confirmed' as const } : s
      )
    }));
  },

  finishSchedule: (id) => {
    set((state) => ({
      scheduleList: state.scheduleList.map((s) =>
        s.id === id ? { ...s, status: 'finished' as const } : s
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

  getScheduleById: (id) => {
    return get().scheduleList.find((s) => s.id === id);
  },

  getSchedulesByDateIndex: (dateIndex) => {
    return get().scheduleList
      .filter((s) => s.dateIndex === dateIndex)
      .sort((a, b) => a.time.localeCompare(b.time));
  },

  addGameRecordFromSchedule: (scheduleId, record) => {
    const schedule = get().scheduleList.find((s) => s.id === scheduleId);
    if (!schedule) return;

    const newRecord: GameRecord = {
      ...record,
      id: `record_${Date.now()}`,
      game: schedule.game,
      mode: schedule.mode || '5v5',
      map: schedule.map || '召唤师峡谷',
      ourTeam: myTeam.name,
      opponentTeam: schedule.opponent,
      time: `${schedule.date} ${schedule.time}`
    };

    set((state) => ({
      gameRecords: [newRecord, ...state.gameRecords],
      scheduleList: state.scheduleList.map((s) =>
        s.id === scheduleId ? { ...s, status: 'finished' as const, recordId: newRecord.id } : s
      )
    }));

    return newRecord.id;
  }
}));

export { myTeam, dateLabels };
