import React, {useState, useRef} from 'react';
import {Text, ScrollView} from 'react-native';
import {useTranslation} from 'react-i18next';

import {AppIcons} from 'assets/icons';
import {Basic} from 'components/templates/basic';
import {Button} from 'components/atoms/button';
import {colors, text, baseStyles} from 'theme';
import {Dropdown} from 'components/atoms/dropdown';
import {LocationDropdown} from 'components/molecules/locality-dropdown';
import {Scrollable} from 'components/templates/scrollable';
import {SelectList} from 'components/atoms/select-list';
import {Spacing, Separator} from 'components/atoms/layout';
import {Toast} from 'components/atoms/toast';
import {useApplication, UserLocation} from 'providers/context';
import {useSettings} from 'providers/settings';

interface ProfileData {
  sex: string;
  ageRange: string;
  location: UserLocation;
  saved: boolean;
}

interface CheckInSettingsProps {
  navigation: any;
}

export const CheckInSettings: React.FC<CheckInSettingsProps> = ({
  navigation
}) => {
  const {t} = useTranslation();
  const {sexOptions, ageRangeOptions} = useSettings();
  const app = useApplication();

  const scrollViewRef = useRef<ScrollView>(null);

  const {
    sex = '',
    ageRange = '',
    location = {county: '', locality: ''}
  } = app.user!;

  const [profile, setProfile] = useState<ProfileData>({
    sex,
    ageRange,
    location,
    saved: false
  });

  const handleSave = () => {
    const savedProfile = {
      sex: profile.sex,
      ageRange: profile.ageRange,
      location: {
        county: profile.location.county || 'u',
        locality: profile.location.locality || 'u'
      }
    };
    app.setContext({
      user: {
        ...app.user,
        ...savedProfile
      }
    });
    setProfile((s) => ({...s, saved: true, ...savedProfile}));
    scrollViewRef.current?.scrollTo({x: 0, y: 0, animated: true});
  };

  if (!sex || !ageRange || !location.county || !location.locality) {
    return (
      <Basic heading={t('checkInSettings:title')}>
        <Text style={text.largeBold}>{t('checkInSettings:checkInFirst')}</Text>
        <Spacing s={48} />
        <Button
          type="empty"
          onPress={() =>
            navigation.navigate('symptoms', {screen: 'symptoms.checker'})
          }>
          {t('checkInSettings:gotoCheckIn')}
        </Button>
      </Basic>
    );
  }

  const successToast = profile.saved && (
    <Toast
      type="success"
      color="rgba(0, 207, 104, 0.16)"
      message={t('common:changesUpdated')}
      icon={<AppIcons.Success width={24} height={24} color={colors.success} />}
    />
  );

  return (
    <Scrollable
      toast={successToast}
      heading={t('checkInSettings:title')}
      scrollViewRef={scrollViewRef}>
      <Text style={text.largeBold}>{t('checkInSettings:intro')}</Text>
      <Spacing s={16} />
      <Text style={baseStyles.label}>{t('sex:label')}</Text>
      <Spacing s={8} />
      <SelectList
        items={sexOptions}
        selectedValue={profile.sex}
        onItemSelected={(value) =>
          setProfile({...profile, saved: false, sex: value})
        }
      />
      <Separator />
      <Dropdown
        label={t('ageRange:label')}
        placeholder={t('ageRange:placeholder')}
        items={ageRangeOptions}
        value={profile.ageRange}
        onValueChange={(value) =>
          setProfile({...profile, saved: false, ageRange: value})
        }
      />
      <Separator />
      <LocationDropdown
        value={profile.location}
        onValueChange={(value) =>
          setProfile({...profile, saved: false, location: value})
        }
      />
      <Spacing s={24} />
      <Button
        disabled={
          profile.sex === sex &&
          profile.ageRange === ageRange &&
          profile.location.county === location.county &&
          profile.location.locality === location.locality
        }
        onPress={handleSave}>
        {t('common:confirmChanges')}
      </Button>
    </Scrollable>
  );
};
