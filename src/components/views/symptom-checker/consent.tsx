import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';

import {useApplication} from 'providers/context';
import {useSymptomChecker} from 'hooks/symptom-checker';

import {Spacing} from 'components/atoms/spacing';
import {Button} from 'components/atoms/button';
import {Markdown} from 'components/atoms/markdown';

import {Card} from 'components/atoms/card';

import {Scrollable} from 'components/templates/scrollable';
import {text, colors} from 'theme';

export function CheckInConsent() {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const app = useApplication();
  const {getNextScreen} = useSymptomChecker();

  const onYes = async () => {
    // TODO: specific function for handling consent?
    await app.setContext({checkInConsent: true});

    const nextScreen = getNextScreen('checker.consent');
    navigation.replace(nextScreen);
  };

  return (
    <Scrollable
      safeArea={false}
      headingShort
      backgroundColor={colors.background}
      heading={t('checker:title')}>
      <Card>
        <Text style={text.largeBold}>{t('welcome:title')}</Text>
        <Spacing s={16} />
        <Markdown style={styles.markdown} markdownStyles={markdownStyles}>
          {t('welcome:text')}
        </Markdown>
        <Spacing s={8} />
        <View style={styles.buttonsContainer}>
          <Button width={'100%'} onPress={onYes}>
            {t('welcome:action')}
          </Button>
        </View>
        <Spacing s={16} />
      </Card>
    </Scrollable>
  );
}

const markdownStyles = StyleSheet.create({
  block: {
    marginBottom: 18,
    lineHeight: 22
  }
});

export const styles = StyleSheet.create({
  markdown: {
    backgroundColor: colors.white
  },
  buttonsContainer: {
    alignItems: 'center'
  }
});
