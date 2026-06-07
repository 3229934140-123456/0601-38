import React, { useCallback, useState } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import Tag from '@/components/Tag';
import EmptyState from '@/components/EmptyState';
import { matchRequests } from '@/data/matches';
import { MatchRequest } from '@/types';

const games = ['全部', '英雄联盟', 'VALORANT', 'CS2', 'DOTA2', '守望先锋2'];
const ranks = ['全部段位', '青铜', '白银', '黄金', '铂金', '钻石', '大师', '王者'];
const modes = ['全部模式', '5v5', '3v3', '1v1'];

const MatchPage: React.FC = () => {
  const [activeGame, setActiveGame] = useState('全部');
  const [activeRank, setActiveRank] = useState('全部段位');
  const [activeMode, setActiveMode] = useState('全部模式');
  const [list, setList] = useState<MatchRequest[]>(matchRequests);

  const handleGameChange = useCallback((game: string) => {
    console.log('[Match] filter game:', game);
    setActiveGame(game);
  }, []);

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
    Taro.showToast({ title: '发布功能开发中', icon: 'none' });
  }, []);

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
            onClick={() => {
              // 简单切换演示
              setActiveRank(activeRank === '全部段位' ? '钻石' : '全部段位');
            }}
          >
            <Text>{activeRank}</Text>
            <Text className={styles.filterChipIcon}>▼</Text>
          </View>
          <View
            className={classnames(styles.filterChip, activeMode !== '全部模式' && styles.active)}
            onClick={() => {
              setActiveMode(activeMode === '全部模式' ? '5v5' : '全部模式');
            }}
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
        {list.length > 0 ? (
          list.map(match => (
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
                      {match.rank}
                    </Text>
                    <Text className={styles.memberCount}>
                      {match.mode}
                    </Text>
                  </View>
                </View>
              </View>

              <View className={styles.matchTags}>
                <Tag text={match.game === 'lol' ? '英雄联盟' : match.game} type="primary" size="sm" />
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
    </View>
  );
};

export default MatchPage;
