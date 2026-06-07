import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, Image, ScrollView, Input, Textarea } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import Tag from '@/components/Tag';
import EmptyState from '@/components/EmptyState';
import { useAppStore } from '@/store';
import { GAME_NAMES, RANK_NAMES } from '@/types';
import { myTeam } from '@/data/teams';

const games = ['全部', '英雄联盟', 'VALORANT', 'CS2', 'DOTA2', '守望先锋2'];
const ranks = ['全部段位', '青铜', '白银', '黄金', '铂金', '钻石', '大师', '王者'];
const modes = ['全部模式', '5v5', '3v3', '1v1'];
const maps: Record<string, string[]> = {
  '英雄联盟': ['召唤师峡谷', '扭曲丛林', '嚎哭深渊'],
  'VALORANT': ['Bind', 'Haven', 'Split', 'Ascent', 'Icebox'],
  'CS2': ['Mirage', 'Dust2', 'Inferno', 'Nuke', 'Overpass'],
  'DOTA2': ['天辉夜魇'],
  '守望先锋2': ['国王大道', '漓江塔', '花村']
};
const times = ['今晚 19:00', '今晚 20:00', '今晚 21:00', '今晚 22:00', '明天 19:00', '明天 20:00', '周末 14:00', '周末 19:00'];

const gameKeyMap: Record<string, string> = {
  '英雄联盟': 'lol',
  'VALORANT': 'valorant',
  'CS2': 'csgo',
  'DOTA2': 'dota2',
  '守望先锋2': 'overwatch'
};

const rankKeyMap: Record<string, string> = {
  '青铜': 'bronze',
  '白银': 'silver',
  '黄金': 'gold',
  '铂金': 'platinum',
  '钻石': 'diamond',
  '大师': 'master',
  '王者': 'challenger'
};

