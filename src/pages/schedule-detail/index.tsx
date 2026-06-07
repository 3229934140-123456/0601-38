import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, Switch } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import Tag from '@/components/Tag';
import { useAppStore } from '@/store';
import { myTeam } from '@/store';
import { GAME_NAMES, POSITION_NAMES } from '@/types';

const ScheduleDetailPage: React.FC = () => {
  const router = useRouter();
  const scheduleId = router.params.id || '';

  const getScheduleById = useAppStore((state) => state.getScheduleById);
  const confirmSchedule = useAppStore((state) => state.confirmSchedule);
  const toggleReminder = useAppStore((state) => state.toggleReminder);
  const hasReminder = useAppStore((state) => state.hasReminder);
  const getGameRecordById = useAppStore((state) => state.getGameRecordById);

  const [schedule, setSchedule] = useState<any>(null);
  const [reminder, setReminder] = useState(false);

  useEffect(() => {
    const data = getScheduleById(scheduleId);
    if (data) {
      setSchedule(data);
      setReminder(hasReminder(scheduleId));
    }
  }, [scheduleId, getScheduleById, hasReminder]);

  const handleReminderChange = useCallback((checked: boolean) => {
    console.log('[ScheduleDetail] reminder changed:', checked);
    toggleReminder(scheduleId);
    setReminder(checked);
    Taro.showToast({
      title: checked ? '已设置提醒' : '已取消提醒',
      icon: 'success'
    });
  }, [scheduleId, toggleReminder]);

  const handleConfirm = useCallback(() => {
    console.log('[ScheduleDetail] confirm');
    Taro.showModal({
      title: '确认参赛',
      content: '确定要参加这场比赛吗？',
      confirmText: '确认',
      confirmColor: '#7B2FFD',
      success: (res) => {
        if (res.confirm) {
          confirmSchedule(scheduleId);
          setSchedule((prev: any) => prev ? { ...prev, status: 'confirmed' } : prev);
          Taro.showToast({ title: '已确认', icon: 'success' });
        }
      }
    });
  }, [scheduleId, confirmSchedule]);

  const handleRecordResult = useCallback(() => {
    console.log('[ScheduleDetail] record result');
    if (schedule?.recordId) {
      Taro.navigateTo({ url: `/pages/review/index?id=${schedule.recordId}` }).catch(err => {
        console.error('[ScheduleDetail] navigate review error:', err);
      });
    } else {
      Taro.navigateTo({ url: `/pages/record-result/index?scheduleId=${scheduleId}` }).catch(err => {
        console.error('[ScheduleDetail] navigate record error:', err);
      });
    }
  }, [schedule, scheduleId]);

  const getGameName = (gameKey: string) => {
    return GAME_NAMES[gameKey as keyof typeof GAME_NAMES] || gameKey;
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'scrim': return '训练赛';
      case 'tournament': return '赛事';
      case 'training': return '队内训练';
      default: return '其他';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return '已确认';
      case 'pending': return '待确认';
      case 'finished': return '已结束';
      default: return '未知';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return '#00D1FF';
      case 'pending': return '#FFA500';
      case 'finished': return '#6B6B80';
      default: return '#6B6B80';
    }
  };

  if (!schedule) {
    return (
      <View className={styles.page}>
        <View className={styles.loading}>
          <Text>加载中...</Text>
        </View>
      </View>
    );
  }

  return (
    <View className={styles.page}>
      <View className={classnames(styles.header, schedule.status)}>
        <View className={styles.headerTop}>
          <Text className={styles.dateText}>{schedule.date} {schedule.time}</Text>
          <Tag
            text={getStatusText(schedule.status)}
            type={schedule.status === 'confirmed' ? 'success' : schedule.status === 'pending' ? 'warning' : 'default'}
            size="md"
          />
        </View>

        <View className={styles.teamsSection}>
          <View className={styles.teamSide}>
            <Image className={styles.teamLogo} src={myTeam.logo} mode="aspectFill" />
            <Text className={styles.teamName}>{myTeam.name}</Text>
            <Text className={styles.teamLabel}>我方</Text>
          </View>

          <View className={styles.vsSection}>
            <Text className={styles.vsText}>VS</Text>
            <Text className={styles.typeText}>{getTypeLabel(schedule.type)}</Text>
          </View>

          <View className={styles.teamSide}>
            <Image
              className={styles.teamLogo}
              src={schedule.opponentLogo || 'https://picsum.photos/id/2/200/200'}
              mode="aspectFill"
            />
            <Text className={styles.teamName}>{schedule.opponent}</Text>
            <Text className={styles.teamLabel}>对手</Text>
          </View>
        </View>
      </View>

      <ScrollView className={styles.content} scrollY showScrollbar={false}>
        <View className={styles.infoCard}>
          <Text className={styles.cardTitle}>比赛信息</Text>

          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>游戏</Text>
            <Text className={styles.infoValue}>{getGameName(schedule.game)}</Text>
          </View>
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>模式</Text>
            <Text className={styles.infoValue}>{schedule.mode || '5v5'}</Text>
          </View>
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>地图</Text>
            <Text className={styles.infoValue}>{schedule.map || '未指定'}</Text>
          </View>
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>时间</Text>
            <Text className={styles.infoValue}>{schedule.date} {schedule.time}</Text>
          </View>
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>状态</Text>
            <Text
              className={styles.infoValue}
              style={{ color: getStatusColor(schedule.status) }}
            >
              {getStatusText(schedule.status)}
            </Text>
          </View>
        </View>

        <View className={styles.infoCard}>
          <View className={styles.cardHeader}>
            <Text className={styles.cardTitle}>赛前提醒</Text>
            <Switch
              checked={reminder}
              onChange={(e: any) => handleReminderChange(e.detail.value)}
              color="#7B2FFD"
            />
          </View>
          <Text className={styles.tipText}>
            开启后将在比赛开始前 30 分钟提醒你
          </Text>
        </View>

        {(schedule.members && schedule.members.length > 0) && (
          <View className={styles.infoCard}>
            <Text className={styles.cardTitle}>参赛成员</Text>
            <View className={styles.memberList}>
              {schedule.members.map((member: any) => (
                <View key={member.id} className={styles.memberItem}>
                  <Image className={styles.memberAvatar} src={member.avatar} mode="aspectFill" />
                  <View className={styles.memberInfo}>
                    <Text className={styles.memberName}>{member.nickname}</Text>
                    <View className={styles.memberTags}>
                      <Tag text={POSITION_NAMES[member.position] || member.position} type="primary" size="sm" />
                      {member.isCaptain && <Tag text="队长" type="success" size="sm" />}
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      <View className={styles.bottomBar}>
        {schedule.status === 'pending' && (
          <>
            <View className={styles.secondaryBtn}>
              <Text>拒绝</Text>
            </View>
            <View className={styles.primaryBtn} onClick={handleConfirm}>
              <Text>确认参赛</Text>
            </View>
          </>
        )}
        {schedule.status === 'confirmed' && (
          <>
            <View className={styles.secondaryBtn}>
              <Text>取消报名</Text>
            </View>
            <View className={styles.primaryBtn}>
              <Text>进入房间</Text>
            </View>
          </>
        )}
        {schedule.status === 'finished' && (
          <View className={styles.primaryBtn} onClick={handleRecordResult}>
            <Text>{schedule.recordId ? '查看战绩' : '录入战绩'}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default ScheduleDetailPage;
