import React from 'react';
import { render } from '@testing-library/react-native';
import HistoryScreen from '../app/screens/HistoryScreen';

describe('HistoryScreen', () => {
  it('renders session history', () => {
    const { getByText } = render(<HistoryScreen />);
    expect(getByText('Session History')).toBeTruthy();
  });
});