const MatchPage: React.FC = () => {
  const matchRequests = useAppStore((state) => state.matchRequests);
  const addMatchRequest = useAppStore((state) => state.addMatchRequest);

  const [activeGame, setActiveGame] = useState('全部');
  const [activeRank, setActiveRank] = useState('全部段位');
  const [activeMode, setActiveMode] = useState('全部模式');

  const [showPublishModal, setShowPublishModal] = useState(false);
  const [formGame, setFormGame] = useState('英雄联盟');
  const [formRank, setFormRank] = useState('钻石');
  const [formMode, setFormMode] = useState('5v5');
  const [formMap, setFormMap] = useState('召唤师峡谷');
  const [formTime, setFormTime] = useState('今晚 20:00');
  const [formDesc, setFormDesc] = useState('');

  const filteredList = useMemo(() => {
    return matchRequests.filter((match) => {
      if (activeGame !== '全部') {
        const gameKey = gameKeyMap[activeGame] || activeGame;
        if (match.game !== gameKey) return false;
      }
      if (activeRank !== '全部段位') {
        const rankKey = rankKeyMap[activeRank] || activeRank;
        if (match.rank !== rankKey) return false;
      }
      if (activeMode !== '全部模式') {
        if (match.mode !== activeMode) return false;
      }
      return true;
    });
  }, [matchRequests, activeGame, activeRank, activeMode]);

  const handleGameChange = useCallback((game: string) => {
    console.log('[Match] filter game:', game);
    setActiveGame(game);
  }, []);

  const handleRankChange = useCallback(() => {
    const rankIndex = ranks.indexOf(activeRank);
    const nextIndex = (rankIndex + 1) % ranks.length;
    setActiveRank(ranks[nextIndex]);
  }, [activeRank]);

  const handleModeChange = useCallback(() => {
    const modeIndex = modes.indexOf(activeMode);
    const nextIndex = (modeIndex + 1) % modes.length;
    setActiveMode(modes[nextIndex]);
  }, [activeMode]);

  const handleAccept = useCallback((matchId: string) => {
    console.log('[Match] accept match:', matchId);
    Taro.showModal({
      title: '确认约战',
      content: '确定要接受这场约战吗？请确保你能按时参加',
      confirmText: '确认',
      confirmColor: '#7B2FFD',
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({ title: '约战成功！', icon: 'success' });
        }
      }
    });
  }, []);

  const handlePublish = useCallback(() => {
    console.log('[Match] publish match');
    setShowPublishModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowPublishModal(false);
  }, []);

  const handleFormGameChange = useCallback((game: string) => {
    setFormGame(game);
    const mapList = maps[game] || [];
    if (mapList.length > 0 && !mapList.includes(formMap)) {
      setFormMap(mapList[0]);
    }
  }, [formMap]);

  const handleSubmit = useCallback(() => {
    console.log('[Match] submit publish:', { formGame, formRank, formMode, formMap, formTime, formDesc });

    const gameKey = gameKeyMap[formGame] || 'lol';
    const rankKey = rankKeyMap[formRank] || 'diamond';

    addMatchRequest({
      teamId: myTeam.id,
      teamName: myTeam.name,
      teamLogo: myTeam.logo,
      game: gameKey,
      rank: rankKey,
      mode: formMode,
      map: formMap,
      time: formTime,
      description: formDesc || '寻找势均力敌的对手'
    });

    setShowPublishModal(false);
    Taro.showToast({ title: '发布成功！', icon: 'success' });

    setFormDesc('');
  }, [formGame, formRank, formMode, formMap, formTime, formDesc, addMatchRequest]);

  const handleCardClick = useCallback((matchId: string) => {
    console.log('[Match] card clicked:', matchId);
  }, []);

  const getRankColor = (rank: string) => {
    const colorMap: Record<string, string> = {
      iron: '#6B6B80',
      bronze: '#CD7F32',
      silver: '#C0C0C0',
      gold: '#FFD700',
      platinum: '#00D4AA',
      diamond: '#B9F2FF',
      master: '#C89B3C',
      grandmaster: '#FF4655',
      challenger: '#00D1FF'
    };
    return colorMap[rank] || '#6B6B80';
  };

  const getRankName = (rankKey: string) => {
    return RANK_NAMES[rankKey as keyof typeof RANK_NAMES] || rankKey;
  };

  const getGameName = (gameKey: string) => {
    return GAME_NAMES[gameKey as keyof typeof GAME_NAMES] || gameKey;
  };

  return (
    <View className={styles.page}>
      <View className={styles.filterBar}>
        <ScrollView
          className={styles.gameTabs}
          scrollX
          showScrollbar={false}
        >
          {games.map(game => (
            <View
              key={game}
              className={classnames(styles.gameTab, activeGame === game && styles.active)}
              onClick={() => handleGameChange(game)}
            >
              <Text>{game}</Text>
            </View>
          ))}
        </ScrollView>

        <View className={styles.quickFilters}>
          <View
            className={classnames(styles.filterChip, activeRank !== '全部段位' && styles.active)}
            onClick={handleRankChange}
          >
            <Text>{activeRank}</Text>
            <Text className={styles.filterChipIcon}>▼</Text>
          </View>
          <View
            className={classnames(styles.filterChip, activeMode !== '全部模式' && styles.active)}
            onClick={handleModeChange}
          >
            <Text>{activeMode}</Text>
            <Text className={styles.filterChipIcon}>▼</Text>
          </View>
        </View>
      </View>

      <ScrollView
        className={styles.matchList}
        scrollY
        showScrollbar={false}
      >
        {filteredList.length > 0 ? (
          filteredList.map(match => (
            <View
              key={match.id}
              className={styles.matchCard}
              onClick={() => handleCardClick(match.id)}
            >
              <View className={styles.matchCardHeader}>
                <Image className={styles.teamLogo} src={match.teamLogo} mode="aspectFill" />
                <View className={styles.teamInfo}>
                  <Text className={styles.teamName}>{match.teamName}</Text>
                  <View className={styles.teamMeta}>
                    <Text
                      className={styles.rankText}
                      style={{ color: getRankColor(match.rank) }}
                    >
                      {getRankName(match.rank)}
                    </Text>
                    <Text className={styles.memberCount}>
                      {match.mode}
                    </Text>
                  </View>
                </View>
              </View>

              <View className={styles.matchTags}>
                <Tag text={getGameName(match.game)} type="primary" size="sm" />
                <Tag text={match.map} type="default" size="sm" />
              </View>

              <View className={styles.matchTime}>
                <Text className={styles.timeIcon}>⏰</Text>
                <Text className={styles.timeText}>{match.time}</Text>
                <Text className={styles.mapText}>· {match.map}</Text>
              </View>

              <Text className={styles.matchDesc}>{match.description}</Text>

              <View className={styles.matchCardFooter}>
                <View className={styles.winRate}>
                  <Text>胜率: </Text>
                  <Text className={styles.winRateValue}>62.3%</Text>
                </View>
                <View
                  className={styles.acceptBtn}
                  onClick={(e) => {
                    e.stopPropagation?.();
                    handleAccept(match.id);
                  }}
                >
                  <Text>接受约战</Text>
                </View>
              </View>
            </View>
          ))
        ) : (
          <View className={styles.emptyState}>
            <EmptyState
              title="暂无约战"
              description="换个筛选条件试试，或者发布一条约战吧"
            />
          </View>
        )}
      </ScrollView>

      <View className={styles.fab} onClick={handlePublish}>
        <Text className={styles.fabIcon}>+</Text>
      </View>

      {showPublishModal && (
        <View className={styles.modalOverlay} onClick={handleCloseModal}>
          <View className={styles.modalContent} onClick={(e) => e.stopPropagation?.()}>
            <View className={styles.modalHeader}>
              <Text className={styles.modalTitle}>发布约战</Text>
              <View className={styles.modalClose} onClick={handleCloseModal}>
                <Text>✕</Text>
              </View>
            </View>

            <ScrollView className={styles.modalBody} scrollY showScrollbar={false}>
              <View className={styles.formGroup}>
                <Text className={styles.formLabel}>选择游戏</Text>
                <View className={styles.formOptions}>
                  {games.filter(g => g !== '全部').map(game => (
                    <View
                      key={game}
                      className={classnames(styles.formOption, formGame === game && styles.active)}
                      onClick={() => handleFormGameChange(game)}
                    >
                      <Text>{game}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View className={styles.formGroup}>
                <Text className={styles.formLabel}>段位要求</Text>
                <View className={styles.formOptions}>
                  {ranks.filter(r => r !== '全部段位').map(rank => (
                    <View
                      key={rank}
                      className={classnames(styles.formOption, formRank === rank && styles.active)}
                      onClick={() => setFormRank(rank)}
                    >
                      <Text>{rank}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View className={styles.formGroup}>
                <Text className={styles.formLabel}>比赛模式</Text>
                <View className={styles.formOptions}>
                  {modes.filter(m => m !== '全部模式').map(mode => (
                    <View
                      key={mode}
                      className={classnames(styles.formOption, formMode === mode && styles.active)}
                      onClick={() => setFormMode(mode)}
                    >
                      <Text>{mode}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View className={styles.formGroup}>
                <Text className={styles.formLabel}>比赛地图</Text>
                <View className={styles.formOptions}>
                  {(maps[formGame] || []).map(map => (
                    <View
                      key={map}
                      className={classnames(styles.formOption, formMap === map && styles.active)}
                      onClick={() => setFormMap(map)}
                    >
                      <Text>{map}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View className={styles.formGroup}>
                <Text className={styles.formLabel}>比赛时间</Text>
                <View className={styles.formOptions}>
                  {times.map(time => (
                    <View
                      key={time}
                      className={classnames(styles.formOption, formTime === time && styles.active)}
                      onClick={() => setFormTime(time)}
                    >
                      <Text>{time}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View className={styles.formGroup}>
                <Text className={styles.formLabel}>约战说明</Text>
                <Textarea
                  className={styles.formTextarea}
                  placeholder="说点什么，比如：要求守时、不喷人、打BO3等..."
                  placeholderClass="textarea-placeholder"
                  value={formDesc}
                  onInput={(e) => setFormDesc(e.detail.value)}
                  maxlength={200}
                />
              </View>
            </ScrollView>

            <View className={styles.modalFooter}>
              <View className={styles.cancelBtn} onClick={handleCloseModal}>
                <Text>取消</Text>
              </View>
              <View className={styles.confirmBtn} onClick={handleSubmit}>
                <Text>发布约战</Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default MatchPage;
