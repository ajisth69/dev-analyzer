// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TagPills, ScoreRing, WinnerBadge } from '../components/UI';

describe('UI Shared Display Components', () => {
  it('renders WinnerBadge correctly', () => {
    render(<WinnerBadge />);
    expect(screen.getByText('🏆 Winner')).toBeInTheDocument();
  });

  it('renders ScoreRing value correctly', () => {
    render(<ScoreRing value={85} label="Test Score" />);
    expect(screen.getByText('85')).toBeInTheDocument();
    expect(screen.getByText('Test Score')).toBeInTheDocument();
  });

  it('renders TagPills correctly for languages > 3%', () => {
    render(<TagPills tags={['TypeScript 80%', 'HTML 15%', 'CSS 5%']} />);
    expect(screen.getByText('TypeScript 80%')).toBeInTheDocument();
    expect(screen.getByText('HTML 15%')).toBeInTheDocument();
  });
});
