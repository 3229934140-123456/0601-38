import React, { useCallback } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import Tag from '@/components/Tag';
import { currentUser, seasonStats } from '@/data/user';
import { matchRequests, scheduleList } from '@/data/matches';
import { GAME_NAMES } from '@/types';

const HomePage: React.FC = () => {
  const quickActions = [
    { icon: '⚔️', text: '发布约战', path: '/pages/match/index' },
    { icon: '👥', text: '我的队伍', path: '/pages/team/index' },
    { icon: '📅', text: '赛程', path: '/pages/schedule/index' },
    { icon: '🏆', text: '战绩', path: '/pages/record/index' }
  ];

  const handleActionClick = useCallback((path: string) => {
    console.log('[Home] navigate to:', path);
    if (path.startsWith('/pages/match') || path.startsWith('/pages/team') ||
        path.startsWith('/pages/record') || path.startsWith('/pages/message')) {
      Taro.switchTab({ url: path }).catch(err => {
        console.error('[Home] switchTab error:', err);
      });
    } else {
      Taro.navigateTo({ url: path }).catch(err => {
        console.error('[Home] navigateTo error:', err);
      });
    }
  }, []);

  const handleMatchClick = useCallback((id: string) => {
    console.log('[Home] match clicked:', id);
    Taro.navigateTo({ url: `/pages/match/index?id=${id}` }).catch(err => {
      console.error('[Home] navigate match error:', err);
    });
  }, []);

  const handleScheduleClick = useCallback((id: string) => {
    console.log('[Home] schedule clicked:', id);
    Taro.navigateTo({ url: `/pages/schedule/index?id=${id}` }).catch(err => {
      console.error('[Home] navigate schedule error:', err);
    });
  }, []);

  const getStatusTag = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Tag text="已确认" type="success" size="sm" />;
      case 'pending':
        return <Tag text="待确认" type="warning" size="sm" />;
      case 'finished':
        return <Tag text="已结束" type="default" size="sm" />;
      default:
        return <Tag text="待开始" type="primary" size="sm" />;
    }
  };

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <Text className={styles.headerTitle}>电竞约战平台</Text>
        <View className={styles.userCard}>
          <Image className={styles.avatar} src={currentUser.avatar} mode="aspectFill" />
          <View className={styles.userInfo}>
            <Text className={styles.nickname}>{currentUser.nickname}</Text>
            <View className={styles.userMeta}>
              <Text className={styles.levelBadge}>Lv.{currentUser.level}</Text>
              <Text className={styles.rankText}>钻石 III</Text>
            </View>
            {currentUser.signature && (
              <Text className={styles.signature}>{currentUser.signature}</Text>
            )}
          </View>
        </View>
      </View>

      <View className={styles.content}>
        <View className={styles.quickActions}>
          {quickActions.map((action, index) => (
            <View
              key={index}
              className={styles.actionItem}
              onClick={() => handleActionClick(action.path)}
            >
              <View className={styles.actionIcon}>
                <Text>{action.icon}</Text>
              </View>
              <Text className={styles.actionText}>{action.text}</Text>
            </View>
          ))}
        </View>

        <View className={styles.statsRow}>
          <View className={styles.statsCard}>
            <Text className={styles.statsLabel}>总场次</Text>
            <Text className={styles.statsValue}>{seasonStats.totalGames}</Text>
          </View>
          <View className={styles.statsCard}>
            <Text className={styles.statsLabel}>胜率</Text>
            <Text className={`${styles.statsValue} ${styles.statsValueWin}`}>
              {seasonStats.winRate}%
            </Text>
          </View>
          <View className={styles.statsCard}>
            <Text className={styles.statsLabel}>连胜</Text>
            <Text className={`${styles.statsValue} ${styles.statsValueWin}`}>
              {seasonStats.currentStreak}
            </Text>
          </View>
        </View>

        <View className={styles.section}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>推荐约战</Text>
            <Text className={styles.sectionMore}>查看更多</Text>
          </View>
          <ScrollView
            className={styles.matchScroll}
            scrollX
            showScrollbar={false}
          >
            {matchRequests.slice(0, 4).map(match => (
              <View
                key={match.id}
                className={styles.matchCard}
                onClick={() => handleMatchClick(match.id)}
              >
                <View className={styles.matchCardHeader}>
                  <Image className={styles.teamLogo} src={match.teamLogo} mode="aspectFill" />
                  <View className={styles.teamInfo}>
                    <Text className={styles.teamName}>{match.teamName}</Text>
                    <Text className={styles.teamRank}>
                      {GAME_NAMES[match.game as keyof typeof GAME_NAMES] || match.game} · {match.rank}
                    </Text>
                  </View>
                </View>
                <View className={styles.matchMeta}>
                  <Tag text={match.mode} type="primary" size="sm" />
                  <Tag text={match.map} type="default" size="sm" />
                </View>
                <Text className={styles.matchTime}>{match.time}</Text>
                <Text className={styles.matchDesc}>{match.description}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        <View className={styles.section}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>即将开始</Text>
            <Text
              className={styles.sectionMore}
              onClick={() => handleActionClick('/pages/schedule/index')}
            >
              全部赛程
            </Text>
          </View>
          <View className={styles.scheduleList}>
            {scheduleList.slice(0, 3).map(item => (
              <View
                key={item.id}
                className={styles.scheduleItem}
                onClick={() => handleScheduleClick(item.id)}
              >
                <View className={styles.scheduleTime}>
                  <Text className={styles.scheduleTimeText}>{item.time}</Text>
                  <Text className={styles.scheduleDate}>{item.date}</Text>
                </View>
                <View className={styles.scheduleInfo}>
                  <Text className={styles.scheduleTitle}>{item.title}</Text>
                  <Text className={styles.scheduleSub}>
                    {GAME_NAMES[item.game as keyof typeof GAME_NAMES] || item.game} · {item.opponent}
                  </Text>
                </View>
                <View className={styles.scheduleStatus}>
                  {getStatusTag(item.status)}
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};

export default HomePage;
