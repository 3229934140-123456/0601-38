import React, { useCallback, useState } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import Tag from '@/components/Tag';
import { myTeam, recommendTeams } from '@/data/teams';
import { POSITION_NAMES, GAME_NAMES } from '@/types';

const TeamPage: React.FC = () => {
  const [hasTeam] = useState(true);

  const handleCreateTeam = useCallback(() => {
    console.log('[Team] create team');
    Taro.showToast({ title: '创建队伍功能开发中', icon: 'none' });
  }, []);

  const handleJoinTeam = useCallback((teamId: string) => {
    console.log('[Team] join team:', teamId);
    Taro.showToast({ title: '申请已发送', icon: 'success' });
  }, []);

  const handleMemberClick = useCallback((memberId: string) => {
    console.log('[Team] member clicked:', memberId);
  }, []);

  const handleInvite = useCallback(() => {
    console.log('[Team] invite member');
    Taro.showToast({ title: '邀请功能开发中', icon: 'none' });
  }, []);

  if (!hasTeam) {
    return (
      <View className={styles.page}>
        <View className={styles.emptyState}>
          <Text className={styles.emptyIcon}>👥</Text>
          <Text className={styles.emptyTitle}>还没有加入队伍</Text>
          <Text className={styles.emptyDesc}>
            创建或加入一支队伍，开始你的电竞之旅
          </Text>
          <View className={styles.emptyActions}>
            <View
              className={`${styles.emptyBtn} ${styles.emptyBtnPrimary}`}
              onClick={handleCreateTeam}
            >
              <Text>创建队伍</Text>
            </View>
            <View
              className={`${styles.emptyBtn} ${styles.emptyBtnSecondary}`}
              onClick={() => {}}
            >
              <Text>加入队伍</Text>
            </View>
          </View>
        </View>

        <View className={styles.recommendSection}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>推荐队伍</Text>
          </View>
          {recommendTeams.map(team => (
            <View key={team.id} className={styles.recommendCard}>
              <Image className={styles.recommendLogo} src={team.logo} mode="aspectFill" />
              <View className={styles.recommendInfo}>
                <Text className={styles.recommendName}>{team.name}</Text>
                <View className={styles.recommendMeta}>
                  <Text className={styles.recommendMetaText}>
                    {GAME_NAMES[team.game as keyof typeof GAME_NAMES] || team.game}
                  </Text>
                  <Text className={styles.recommendMetaText}>·</Text>
                  <Text className={styles.recommendMetaText}>{team.rank}</Text>
                  <Text className={styles.recommendMetaText}>·</Text>
                  <Text className={styles.recommendMetaText}>{team.winRate}%胜率</Text>
                </View>
              </View>
              <View
                className={styles.joinBtn}
                onClick={() => handleJoinTeam(team.id)}
              >
                <Text>申请加入</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  }

  return (
    <View className={styles.page}>
      <View className={styles.teamHeader}>
        <View className={styles.teamInfo}>
          <Image className={styles.teamLogo} src={myTeam.logo} mode="aspectFill" />
          <View className={styles.teamMain}>
            <Text className={styles.teamName}>{myTeam.name}</Text>
            <View className={styles.teamMeta}>
              <Text className={styles.gameTag}>
                {GAME_NAMES[myTeam.game as keyof typeof GAME_NAMES] || myTeam.game}
              </Text>
              <Text className={styles.rankTag}>{myTeam.rank}</Text>
            </View>
          </View>
        </View>
        <View className={styles.teamStats}>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{myTeam.totalMatches}</Text>
            <Text className={styles.statLabel}>总场次</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{myTeam.winRate}%</Text>
            <Text className={styles.statLabel}>胜率</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>
              {myTeam.memberCount}/{myTeam.maxMembers}
            </Text>
            <Text className={styles.statLabel}>成员</Text>
          </View>
        </View>
      </View>

      {myTeam.announcement && (
        <View className={styles.announcement}>
          <Text className={styles.announcementIcon}>📢</Text>
          <Text className={styles.announcementText} numberOfLines={1}>
            {myTeam.announcement}
          </Text>
          <Text className={styles.announcementMore}>详情</Text>
        </View>
      )}

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>队伍成员</Text>
          <Text className={styles.sectionAction} onClick={handleInvite}>
            邀请成员
          </Text>
        </View>
        <View className={styles.memberList}>
          {myTeam.members.map(member => (
            <View
              key={member.id}
              className={styles.memberItem}
              onClick={() => handleMemberClick(member.id)}
            >
              <Image className={styles.memberAvatar} src={member.avatar} mode="aspectFill" />
              <View className={styles.memberInfo}>
                <View className={styles.memberNameRow}>
                  <Text className={styles.memberName}>{member.nickname}</Text>
                  {member.isCaptain && (
                    <Text className={styles.captainBadge}>队长</Text>
                  )}
                </View>
                <View className={styles.memberMeta}>
                  <Text className={styles.positionTag}>
                    {POSITION_NAMES[member.position] || member.position}
                  </Text>
                  <Text className={styles.rankText}>{member.rank}</Text>
                </View>
              </View>
            </View>
          ))}
          <View className={styles.memberItem} onClick={handleInvite}>
            <View className={styles.addMemberBtn}>
              <Text>+</Text>
            </View>
            <View className={styles.memberInfo}>
              <Text className={styles.memberName} style={{ color: '#6B6B80' }}>
                邀请新成员
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View className={styles.recommendSection}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>推荐对手</Text>
        </View>
        {recommendTeams.slice(0, 3).map(team => (
          <View key={team.id} className={styles.recommendCard}>
            <Image className={styles.recommendLogo} src={team.logo} mode="aspectFill" />
            <View className={styles.recommendInfo}>
              <Text className={styles.recommendName}>{team.name}</Text>
              <View className={styles.recommendMeta}>
                <Text className={styles.recommendMetaText}>{team.rank}</Text>
                <Text className={styles.recommendMetaText}>·</Text>
                <Text className={styles.recommendMetaText}>{team.winRate}%胜率</Text>
                <Text className={styles.recommendMetaText}>·</Text>
                <Text className={styles.recommendMetaText}>{team.totalMatches}场</Text>
              </View>
            </View>
            <View
              className={styles.joinBtn}
              onClick={() => handleJoinTeam(team.id)}
            >
              <Text>约战</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export default TeamPage;
