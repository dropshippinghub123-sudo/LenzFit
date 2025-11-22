import React from 'react';
import { render } from '@testing-library/react-native';
import CameraScreen from '../app/screens/CameraScreen';

describe('CameraScreen', () => {
  it('renders correctly', () => {
    const navigation = { navigate: jest.fn() };
    const { getByText } = render(<CameraScreen navigation={navigation} />);
    expect(getByText('Live Workout')).toBeTruthy();
  });
});
