import React from 'react';
import {Text, View, StyleSheet, TouchableWithoutFeedback} from 'react-native';
import {useTranslation} from 'react-i18next';

import {AppIcons} from 'assets/icons';
import {Button} from 'components/atoms/button';
import {colors, text} from 'theme';
import {DataProtectionLink} from 'components/views/data-protection-policy';
import {Markdown} from 'components/atoms/markdown';
import {Spacing} from 'components/atoms/spacing';
import {useApplication} from 'providers/context';

interface CheckInConsentProps {
  onDismissed?: () => void;
  onConsent?: () => void;
}

export const CheckInConsent: React.FC<CheckInConsentProps> = ({
  onDismissed,
  onConsent
}) => {
  const {t} = useTranslation();
  const app = useApplication();

  const onYes = async () => {
    await app.setContext({checkInConsent: true});
    onConsent && onConsent();
  };

  return (
    <View style={styles.container}>
      {onDismissed && (
        <View style={styles.dismissed}>
          <TouchableWithoutFeedback onPress={onDismissed}>
            <View>
              <AppIcons.Close width={24} height={24} />
            </View>
          </TouchableWithoutFeedback>
        </View>
      )}
      <Text style={text.largeBold}>{t('welcome:title')}</Text>
      <Spacing s={18} />
      <Markdown markdownStyles={markdownStyles}>{t('welcome:text')}</Markdown>
      <Spacing s={8} />
      <View style={styles.buttonsContainer}>
        <Button width={'100%'} onPress={onYes}>
          {t('welcome:action')}
        </Button>
      </View>
      <Spacing s={16} />
      <DataProtectionLink />
    </View>
  );
};

const markdownStyles = StyleSheet.create({
  block: {
    marginBottom: 18
  }
});

export const styles = StyleSheet.create({
  container: {
    position: 'relative',
    backgroundColor: colors.white,
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 4,
    padding: 16,
    marginBottom: 16
  },
  buttonsContainer: {
    alignItems: 'center'
  },
  dismissed: {
    position: 'absolute',
    width: 24,
    height: 24,
    top: 9,
    right: 9,
    zIndex: 99
  }
});
