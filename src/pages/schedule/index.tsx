import React, { useCallback, useState } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import Tag from '@/components/Tag';
import EmptyState from '@/components/EmptyState';
import { scheduleList } from '@/data/matches';
import { myTeam } from '@/data/teams';
import { ScheduleItem } from '@/types';

const dates = [
  { day: '今天', weekday: '周六', isToday: true },
  { day: '09', weekday: '周日', isToday: false },
  { day: '10', weekday: '周一', isToday: false },
  { day: '11', weekday: '周二', isToday: false },
  { day: '12', weekday: '周三', isToday: false },
  { day: '13', weekday: '周四', isToday: false },
  { day: '14', weekday: '周五', isToday: false }
];

const SchedulePage: React.FC = () => {
  const [activeDate, setActiveDate] = useState(0);
  const [schedules, setSchedules] = useState<ScheduleItem[]>(scheduleList);

  const handleDateChange = useCallback((index: number) => {
    console.log('[Schedule] date changed:', index);
    setActiveDate(index);
  }, []);

  const handleConfirm = useCallback((id: string) => {
    console.log('[Schedule] confirm match:', id);
    Taro.showModal({
      title: '确认参赛',
      content: '确定要参加这场比赛吗？',
      confirmText: '确认',
      confirmColor: '#7B2FFD',
      success: (res) => {
        if (res.confirm) {
          setSchedules(prev =>
            prev.map(s => (s.id === id ? { ...s, status: 'confirmed' } : s))
          );
          Taro.showToast({ title: '已确认', icon: 'success' });
        }
      }
    });
  }, []);

  const handleRemind = useCallback((id: string) => {
    console.log('[Schedule] set reminder:', id);
    Taro.showToast({ title: '已设置提醒', icon: 'success' });
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
        return <Tag text="未知" type="default" size="sm" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'scrim': return '训练赛';
      case 'tournament': return '比赛';
      case 'training': return '队内训练';
      default: return '其他';
    }
  };

  return (
    <View className={styles.page}>
      <View className={styles.dateBar}>
        <ScrollView
          className={styles.dateScroll}
          scrollX
          showScrollbar={false}
        >
          {dates.map((date, index) => (
            <View
              key={index}
              className={classnames(styles.dateItem, activeDate === index && styles.active)}
              onClick={() => handleDateChange(index)}
            >
              <Text className={styles.day}>{date.day}</Text>
              <Text className={styles.weekday}>{date.weekday}</Text>
              {date.isToday && (
                <Text className={styles.todayTag}>今天</Text>
              )}
            </View>
          ))}
        </ScrollView>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>今日赛程</Text>
        {schedules.length > 0 ? (
          schedules.map(item => (
            <View
              key={item.id}
              className={classnames(styles.matchCard, item.status)}
            >
              <View className={styles.matchHeader}>
                <Text className={styles.matchTime}>{item.time}</Text>
                <View className={styles.matchType}>{getTypeLabel(item.type)}</View>
              </View>

              <View className={styles.teamsRow}>
                <View className={styles.teamBlock}>
                  <Image
                    className={classnames(styles.teamLogoSmall, styles.teamLogoLeft)}
                    src={myTeam.logo}
                    mode="aspectFill"
                  />
                  <Text className={styles.teamNameSmall}>{myTeam.name}</Text>
                </View>
                <Text className={styles.vsText}>VS</Text>
                <View className={classnames(styles.teamBlock, styles.teamBlockRight)}>
                  <Text className={styles.teamNameSmall}>{item.opponent}</Text>
                  <Image
                    className={classnames(styles.teamLogoSmall, styles.teamLogoRight)}
                    src="https://picsum.photos/id/2/200/200"
                    mode="aspectFill"
                  />
                </View>
              </View>

              <View className={styles.matchInfo}>
                <View className={styles.infoItem}>
                  <Text className={styles.infoIcon}>🎮</Text>
                  <Text>{item.game}</Text>
                </View>
                <View className={styles.infoItem}>
                  <Text className={styles.infoIcon}>📍</Text>
                  <Text>线上</Text>
                </View>
                {getStatusTag(item.status)}
              </View>

              {item.status === 'pending' && (
                <View className={styles.matchActions}>
                  <View
                    className={classnames(styles.actionBtn, styles.actionBtnSecondary)}
                    onClick={() => {}}
                  >
                    <Text>拒绝</Text>
                  </View>
                  <View
                    className={classnames(styles.actionBtn, styles.actionBtnPrimary)}
                    onClick={() => handleConfirm(item.id)}
                  >
                    <Text>确认参赛</Text>
                  </View>
                </View>
              )}

              {item.status === 'confirmed' && (
                <View className={styles.matchActions}>
                  <View
                    className={classnames(styles.actionBtn, styles.actionBtnSecondary)}
                    onClick={() => handleRemind(item.id)}
                  >
                    <Text>设置提醒</Text>
                  </View>
                  <View
                    className={classnames(styles.actionBtn, styles.actionBtnPrimary)}
                    onClick={() => {}}
                  >
                    <Text>进入房间</Text>
                  </View>
                </View>
              )}
            </View>
          ))
        ) : (
          <View className={styles.emptyState}>
            <EmptyState
              title="今日暂无赛程"
              description="去约战大厅找一支队伍来场训练赛吧"
            />
          </View>
        )}
      </View>
    </View>
  );
};

export default SchedulePage;
