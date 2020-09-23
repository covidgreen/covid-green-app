import React, {useState, forwardRef, ReactNode} from 'react';
import {Text, View, TouchableWithoutFeedback, StyleSheet} from 'react-native';

import {BasicItem} from 'providers/settings';

import {Spacing} from 'components/atoms/spacing';
import {DropdownModal} from './modal';

import {text, colors} from 'theme';
import {AppIcons} from 'assets/icons';

export interface DropdownProps {
  label?: string;
  placeholder: string;
  title?: string;
  items: BasicItem[];
  value: string;
  onValueChange: (value: string) => void;
  onClose?: () => void;
  search?: {
    placeholder: string;
    items: BasicItem[];
    term: string;
    onChange: (value: string) => void;
    noResults: string;
  };
  itemRenderer?: (item: BasicItem) => ReactNode;
  display?: (item: BasicItem) => string;
  forceDisplay?: () => string;
  instructions?: () => ReactNode;
  icon?: ReactNode;
}

export const Dropdown = forwardRef<TouchableWithoutFeedback, DropdownProps>(
  (
    {
      label,
      placeholder,
      title,
      items,
      value,
      onValueChange,
      onClose,
      search,
      itemRenderer,
      display,
      forceDisplay,
      instructions,
      icon
    },
    ref
  ) => {
    const [isModalVisible, setModalVisible] = useState(false);

    const onItemSelected = (newValue: string) => {
      setModalVisible(false);
      onValueChange(newValue);
    };

    const selectedItem =
      (value && items.find((i) => i.value === value)) || null;

    let displayValue = placeholder;
    let a11yValue = placeholder;
    if (forceDisplay) {
      displayValue = forceDisplay();
      a11yValue = forceDisplay();
    } else if (selectedItem) {
      displayValue = (display && display(selectedItem)) || selectedItem.label;
      a11yValue =
        (display && display(selectedItem)) ||
        selectedItem.hint ||
        selectedItem.label;
    }

    return (
      <>
        <TouchableWithoutFeedback
          ref={ref}
          accessibilityRole="button"
          accessibilityLabel={
            value === '' ? label || '' : `${label || ''}, ${a11yValue}`
          }
          accessibilityHint={placeholder}
          hitSlop={{right: 40, bottom: 20, top: 20}}
          onPress={() => setModalVisible(true)}>
          <View style={styles.container}>
            <View style={styles.content}>
              {label && (
                <>
                  <Text
                    maxFontSizeMultiplier={2}
                    style={[text.default, {color: colors.text}]}>
                    {label}
                  </Text>
                  <Spacing s={8} />
                </>
              )}
              <Text
                maxFontSizeMultiplier={1.5}
                numberOfLines={1}
                style={styles.displayValue}>
                {displayValue}
              </Text>
            </View>
            <AppIcons.ArrowRight width={18} height={18} color={colors.purple} />
          </View>
        </TouchableWithoutFeedback>
        {isModalVisible && (
          <DropdownModal
            icon={icon}
            title={title || placeholder}
            titleHint={label}
            items={search?.items || items}
            selectedValue={value}
            onSelect={onItemSelected}
            onClose={() => {
              setModalVisible(false);
              onClose && onClose();
            }}
            search={search}
            itemRenderer={itemRenderer}
            instructions={instructions}
          />
        )}
      </>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  content: {
    flex: 1
  },
  displayValue: {
    ...text.largeBold,
    color: colors.purple
  }
});
