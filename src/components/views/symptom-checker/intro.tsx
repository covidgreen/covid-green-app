import React, {useState, useEffect} from 'react';
import {Text} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';

import {useApplication} from 'providers/context';
import {useDbText} from 'providers/settings';
import {useFocusRef, setAccessibilityFocusRef} from 'hooks/accessibility';
import {useSymptomChecker} from 'hooks/symptom-checker';

import {Spacing, Separator} from 'components/atoms/layout';
import {Button} from 'components/atoms/button';
import {Dropdown} from 'components/atoms/dropdown';
import {Scrollable} from 'components/templates/scrollable';
import {Card} from 'components/atoms/card';
import {AppIcons} from 'assets/icons';

import {text, colors} from 'theme';

interface IntroState {
  gender: string;
  race: string;
  ethnicity: string;
  ageRange: string;
  county: string;
}

export function CheckInIntro() {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const app = useApplication();
  const {
    genderOptions,
    raceOptions,
    ethnicityOptions,
    ageRangeOptions,
    countiesOptions
  } = useDbText();
  const {getNextScreen} = useSymptomChecker();
  const [ref1, ref2, ref3, ref4, ref5] = useFocusRef({
    count: 5,
    timeout: 1000
  });

  const [state, setState] = useState<IntroState>({
    gender: (app.user && app.user.gender) || '',
    race: (app.user && app.user.race) || '',
    ethnicity: (app.user && app.user.ethnicity) || '',
    ageRange: (app.user && app.user.ageRange) || '',
    county: (app.user && app.user.county) || ''
  });
  const [searchTerm, setSearchTerm] = useState<string>('');

  const counties = !searchTerm
    ? countiesOptions
    : countiesOptions.filter(
        ({label}) =>
          label && label.toLowerCase().includes(searchTerm.toLowerCase())
      );

  // TODO: check on how to update state
  useEffect(() => {
    if (!app.user) {
      return;
    }

    if (
      app.user.gender !== state.gender ||
      app.user.race !== state.race ||
      app.user.ethnicity !== state.ethnicity ||
      app.user.ageRange !== state.ageRange ||
      app.user.county !== state.county
    ) {
      setState((s) => ({
        ...s,
        gender: (app.user && app.user.gender) || '',
        race: (app.user && app.user.race) || '',
        ethnicity: (app.user && app.user.ethnicity) || '',
        ageRange: (app.user && app.user.ageRange) || '',
        county: (app.user && app.user.county) || ''
      }));
    }
  }, [app.user]);

  const onContinue = async () => {
    await app.setContext({
      user: {
        ...app.user,
        gender: state.gender || 'u',
        race: state.race || 'u',
        ethnicity: state.ethnicity || 'u',
        ageRange: state.ageRange || 'u',
        county: state.county.split('_')[0] || 'u'
      }
    });

    navigation.navigate(getNextScreen('checker.intro'));
  };

  return (
    <Scrollable
      accessibilityRefocus={false}
      headingShort
      backgroundColor={colors.background}
      safeArea={false}
      heading={t('checker:introTitle')}>
      <Card>
        <Text maxFontSizeMultiplier={2} style={text.default}>
          {t('checker:introOptional')}
        </Text>
        <Spacing s={24} />
        <Dropdown
          icon={<AppIcons.Search width={20} height={20} />}
          ref={ref1}
          label={t('county:label')}
          placeholder={t('county:dropdownPlaceholder')}
          items={countiesOptions}
          value={state.county}
          search={{
            placeholder: t('county:searchPlaceholder'),
            items: counties,
            term: searchTerm,
            onChange: setSearchTerm,
            noResults: t('county:noResults')
          }}
          onValueChange={(county) => {
            setSearchTerm('');
            setState((s) => ({...s, county}));
            setAccessibilityFocusRef(ref1);
          }}
          onClose={() => {
            setSearchTerm('');
            setAccessibilityFocusRef(ref1);
          }}
        />
        <Separator />
        <Dropdown
          ref={ref2}
          label={t('gender:label')}
          placeholder={t('gender:placeholder')}
          items={genderOptions}
          value={state.gender}
          onValueChange={(gender) => {
            setState((s) => ({...s, gender}));
            setAccessibilityFocusRef(ref2);
          }}
          onClose={() => setAccessibilityFocusRef(ref2)}
        />
        <Separator />
        <Dropdown
          ref={ref3}
          label={t('ageRange:label')}
          placeholder={t('ageRange:placeholder')}
          items={ageRangeOptions}
          value={state.ageRange}
          onValueChange={(ageRange) => {
            setState((s) => ({...s, ageRange}));
            setAccessibilityFocusRef(ref3);
          }}
          onClose={() => setAccessibilityFocusRef(ref3)}
        />
        <Separator />
        <Dropdown
          ref={ref4}
          label={t('race:label')}
          placeholder={t('race:placeholder')}
          items={raceOptions}
          value={state.race}
          onValueChange={(race) => {
            setState((s) => ({...s, race}));
            setAccessibilityFocusRef(ref4);
          }}
          onClose={() => setAccessibilityFocusRef(ref4)}
        />
        <Separator />
        <Dropdown
          ref={ref5}
          label={t('ethnicity:label')}
          placeholder={t('ethnicity:placeholder')}
          items={ethnicityOptions}
          value={state.ethnicity}
          onValueChange={(ethnicity) => {
            setState((s) => ({...s, ethnicity}));
            setAccessibilityFocusRef(ref5);
          }}
          onClose={() => setAccessibilityFocusRef(ref5)}
        />
        <Separator />
        <Button width="100%" onPress={onContinue}>
          {t('checker:introButton')}
        </Button>
      </Card>
    </Scrollable>
  );
}
