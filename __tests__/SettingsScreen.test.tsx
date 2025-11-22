import React from 'react';
import { render } from '@testing-library/react-native';
import SettingsScreen from '../app/screens/SettingsScreen';

describe('SettingsScreen', () => {
  it('renders settings', () => {
    const { getByText } = render(<SettingsScreen />);
    expect(getByText('Settings')).toBeTruthy();
  });
});
