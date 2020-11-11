import React from 'react';
import {useTranslation} from 'react-i18next';
import {Text, Switch, View, StyleSheet} from 'react-native';

import {colors, text} from 'theme';
import {DataProtectionLink} from 'components/views/data-protection-policy';
import {Markdown} from 'components/atoms/markdown';
import {Spacing} from 'components/atoms/spacing';
import {useExposure} from 'react-native-exposure-notification-service';
import {Scrollable} from 'components/templates/scrollable';
import {useApplication} from 'providers/context';

export const Metrics = () => {
  const {t} = useTranslation();
  const {configure} = useExposure();
  const {analyticsOptIn, setContext} = useApplication();

  const toggleSwitch = async () => {
    setContext({analyticsOptIn: !analyticsOptIn});
    configure();
  };

  return (
    <Scrollable heading={t('metrics:title')}>
      <Markdown style={{}} markdownStyles={markdownStyles}>
        {t('metrics:info')}
      </Markdown>
      <Spacing s={16} />
      <DataProtectionLink />
      <Spacing s={32} />
      <View style={styles.row}>
        <View style={styles.label} accessibilityElementsHidden>
          <Text style={text.largeBold}>{t('metrics:share')}</Text>
        </View>
        <View>
          <Switch
            accessibilityRole="switch"
            accessibilityLabel={t('metrics:share')}
            trackColor={{
              false: colors.darkGray,
              true: colors.purple
            }}
            thumbColor={colors.white}
            onValueChange={toggleSwitch}
            value={analyticsOptIn}
          />
        </View>
      </View>
    </Scrollable>
  );
};

const markdownStyles = StyleSheet.create({
  text: {
    ...text.default,
    flexWrap: 'wrap',
    marginBottom: 18
  },
  block: {
    marginBottom: 18
  }
});

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  label: {
    flex: 1
  }
});
