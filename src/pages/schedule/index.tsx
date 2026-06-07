import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import Tag from '@/components/Tag';
import EmptyState from '@/components/EmptyState';
import { useAppStore } from '@/store';
import { myTeam } from '@/store';
import { GAME_NAMES } from '@/types';

const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

const SchedulePage: React.FC = () => {
  const [activeDate, setActiveDate] = useState(0);

  const getSchedulesByDateIndex = useAppStore((state) => state.getSchedulesByDateIndex);
  const confirmSchedule = useAppStore((state) => state.confirmSchedule);
  const toggleReminder = useAppStore((state) => state.toggleReminder);
  const hasReminder = useAppStore((state) => state.hasReminder);

  const dates = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const day = i === 0 ? '今天' : i === 1 ? '明天' : String(d.getDate()).padStart(2, '0');
      const weekday = weekDays[d.getDay()];
      return { day, weekday, isToday: i === 0, date: d };
    });
  }, []);

  const schedules = useMemo(() => {
    return getSchedulesByDateIndex(activeDate);
  }, [activeDate, getSchedulesByDateIndex]);

  const sectionTitle = useMemo(() => {
    if (activeDate === 0) return '今日赛程';
    if (activeDate === 1) return '明日赛程';
    const weekday = dates[activeDate]?.weekday || '';
    return `${weekday}赛程`;
  }, [activeDate, dates]);

  const handleDateChange = useCallback((index: number) => {
    console.log('[Schedule] date changed:', index, dates[index]?.weekday);
    setActiveDate(index);
  }, [dates]);

  const handleCardClick = useCallback((id: string) => {
    console.log('[Schedule] card clicked:', id);
    Taro.navigateTo({ url: `/pages/schedule-detail/index?id=${id}` }).catch(err => {
      console.error('[Schedule] navigate error:', err);
    });
  }, []);

  const handleConfirm = useCallback((id: string, e?: React.MouseEvent) => {
    e?.stopPropagation?.();
    console.log('[Schedule] confirm match:', id);
    Taro.showModal({
      title: '确认参赛',
      content: '确定要参加这场比赛吗？',
      confirmText: '确认',
      confirmColor: '#7B2FFD',
      success: (res) => {
        if (res.confirm) {
          confirmSchedule(id);
          Taro.showToast({ title: '已确认', icon: 'success' });
        }
      }
    });
  }, [confirmSchedule]);

  const handleRemind = useCallback((id: string, e?: React.MouseEvent) => {
    e?.stopPropagation?.();
    console.log('[Schedule] toggle reminder:', id);
    toggleReminder(id);
    const has = hasReminder(id);
    Taro.showToast({
      title: has ? '已取消提醒' : '已设置提醒',
      icon: 'success'
    });
  }, [toggleReminder, hasReminder]);

  const handleRecordResult = useCallback((item: any, e?: React.MouseEvent) => {
    e?.stopPropagation?.();
    console.log('[Schedule] record result:', item.id);
    if (item.recordId) {
      Taro.navigateTo({ url: `/pages/review/index?id=${item.recordId}` }).catch(err => {
        console.error('[Schedule] navigate review error:', err);
      });
    } else {
      Taro.navigateTo({ url: `/pages/record-result/index?scheduleId=${item.id}` }).catch(err => {
        console.error('[Schedule] navigate record error:', err);
      });
    }
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

  const getGameName = (gameKey: string) => {
    return GAME_NAMES[gameKey as keyof typeof GAME_NAMES] || gameKey;
  };

  const getOpponentLogo = (item: any) => {
    if (item.opponentLogo) return item.opponentLogo;
    if (item.type === 'training') return myTeam.logo;
    return 'https://picsum.photos/id/10/200/200';
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
        <Text className={styles.sectionTitle}>{sectionTitle}</Text>
        {schedules.length > 0 ? (
          schedules.map(item => (
            <View
              key={item.id}
              className={classnames(styles.matchCard, item.status)}
              onClick={() => handleCardClick(item.id)}
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
                    src={getOpponentLogo(item)}
                    mode="aspectFill"
                  />
                </View>
              </View>

              <View className={styles.matchInfo}>
                <View className={styles.infoItem}>
                  <Text className={styles.infoIcon}>🎮</Text>
                  <Text>{getGameName(item.game)}</Text>
                </View>
                {item.map && (
                  <View className={styles.infoItem}>
                    <Text className={styles.infoIcon}>📍</Text>
                    <Text>{item.map}</Text>
                  </View>
                )}
                {getStatusTag(item.status)}
                {hasReminder(item.id) && (
                  <Tag text="已设提醒" type="info" size="sm" />
                )}
              </View>

              {item.status === 'pending' && (
                <View className={styles.matchActions}>
                  <View
                    className={classnames(styles.actionBtn, styles.actionBtnSecondary)}
                    onClick={(e) => e.stopPropagation?.()}
                  >
                    <Text>拒绝</Text>
                  </View>
                  <View
                    className={classnames(styles.actionBtn, styles.actionBtnPrimary)}
                    onClick={(e) => handleConfirm(item.id, e)}
                  >
                    <Text>确认参赛</Text>
                  </View>
                </View>
              )}

              {item.status === 'confirmed' && (
                <View className={styles.matchActions}>
                  <View
                    className={classnames(
                      styles.actionBtn,
                      styles.actionBtnSecondary,
                      hasReminder(item.id) && styles.actionBtnActive
                    )}
                    onClick={(e) => handleRemind(item.id, e)}
                  >
                    <Text>{hasReminder(item.id) ? '取消提醒' : '设置提醒'}</Text>
                  </View>
                  <View
                    className={classnames(styles.actionBtn, styles.actionBtnPrimary)}
                    onClick={(e) => e.stopPropagation?.()}
                  >
                    <Text>进入房间</Text>
                  </View>
                </View>
              )}

              {item.status === 'finished' && (
                <View className={styles.matchActions}>
                  <View
                    className={classnames(styles.actionBtn, styles.actionBtnSecondary)}
                    onClick={(e) => e.stopPropagation?.()}
                  >
                    <Text>查看详情</Text>
                  </View>
                  <View
                    className={classnames(styles.actionBtn, styles.actionBtnPrimary)}
                    onClick={(e) => handleRecordResult(item, e)}
                  >
                    <Text>{item.recordId ? '查看战绩' : '录入战绩'}</Text>
                  </View>
                </View>
              )}
            </View>
          ))
        ) : (
          <View className={styles.emptyState}>
            <EmptyState
              title="暂无赛程"
              description="去约战大厅找一支队伍来场训练赛吧"
            />
          </View>
        )}
      </View>
    </View>
  );
};

export default SchedulePage;
