import React, { useCallback, useState } from 'react';
import { View, Text, Image, ScrollView, Textarea } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import { gameRecords } from '@/data/records';
import { GameRecord } from '@/types';

const ReviewPage: React.FC = () => {
  const [record] = useState<GameRecord>(gameRecords[0]);
  const [reviewNote, setReviewNote] = useState(record.reviewNote || '');
  const [punctuality, setPunctuality] = useState(record.opponentPunctuality || 0);
  const [mistakes, setMistakes] = useState<string[]>(record.keyMistakes || []);

  const handleScreenshotClick = useCallback((index: number) => {
    console.log('[Review] screenshot clicked:', index);
    Taro.previewImage({
      current: record.screenshots?.[index] || '',
      urls: record.screenshots || []
    });
  }, [record.screenshots]);

  const handleSubmit = useCallback(() => {
    console.log('[Review] submit review');
    Taro.showToast({ title: '复盘已提交', icon: 'success' });
    setTimeout(() => {
      Taro.navigateBack().catch(err => {
        console.error('[Review] navigateBack error:', err);
      });
    }, 1500);
  }, []);

  const handleAddMistake = useCallback(() => {
    console.log('[Review] add mistake');
    Taro.showModal({
      title: '添加失误',
      editable: true,
      placeholderText: '请输入失误描述',
      confirmText: '添加',
      confirmColor: '#7B2FFD',
      success: (res) => {
        if (res.confirm && res.content) {
          setMistakes(prev => [...prev, res.content!]);
        }
      }
    });
  }, []);

  const handleRate = useCallback((score: number) => {
    console.log('[Review] rate punctuality:', score);
    setPunctuality(score);
  }, []);

  const renderStars = (rating: number, onRate?: (score: number) => void) => {
    return (
      <View className={styles.starsRow}>
        {[1, 2, 3, 4, 5].map(star => (
          <Text
            key={star}
            className={classnames(styles.star, star <= rating && styles.active)}
            onClick={() => onRate?.(star)}
          >
            ★
          </Text>
        ))}
      </View>
    );
  };

  return (
    <View className={styles.page}>
      <View className={classnames(styles.resultHeader, record.result)}>
        <Text className={styles.resultText}>
          {record.result === 'win' ? '胜利' : '失败'}
        </Text>
        <View className={styles.scoreRow}>
          <View className={styles.scoreTeam}>
            <Image
              className={styles.teamLogo}
              src="https://picsum.photos/id/1/200/200"
              mode="aspectFill"
            />
            <Text className={styles.teamName}>暗夜猎手</Text>
            <Text className={styles.scoreBig}>{record.ourScore}</Text>
          </View>
          <Text className={styles.vsText}>VS</Text>
          <View className={styles.scoreTeam}>
            <Image
              className={styles.teamLogo}
              src="https://picsum.photos/id/2/200/200"
              mode="aspectFill"
            />
            <Text className={styles.teamName}>{record.opponentTeam}</Text>
            <Text className={styles.scoreBig}>{record.opponentScore}</Text>
          </View>
        </View>
        <View className={styles.matchMeta}>
          <Text className={styles.metaItem}>{record.mode}</Text>
          <Text className={styles.metaItem}>·</Text>
          <Text className={styles.metaItem}>{record.map}</Text>
          <Text className={styles.metaItem}>·</Text>
          <Text className={styles.metaItem}>{record.duration}</Text>
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>比赛详情</Text>
        <View className={styles.infoCard}>
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>游戏</Text>
            <Text className={styles.infoValue}>{record.game}</Text>
          </View>
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>模式</Text>
            <Text className={styles.infoValue}>{record.mode}</Text>
          </View>
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>地图</Text>
            <Text className={styles.infoValue}>{record.map}</Text>
          </View>
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>时间</Text>
            <Text className={styles.infoValue}>{record.time}</Text>
          </View>
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>时长</Text>
            <Text className={styles.infoValue}>{record.duration}</Text>
          </View>
          {record.myHero && (
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>我的英雄</Text>
              <Text className={styles.infoValue}>{record.myHero}</Text>
            </View>
          )}
          {record.myKda && (
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>我的KDA</Text>
              <Text className={styles.infoValue}>{record.myKda}</Text>
            </View>
          )}
        </View>
      </View>

      {record.screenshots && record.screenshots.length > 0 && (
        <View className={styles.section}>
          <Text className={styles.sectionTitle}>比赛截图</Text>
          <ScrollView
            className={styles.screenshotScroll}
            scrollX
            showScrollbar={false}
          >
            {record.screenshots.map((src, index) => (
              <View
                key={index}
                className={styles.screenshotItem}
                onClick={() => handleScreenshotClick(index)}
              >
                <Image
                  className={styles.screenshotImg}
                  src={src}
                  mode="aspectFill"
                />
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>关键失误</Text>
        <View className={styles.mistakeList}>
          {mistakes.length > 0 ? (
            mistakes.map((mistake, index) => (
              <View key={index} className={styles.mistakeItem}>
                <Text className={styles.mistakeIcon}>⚠️</Text>
                <Text className={styles.mistakeText}>{mistake}</Text>
              </View>
            ))
          ) : (
            <Text className={styles.mistakeText} style={{ textAlign: 'center', color: '#6B6B80' }}>
              暂无失误标记
            </Text>
          )}
          <View className={styles.addMistakeBtn} onClick={handleAddMistake}>
            <Text>+ 添加失误</Text>
          </View>
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>复盘笔记</Text>
        <View className={styles.noteCard}>
          <Textarea
            className={styles.noteInput}
            placeholder="记录一下这场比赛的心得体会..."
            placeholderClass="textarea-placeholder"
            value={reviewNote}
            onInput={(e) => setReviewNote(e.detail.value)}
            autoHeight
            maxlength={500}
          />
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>对手评价</Text>
        <View className={styles.ratingSection}>
          <View className={styles.ratingRow}>
            <Text className={styles.ratingLabel}>守时度</Text>
            {renderStars(punctuality, handleRate)}
          </View>
          <View className={styles.ratingRow}>
            <Text className={styles.ratingLabel}>整体实力</Text>
            {renderStars(4)}
          </View>
          <View className={styles.ratingRow}>
            <Text className={styles.ratingLabel}>游戏态度</Text>
            {renderStars(5)}
          </View>
        </View>
      </View>

      <View className={styles.bottomBar}>
        <View className={styles.secondaryBtn} onClick={() => {}}>
          <Text>分享</Text>
        </View>
        <View className={styles.submitBtn} onClick={handleSubmit}>
          <Text>提交复盘</Text>
        </View>
      </View>
    </View>
  );
};

export default ReviewPage;
