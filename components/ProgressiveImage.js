import React from 'react';
import {StyleSheet, View, Animated} from 'react-native';


//a modern loading for element 
class ProgressiveImage extends React.Component {
  // animation
  defaultImageAnimated = new Animated.Value(0);
  imageAnimated = new Animated.Value(0);
//  handle the default img
  handleDefaultImageLoad = () => {
    Animated.timing(this.defaultImageAnimated, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };
// handle the img when it loaded 
  handleImageLoad = () => {
    Animated.timing(this.imageAnimated, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  render() {
    const {defaultImageSource, source, style, ...props} = this.props;
    return (
      <View style={styles.container}>
        <Animated.Image
          {...props}
          source={defaultImageSource}
          style={[style, {opacity: this.defaultImageAnimated}]}
          onLoad={this.handleDefaultImageLoad}
          blurRadius={1}
        />
        <Animated.Image
          {...props}
          source={source}
          style={[style, {opacity: this.imageAnimated}, styles.imageOverlay]}
          onLoad={this.handleImageLoad}
        />
      </View>
    );
  }
}

export default ProgressiveImage;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#e1e4e8',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
});
