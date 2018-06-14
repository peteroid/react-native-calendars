import React, {Component} from 'react';
import {
  Platform,
  TouchableOpacity,
  Text,
  View
} from 'react-native';
import PropTypes from 'prop-types';

import {shouldUpdate} from '../../../component-updater';

import styleConstructor from './style';

class Day extends Component {
  static propTypes = {
    // TODO: disabled props should be removed
    state: PropTypes.oneOf(['disabled', 'today', '']),

    // Specify theme properties to override specific styles for calendar parts. Default = {}
    theme: PropTypes.object,
    marking: PropTypes.any,
    onPress: PropTypes.func,
    onLongPress: PropTypes.func,
    date: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.style = styleConstructor(props.theme);
    this.onDayPress = this.onDayPress.bind(this);
    this.onDayLongPress = this.onDayLongPress.bind(this);
  }

  onDayPress() {
    this.props.onPress(this.props.date);
  }

  onDayLongPress() {
    this.props.onLongPress(this.props.date);
  }

  shouldComponentUpdate(nextProps) {
    return shouldUpdate(this.props, nextProps, ['state', 'children', 'marking', 'onPress', 'onLongPress']);
  }

  renderDots(marking) {
    const baseDotStyle = [this.style.dot, this.style.visibleDot];
    if (marking.dots && Array.isArray(marking.dots) && marking.dots.length > 0) {
      // Filter out dots so that we we process only those items which have key and color property
      const _validDots = marking.dots.filter(d => (d && d.color));
      const areDotsOverflow = _validDots.length > 3
      const validDots = areDotsOverflow ? _validDots.slice(0, 2) : _validDots

      return (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
          {validDots.map(dot => {
            return (
              <View key={dot.key ? dot.key : index} style={[baseDotStyle,
                { marginTop: 0 },
                { backgroundColor: marking.selected && dot.selectedDotColor ? dot.selectedDotColor : dot.color }]} />
            );
          })}

          {areDotsOverflow ? (
            <Text
              style={{
                fontSize: 8,
                height: 5,
                width: 5,
                lineHeight: 6,
                fontWeight: 'bold',
                color: marking.selected ? '#fff' : '#ff723f',
                backgroundColor: 'transparent',
                ...(Platform.select({
                  android: {
                    marginLeft: 1,
                    height: 6,
                  }
                }))
              }}>+</Text>
          ) : null}
        </View>
      )
    }
    return;
  }

  render() {
    const containerStyle = [this.style.base];
    const textStyle = [this.style.text];

    const marking = this.props.marking || {};
    const dot = this.renderDots(marking);

    if (marking.selected) {
      containerStyle.push(this.style.selected);
      textStyle.push(this.style.selectedText);
      if (marking.selectedColor) {
        containerStyle.push({backgroundColor: marking.selectedColor});
      }
    } else if (typeof marking.disabled !== 'undefined' ? marking.disabled : this.props.state === 'disabled') {
      textStyle.push(this.style.disabledText);
    } else if (this.props.state === 'today') {
      textStyle.push(this.style.todayText);
    } else if (marking.textStyle) {
      textStyle.push(marking.textStyle);
    }
    return (
      <TouchableOpacity
        style={containerStyle}
        onPress={this.onDayPress}
        onLongPress={this.onDayLongPress}>
        <Text allowFontScaling={false} style={textStyle}>{String(this.props.children)}</Text>
        <View style={{flexDirection: 'row'}}>{dot}</View>
      </TouchableOpacity>
    );
  }
}

export default Day;
