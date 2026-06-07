import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import EmptyState from '@/components/EmptyState';
import { messages } from '@/data/messages';
import { Message } from '@/types';

const tabs = [
  { key: 'all', label: '全部' },
  { key: 'private', label: '私信' },
  { key: 'system', label: '系统' },
  { key: 'team', label: '队内' }
];

const MessagePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [msgList, setMsgList] = useState<Message[]>(messages);

  const filteredMessages = useMemo(() => {
    if (activeTab === 'all') return msgList;
    return msgList.filter(m => m.type === activeTab);
  }, [activeTab, msgList]);

  const unreadCounts = useMemo(() => {
    const counts: Record<string, number> = { all: 0, private: 0, system: 0, team: 0 };
    msgList.forEach(m => {
      if (m.unread) {
        counts.all++;
        counts[m.type]++;
      }
    });
    return counts;
  }, [msgList]);

  const handleTabChange = useCallback((key: string) => {
    console.log('[Message] tab changed:', key);
    setActiveTab(key);
  }, []);

  const handleMessageClick = useCallback((msg: Message) => {
    console.log('[Message] message clicked:', msg.id);
    setMsgList(prev =>
      prev.map(m => (m.id === msg.id ? { ...m, unread: false } : m))
    );
    Taro.showToast({ title: '查看消息详情', icon: 'none' });
  }, []);

  const handleMarkAllRead = useCallback(() => {
    console.log('[Message] mark all read');
    setMsgList(prev => prev.map(m => ({ ...m, unread: false })));
    Taro.showToast({ title: '已全部标为已读', icon: 'success' });
  }, []);

  const getIconWrapClass = (type: string) => {
    if (type === 'system') return 'system';
    if (type === 'team') return 'team';
    return '';
  };

  const getIconEmoji = (type: string) => {
    switch (type) {
      case 'system': return '🔔';
      case 'team': return '📢';
      default: return '💬';
    }
  };

  return (
    <View className={styles.page}>
      <View className={styles.tabBar}>
        {tabs.map(tab => (
          <View
            key={tab.key}
            className={classnames(styles.tabItem, activeTab === tab.key && styles.active)}
            onClick={() => handleTabChange(tab.key)}
          >
            <Text>{tab.label}</Text>
            {unreadCounts[tab.key] > 0 && (
              <View className={styles.tabBadge}>
                <Text>{unreadCounts[tab.key] > 99 ? '99+' : unreadCounts[tab.key]}</Text>
              </View>
            )}
          </View>
        ))}
      </View>

      <View className={styles.headerActions}>
        <Text className={styles.readAllBtn} onClick={handleMarkAllRead}>
          全部已读
        </Text>
      </View>

      <ScrollView scrollY showScrollbar={false}>
        {filteredMessages.length > 0 ? (
          <View className={styles.messageList}>
            {filteredMessages.map(msg => (
              <View
                key={msg.id}
                className={styles.messageItem}
                onClick={() => handleMessageClick(msg)}
              >
                <View className={styles.avatarWrap}>
                  {msg.type === 'private' ? (
                    <Image
                      className={styles.avatar}
                      src={msg.senderAvatar || 'https://picsum.photos/id/64/200/200'}
                      mode="aspectFill"
                    />
                  ) : (
                    <View className={classnames(styles.iconWrap, getIconWrapClass(msg.type))}>
                      <Text>{getIconEmoji(msg.type)}</Text>
                    </View>
                  )}
                  {msg.unread && <View className={styles.unreadDot} />}
                </View>
                <View className={styles.messageContent}>
                  <View className={styles.messageTop}>
                    <Text
                      className={classnames(
                        styles.messageTitle,
                        msg.unread && styles.unread
                      )}
                      numberOfLines={1}
                    >
                      {msg.title}
                    </Text>
                    <Text className={styles.messageTime}>{msg.time}</Text>
                  </View>
                  <Text className={styles.messagePreview} numberOfLines={1}>
                    {msg.content}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View className={styles.emptyState}>
            <EmptyState
              title="暂无消息"
              description="快去约战吧，消息会第一时间通知你"
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default MessagePage;
