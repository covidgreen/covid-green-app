import React, {FC} from 'react';
import {View, StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';

import {Markdown} from 'components/atoms/markdown';
import {Scrollable} from 'components/templates/scrollable';
import {KeepSafeIcons} from 'assets/icons';

const map: {[key: number]: any} = Object.entries(KeepSafeIcons).reduce(
  (p, c, i) => {
    return {
      ...p,
      [i]: c[1]({width: 48, height: 48})
    };
  },
  {}
);

function renderListBullet(_: boolean, index: number) {
  return <View style={styles.listIcon}>{map[index]}</View>;
}

export const CloseContactInfo: FC = () => {
  const {t} = useTranslation();
  return (
    <Scrollable heading={t('closeContactInfo:title')}>
      <Markdown renderListBullet={renderListBullet}>
        {t('closeContactInfo:info')}
      </Markdown>
    </Scrollable>
  );
};

const styles = StyleSheet.create({
  listIcon: {
    marginTop: 12,
    marginRight: 12
  }
});
