import React from 'react';
import { render } from '@testing-library/react-native';
import ResultsScreen from '../app/screens/ResultsScreen';

describe('ResultsScreen', () => {
  it('renders session results', () => {
    const route = { params: { reps: [{ rep: 1, score: 95, issues: [], angles: {}, tips: [] }] } };
    const navigation = { navigate: jest.fn() };
    const { getByText } = render(<ResultsScreen route={route} navigation={navigation} />);
    expect(getByText('Session Results')).toBeTruthy();
    expect(getByText('Rep 1: 95')).toBeTruthy();
  });
});
