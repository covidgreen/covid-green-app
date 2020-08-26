import {StyleSheet, ViewStyle} from 'react-native';

const cardImageStyle: ViewStyle = {
  justifyContent: 'center',
  alignItems: 'center',
  borderTopLeftRadius: 6,
  borderTopRightRadius: 6
};

export const styles = StyleSheet.create({
  messageWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: 20
  },
  cardImageSuccess: {
    ...cardImageStyle,
    backgroundColor: '#e5f2eb'
  },
  cardImageWarning: {
    ...cardImageStyle,
    backgroundColor: '#ecdbe4'
  },
  buttonsWrapper: {
    width: '100%'
  }
});
