import React, {FC} from 'react';
import {useTranslation} from 'react-i18next';

import {Markdown} from 'components/atoms/markdown';
import {Scrollable} from 'components/templates/scrollable';

export const CloseContactInfo: FC = () => {
  const {t} = useTranslation();

  return (
    <Scrollable heading={t('closeContactInfo:title')}>
      <Markdown>{t('closeContactInfo:info')}</Markdown>
    </Scrollable>
  );
};
