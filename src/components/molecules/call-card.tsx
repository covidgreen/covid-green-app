import React, {FC} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {BubbleIcons} from 'assets/icons';
import {text} from 'theme';
import {Card} from 'components/atoms/card';

interface CallCardProps {
  onPress?: () => void;
  message: String;
}

export const CallCard: FC<CallCardProps> = ({onPress, message}) => {
  return (
    <Card type="empty" padding={{h: 16, r: 16}} onPress={onPress}>
      <View style={styles.row}>
        <BubbleIcons.CallGreen height={56} width={56} />
        <Text style={[text.largeBold, styles.text]}>{message}</Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  text: {
    paddingLeft: 20
  }
});
