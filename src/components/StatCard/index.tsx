import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';

interface StatCardProps {
  label: string;
  value: string | number;
  subText?: string;
  highlight?: boolean;
  color?: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, subText, highlight, color }) => {
  return (
    <View className={styles.card}>
      <Text className={styles.label}>{label}</Text>
      <Text
        className={styles.value}
        style={{ color: highlight ? color : undefined }}
      >
        {value}
      </Text>
      {subText && <Text className={styles.subText}>{subText}</Text>}
    </View>
  );
};

export default StatCard;
