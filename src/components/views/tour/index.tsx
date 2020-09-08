import React, {FC, useState, useRef} from 'react';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableWithoutFeedback
} from 'react-native';
import Video from 'react-native-video';
import {useSafeArea} from 'react-native-safe-area-context';
import ViewPager from '@react-native-community/viewpager';

import {useFocusRef, setAccessibilityFocusRef} from 'hooks/accessibility';

import {Markdown} from 'components/atoms/markdown';

import {colors, text} from 'theme';
import {AppIcons} from 'assets/icons';

import Step2 from 'assets/icons/how-it-works/howitworks2.svg';
import Step3 from 'assets/icons/how-it-works/howitworks3.svg';
import Step4 from 'assets/icons/how-it-works/howitworks4.svg';

const {width} = Dimensions.get('window');

const Tour: FC<any> = () => {
  const {t} = useTranslation();
  const nav = useNavigation();
  const insets = useSafeArea();
  const [position, setPosition] = useState<number>(0);
  const pager = useRef<ViewPager | null>(null);
  const [ref] = useFocusRef();

  const statements: string[] = t('onboarding:tour:statements', {
    returnObjects: true
  });

  const onClose = () => nav.goBack();

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top
        }
      ]}>
      <View style={styles.fill}>
        <View style={[styles.header, styles.row]}>
          <View style={[styles.padded, styles.close]}>
            <TouchableWithoutFeedback
              accessibilityRole="button"
              accessibilityLabel={t('common:close')}
              accessibilityHint={`${t('common:close')} ${t(
                'onboarding:tour:title'
              )}`}
              onPress={onClose}
              style={styles.close}>
              <View>
                <AppIcons.Close width={28} height={28} color={colors.purple} />
              </View>
            </TouchableWithoutFeedback>
          </View>
          <View
            ref={ref}
            accessible
            accessibilityRole="header"
            accessibilityLabel={t('onboarding:tour:title')}
            accessibilityHint={t('onboarding:tour:currentPage', {
              page: position + 1,
              total: statements.length
            })}
            style={styles.headerContent}>
            <Text style={styles.heading}>{t('onboarding:tour:title')}</Text>
          </View>
          <View style={styles.padded} />
        </View>
      </View>
      <View style={styles.details}>
        <ViewPager
          ref={pager}
          orientation="horizontal"
          style={styles.viewPager}
          onPageSelected={(e) => setPosition(e.nativeEvent.position)}
          initialPage={0}>
          {statements.map((statement, index) => (
            <ScrollView key={`s-${index}`}>
              {index === 0 && (
                <Video
                  source={require('assets/videos/how-it-works.mp4')}
                  style={styles.video}
                  paused={false}
                  repeat={true}
                  resizeMode="cover"
                />
              )}
              {index === 1 && <Step2 style={styles.video} />}
              {index === 2 && <Step3 style={styles.video} />}
              {index === 3 && <Step4 style={styles.video} />}
              <Markdown style={styles.content} markdownStyles={MarkdownStyles}>
                {statement}
              </Markdown>
            </ScrollView>
          ))}
        </ViewPager>
      </View>
      <View style={[styles.row, styles.controls]}>
        <View style={[styles.left, styles.button]}>
          <TouchableWithoutFeedback
            accessibilityRole="button"
            accessibilityHint={t('onboarding:tour:previousHint')}
            onPress={() => {
              pager.current?.setPage(position - 1);
              setAccessibilityFocusRef(ref);
            }}>
            <Text
              maxFontSizeMultiplier={1.2}
              style={[
                styles.buttonText,
                position === 0 ? styles.hidden : styles.visible
              ]}>
              {t('onboarding:tour:previous')}
            </Text>
          </TouchableWithoutFeedback>
        </View>
        <View
          style={[styles.center, styles.dots]}
          accessible
          accessibilityLabel={t('onboarding:tour:currentPage', {
            page: position + 1,
            total: statements.length
          })}>
          {statements.map((_, index) =>
            position === index ? (
              <View key={index} style={[styles.dot, styles.activeDot]}>
                <View style={styles.innerDot} />
              </View>
            ) : (
              <View key={index} style={styles.dot} />
            )
          )}
        </View>
        {position < statements.length - 1 && (
          <View style={[styles.right, styles.button]}>
            <TouchableWithoutFeedback
              accessibilityRole="button"
              accessibilityHint={t('onboarding:tour:nextHint')}
              onPress={() => {
                pager.current?.setPage(position + 1);
                setAccessibilityFocusRef(ref);
              }}>
              <Text
                maxFontSizeMultiplier={1.2}
                style={[
                  styles.buttonText,
                  position === statements.length - 1
                    ? styles.hidden
                    : styles.visible
                ]}>
                {t('onboarding:tour:next')}
              </Text>
            </TouchableWithoutFeedback>
          </View>
        )}
        {position === statements.length - 1 && (
          <View style={[styles.right, styles.button]}>
            <TouchableWithoutFeedback
              accessibilityRole="button"
              accessibilityLabel={t('common:close')}
              accessibilityHint={`${t('common:close')} ${t(
                'onboarding:tour:title'
              )}`}
              onPress={onClose}>
              <Text
                maxFontSizeMultiplier={1.2}
                style={[
                  styles.buttonText,
                  position === statements.length - 1
                    ? styles.visible
                    : styles.hidden
                ]}>
                {t('onboarding:tour:close')}
              </Text>
            </TouchableWithoutFeedback>
          </View>
        )}
      </View>
    </View>
  );
};

const MarkdownStyles = StyleSheet.create({
  text: {
    ...text.default
  },
  strong: {
    ...text.defaultBold
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  fill: {
    flex: 1
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  header: {
    paddingHorizontal: 10,
    paddingVertical: 20
  },
  headerContent: {
    flex: 1
  },
  heading: {
    ...text.largeBold,
    textAlign: 'center'
  },
  padded: {
    width: 24,
    height: 24,
    position: 'relative',
    zIndex: 10
  },
  close: {
    marginLeft: 10
  },
  details: {
    flex: 10
  },
  viewPager: {
    flex: 1,
    borderWidth: 0
  },
  video: {
    backgroundColor: 'transparent',
    width,
    height: (width / 3) * 2,
    marginBottom: 30
  },
  content: {
    flex: 1,
    paddingHorizontal: 30
  },
  controls: {
    flex: 1,
    borderStyle: 'solid',
    borderTopWidth: 1,
    borderColor: '#ededed',
    paddingBottom: 15
  },
  left: {
    width: '30%',
    alignItems: 'flex-start'
  },
  center: {
    width: '40%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  right: {
    width: '30%',
    alignItems: 'flex-end'
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 12,
    backgroundColor: colors.darkestGray,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  activeDot: {
    width: 16,
    height: 16,
    borderRadius: 16,
    backgroundColor: colors.purple
  },
  innerDot: {
    width: 4,
    height: 4,
    borderRadius: 4,
    backgroundColor: colors.darkGray
  },
  button: {
    paddingHorizontal: 15
  },
  buttonText: {
    ...text.defaultBold,
    color: colors.purple
  },
  hidden: {
    opacity: 0
  },
  visible: {
    opacity: 1
  }
});

export default Tour;
