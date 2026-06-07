import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, Textarea } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import Tag from '@/components/Tag';
import { useAppStore } from '@/store';
import { myTeam } from '@/store';
import { GAME_NAMES } from '@/types';

const RecordResultPage: React.FC = () => {
  const router = useRouter();
  const scheduleId = router.params.scheduleId || '';

  const getScheduleById = useAppStore((state) => state.getScheduleById);
  const addGameRecordFromSchedule = useAppStore((state) => state.addGameRecordFromSchedule);

  const [schedule, setSchedule] = useState<any>(null);
  const [ourScore, setOurScore] = useState(2);
  const [opponentScore, setOpponentScore] = useState(1);
  const [myHero, setMyHero] = useState('');
  const [myKda, setMyKda] = useState('');
  const [duration, setDuration] = useState('32:45');
  const [screenshots, setScreenshots] = useState<string[]>([]);
  const [note, setNote] = useState('');

  useEffect(() => {
    const data = getScheduleById(scheduleId);
    if (data) {
      setSchedule(data);
    }
  }, [scheduleId, getScheduleById]);

  const result = ourScore > opponentScore ? 'win' : ourScore < opponentScore ? 'lose' : 'draw';

  const handleAddScreenshot = useCallback(() => {
    console.log('[RecordResult] add screenshot');
    const newScreenshot = `https://picsum.photos/id/${Math.floor(Math.random() * 100) + 200}/800/600`;
    setScreenshots(prev => [...prev, newScreenshot]);
    Taro.showToast({ title: '截图已添加', icon: 'success' });
  }, []);

  const handleScreenshotClick = useCallback((index: number) => {
    console.log('[RecordResult] screenshot clicked:', index);
    if (screenshots.length > 0) {
      Taro.previewImage({
        current: screenshots[index],
        urls: screenshots
      });
    }
  }, [screenshots]);

  const handleSubmit = useCallback(() => {
    console.log('[RecordResult] submit:', { ourScore, opponentScore, myHero, myKda, duration, screenshots, note });

    const recordId = addGameRecordFromSchedule(scheduleId, {
      ourScore,
      opponentScore,
      result,
      duration,
      myHero: myHero || undefined,
      myKda: myKda || undefined,
      screenshots: screenshots.length > 0 ? screenshots : undefined,
      reviewNote: note || undefined,
      keyMistakes: [],
      opponentPunctuality: 0
    });

    Taro.showToast({ title: '战绩已保存', icon: 'success' });

    setTimeout(() => {
      if (recordId) {
        Taro.redirectTo({ url: `/pages/review/index?id=${recordId}` }).catch(err => {
          console.error('[RecordResult] redirect error:', err);
          Taro.navigateBack().catch(() => {});
        });
      } else {
        Taro.navigateBack().catch(() => {});
      }
    }, 1000);
  }, [scheduleId, ourScore, opponentScore, result, duration, myHero, myKda, screenshots, note, addGameRecordFromSchedule]);

  const getGameName = (gameKey: string) => {
    return GAME_NAMES[gameKey as keyof typeof GAME_NAMES] || gameKey;
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
      <View className={classnames(styles.resultHeader, result)}>
        <Text className={styles.resultText}>
          {result === 'win' ? '胜利' : result === 'lose' ? '失败' : '平局'}
        </Text>
        <View className={styles.scoreRow}>
          <View className={styles.scoreTeam}>
            <Image className={styles.teamLogo} src={myTeam.logo} mode="aspectFill" />
            <Text className={styles.teamName}>{myTeam.name}</Text>
            <View className={styles.scoreInput}>
              <Text
                className={styles.scoreBtn}
                onClick={() => setOurScore(Math.max(0, ourScore - 1))}
              >
                -
              </Text>
              <Text className={styles.scoreNum}>{ourScore}</Text>
              <Text
                className={styles.scoreBtn}
                onClick={() => setOurScore(ourScore + 1)}
              >
                +
              </Text>
            </View>
          </View>

          <Text className={styles.vsText}>VS</Text>

          <View className={styles.scoreTeam}>
            <Image
              className={styles.teamLogo}
              src={schedule.opponentLogo || 'https://picsum.photos/id/2/200/200'}
              mode="aspectFill"
            />
            <Text className={styles.teamName}>{schedule.opponent}</Text>
            <View className={styles.scoreInput}>
              <Text
                className={styles.scoreBtn}
                onClick={() => setOpponentScore(Math.max(0, opponentScore - 1))}
              >
                -
              </Text>
              <Text className={styles.scoreNum}>{opponentScore}</Text>
              <Text
                className={styles.scoreBtn}
                onClick={() => setOpponentScore(opponentScore + 1)}
              >
                +
              </Text>
            </View>
          </View>
        </View>

        <View className={styles.matchMeta}>
          <Text className={styles.metaItem}>{schedule.mode || '5v5'}</Text>
          <Text className={styles.metaItem}>·</Text>
          <Text className={styles.metaItem}>{schedule.map || '未知地图'}</Text>
          <Text className={styles.metaItem}>·</Text>
          <Text className={styles.metaItem}>{getGameName(schedule.game)}</Text>
        </View>
      </View>

      <ScrollView className={styles.content} scrollY showScrollbar={false}>
        <View className={styles.infoCard}>
          <Text className={styles.cardTitle}>比赛信息</Text>

          <View className={styles.formRow}>
            <Text className={styles.formLabel}>比赛时长</Text>
            <View className={styles.formInputWrap}>
              <Textarea
                className={styles.formInput}
                placeholder="如：32:45"
                value={duration}
                onInput={(e) => setDuration(e.detail.value)}
                maxlength={20}
              />
            </View>
          </View>

          <View className={styles.formRow}>
            <Text className={styles.formLabel}>我的英雄</Text>
            <View className={styles.formInputWrap}>
              <Textarea
                className={styles.formInput}
                placeholder="请输入你使用的英雄"
                value={myHero}
                onInput={(e) => setMyHero(e.detail.value)}
                maxlength={50}
              />
            </View>
          </View>

          <View className={styles.formRow}>
            <Text className={styles.formLabel}>KDA</Text>
            <View className={styles.formInputWrap}>
              <Textarea
                className={styles.formInput}
                placeholder="如：8/3/12"
                value={myKda}
                onInput={(e) => setMyKda(e.detail.value)}
                maxlength={20}
              />
            </View>
          </View>
        </View>

        <View className={styles.infoCard}>
          <Text className={styles.cardTitle}>比赛截图</Text>
          <View className={styles.screenshotGrid}>
            {screenshots.map((src, index) => (
              <View
                key={index}
                className={styles.screenshotItem}
                onClick={() => handleScreenshotClick(index)}
              >
                <Image className={styles.screenshotImg} src={src} mode="aspectFill" />
              </View>
            ))}
            {screenshots.length < 6 && (
              <View
                className={classnames(styles.screenshotItem, styles.addScreenshot)}
                onClick={handleAddScreenshot}
              >
                <Text className={styles.addIcon}>+</Text>
                <Text className={styles.addText}>添加截图</Text>
              </View>
            )}
          </View>
        </View>

        <View className={styles.infoCard}>
          <Text className={styles.cardTitle}>简单备注</Text>
          <Textarea
            className={styles.noteInput}
            placeholder="记录一下这场比赛的情况..."
            placeholderClass="textarea-placeholder"
            value={note}
            onInput={(e) => setNote(e.detail.value)}
            autoHeight
            maxlength={300}
          />
        </View>
      </ScrollView>

      <View className={styles.bottomBar}>
        <View className={styles.submitBtn} onClick={handleSubmit}>
          <Text>保存并继续复盘</Text>
        </View>
      </View>
    </View>
  );
};

export default RecordResultPage;
