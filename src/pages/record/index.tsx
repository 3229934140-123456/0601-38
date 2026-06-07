import React, { useCallback, useState } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import Tag from '@/components/Tag';
import { seasonStats, heroStats } from '@/data/user';
import { gameRecords } from '@/data/records';
import { GameRecord } from '@/types';

const tabs = ['全部', '胜利', '失败'];

const RecordPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('全部');
  const [records, setRecords] = useState<GameRecord[]>(gameRecords);

  const handleTabChange = useCallback((tab: string) => {
    console.log('[Record] tab changed:', tab);
    setActiveTab(tab);
    if (tab === '全部') {
      setRecords(gameRecords);
    } else if (tab === '胜利') {
      setRecords(gameRecords.filter(r => r.result === 'win'));
    } else {
      setRecords(gameRecords.filter(r => r.result === 'lose'));
    }
  }, []);

  const handleRecordClick = useCallback((recordId: string) => {
    console.log('[Record] record clicked:', recordId);
    Taro.navigateTo({ url: `/pages/review/index?id=${recordId}` }).catch(err => {
      console.error('[Record] navigate error:', err);
    });
  }, []);

  return (
    <View className={styles.page}>
      <View className={styles.statsHeader}>
        <Text className={styles.seasonTitle}>2024 夏季赛</Text>
        <View className={styles.mainStats}>
          <View className={styles.winRateCircle} style={{ ['--win-rate' as any]: seasonStats.winRate }}>
            <View className={styles.winRateInner}>
              <Text className={styles.winRateValue}>{seasonStats.winRate}%</Text>
              <Text className={styles.winRateLabel}>胜率</Text>
            </View>
          </View>
          <View className={styles.statsGrid}>
            <View className={styles.statItem}>
              <Text className={styles.statNumber}>{seasonStats.totalGames}</Text>
              <Text className={styles.statLabel}>总场次</Text>
            </View>
            <View className={styles.statItem}>
              <Text className={styles.statNumber}>{seasonStats.wins}</Text>
              <Text className={styles.statLabel}>胜场</Text>
            </View>
            <View className={styles.statItem}>
              <Text className={styles.statNumber}>{seasonStats.currentStreak}连胜</Text>
              <Text className={styles.statLabel}>当前连胜</Text>
            </View>
            <View className={styles.statItem}>
              <Text className={styles.statNumber}>{seasonStats.mvpCount}</Text>
              <Text className={styles.statLabel}>MVP次数</Text>
            </View>
          </View>
        </View>
        <View className={styles.filterTabs}>
          {tabs.map(tab => (
            <View
              key={tab}
              className={classnames(styles.filterTab, activeTab === tab && styles.active)}
              onClick={() => handleTabChange(tab)}
            >
              <Text>{tab}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>英雄池</Text>
          <Text className={styles.sectionMore}>查看全部</Text>
        </View>
        <ScrollView
          className={styles.heroScroll}
          scrollX
          showScrollbar={false}
        >
          {heroStats.map((hero, index) => (
            <View key={index} className={styles.heroCard}>
              <View className={styles.heroIcon}>
                <Text>⚔️</Text>
              </View>
              <Text className={styles.heroName}>{hero.name}</Text>
              <Text className={styles.heroGames}>{hero.games}场</Text>
              <Text className={classnames(styles.heroWinRate, hero.winRate >= 50 ? 'win' : 'lose')}>
                {hero.winRate}%
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>

      <View className={styles.recordList}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>比赛记录</Text>
        </View>
        {records.map(record => (
          <View
            key={record.id}
            className={styles.recordCard}
            onClick={() => handleRecordClick(record.id)}
          >
            <View className={classnames(styles.resultBadge, record.result)}>
              <Text className={classnames(styles.resultText, record.result)}>
                {record.result === 'win' ? '胜' : '负'}
              </Text>
            </View>
            <View className={styles.recordInfo}>
              <Text className={styles.recordTitle}>
                vs {record.opponentTeam}
              </Text>
              <View className={styles.recordMeta}>
                <Text className={styles.recordMetaText}>{record.game}</Text>
                <Text className={styles.recordMetaText}>·</Text>
                <Text className={styles.recordMetaText}>{record.map}</Text>
                <Text className={styles.recordMetaText}>·</Text>
                <Text className={styles.recordMetaText}>{record.duration}</Text>
              </View>
              {record.myHero && (
                <View className={styles.heroInfo}>
                  <Text className={styles.heroNameSmall}>{record.myHero}</Text>
                  {record.myKda && (
                    <Text className={styles.kdaText}>KDA: {record.myKda}</Text>
                  )}
                </View>
              )}
            </View>
            <View className={styles.recordRight}>
              <Text className={styles.score}>
                {record.ourScore}:{record.opponentScore}
              </Text>
              <Text className={styles.recordTime}>{record.time}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export default RecordPage;
